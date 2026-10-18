// Minimal WebGL plumbing adapted from PavelDoGreat/WebGL-Fluid-Simulation (MIT License).
// https://github.com/PavelDoGreat/WebGL-Fluid-Simulation

export type GLContext = WebGLRenderingContext | WebGL2RenderingContext;

export interface TexFormat {
  internalFormat: number;
  format: number;
}

export interface Ext {
  isWebGL2: boolean;
  formatRG: TexFormat;
  formatR: TexFormat;
  halfFloatTexType: number;
  supportLinearFiltering: boolean;
}

export interface FBO {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
}

export interface DoubleFBO {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap: () => void;
}

export interface GLProgram {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
  bind: () => void;
}

export function getWebGLContext(canvas: HTMLCanvasElement): { gl: GLContext; ext: Ext } | null {
  const params: WebGLContextAttributes = {
    alpha: true,
    // Our composite shader outputs straight (non-premultiplied) color; with
    // the default premultipliedAlpha:true the browser composites it onto the
    // page assuming it's already alpha-multiplied, producing white/dark
    // fringing at partial-alpha edges.
    premultipliedAlpha: false,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
  };

  let gl = canvas.getContext("webgl2", params) as WebGL2RenderingContext | null;
  const isWebGL2 = !!gl;
  if (!gl) {
    gl = (canvas.getContext("webgl", params) ||
      canvas.getContext("experimental-webgl", params)) as WebGL2RenderingContext | null;
  }
  if (!gl) return null;

  let halfFloatTexType: number;
  let supportLinearFiltering: boolean;

  if (isWebGL2) {
    gl.getExtension("EXT_color_buffer_float");
    supportLinearFiltering = !!gl.getExtension("OES_texture_float_linear");
    halfFloatTexType = gl.HALF_FLOAT;
  } else {
    const halfFloat = gl.getExtension("OES_texture_half_float");
    supportLinearFiltering = !!gl.getExtension("OES_texture_half_float_linear");
    halfFloatTexType = halfFloat ? (halfFloat as unknown as { HALF_FLOAT_OES: number }).HALF_FLOAT_OES : gl.UNSIGNED_BYTE;
  }

  gl.clearColor(0, 0, 0, 0);

  let formatRG: TexFormat | null;
  let formatR: TexFormat | null;

  if (isWebGL2) {
    const gl2 = gl as WebGL2RenderingContext;
    formatRG = getSupportedFormat(gl2, gl2.RG16F, gl2.RG, halfFloatTexType);
    formatR = getSupportedFormat(gl2, gl2.R16F, gl2.RED, halfFloatTexType);
  } else {
    formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
  }

  if (!formatRG || !formatR) return null;

  return { gl, ext: { isWebGL2, formatRG, formatR, halfFloatTexType, supportLinearFiltering } };
}

function getSupportedFormat(
  gl: GLContext,
  internalFormat: number,
  format: number,
  type: number
): TexFormat | null {
  if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
    const gl2 = gl as WebGL2RenderingContext;
    if (gl2.R16F !== undefined && internalFormat === gl2.R16F)
      return getSupportedFormat(gl, gl2.RG16F, gl2.RG, type);
    if (gl2.RG16F !== undefined && internalFormat === gl2.RG16F)
      return getSupportedFormat(gl, gl2.RGBA16F, gl.RGBA, type);
    return null;
  }
  return { internalFormat, format };
}

function supportRenderTextureFormat(gl: GLContext, internalFormat: number, format: number, type: number): boolean {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  gl.deleteFramebuffer(fbo);
  gl.deleteTexture(texture);
  return status === gl.FRAMEBUFFER_COMPLETE;
}

export function compileShader(gl: GLContext, type: number, source: string, keywords?: string[]): WebGLShader {
  const finalSource = keywords && keywords.length ? keywords.map((k) => `#define ${k}\n`).join("") + source : source;
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, finalSource);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("[fluid] shader compile error:", gl.getShaderInfoLog(shader));
  }
  return shader;
}

export function createProgram(gl: GLContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): GLProgram {
  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("[fluid] program link error:", gl.getProgramInfoLog(program));
  }
  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i);
    if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
  }
  return { program, uniforms, bind: () => gl.useProgram(program) };
}

export function createFBO(
  gl: GLContext,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  filter: number
): FBO {
  gl.activeTexture(gl.TEXTURE0);
  const texture = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

  const fbo = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.viewport(0, 0, w, h);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return {
    texture,
    fbo,
    width: w,
    height: h,
    texelSizeX: 1 / w,
    texelSizeY: 1 / h,
    attach(id: number) {
      gl.activeTexture(gl.TEXTURE0 + id);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      return id;
    },
  };
}

export function createDoubleFBO(
  gl: GLContext,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  filter: number
): DoubleFBO {
  let fbo1 = createFBO(gl, w, h, internalFormat, format, type, filter);
  let fbo2 = createFBO(gl, w, h, internalFormat, format, type, filter);
  return {
    width: w,
    height: h,
    texelSizeX: fbo1.texelSizeX,
    texelSizeY: fbo1.texelSizeY,
    get read() {
      return fbo1;
    },
    get write() {
      return fbo2;
    },
    swap() {
      const t = fbo1;
      fbo1 = fbo2;
      fbo2 = t;
    },
  };
}

export function createBlit(gl: GLContext) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  const elemBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elemBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  return (target: FBO | null) => {
    if (target == null) {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    } else {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  };
}
