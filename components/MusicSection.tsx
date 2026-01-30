"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface Song {
  id: number;
  name: string;
  artist: string;
  albumCover: string;
  audioUrl?: string;
  spotifyUrl: string;
}

export default function MusicSection() {
  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const songs: Song[] = [
    {
      id: 1,
      name: "Sunflower",
      artist: "Post Malone",
      albumCover: "/album-covers/sunflower.jpeg",
      audioUrl: "/music/sunflower.mp3", // Add your audio files to /public/music/
      spotifyUrl: "https://open.spotify.com/track/YOUR_TRACK_ID",
    },
    {
      id: 2,
      name: "Shinunog E-Wa",
      artist: "Fujii kaze",
      albumCover: "/album-covers/shinunoga_E-wa.jpeg",
      audioUrl: "/music/Shinunoga E-wa.mp3",
      spotifyUrl: "https://open.spotify.com/track/YOUR_TRACK_ID",
    },
    {
      id: 3,
      name: "You Haunt Me",
      artist: "Citizen",
      albumCover: "/album-covers/you_haunt_me.jpeg",
      audioUrl: "/music/You_haunt_me.mp3",
      spotifyUrl: "https://open.spotify.com/track/YOUR_TRACK_ID",
    },
  ];

  const handlePlayPause = (songId: number, audioUrl?: string) => {
    if (currentPlaying === songId) {
      // Pause current song
      audioRef.current?.pause();
      setCurrentPlaying(null);
    } else {
      // Play new song
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.play();
        setCurrentPlaying(songId);

        // Reset when song ends
        audio.onended = () => setCurrentPlaying(null);
      }
    }
  };

  const openSpotify = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <section className="bg-hero-gradient py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header with Spotify Icon */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex items-center mb-8">
            <svg
              height="50px"
              width="50px"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-4"
            >
              <radialGradient
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(0 -534)"
                r="43.888"
                cy="572.064"
                cx="33.34"
                id="spotifyGradient1"
              >
                <stop stopColor="#f4e9c3" offset="0"></stop>
                <stop stopColor="#f8eecd" offset=".219"></stop>
                <stop stopColor="#fdf4dc" offset=".644"></stop>
                <stop stopColor="#fff6e1" offset="1"></stop>
              </radialGradient>
              <path
                d="M51.03,37.34c0.16,0.98,1.08,1.66,2.08,1.66h5.39c2.63,0,4.75,2.28,4.48,4.96 C62.74,46.3,60.64,48,58.29,48H49c-1.22,0-2.18,1.08-1.97,2.34c0.16,0.98,1.08,1.66,2.08,1.66h8.39c1.24,0,2.37,0.5,3.18,1.32 C61.5,54.13,62,55.26,62,56.5c0,2.49-2.01,4.5-4.5,4.5h-49c-1.52,0-2.9-0.62-3.89-1.61C3.62,58.4,3,57.02,3,55.5 C3,52.46,5.46,50,8.5,50H14c1.22,0,2.18-1.08,1.97-2.34C15.81,46.68,14.89,44,13.89,44H5.5c-2.63,0-4.75-2.28-4.48-4.96 C1.26,36.7,3.36,35,5.71,35H8c1.71,0,3.09-1.43,3-3.16C10.91,30.22,9.45,29,7.83,29H4.5c-2.63,0-4.75-2.28-4.48-4.96 C0.26,21.7,2.37,20,4.71,20H20c0.83,0,1.58-0.34,2.12-0.88C22.66,18.58,23,17.83,23,17c0-1.66-1.34-3-3-3h-1.18 c-0.62-0.09-1.43,0-2.32,0h-9c-1.52,0-2.9-0.62-3.89-1.61S2,10.02,2,8.5C2,5.46,4.46,3,7.5,3h49c3.21,0,5.8,2.79,5.47,6.06 C61.68,11.92,60.11,14,57.24,14H52c-2.76,0-5,2.24-5,5c0,1.38,0.56,2.63,1.46,3.54C49.37,23.44,50.62,24,52,24h6.5 c3.21,0,5.8,2.79,5.47,6.06C63.68,32.92,61.11,35,58.24,35H53C51.78,35,50.82,36.08,51.03,37.34z"
                fill="url(#spotifyGradient1)"
              ></path>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(0 -534)"
                y2="590.253"
                y1="530.096"
                x2="32"
                x1="32"
                id="spotifyGradient2"
              >
                <stop stopColor="#42d778" offset="0"></stop>
                <stop stopColor="#3dca76" offset=".428"></stop>
                <stop stopColor="#34b171" offset="1"></stop>
              </linearGradient>
              <path
                d="M57,32c0,12.837-9.663,23.404-22.115,24.837C33.942,56.942,32.971,57,32,57 c-1.644,0-3.25-0.163-4.808-0.471C15.683,54.298,7,44.163,7,32C7,18.192,18.192,7,32,7S57,18.192,57,32z"
                fill="url(#spotifyGradient2)"
              ></path>
              <path
                d="M41.683,44.394c-0.365,0-0.731-0.181-1.096-0.365c-3.471-2.009-7.674-3.105-12.24-3.105 c-2.559,0-5.116,0.364-7.491,0.912c-0.365,0-0.914,0.183-1.096,0.183c-0.914,0-1.461-0.732-1.461-1.462 c0-0.913,0.547-1.463,1.279-1.643c2.923-0.732,5.846-1.096,8.951-1.096c5.116,0,9.866,1.276,13.885,3.655 c0.548,0.364,0.914,0.73,0.914,1.642C43.145,43.847,42.414,44.394,41.683,44.394z M44.241,38.181c-0.547,0-0.912-0.18-1.279-0.364 c-3.835-2.375-9.135-3.839-15.163-3.839c-2.924,0-5.664,0.366-7.674,0.916c-0.549,0.18-0.731,0.18-1.096,0.18 c-1.096,0-1.827-0.912-1.827-1.826c0-1.096,0.549-1.645,1.461-2.009c2.74-0.73,5.481-1.279,9.317-1.279 c6.213,0,12.241,1.463,16.991,4.384c0.73,0.364,1.096,1.096,1.096,1.826C46.069,37.269,45.337,38.181,44.241,38.181z M47.165,30.876 c-0.548,0-0.731-0.182-1.279-0.364c-4.385-2.559-10.961-4.021-17.356-4.021c-3.289,0-6.577,0.366-9.5,1.096 c-0.366,0-0.731,0.182-1.279,0.182c-1.279,0.183-2.193-0.912-2.193-2.192c0-1.279,0.731-2.009,1.644-2.192 c3.471-1.096,7.125-1.462,11.327-1.462c6.943,0,14.25,1.462,19.731,4.567c0.73,0.366,1.278,1.096,1.278,2.193 C49.357,29.961,48.442,30.876,47.165,30.876z"
                fill="#fff"
              ></path>
            </svg>
            <h2 className="text-3xl font-bold text-primary">
              Currently Playing
            </h2>
          </div>

          {/* Song List */}
          <div className="space-y-4">
            {songs.map((song, index) => (
              <div
                key={song.id}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/10 transition-all duration-300 group cursor-pointer"
                onClick={() => handlePlayPause(song.id, song.audioUrl)}
              >
                {/* Left side: Album cover and song info */}
                <div className="flex items-center flex-1">
                  <div className="relative w-16 h-16 mr-4 rounded-lg overflow-hidden bg-secondary/20">
                    {song.albumCover && (
                      <Image
                        src={song.albumCover}
                        alt={song.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-primary text-lg">
                      {song.name}
                    </p>
                    <p className="text-sm text-primary/60">{song.artist}</p>
                  </div>
                </div>

                {/* Right side: Playing animation or play button */}
                <div className="flex items-center gap-4">
                  {currentPlaying === song.id && index === 0 ? (
                    // Animated bars for currently playing (first song)
                    <div className="flex items-center gap-1">
                      {[0.2, 0.4, 0.6, 0.8].map((delay, i) => (
                        <div
                          key={i}
                          className="w-1 bg-[#1DB954] rounded-full animate-sound-wave"
                          style={{
                            animationDelay: `${delay}s`,
                            height: "33px",
                          }}
                        />
                      ))}
                    </div>
                  ) : currentPlaying === song.id ? (
                    // Pause icon
                    <div className="flex gap-1">
                      <div className="w-1 h-8 bg-primary rounded-full"></div>
                      <div className="w-1 h-8 bg-primary rounded-full"></div>
                    </div>
                  ) : (
                    // Play button
                    <div className="w-6 h-6 bg-primary group-hover:bg-primary-dark transition-colors rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-0.5"></div>
                    </div>
                  )}

                  {/* Spotify link button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openSpotify(song.spotifyUrl);
                    }}
                    className="px-4 py-2 bg-[#1DB954] hover:bg-[#1ed760] text-white rounded-full font-semibold text-sm transition-colors"
                  >
                    Open in Spotify
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Spotify Playlist Link */}
          <div className="mt-8 text-center">
            <button
              onClick={() =>
                openSpotify(
                  "https://open.spotify.com/playlist/6YKE2j7FtzZCbIYSsS6FmN?si=797ad72447d046bb",
                )
              }
              className="px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View Full Playlist on Spotify
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
