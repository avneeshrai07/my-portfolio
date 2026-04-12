'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const BookCard = ({
  num = '01',
  title = 'Project',
  category = 'Category',
  year = '2024',
  stack = [],
  sub = '',
  href = '/',
}) => {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style>{`
        .book {
          perspective: 1200px;
          transform-style: preserve-3d;
          transition: transform 0.6s ease;
          width: 100%;
          aspect-ratio: 3 / 4;
          position: relative;
        }
        .book:hover {
          transform: rotateZ(-4deg) translateY(-4px);
          z-index: 10;
        }
        .book-layer {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: left center;
        }
        .book .cover { z-index: 2; }
        .book:hover .cover {
          transform: rotateY(-62deg);
          box-shadow: -8px 6px 28px rgba(0,0,0,0.13);
        }
        .book .inner { z-index: 1; }
        .book:hover .inner {
          transform: rotateZ(4deg) rotateX(-1deg) rotateY(-6deg) translateX(90px) translateY(-10px);
          box-shadow: 12px 16px 40px rgba(0,0,0,0.12);
        }
        .line-reveal {
          opacity: 0;
          transform: translateY(5px);
          animation: revealLine 0.35s ease forwards;
        }
        @keyframes revealLine {
          to { opacity: 1; transform: translateY(0); }
        }
        .open-hint {
          opacity: 0;
          animation: fadeHint 0.3s ease forwards;
        }
        @keyframes fadeHint {
          to { opacity: 1; }
        }
        .book-label    { font-size: clamp(8px,  0.65vw, 10px); }
        .book-title-in { font-size: clamp(20px, 2.2vw,  30px); }
        .book-sub      { font-size: clamp(10px, 0.85vw, 13px); }
        .book-year     { font-size: clamp(11px, 0.9vw,  14px); }
        .book-hint     { font-size: clamp(8px,  0.65vw, 10px); }
        .cover-num     { font-size: clamp(9px,  0.7vw,  11px); }
        .cover-title   { font-size: clamp(12px, 1vw,    15px); }
      `}</style>

      <div
        className="book flex items-center justify-center rounded-2xl"
        style={{
          background: '#f5f0e8',
          boxShadow: '3px 4px 16px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.8)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >

        {/* ── Inner page ── */}
        <div
          className="book-layer inner absolute inset-0 flex flex-col justify-between rounded-2xl cursor-pointer px-[9%] py-[10%]"
          style={{ background: '#faf7f2', boxShadow: '2px 4px 14px rgba(0,0,0,0.07)' }}
          onClick={() => router.push(href)}
          role="link"
          aria-label={`View ${title}`}
        >
          {/* Top rule */}
          <div className="w-full h-px" style={{ background: 'rgba(0,0,0,0.07)' }} />

          {/* Main content: title → subtitle → year */}
          <div className="flex flex-col gap-4">

            {/* Title */}
            <div className={hovered ? 'line-reveal' : 'opacity-0'}>
              <p className="book-title-in font-light tracking-tight leading-tight" style={{ color: '#1a1a1a' }}>
                {title}
              </p>
            </div>

            {/* Subtitle */}
            <div
              className={hovered ? 'line-reveal' : 'opacity-0'}
              style={hovered ? { animationDelay: '0.08s' } : {}}
            >
              <p className="book-sub font-light leading-relaxed" style={{ color: 'rgba(26,26,26,0.55)' }}>
                {sub}
              </p>
            </div>

            {/* Year */}
            <div
              className={hovered ? 'line-reveal' : 'opacity-0'}
              style={hovered ? { animationDelay: '0.16s' } : {}}
            >
              <p className="book-label tracking-[0.22em] uppercase mb-1" style={{ color: 'rgba(26,26,26,0.35)' }}>
                Year
              </p>
              <p className="book-year font-light" style={{ color: '#1a1a1a' }}>{year}</p>
            </div>

          </div>

          {/* Bottom rule + open hint */}
          <div className="flex items-center">
            <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,0.07)' }} />
            {hovered && (
              <span
                className="open-hint ml-3 book-hint tracking-[0.18em] uppercase whitespace-nowrap"
                style={{ color: 'rgba(26,26,26,0.32)' }}
              >
                open →
              </span>
            )}
          </div>
        </div>

        {/* ── Cover page ── */}
        <div
          className="book-layer cover absolute inset-0 flex flex-col items-center justify-center rounded-2xl gap-2"
          style={{ background: '#ede8de', boxShadow: '2px 4px 14px rgba(0,0,0,0.09)' }}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-[4px] rounded-l-2xl"
            style={{ background: 'rgba(0,0,0,0.06)' }}
          />
          <p className="cover-num tracking-[0.3em] uppercase" style={{ color: 'rgba(26,26,26,0.25)' }}>{num}</p>
          <div className="w-6 h-px my-1" style={{ background: 'rgba(0,0,0,0.15)' }} />
          <p
            className="cover-title font-light tracking-[0.2em] uppercase text-center px-[10%]"
            style={{ color: 'rgba(26,26,26,0.6)' }}
          >
            {title}
          </p>
          <p className="cover-num tracking-[0.22em] uppercase mt-1" style={{ color: 'rgba(26,26,26,0.3)' }}>
            {category}
          </p>
          <div className="w-6 h-px mt-1" style={{ background: 'rgba(0,0,0,0.15)' }} />
        </div>
      </div>
    </>
  );
};

export default BookCard;