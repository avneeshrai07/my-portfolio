"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import SectionHeader from "@/components/shared/SectionHeader";

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
      albumCover: `${process.env.NEXT_PUBLIC_CDN_URL}/sunflower.jpeg`,
      duration: "2:38",
      audioUrl: `${process.env.NEXT_PUBLIC_CDN_URL}/Sunflower.mp3`,
      spotifyUrl: "https://open.spotify.com/track/3KkXRkHbMCARz0aVfEt68P?si=fdf6ac5c9e064419",
    },
    {
      id: 2,
      name: "Shinunoga E-Wa",
      artist: "Fujii Kaze",
      albumCover: `${process.env.NEXT_PUBLIC_CDN_URL}/shinunoga_E-wa.jpeg`,
      duration: "3:17",
      audioUrl: `${process.env.NEXT_PUBLIC_CDN_URL}/Shinunoga E-wa.mp3`,
      spotifyUrl: "https://open.spotify.com/track/0o9zmvc5f3EFApU52PPIyW?si=fe27137ee5cc45d3",
    },
    {
      id: 3,
      name: "You Haunt Me",
      artist: "Citizen",
      albumCover: `${process.env.NEXT_PUBLIC_CDN_URL}/you_haunt_me.jpeg`,
      duration: "3:42",
      audioUrl: `${process.env.NEXT_PUBLIC_CDN_URL}/You_haunt_me.mp3`,
      spotifyUrl: "https://open.spotify.com/track/1zjPk4TbcTtyJD1WdQauZn?si=9e4326bf836741cb",
    },
  ];

  const handlePlayPause = (songId: number, audioUrl?: string) => {
    if (currentPlaying === songId) {
      audioRef.current?.pause();
      setCurrentPlaying(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.play().catch((err) => console.error("Audio error:", err));
        setCurrentPlaying(songId);
        audio.onended = () => setCurrentPlaying(null);
      }
    }
  };

  const openSpotify = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="bg-hero-gradient section-pad px-5 md:px-10">
      <div className="max-w-3xl mx-auto">
        <SectionHeader title="What I'm" accent="Listening To" className="mb-12" />

        {/* Player card — earthy parchment to match the site palette */}
        <div
          className="relative overflow-hidden"
          style={{
            background: "#FAF5EC",
            border: "1px solid var(--proj-border-2, #D4B896)",
            borderRadius: 16,
            boxShadow: "3px 4px 24px rgba(81,55,32,0.10)",
          }}
        >
          {/* Grain overlay */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              opacity: 0.06,
              mixBlendMode: "multiply",
            }}
          />

          <div className="relative z-10 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#1DB954] rounded-full blur-md opacity-20 animate-pulse" />
                  <svg height="40px" width="40px" viewBox="0 0 64 64" className="relative">
                    <linearGradient id="sg">
                      <stop stopColor="#1ed760" offset="0" />
                      <stop stopColor="#1db954" offset="1" />
                    </linearGradient>
                    <circle fill="url(#sg)" r="28" cy="32" cx="32" />
                    <path
                      d="M41.683,44.394c-0.365,0-0.731-0.181-1.096-0.365c-3.471-2.009-7.674-3.105-12.24-3.105c-2.559,0-5.116,0.364-7.491,0.912c-0.365,0-0.914,0.183-1.096,0.183c-0.914,0-1.461-0.732-1.461-1.462c0-0.913,0.547-1.463,1.279-1.643c2.923-0.732,5.846-1.096,8.951-1.096c5.116,0,9.866,1.276,13.885,3.655c0.548,0.364,0.914,0.73,0.914,1.642C43.145,43.847,42.414,44.394,41.683,44.394z M44.241,38.181c-0.547,0-0.912-0.18-1.279-0.364c-3.835-2.375-9.135-3.839-15.163-3.839c-2.924,0-5.664,0.366-7.674,0.916c-0.549,0.18-0.731,0.18-1.096,0.18c-1.096,0-1.827-0.912-1.827-1.826c0-1.096,0.549-1.645,1.461-2.009c2.74-0.73,5.481-1.279,9.317-1.279c6.213,0,12.241,1.463,16.991,4.384c0.73,0.364,1.096,1.096,1.096,1.826C46.069,37.269,45.337,38.181,44.241,38.181z M47.165,30.876c-0.548,0-0.731-0.182-1.279-0.364c-4.385-2.559-10.961-4.021-17.356-4.021c-3.289,0-6.577,0.366-9.5,1.096c-0.366,0-0.731,0.182-1.279,0.182c-1.279,0.183-2.193-0.912-2.193-2.192c0-1.279,0.731-2.009,1.644-2.192C19.675,24.279,23.329,23.913,27.531,23.913c6.943,0,14.25,1.462,19.731,4.567c0.73,0.366,1.278,1.096,1.278,2.193C48.539,31.673,47.624,32.588,47.165,30.876z"
                      fill="#fff"
                    />
                  </svg>
                </div>
                <div>
                  <p
                    className="font-super-heading font-semibold"
                    style={{ fontSize: 20, color: "var(--suit-brown)" }}
                  >
                    My Playlist
                  </p>
                  <p style={{ fontSize: 12, color: "var(--skin-tone)" }}>Curated with love</p>
                </div>
              </div>
              <span style={{ fontSize: 13, color: "var(--skin-tone)" }}>{songs.length} songs</span>
            </div>

            {/* Song list */}
            <div className="flex flex-col gap-1">
              {songs.map((song, index) => (
                <div
                  key={song.id}
                  className="group flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all duration-200"
                  style={{
                    background: currentPlaying === song.id
                      ? "rgba(81,55,32,0.08)"
                      : hoveredSong === song.id
                      ? "rgba(81,55,32,0.05)"
                      : "transparent",
                  }}
                  onClick={() => handlePlayPause(song.id, song.audioUrl)}
                  onMouseEnter={() => setHoveredSong(song.id)}
                  onMouseLeave={() => setHoveredSong(null)}
                >
                  {/* Left */}
                  <div className="flex items-center flex-1 gap-3">
                    <div className="w-6 text-center flex-shrink-0">
                      {currentPlaying === song.id ? (
                        <div className="flex items-center gap-0.5 justify-center">
                          {[0.1, 0.3, 0.5].map((delay, i) => (
                            <div
                              key={i}
                              className="w-0.5 rounded-full animate-sound-wave"
                              style={{
                                animationDelay: `${delay}s`,
                                height: "16px",
                                background: "var(--proj-terra)",
                              }}
                            />
                          ))}
                        </div>
                      ) : hoveredSong === song.id ? (
                        <svg
                          className="w-4 h-4 mx-auto"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                          style={{ color: "var(--suit-brown)" }}
                        >
                          <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" />
                        </svg>
                      ) : (
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--skin-tone)", opacity: 0.7 }}>
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <div
                      className="relative flex-shrink-0 rounded-lg overflow-hidden shadow-sm"
                      style={{ width: 44, height: 44, background: "var(--proj-sand)" }}
                    >
                      <Image
                        src={song.albumCover}
                        alt={`${song.name} album cover`}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                      {currentPlaying === song.id && (
                        <div className="absolute inset-0 bg-black/25" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="font-normal truncate transition-colors"
                        style={{
                          fontSize: 14,
                          color: currentPlaying === song.id
                            ? "var(--proj-terra)"
                            : "var(--suit-brown)",
                        }}
                      >
                        {song.name}
                      </p>
                      <p style={{ fontSize: 12, color: "var(--skin-tone)", opacity: 0.8 }} className="truncate">
                        {song.artist}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: 12, color: "var(--skin-tone)", opacity: 0.6, minWidth: "2.5rem", textAlign: "right" }}>
                      {song.duration}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); openSpotify(song.spotifyUrl); }}
                        className="p-1.5 rounded-full transition-colors"
                        style={{ background: "transparent" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(81,55,32,0.08)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        title="Open in Spotify"
                      >
                        <svg className="w-4 h-4" fill="#1db954" viewBox="0 0 24 24">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              className="mt-5 pt-5"
              style={{ borderTop: "1px solid var(--proj-border-2, #D4B896)" }}
            >
              <button
                onClick={() => openSpotify("https://open.spotify.com/playlist/6YKE2j7FtzZCbIYSsS6FmN?si=797ad72447d046bb")}
                className="w-full py-3 rounded-full font-normal tracking-wide flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  background: "var(--suit-brown)",
                  color: "var(--proj-cream)",
                  fontSize: 13,
                  border: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <svg className="w-4 h-4" fill="#1db954" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Open Full Playlist on Spotify
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
