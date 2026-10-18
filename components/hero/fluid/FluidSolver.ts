// Trimmed, encapsulated port of PavelDoGreat/WebGL-Fluid-Simulation's GPU
// Navier-Stokes solver (MIT License). Stripped of the GUI, analytics,
// screenshot capture, and the RGB "dye" visual — this keeps only the physics
// (curl / vorticity confinement / pressure projection / advection) and
// repurposes the dye field as a single-channel reveal mask composited with
// an image in COMPOSITE_SHADER. See shaders.ts for the per-pass math.

import {
  GLContext,
  Ext,
  FBO,
  DoubleFBO,
  GLProgram,
  getWebGLContext,
  compileShader,
  createProgram,
  createFBO,
  createDoubleFBO,
  createBlit,
} from "./webgl";
import * as S from "./shaders";

export interface FluidSolverOptions {
  imageUrl: string;
  simResolution?: number;
  maskResolution?: number;
  densityDissipation?: number;
  velocityDissipation?: number;
  pressure?: number;
  pressureIterations?: number;
  curl?: number;
  splatRadius?: number;
}

type ResolvedOptions = Required<FluidSolverOptions>;

const DEFAULTS: Omit<ResolvedOptions, "imageUrl"> = {
  simResolution: 96,
  maskResolution: 512,
  densityDissipation: 0.9,
  velocityDissipation: 1.2,
  pressure: 0.8,
  pressureIterations: 14,
  curl: 15,
  splatRadius: 0.4,
};

export class FluidSolver {
  private canvas: HTMLCanvasElement;
  private gl: GLContext;
  private ext: Ext;
  private blit: (target: FBO | null) => void;
  private opts: ResolvedOptions;

  private clearProgram: GLProgram;
  private splatProgram: GLProgram;
  private advectionProgram: GLProgram;
  private divergenceProgram: GLProgram;
  private curlProgram: GLProgram;
  private vorticityProgram: GLProgram;
  private pressureProgram: GLProgram;
  private gradientSubtractProgram: GLProgram;
  private compositeProgram: GLProgram;

  private velocity!: DoubleFBO;
  private mask!: DoubleFBO;
  private divergence!: FBO;
  private curlFbo!: FBO;
  private pressureFbo!: DoubleFBO;

  private imageTexture: WebGLTexture;
  private imageReady = false;
  private imageSize = { width: 1, height: 1 };

  private width = 0;
  private height = 0;
  private destroyed = false;
  private time = 0;

  constructor(canvas: HTMLCanvasElement, options: FluidSolverOptions) {
    this.canvas = canvas;
    this.opts = { ...DEFAULTS, ...options };

    const ctx = getWebGLContext(canvas);
    if (!ctx) throw new Error("WebGL is not supported in this browser");
    this.gl = ctx.gl;
    this.ext = ctx.ext;
    const gl = this.gl;

    this.blit = createBlit(gl);

    const baseVertex = compileShader(gl, gl.VERTEX_SHADER, S.BASE_VERTEX_SHADER);
    const advectionKeywords = this.ext.supportLinearFiltering ? undefined : ["MANUAL_FILTERING"];

    const frag = (src: string, keywords?: string[]) => compileShader(gl, gl.FRAGMENT_SHADER, src, keywords);

    this.clearProgram = createProgram(gl, baseVertex, frag(S.CLEAR_SHADER));
    this.splatProgram = createProgram(gl, baseVertex, frag(S.SPLAT_SHADER));
    this.advectionProgram = createProgram(gl, baseVertex, frag(S.ADVECTION_SHADER, advectionKeywords));
    this.divergenceProgram = createProgram(gl, baseVertex, frag(S.DIVERGENCE_SHADER));
    this.curlProgram = createProgram(gl, baseVertex, frag(S.CURL_SHADER));
    this.vorticityProgram = createProgram(gl, baseVertex, frag(S.VORTICITY_SHADER));
    this.pressureProgram = createProgram(gl, baseVertex, frag(S.PRESSURE_SHADER));
    this.gradientSubtractProgram = createProgram(gl, baseVertex, frag(S.GRADIENT_SUBTRACT_SHADER));
    this.compositeProgram = createProgram(gl, baseVertex, frag(S.COMPOSITE_SHADER));

    this.imageTexture = this.loadImageTexture(this.opts.imageUrl);
  }

  private loadImageTexture(url: string): WebGLTexture {
    const gl = this.gl;
    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));

    const img = new Image();
    img.onload = () => {
      if (this.destroyed) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      this.imageSize = { width: img.naturalWidth, height: img.naturalHeight };
      this.imageReady = true;
    };
    img.src = url;

    return texture;
  }

  private getResolution(resolution: number) {
    const gl = this.gl;
    let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
    if (aspectRatio < 1) aspectRatio = 1 / aspectRatio;
    const min = Math.round(resolution);
    const max = Math.round(resolution * aspectRatio);
    return gl.drawingBufferWidth > gl.drawingBufferHeight ? { width: max, height: min } : { width: min, height: max };
  }

  private initFramebuffers() {
    const gl = this.gl;
    const simRes = this.getResolution(this.opts.simResolution);
    const maskRes = this.getResolution(this.opts.maskResolution);
    const texType = this.ext.halfFloatTexType;
    const rg = this.ext.formatRG;
    const r = this.ext.formatR;
    const filtering = this.ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

    this.velocity = createDoubleFBO(gl, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
    this.mask = createDoubleFBO(gl, maskRes.width, maskRes.height, r.internalFormat, r.format, texType, filtering);
    this.divergence = createFBO(gl, simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    this.curlFbo = createFBO(gl, simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    this.pressureFbo = createDoubleFBO(gl, simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
  }

  /** Resize the canvas backing store (CSS pixels) and rebuild the solver's framebuffers. */
  resize(cssWidth: number, cssHeight: number) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(cssWidth * dpr));
    const h = Math.max(1, Math.round(cssHeight * dpr));
    if (w === this.width && h === this.height) return;
    this.width = w;
    this.height = h;
    this.canvas.width = w;
    this.canvas.height = h;
    this.initFramebuffers();
  }

  private correctRadius(radius: number) {
    const aspectRatio = this.width / this.height;
    if (aspectRatio > 1) radius *= aspectRatio;
    return radius;
  }

  /** Inject velocity + reveal-mask at a normalized (0..1) point, dx/dy as texcoord-space deltas. */
  splat(x: number, y: number, dx: number, dy: number, strength: number) {
    if (!this.velocity || !this.mask) return;
    const gl = this.gl;
    const radius = this.correctRadius(this.opts.splatRadius / 100);

    this.splatProgram.bind();
    gl.uniform1i(this.splatProgram.uniforms.uTarget, this.velocity.read.attach(0));
    gl.uniform1f(this.splatProgram.uniforms.aspectRatio, this.width / this.height);
    gl.uniform2f(this.splatProgram.uniforms.point, x, y);
    gl.uniform3f(this.splatProgram.uniforms.color, dx, dy, 0);
    gl.uniform1f(this.splatProgram.uniforms.radius, radius);
    this.blit(this.velocity.write);
    this.velocity.swap();

    gl.uniform1i(this.splatProgram.uniforms.uTarget, this.mask.read.attach(0));
    gl.uniform3f(this.splatProgram.uniforms.color, strength, 0, 0);
    this.blit(this.mask.write);
    this.mask.swap();
  }

  /** Advance the Navier-Stokes solve by dt seconds. */
  step(dt: number) {
    if (!this.velocity || !this.mask) return;
    this.time += dt;
    const gl = this.gl;
    gl.disable(gl.BLEND);

    this.curlProgram.bind();
    gl.uniform2f(this.curlProgram.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    gl.uniform1i(this.curlProgram.uniforms.uVelocity, this.velocity.read.attach(0));
    this.blit(this.curlFbo);

    this.vorticityProgram.bind();
    gl.uniform2f(this.vorticityProgram.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    gl.uniform1i(this.vorticityProgram.uniforms.uVelocity, this.velocity.read.attach(0));
    gl.uniform1i(this.vorticityProgram.uniforms.uCurl, this.curlFbo.attach(1));
    gl.uniform1f(this.vorticityProgram.uniforms.curl, this.opts.curl);
    gl.uniform1f(this.vorticityProgram.uniforms.dt, dt);
    this.blit(this.velocity.write);
    this.velocity.swap();

    this.divergenceProgram.bind();
    gl.uniform2f(this.divergenceProgram.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    gl.uniform1i(this.divergenceProgram.uniforms.uVelocity, this.velocity.read.attach(0));
    this.blit(this.divergence);

    this.clearProgram.bind();
    gl.uniform1i(this.clearProgram.uniforms.uTexture, this.pressureFbo.read.attach(0));
    gl.uniform1f(this.clearProgram.uniforms.value, this.opts.pressure);
    this.blit(this.pressureFbo.write);
    this.pressureFbo.swap();

    this.pressureProgram.bind();
    gl.uniform2f(this.pressureProgram.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    gl.uniform1i(this.pressureProgram.uniforms.uDivergence, this.divergence.attach(0));
    for (let i = 0; i < this.opts.pressureIterations; i++) {
      gl.uniform1i(this.pressureProgram.uniforms.uPressure, this.pressureFbo.read.attach(1));
      this.blit(this.pressureFbo.write);
      this.pressureFbo.swap();
    }

    this.gradientSubtractProgram.bind();
    gl.uniform2f(this.gradientSubtractProgram.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    gl.uniform1i(this.gradientSubtractProgram.uniforms.uPressure, this.pressureFbo.read.attach(0));
    gl.uniform1i(this.gradientSubtractProgram.uniforms.uVelocity, this.velocity.read.attach(1));
    this.blit(this.velocity.write);
    this.velocity.swap();

    this.advectionProgram.bind();
    gl.uniform2f(this.advectionProgram.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    if (!this.ext.supportLinearFiltering)
      gl.uniform2f(this.advectionProgram.uniforms.dyeTexelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    const velocityId = this.velocity.read.attach(0);
    gl.uniform1i(this.advectionProgram.uniforms.uVelocity, velocityId);
    gl.uniform1i(this.advectionProgram.uniforms.uSource, velocityId);
    gl.uniform1f(this.advectionProgram.uniforms.dt, dt);
    gl.uniform1f(this.advectionProgram.uniforms.dissipation, this.opts.velocityDissipation);
    this.blit(this.velocity.write);
    this.velocity.swap();

    if (!this.ext.supportLinearFiltering)
      gl.uniform2f(this.advectionProgram.uniforms.dyeTexelSize, this.mask.texelSizeX, this.mask.texelSizeY);
    gl.uniform1i(this.advectionProgram.uniforms.uVelocity, this.velocity.read.attach(0));
    gl.uniform1i(this.advectionProgram.uniforms.uSource, this.mask.read.attach(1));
    gl.uniform1f(this.advectionProgram.uniforms.dissipation, this.opts.densityDissipation);
    this.blit(this.mask.write);
    this.mask.swap();
  }

  /** Composite the reveal mask + image to the canvas. */
  render() {
    if (!this.imageReady || !this.mask) return;
    const gl = this.gl;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.BLEND);

    this.compositeProgram.bind();
    gl.uniform1i(this.compositeProgram.uniforms.uMask, this.mask.read.attach(0));
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.imageTexture);
    gl.uniform1i(this.compositeProgram.uniforms.uImage, 1);
    gl.uniform2f(this.compositeProgram.uniforms.uCanvasSize, this.width, this.height);
    gl.uniform2f(this.compositeProgram.uniforms.uImageSize, this.imageSize.width, this.imageSize.height);
    gl.uniform1f(this.compositeProgram.uniforms.uTime, this.time);
    this.blit(null);
  }

  dispose() {
    this.destroyed = true;
    const gl = this.gl;
    const loseCtx = gl.getExtension("WEBGL_lose_context") as { loseContext: () => void } | null;
    loseCtx?.loseContext();
  }
}
