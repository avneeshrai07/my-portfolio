"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface Song {
  id: number;
  name: string;
  artist: string;
  albumCover: string;
  duration: string;
  audioUrl?: string;
  spotifyUrl: string;
}

export default function MusicSection() {
  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);
  const [hoveredSong, setHoveredSong] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const songs: Song[] = [
    {
      id: 1,
      name: "Sunflower",
      artist: "Post Malone",
      albumCover: "/album-covers/sunflower.jpeg",
      duration: "2:38",
      audioUrl: "/music/sunflower.mp3",
      spotifyUrl: "https://open.spotify.com/track/3KkXRkHbMCARz0aVfEt68P?si=fdf6ac5c9e064419",
    },
    {
      id: 2,
      name: "Shinunoga E-Wa",
      artist: "Fujii Kaze",
      albumCover: "/album-covers/shinunoga_E-wa.jpeg",
      duration: "3:17",
      audioUrl: "/music/Shinunoga E-wa.mp3",
      spotifyUrl: "https://open.spotify.com/track/0o9zmvc5f3EFApU52PPIyW?si=fe27137ee5cc45d3",
    },
    {
      id: 3,
      name: "You Haunt Me",
      artist: "Citizen",
      albumCover: "/album-covers/you_haunt_me.jpeg",
      duration: "3:42",
      audioUrl: "/music/You_haunt_me.mp3",
      spotifyUrl: "https://open.spotify.com/track/1zjPk4TbcTtyJD1WdQauZn?si=9e4326bf836741cb",
    },
  ];

  const handlePlayPause = (songId: number, audioUrl?: string) => {
    if (currentPlaying === songId) {
      audioRef.current?.pause();
      setCurrentPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
        setCurrentPlaying(songId);
        audio.onended = () => setCurrentPlaying(null);
      }
    }
  };

  const openSpotify = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="bg-hero-gradient py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Music Player Card - More Compact */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-secondary/30">
          {/* Header - Smaller */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-[#1DB954] rounded-full blur-md opacity-30 animate-pulse"></div>
                <svg
                  height="44px"
                  width="44px"
                  viewBox="0 0 64 64"
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative"
                >
                  <linearGradient id="spotifyGreen">
                    <stop stopColor="#1ed760" offset="0"></stop>
                    <stop stopColor="#1db954" offset="1"></stop>
                  </linearGradient>
                  <circle fill="url(#spotifyGreen)" r="28" cy="32" cx="32" />
                  <path
                    d="M41.683,44.394c-0.365,0-0.731-0.181-1.096-0.365c-3.471-2.009-7.674-3.105-12.24-3.105 c-2.559,0-5.116,0.364-7.491,0.912c-0.365,0-0.914,0.183-1.096,0.183c-0.914,0-1.461-0.732-1.461-1.462 c0-0.913,0.547-1.463,1.279-1.643c2.923-0.732,5.846-1.096,8.951-1.096c5.116,0,9.866,1.276,13.885,3.655 c0.548,0.364,0.914,0.73,0.914,1.642C43.145,43.847,42.414,44.394,41.683,44.394z M44.241,38.181c-0.547,0-0.912-0.18-1.279-0.364 c-3.835-2.375-9.135-3.839-15.163-3.839c-2.924,0-5.664,0.366-7.674,0.916c-0.549,0.18-0.731,0.18-1.096,0.18 c-1.096,0-1.827-0.912-1.827-1.826c0-1.096,0.549-1.645,1.461-2.009c2.74-0.73,5.481-1.279,9.317-1.279 c6.213,0,12.241,1.463,16.991,4.384c0.73,0.364,1.096,1.096,1.096,1.826C46.069,37.269,45.337,38.181,44.241,38.181z M47.165,30.876 c-0.548,0-0.731-0.182-1.279-0.364c-4.385-2.559-10.961-4.021-17.356-4.021c-3.289,0-6.577,0.366-9.5,1.096 c-0.366,0-0.731,0.182-1.279,0.182c-1.279,0.183-2.193-0.912-2.193-2.192c0-1.279,0.731-2.009,1.644-2.192 c3.471-1.096,7.125-1.462,11.327-1.462c6.943,0,14.25,1.462,19.731,4.567c0.73,0.366,1.278,1.096,1.278,2.193 C49.357,29.961,48.442,30.876,47.165,30.876z"
                    fill="#fff"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-hero-suit">My Playlist</h2>
                <p className="text-xs text-hero-suit/60">Curated with love</p>
              </div>
            </div>
            <span className="text-hero-suit/60 text-sm font-medium">
              {songs.length} songs
            </span>
          </div>

          {/* Song List - More Compact */}
          <div className="space-y-2">
            {songs.map((song, index) => (
              <div
                key={song.id}
                className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  currentPlaying === song.id
                    ? "bg-gradient-to-r from-secondary/40 to-secondary/20"
                    : "hover:bg-secondary/10"
                }`}
                onClick={() => handlePlayPause(song.id, song.audioUrl)}
                onMouseEnter={() => setHoveredSong(song.id)}
                onMouseLeave={() => setHoveredSong(null)}
              >
                {/* Left Side */}
                <div className="flex items-center flex-1 gap-3">
                  {/* Track Number or Play Indicator */}
                  <div className="w-6 text-center flex-shrink-0">
                    {currentPlaying === song.id ? (
                      <div className="flex items-center gap-0.5 justify-center">
                        {[0.1, 0.3, 0.5].map((delay, i) => (
                          <div
                            key={i}
                            className="w-0.5 bg-[#1DB954] rounded-full animate-sound-wave"
                            style={{
                              animationDelay: `${delay}s`,
                              height: "16px",
                            }}
                          />
                        ))}
                      </div>
                    ) : hoveredSong === song.id ? (
                      <svg
                        className="w-5 h-5 text-hero-suit mx-auto"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" />
                      </svg>
                    ) : (
                      <span className="text-hero-suit/50 font-semibold text-sm">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Album Cover - NO SCALE ANIMATION */}
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary/20 flex-shrink-0 shadow-md">
                    <Image
                      src={song.albumCover}
                      alt={`${song.name} album cover`}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                    {currentPlaying === song.id && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="flex gap-0.5">
                          {[0, 0.2, 0.4].map((delay, i) => (
                            <div
                              key={i}
                              className="w-0.5"
                              style={{
                                animationDelay: `${delay}s`,
                                height: "12px",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Song Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-bold text-base truncate transition-colors ${
                        currentPlaying === song.id
                          ? "text-[#1DB954]"
                          : "text-hero-suit"
                      }`}
                    >
                      {song.name}
                    </p>
                    <p className="text-xs text-hero-suit/60 truncate">
                      {song.artist}
                    </p>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                  {/* Duration */}
                  <span className="text-hero-suit/50 text-xs font-medium min-w-[2.5rem] text-right">
                    {song.duration}
                  </span>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Spotify Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openSpotify(song.spotifyUrl);
                      }}
                      className="p-2 hover:bg-secondary/30 rounded-full transition-colors"
                      title="Open in Spotify"
                    >
                      <svg
                        className="w-4 h-4 text-[#1db954]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                    </button>

                    {/* More Options */}
                    <button
                      className="p-2 hover:bg-secondary/30 rounded-full transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg
                        className="w-4 h-4 text-hero-suit/60"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer - More Compact */}
          <div className="mt-6 pt-5 border-t border-secondary/20">
            <button
              onClick={() =>
                openSpotify(
                  "https://open.spotify.com/playlist/6YKE2j7FtzZCbIYSsS6FmN?si=797ad72447d046bb"
                )
              }
              className="w-full px-6 py-3 bg-gradient-to-r from-[#1DB954] to-[#1ed760] hover:from-[#1ed760] hover:to-[#1DB954] text-white font-bold rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              Open Full Playlist on Spotify
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
