import React, { useEffect, useRef, useState } from 'react';
import { Music, X, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { MUSIC_PLAYLIST, Song } from '../src/data/music';
import ElasticSlider from './ElasticSlider';

interface MusicPlayerProps {
  initialVisible?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ initialVisible = false }) => {
  const [isSeeking, setIsSeeking] = useState(false);
  const [isOpen, setIsOpen] = useState(initialVisible);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentSong = MUSIC_PLAYLIST[currentSongIndex];

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = isMuted ? 0 : volume;

    if (isPlaying) {
      const playPromise = audioRef.current.play();
      playPromise?.catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSongIndex, isMuted, volume]);

  useEffect(() => {
    if (initialVisible) {
      setIsOpen(true);
    }
  }, [initialVisible]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const getSongUrl = (song: Song) => {
    if (song.url) return song.url;
    return `https://music.163.com/song/media/outer/url?id=${song.id}.mp3`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      <audio
        ref={audioRef}
        src={getSongUrl(currentSong)}
        crossOrigin="anonymous"
        onTimeUpdate={(event) => {
          if (!isSeeking) {
            setProgress(event.currentTarget.currentTime);
          }
        }}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onEnded={() => {
          setCurrentSongIndex((prev) => (prev + 1) % MUSIC_PLAYLIST.length);
          setIsPlaying(true);
        }}
        onError={() => setIsPlaying(false)}
      />

      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="system-panel flex h-14 w-14 items-center justify-center bg-[var(--paper)] text-[var(--ink)]"
          title="Open audio module"
        >
          <Music className={isPlaying ? 'animate-spin-slow' : ''} size={18} />
        </button>
      ) : (
        <div className="system-panel w-[320px] overflow-hidden bg-[var(--paper)] md:w-[360px]">
          <div className="system-section-header">
            <span>AUDIO MODULE</span>
            <button
              onClick={() => setIsOpen(false)}
              className="border border-[var(--line)] bg-[var(--paper)] p-1 transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)]"
            >
              <X size={14} />
            </button>
          </div>

          <div className="grid gap-0 border-b border-[var(--line)] md:grid-cols-[96px_1fr]">
            <div className="border-b border-[var(--line)] bg-[var(--surface-strong)] md:border-b-0 md:border-r">
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                className="system-card-image h-24 w-full object-cover md:h-full"
              />
            </div>
            <div className="p-4">
              <span className="system-label">Now Playing</span>
              <h3 className="font-display text-4xl uppercase leading-[0.9] text-[var(--ink)]">
                {currentSong.title}
              </h3>
              <p className="mt-2 font-mono text-xs font-bold uppercase text-[var(--muted)]">
                {currentSong.artist}
              </p>
            </div>
          </div>

          <div className="space-y-5 p-4">
            <div>
              <div className="mb-2 flex items-center justify-between font-mono text-[11px] font-bold uppercase text-[var(--muted)]">
                <span>Progress</span>
                <span>
                  {Math.floor(progress)} / {Math.floor(duration || 0)}s
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={progress}
                onMouseDown={() => setIsSeeking(true)}
                onTouchStart={() => setIsSeeking(true)}
                onChange={(event) => setProgress(parseFloat(event.target.value))}
                onMouseUp={(event) => {
                  setIsSeeking(false);
                  if (audioRef.current) audioRef.current.currentTime = parseFloat(event.currentTarget.value);
                }}
                onTouchEnd={(event) => {
                  setIsSeeking(false);
                  if (audioRef.current) audioRef.current.currentTime = parseFloat(event.currentTarget.value);
                }}
                className="h-4 w-full appearance-none border border-[var(--line)] bg-[var(--surface-strong)] accent-[var(--ink)]"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setCurrentSongIndex((prev) => (prev - 1 + MUSIC_PLAYLIST.length) % MUSIC_PLAYLIST.length);
                  setIsPlaying(true);
                }}
                className="flex h-12 w-12 items-center justify-center border border-[var(--line)] bg-[var(--paper)] transition-colors hover:bg-[var(--surface-strong)]"
              >
                <SkipBack size={18} />
              </button>

              <button
                onClick={() => setIsPlaying((prev) => !prev)}
                className="flex h-12 flex-1 items-center justify-center gap-2 border border-[var(--line)] bg-[var(--ink)] px-4 font-mono text-xs font-bold uppercase text-[var(--paper)] transition-colors hover:bg-[var(--accent)]"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentSongIndex((prev) => (prev + 1) % MUSIC_PLAYLIST.length);
                  setIsPlaying(true);
                }}
                className="flex h-12 w-12 items-center justify-center border border-[var(--line)] bg-[var(--paper)] transition-colors hover:bg-[var(--surface-strong)]"
              >
                <SkipForward size={18} />
              </button>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between font-mono text-[11px] font-bold uppercase text-[var(--muted)]">
                <span>Volume</span>
                <span>{Math.round((isMuted ? 0 : volume) * 100)}%</span>
              </div>
              <ElasticSlider
                leftIcon={
                  <button onClick={() => setIsMuted((prev) => !prev)} className="transition-colors hover:text-[var(--accent)]">
                    {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                }
                value={(isMuted ? 0 : volume) * 1000}
                maxValue={1000}
                isStepped
                stepSize={10}
                onChange={(next) => {
                  const nextVolume = next / 1000;
                  setVolume(nextVolume);
                  if (nextVolume > 0 && isMuted) {
                    setIsMuted(false);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};
