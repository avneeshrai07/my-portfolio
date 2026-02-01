"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

// ⭐ CONFIGURATION: Move outside component
const SCROLL_DISTANCE_PER_MOVIE = 100; // Change this value (in vh units)

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
  
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

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

  // GSAP ScrollTrigger setup
  useEffect(() => {
    if (!isMounted || !sectionRef.current || !triggerRef.current) return;

    const section = sectionRef.current;
    const totalMovies = movies.length;

    // Create ScrollTrigger with pinning
    const scrollTrigger = ScrollTrigger.create({
  trigger: triggerRef.current,
  start: "top top",
  end: `+=${(totalMovies - 1) * SCROLL_DISTANCE_PER_MOVIE}vh`,
  pin: section,
  pinSpacing: true,
  
  // ⭐ Increase scrub for smoother, lazier response
  scrub: 3, // Changed from 1 to 2 (higher = smoother/slower)
  
  snap: {
    snapTo: 1 / (totalMovies - 1),
    
    // ⭐ Increase duration for slower, smoother snaps
    duration: { min: 0.4, max: 1.5 }, // Changed from {0.2, 0.8}
    
    // ⭐ Increase delay for less aggressive snapping
    delay: 0.5, // Changed from 0.1
    
    // ⭐ Use a gentler easing function
    ease: "power1.out" // Changed from "power2.inOut"
  },
  
  onUpdate: (self) => {
    const newIndex = Math.round(self.progress * (totalMovies - 1));
    setSelectedIndex(newIndex);
  },
  
  markers: false
});

    return () => {
      scrollTrigger.kill();
    };
  }, [isMounted, movies.length]); // ✅ Fixed: removed SCROLL_DISTANCE_PER_MOVIE from deps

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
    <>
      <div ref={triggerRef} className="h-px bg-hero-gradient"/>

      
      <section ref={sectionRef} className="bg-hero-gradient py-12 overflow-hidden min-h-screen flex items-center">
        <div className="container mx-auto px-4 md:px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-6xl mx-auto">
            
            {/* Left - Movie Poster */}
            <div className="lg:col-span-3 flex items-start">
              <div 
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
                        disabled={true}
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
    </>
  );
}
