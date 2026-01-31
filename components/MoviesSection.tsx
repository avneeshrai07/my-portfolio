"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Movie {
  title: string;
  localPoster?: string | null;
  link?: string;
}

interface MovieData {
  Title: string;
  Year: string;
  Genre: string;
  imdbRating: string;
  Plot: string;
  Poster: string;
  Runtime: string;
}

export default function MovieSection() {
  const [movies] = useState<Movie[]>([
    { title: "Interstellar", localPoster: null, link: "https://your-link.com/interstellar" },
    { title: "The Dark Knight", localPoster: null, link: "https://your-link.com/dark-knight" },
    { title: "Inception", localPoster: null, link: "https://your-link.com/inception" },
    { title: "Berserk", localPoster: null, link: "https://your-link.com/berserk" },
    { title: "Oppenheimer", localPoster: null, link: "https://your-link.com/oppenheimer" },
    { title: "Dune", localPoster: null, link: "https://your-link.com/dune" },
  ]);

  const [movieData, setMovieData] = useState<Record<string, MovieData>>({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const scrollAccumulator = useRef(0);
  const isTransitioning = useRef(false);
  const lastScrollTime = useRef(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const titles = movies.map((m) => m.title);
        const response = await fetch('/api/movies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ titles }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setMovieData(data);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [movies]);

  // Check if poster center is at viewport center
  useEffect(() => {
    const checkPosition = () => {
      if (!posterRef.current) return;

      const posterRect = posterRef.current.getBoundingClientRect();
      const posterCenter = posterRect.top + posterRect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      
      const isInCenter = Math.abs(posterCenter - viewportCenter) < 100;
      setIsActive(isInCenter);
    };

    window.addEventListener('scroll', checkPosition);
    checkPosition();
    
    return () => window.removeEventListener('scroll', checkPosition);
  }, []);

  // Improved scroll hijacking - bulletproof version
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isActive || !sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      
      // Check if mouse is over section
      const isOverSection = 
        e.clientX >= rect.left && 
        e.clientX <= rect.right &&
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom;
      
      if (!isOverSection) return;

      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTime.current;
      
      // Ignore if transitioning or too soon after last transition
      if (isTransitioning.current || timeSinceLastScroll < 350) {
        e.preventDefault();
        return;
      }

      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;

      // Determine if we should hijack scroll
      const shouldHijack = 
        (isScrollingDown && selectedIndex < movies.length - 1) ||
        (isScrollingUp && selectedIndex > 0);

      if (shouldHijack) {
        e.preventDefault();
        e.stopPropagation();
        
        // Accumulate scroll delta
        scrollAccumulator.current += e.deltaY;
        
        // Lower threshold for faster response
        const scrollThreshold = 50;

        if (Math.abs(scrollAccumulator.current) >= scrollThreshold) {
          isTransitioning.current = true;
          lastScrollTime.current = now;
          
          if (scrollAccumulator.current > 0 && selectedIndex < movies.length - 1) {
            setSelectedIndex(prev => prev + 1);
          } else if (scrollAccumulator.current < 0 && selectedIndex > 0) {
            setSelectedIndex(prev => prev - 1);
          }
          
          scrollAccumulator.current = 0;
          
          setTimeout(() => {
            isTransitioning.current = false;
          }, 350);
        }
      } else {
        // At boundaries - allow page scroll but reset accumulator
        scrollAccumulator.current = 0;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!isActive) return;
      
      const touch = e.touches[0];
      scrollAccumulator.current = touch.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isActive || !sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const touch = e.touches[0];
      
      const isOverSection = 
        touch.clientX >= rect.left && 
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top && 
        touch.clientY <= rect.bottom;
      
      if (!isOverSection) return;

      const deltaY = scrollAccumulator.current - touch.clientY;
      scrollAccumulator.current = touch.clientY;

      const shouldHijack = 
        (deltaY > 0 && selectedIndex < movies.length - 1) ||
        (deltaY < 0 && selectedIndex > 0);

      if (shouldHijack && !isTransitioning.current) {
        e.preventDefault();
        
        if (Math.abs(deltaY) > 30) {
          isTransitioning.current = true;
          
          if (deltaY > 0 && selectedIndex < movies.length - 1) {
            setSelectedIndex(prev => prev + 1);
          } else if (deltaY < 0 && selectedIndex > 0) {
            setSelectedIndex(prev => prev - 1);
          }
          
          setTimeout(() => {
            isTransitioning.current = false;
          }, 350);
        }
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [selectedIndex, movies.length, isActive]);

  const handleWatchNow = (link?: string) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  const selectedMovie = movies[selectedIndex];
  const selectedData = movieData[selectedMovie?.title];

  if (!isMounted) {
    return null;
  }

  const getVisibleMovies = () => {
    const visibleCount = 5;
    let startIndex = Math.max(0, selectedIndex - 2);
    
    if (startIndex + visibleCount > movies.length) {
      startIndex = Math.max(0, movies.length - visibleCount);
    }
    
    return movies.slice(startIndex, startIndex + visibleCount).map((movie, idx) => ({
      movie,
      originalIndex: startIndex + idx
    }));
  };

  const visibleMovies = getVisibleMovies();

  return (
    <section ref={sectionRef} className="bg-hero-gradient py-12 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-6xl mx-auto">
          
          {/* Left - Movie Poster */}
          <div className="lg:col-span-3 flex items-start">
            <div 
              ref={posterRef}
              className="relative w-full max-w-[50vh] mx-auto aspect-[1.8/3] rounded-xl overflow-hidden shadow-2xl border border-secondary/30 transition-all duration-500 ease-out"
            >
              {selectedData && (selectedMovie.localPoster || selectedData.Poster) ? (
                selectedMovie.localPoster ? (
                  <Image
                    key={selectedIndex}
                    src={selectedMovie.localPoster}
                    alt={selectedData.Title}
                    fill
                    className="object-cover animate-fade-in"
                    priority
                  />
                ) : (
                  <img
                    key={selectedIndex}
                    src={selectedData.Poster}
                    alt={selectedData.Title}
                    className="w-full h-full object-cover animate-fade-in"
                  />
                )
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-hero-suit/50 to-hero-bg flex items-center justify-center">
                  <p className="text-hero-suit/60 text-sm font-semibold text-center px-4">
                    Loading...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Middle - Movie Details */}
          <div className="lg:col-span-6 space-y-3 px-4 flex items-center">
            <div className="w-full">
              {selectedData ? (
                <div key={selectedIndex} className="animate-fade-in">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-hero-suit leading-tight">
                    {selectedData.Title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-hero-suit/80 mt-2">
                    <span className="font-semibold">{selectedData.Year}</span>
                    <span className="text-hero-suit/40">•</span>
                    <span>{selectedData.Genre.split(',')[0]}</span>
                    <span className="text-hero-suit/40">•</span>
                    <span>{selectedData.Runtime}</span>
                  </div>

                  <p className="text-hero-suit/90 text-sm md:text-base leading-relaxed line-clamp-4 mt-3">
                    {selectedData.Plot}
                  </p>

                  <div className="text-xs text-hero-suit/70 mt-2">
                    <span className="font-semibold">Genre:</span> {selectedData.Genre}
                  </div>

                  <button 
                    onClick={() => handleWatchNow(selectedMovie.link)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-secondary to-hero-shirt hover:from-hero-shirt hover:to-secondary text-hero-suit font-bold rounded-lg transition-all duration-300 active:scale-95 shadow-lg text-sm mt-4"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    View Details
                  </button>
                </div>
              ) : (
                <div className="text-center text-hero-suit/60">
                  <p className="text-sm">Loading...</p>
                </div>
              )}
            </div>
          </div>

          {/* Right - Movie Cards */}
          <div className="lg:col-span-3 flex items-start">
            <div className="w-full max-w-[50vh] mx-auto aspect-[1.8/3] bg-hero-suit/10 backdrop-blur-md rounded-xl border border-hero-suit/20 p-3 flex flex-col">
              <h3 className="text-xs font-bold text-hero-suit/90 mb-3 uppercase tracking-wider">
                More to Watch
              </h3>
              <div className="flex-1 space-y-2 overflow-hidden flex flex-col justify-around">
                {visibleMovies.map(({ movie, originalIndex }) => {
                  const data = movieData[movie.title];
                  const poster = movie.localPoster || data?.Poster;
                  const isLocalPoster = movie.localPoster !== null && movie.localPoster !== undefined;
                  const isSelected = selectedIndex === originalIndex;

                  return (
                    <button
                      key={originalIndex}
                      onClick={() => setSelectedIndex(originalIndex)}
                      className={`w-full flex items-center gap-2 p-2 rounded-lg transition-all duration-300 ${
                        isSelected
                          ? 'bg-secondary/30 border border-secondary/50 shadow-lg'
                          : 'bg-hero-suit/5 hover:bg-hero-suit/10 border border-transparent'
                      }`}
                    >
                      <div className="relative w-10 h-14 flex-shrink-0 rounded overflow-hidden shadow-md">
                        {poster ? (
                          isLocalPoster ? (
                            <Image
                              src={poster}
                              alt={movie.title}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <img
                              src={poster}
                              alt={movie.title}
                              className="w-full h-full object-cover"
                            />
                          )
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-hero-suit/30 to-hero-bg/50" />
                        )}
                      </div>

                      <div className="flex-1 text-left min-w-0">
                        <p className={`font-bold text-xs truncate transition-colors ${
                          isSelected ? 'text-hero-suit' : 'text-hero-suit/80'
                        }`}>
                          {data?.Title || movie.title}
                        </p>
                        {data?.Year && (
                          <p className="text-hero-suit/60 text-[10px] mt-0.5">{data.Year}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}
