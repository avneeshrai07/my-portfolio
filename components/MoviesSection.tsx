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

// ⭐ CONFIGURATION: Global animation settings
const SCROLL_DISTANCE_PER_MOVIE = 100;
const SCROLL_SCRUB_SPEED = 3;
const SCROLL_SNAP_MIN_DURATION = 0.6;
const SCROLL_SNAP_MAX_DURATION = 1.5;
const SCROLL_SNAP_DELAY = 0.2;
const FADE_OUT_DURATION = 0.2;
const FADE_IN_DURATION = 0.5;
const CONTENT_STAGGER = 0.1;
const DETAILS_FADE_DURATION = 0.5;
const DETAILS_STAGGER = 0.05;
const DETAILS_DELAY = 0.2;
const CARD_TRANSITION_DURATION = 400;

// ⭐ NEW: Mobile scroll configuration
// const MOBILE_SCROLL_DISTANCE_PER_MOVIE = 30; // 30vh per movie

export default function MovieSection() {
  const [movies] = useState<Movie[]>([
    { title: "When Life Gives You Tangerines", localPoster: null, link: "https://www.netflix.com/title/81681535" },
    { title: "Jujutsu Kaisen", localPoster: null, link: "https://www.netflix.com/browse/genre/83?jbv=81278456" },
    { title: "Wednesday", localPoster: "/movies/wednesday.jpeg", link: "https://www.netflix.com/browse/my-list?jbv=81231974" },
    { title: "How to Sell Drugs Online (Fast)", localPoster: null, link: "https://www.netflix.com/browse/genre/83?jbv=80218448" },
    { title: "Record of Ragnarok", localPoster: null, link: "https://aniwatchtv.by/?s=Record+of+Ragnarok" },
    { title: "500 Days of Summer", localPoster: null, link: "https://www.hotstar.com/in/movies/500-days-of-summer/1770000925" },
  ]);

  const [movieData, setMovieData] = useState<Record<string, MovieData>>({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // ⭐ DESKTOP Refs for GSAP animations
  const posterRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<HTMLParagraphElement>(null);
  const genreRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isFirstRender = useRef(true);

  // ⭐ MOBILE-SPECIFIC Refs for GSAP animations
  const mobilePosterRef = useRef<HTMLDivElement>(null);
  const mobileDetailsRef = useRef<HTMLDivElement>(null);
  const mobileTitleRef = useRef<HTMLHeadingElement>(null);
  const mobileMetaRef = useRef<HTMLDivElement>(null);
  const mobilePlotRef = useRef<HTMLParagraphElement>(null);
  const mobileGenreRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  
  // ⭐ NEW: Horizontal scroll container ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // ⭐ DESKTOP smooth content transitions with GSAP
  useEffect(() => {
    if (!isMounted) return;
    if (!posterRef.current || !detailsRef.current) return;
    
    const selectedMovie = movies[selectedIndex];
    const selectedData = movieData[selectedMovie?.title];
    
    if (!selectedMovie || !selectedData) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Only run on desktop
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    if (!mediaQuery.matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.to([posterRef.current, detailsRef.current], {
        opacity: 0,
        y: 20,
        duration: FADE_OUT_DURATION,
        ease: "power2.in",
      })
      .set([posterRef.current, detailsRef.current], {
        y: -20,
      })
      .to([posterRef.current, detailsRef.current], {
        opacity: 1,
        y: 0,
        duration: FADE_IN_DURATION,
        ease: "power2.out",
        stagger: CONTENT_STAGGER,
      });

      const childElements = [
        titleRef.current,
        metaRef.current,
        plotRef.current,
        genreRef.current,
        buttonRef.current
      ].filter(el => el !== null);

      if (childElements.length > 0) {
        gsap.fromTo(
          childElements,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: DETAILS_FADE_DURATION,
            stagger: DETAILS_STAGGER,
            ease: "power2.out",
            delay: DETAILS_DELAY,
          }
        );
      }
    });

    return () => ctx.revert();
  }, [selectedIndex, isMounted, movies, movieData]);

  // ⭐ MOBILE smooth content transitions with GSAP
  useEffect(() => {
    if (!isMounted) return;
    if (!mobilePosterRef.current || !mobileDetailsRef.current) return;
    
    const selectedMovie = movies[selectedIndex];
    const selectedData = movieData[selectedMovie?.title];
    
    if (!selectedMovie || !selectedData) return;

    // Only run on mobile
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    if (!mediaQuery.matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.to([mobilePosterRef.current, mobileDetailsRef.current], {
        opacity: 0,
        y: 20,
        duration: FADE_OUT_DURATION,
        ease: "power2.in",
      })
      .set([mobilePosterRef.current, mobileDetailsRef.current], {
        y: -20,
      })
      .to([mobilePosterRef.current, mobileDetailsRef.current], {
        opacity: 1,
        y: 0,
        duration: FADE_IN_DURATION,
        ease: "power2.out",
        stagger: CONTENT_STAGGER,
      });

      const childElements = [
        mobileTitleRef.current,
        mobileMetaRef.current,
        mobilePlotRef.current,
        mobileGenreRef.current,
        mobileButtonRef.current
      ].filter(el => el !== null);

      if (childElements.length > 0) {
        gsap.fromTo(
          childElements,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: DETAILS_FADE_DURATION,
            stagger: DETAILS_STAGGER,
            ease: "power2.out",
            delay: DETAILS_DELAY,
          }
        );
      }
    });

    return () => ctx.revert();
  }, [selectedIndex, isMounted, movies, movieData]);

  // ⭐ DESKTOP ScrollTrigger setup
  useEffect(() => {
    if (!isMounted || !sectionRef.current || !triggerRef.current) return;

    // Only enable on desktop
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    if (!mediaQuery.matches) return;

    const section = sectionRef.current;
    const totalMovies = movies.length;

    const scrollTrigger = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top top",
      end: `+=${(totalMovies - 1) * SCROLL_DISTANCE_PER_MOVIE}vh`,
      pin: section,
      pinSpacing: true,
      scrub: SCROLL_SCRUB_SPEED,
      snap: {
        snapTo: 1 / (totalMovies - 1),
        duration: { min: SCROLL_SNAP_MIN_DURATION, max: SCROLL_SNAP_MAX_DURATION },
        delay: SCROLL_SNAP_DELAY,
        ease: "power1.inOut"
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
  }, [isMounted, movies.length]);

  // ⭐ NEW: Horizontal scroll handler using IntersectionObserver for better performance
  useEffect(() => {
    if (!isMounted || !scrollContainerRef.current) return;

    // Only enable on mobile
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    if (!mediaQuery.matches) return;

    const container = scrollContainerRef.current;
    const cards = container.querySelectorAll('[data-movie-index]');

    const observerOptions = {
      root: container,
      threshold: 0.6, // Card needs to be 60% visible to be considered "in view"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          const index = parseInt(entry.target.getAttribute('data-movie-index') || '0');
          setSelectedIndex(index);
        }
      });
    }, observerOptions);

    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
      observer.disconnect();
    };
  }, [isMounted, movies.length]);

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
      <div ref={triggerRef} className="h-1px bg-hero-gradient"/>

      <section ref={sectionRef} className="bg-hero-gradient py-4 lg:py-8 overflow-hidden flex items-center">
        <div className="container mx-auto px-4 md:px-6 w-full">
          <h1 className="text-hero-suit/60 text-2xl md:text-2.5xl lg:text-3xl font-semibold text-left lg:ml-6 mb-6 lg:mb-6">
            Currently watching
          </h1>

          {/* ⭐ DESKTOP LAYOUT - UNCHANGED */}
          <div className="hidden lg:grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-6xl mx-auto">
            {/* Left - Movie Poster */}
            <div className="lg:col-span-3 flex items-start">
              <div 
                ref={posterRef}
                className="relative w-full max-w-[50vh] mx-auto aspect-[1.85/3] rounded-xl overflow-hidden shadow-2xl border border-secondary/30"
                style={{ opacity: 1 }}
              >
                {selectedData && (selectedMovie.localPoster || selectedData.Poster) ? (
                  selectedMovie.localPoster ? (
                    <Image
                      key={selectedIndex}
                      src={selectedMovie.localPoster}
                      alt={selectedData.Title}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <img
                      key={selectedIndex}
                      src={selectedData.Poster}
                      alt={selectedData.Title}
                      className="w-full h-full object-cover"
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
              <div ref={detailsRef} className="w-full" style={{ opacity: 1 }}>
                {selectedData ? (
                  <div key={selectedIndex}>
                    <h1 ref={titleRef} className="text-3xl md:text-4xl lg:text-5xl font-bold text-hero-suit leading-tight">
                      {selectedData.Title}
                    </h1>

                    <div ref={metaRef} className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-hero-suit/80 mt-2">
                      <span className="font-semibold">{selectedData.Year}</span>
                      <span className="text-hero-suit/40">•</span>
                      <span>{selectedData.Genre.split(',')[0]}</span>
                      <span className="text-hero-suit/40">•</span>
                      <span>{selectedData.Runtime}</span>
                    </div>

                    <p ref={plotRef} className="text-hero-suit/90 text-sm md:text-base leading-relaxed line-clamp-4 mt-3">
                      {selectedData.Plot}
                    </p>

                    <div ref={genreRef} className="text-xs text-hero-suit/70 mt-2">
                      <span className="font-semibold">Genre:</span> {selectedData.Genre}
                    </div>

                    <button 
                      ref={buttonRef}
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
              <div className="w-full max-w-[50vh] mx-auto aspect-[1.85/3] bg-hero-suit/10 backdrop-blur-md rounded-xl border border-hero-suit/20 p-3 flex flex-col">
                <h3 className="text-xs font-bold text-hero-suit/90 mb-3 uppercase tracking-wider">
                  More to Watch
                </h3>
                <div className="flex-1 space-y-1 overflow-hidden flex flex-col justify-around">
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
                        className={`w-full flex items-center gap-2 p-2 rounded-lg transition-all ease-out ${
                          isSelected
                            ? 'bg-secondary/30 border border-secondary/50 shadow-lg scale-105'
                            : 'bg-hero-suit/5 hover:bg-hero-suit/10 border border-transparent scale-100'
                        }`}
                        style={{
                          transitionDuration: `${CARD_TRANSITION_DURATION}ms`,
                          transitionProperty: 'all',
                          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
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
                          <p 
                            className="font-bold text-xs truncate transition-colors"
                            style={{
                              transitionDuration: `${CARD_TRANSITION_DURATION}ms`,
                              color: isSelected ? 'var(--hero-suit)' : 'rgba(var(--hero-suit-rgb), 0.8)'
                            }}
                          >
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

          {/* ⭐ NEW: MOBILE LAYOUT - Poster + Details top, Horizontal scroll cards bottom */}
          <div className="lg:hidden flex flex-col gap-4">
            {/* Top Row: Poster + Details (40-60 split) */}
            <div className="flex gap-3">
              {/* Left - Poster (40%) */}
              <div className="w-[40%] flex-shrink-0">
                <div 
                  ref={mobilePosterRef}
                  className="relative w-full aspect-[1.85/3] rounded-lg overflow-hidden shadow-xl border border-secondary/30"
                  style={{ opacity: 1 }}
                >
                  {selectedData && (selectedMovie.localPoster || selectedData.Poster) ? (
                    selectedMovie.localPoster ? (
                      <Image
                        key={selectedIndex}
                        src={selectedMovie.localPoster}
                        alt={selectedData.Title}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <img
                        key={selectedIndex}
                        src={selectedData.Poster}
                        alt={selectedData.Title}
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-hero-suit/50 to-hero-bg flex items-center justify-center">
                      <p className="text-hero-suit/60 text-xs font-semibold text-center px-2">
                        Loading...
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right - Details (60%) */}
              <div className="flex-1 flex flex-col justify-center">
                <div ref={mobileDetailsRef} style={{ opacity: 1 }}>
                  {selectedData ? (
                    <div key={selectedIndex} className="space-y-2">
                      {/* Year + Rating */}
                      <div ref={mobileMetaRef} className="flex items-center gap-2 text-xs text-hero-suit/80">
                        <span className="font-bold">{selectedData.Year}</span>
                        <span className="text-hero-suit/40">•</span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                          <span className="font-semibold">{selectedData.imdbRating}</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h2 ref={mobileTitleRef} className="text-2xl font-bold text-hero-suit leading-tight line-clamp-2">
                        {selectedData.Title}
                      </h2>

                      {/* Plot */}
                      <p ref={mobilePlotRef} className="text-hero-suit/80 text-xs leading-relaxed line-clamp-3">
                        {selectedData.Plot}
                      </p>

                      {/* Description/Genre */}
                      <div ref={mobileGenreRef} className="text-xs text-hero-suit/60">
                        <span className="font-semibold">Genre:</span> {selectedData.Genre.split(',').slice(0, 2).join(', ')}
                      </div>

                      {/* Button */}
                      <button 
                        ref={mobileButtonRef}
                        onClick={() => handleWatchNow(selectedMovie.link)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-secondary to-hero-shirt hover:from-hero-shirt hover:to-secondary text-hero-suit font-bold rounded-lg transition-all duration-300 active:scale-95 shadow-lg text-xs w-full mt-2"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        View Details
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-hero-suit/60">
                      <p className="text-xs">Loading...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Row: Scrollable "More to Watch" Cards */}
            <div className="w-full">
              <h3 className="text-xs font-bold text-hero-suit/90 mb-2 uppercase tracking-wider">
                More to Watch
              </h3>
              
              {/* ⭐ Horizontal scrollable container with IntersectionObserver detection */}
              <div 
                ref={scrollContainerRef}
                className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {movies.map((movie, originalIndex) => {
                  const data = movieData[movie.title];
                  const poster = movie.localPoster || data?.Poster;
                  const isLocalPoster = movie.localPoster !== null && movie.localPoster !== undefined;
                  const isSelected = selectedIndex === originalIndex;

                  return (
                    <button
                      key={originalIndex}
                      data-movie-index={originalIndex}
                      onClick={() => {
                        setSelectedIndex(originalIndex);
                        // Scroll selected card into view
                        const card = scrollContainerRef.current?.querySelector(`[data-movie-index="${originalIndex}"]`);
                        card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                      }}
                      className={`flex-shrink-0 snap-center rounded-lg transition-all ease-out ${
                        isSelected
                          ? 'bg-secondary/30 border-2 border-secondary/70 shadow-xl scale-105'
                          : 'bg-hero-suit/5 border-2 border-transparent scale-100'
                      }`}
                      style={{
                        width: 'calc(80vw - 2rem)', // 80% of viewport minus padding
                        transitionDuration: `${CARD_TRANSITION_DURATION}ms`,
                        transitionProperty: 'all',
                        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      <div className="flex items-center gap-3 p-3">
                        <div className="relative w-16 h-24 flex-shrink-0 rounded overflow-hidden shadow-md">
                          {poster ? (
                            isLocalPoster ? (
                              <Image
                                src={poster}
                                alt={movie.title}
                                fill
                                className="object-cover"
                                sizes="64px"
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
                          <p 
                            className="font-bold text-sm truncate transition-colors"
                            style={{
                              transitionDuration: `${CARD_TRANSITION_DURATION}ms`,
                              color: isSelected ? 'var(--hero-suit)' : 'rgba(var(--hero-suit-rgb), 0.8)'
                            }}
                          >
                            {data?.Title || movie.title}
                          </p>
                          {data?.Year && (
                            <p className="text-hero-suit/60 text-xs mt-0.5">{data.Year}</p>
                          )}
                          {data?.imdbRating && (
                            <div className="flex items-center gap-1 mt-1">
                              <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                              <span className="text-xs font-semibold text-hero-suit/80">{data.imdbRating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⭐ Hide scrollbar on mobile */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
