// components/ui/iphone.tsx
import React from "react";

interface IphoneProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  videoSrc?: string;
}

export function Iphone({
  src,
  videoSrc,
  className = "",
  style,
  ...props
}: IphoneProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{ aspectRatio: "433/882", ...style }}
      {...props}
    >
      {/* iPhone Frame */}
      <div className="relative h-full w-full">
        {/* Outer Frame with rounded corners */}
        <div className="absolute inset-0 rounded-[3.5rem] bg-black shadow-2xl ring-1 ring-gray-800">
          {/* Inner Screen Border */}
          <div className="absolute inset-[3px] rounded-[3.3rem] bg-gray-900 p-[10px]">
            {/* Dynamic Island */}
            <div className="absolute left-1/2 top-[10px] z-10 h-[30px] w-[120px] -translate-x-1/2 rounded-[20px] bg-black" />
            
            {/* Screen Content */}
            <div className="relative h-full w-full overflow-hidden rounded-[3rem] bg-white">
              {videoSrc ? (
                <video
                  src={videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : src ? (
                <img
                  src={src}
                  alt="iPhone content"
                  className="h-full w-full object-cover object-top"
                />
              ) : null}
            </div>
          </div>
        </div>

        {/* Side Buttons */}
        {/* Volume Buttons (Left) */}
        <div className="absolute -left-[2px] top-[140px] h-[30px] w-[3px] rounded-l-full bg-gray-800" />
        <div className="absolute -left-[2px] top-[180px] h-[50px] w-[3px] rounded-l-full bg-gray-800" />
        
        {/* Power Button (Right) */}
        <div className="absolute -right-[2px] top-[160px] h-[70px] w-[3px] rounded-r-full bg-gray-800" />
      </div>
    </div>
  );
}
