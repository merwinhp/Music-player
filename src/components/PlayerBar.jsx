import { useState, useEffect } from 'react'
import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Repeat1,
  Volume2, Volume1, VolumeX,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import AudioPlayer from '../services/audioPlayer'

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function PlayerBar() {
  const {
    currentTrack, isPlaying, volume, shuffle, repeatMode,
    progress, duration,
    pauseTrack, resumeTrack, nextTrack, prevTrack,
    toggleShuffle, cycleRepeat, seekTo, changeVolume,
  } = useApp()

  const [localVolume, setLocalVolume] = useState(volume * 100)
  const [showVolume, setShowVolume] = useState(false)

  useEffect(() => {
    setLocalVolume(volume * 100)
  }, [volume])

  if (!currentTrack) return null

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value) / 100
    setLocalVolume(val * 100)
    changeVolume(val)
  }

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value)
    seekTo(val)
  }

  const getDuration = () => {
    return AudioPlayer.duration() || currentTrack.duration || 0
  }

  const totalDuration = getDuration()
  const progressValue = totalDuration > 0 ? Math.min(progress, totalDuration) : 0

  return (
    <div className="fixed bottom-0 left-0 right-0 backdrop-blur-sm border-t-2 border-kawaii-pink shadow-lg z-50 px-4 py-3" style={{ backgroundColor: 'var(--player-bg)' }}>
      <div className="max-w-6xl mx-auto flex items-center gap-4">
        <div className="flex items-center gap-3 w-56 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-kawaii-pink/20 flex items-center justify-center text-xl shrink-0 overflow-hidden">
            {currentTrack.coverArt ? (
              <img src={currentTrack.coverArt} alt="" className="w-full h-full object-cover" />
            ) : (
              '🎵'
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate text-kawaii-text">
              {currentTrack.title || 'Unknown Track'}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--player-text-muted)' }}>
              {currentTrack.artist || 'Unknown Artist'}
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleShuffle}
              className={`p-1.5 rounded-lg transition-all hover:scale-110 ${
                shuffle ? 'text-kawaii-pink bg-kawaii-pink/10' : ''
              }`}
              title="Shuffle"
            >
              <Shuffle size={18} />
            </button>
            <button
              onClick={prevTrack}
              className="p-1.5 rounded-lg hover:text-kawaii-text transition-all"
              title="Previous"
              style={{ color: 'var(--track-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--track-hover)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <SkipBack size={20} />
            </button>
            <button
              onClick={isPlaying ? pauseTrack : resumeTrack}
              className="p-2.5 rounded-full bg-kawaii-pink text-white hover:bg-kawaii-pink/90 hover:scale-105 transition-all shadow-md"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />}
            </button>
            <button
              onClick={nextTrack}
              className="p-1.5 rounded-lg hover:text-kawaii-text transition-all"
              title="Next"
              style={{ color: 'var(--track-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--track-hover)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <SkipForward size={20} />
            </button>
            <button
              onClick={cycleRepeat}
              className={`p-1.5 rounded-lg transition-all hover:scale-110 ${
                repeatMode !== 'none' ? 'text-kawaii-pink bg-kawaii-pink/10' : ''
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
            </button>
          </div>

          <div className="w-full max-w-md flex items-center gap-2">
            <span className="text-xs w-10 text-right tabular-nums" style={{ color: 'var(--track-muted)' }}>
              {formatTime(progressValue)}
            </span>
            <input
              type="range"
              min={0}
              max={totalDuration || 1}
              step={0.1}
              value={progressValue}
              onChange={handleSeek}
              className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-kawaii-pink
                [&::-webkit-slider-thumb]:shadow-md
                accent-kawaii-pink"
              style={{ backgroundColor: 'var(--slider-track)' }}
            />
            <span className="text-xs w-10 tabular-nums" style={{ color: 'var(--track-muted)' }}>
              {formatTime(totalDuration)}
            </span>
          </div>
        </div>

        <div
          className="w-32 flex items-center gap-2 justify-end relative"
          onMouseEnter={() => setShowVolume(true)}
          onMouseLeave={() => setShowVolume(false)}
        >
          <button className="hover:text-kawaii-text" style={{ color: 'var(--track-muted)' }}>
            {volume === 0 ? <VolumeX size={18} /> : volume < 0.5 ? <Volume1 size={18} /> : <Volume2 size={18} />}
          </button>
          <div className={`flex items-center gap-2 transition-all duration-200 ${showVolume ? 'opacity-100 w-24' : 'opacity-60 w-16'}`}>
            <input
              type="range"
              min={0}
              max={100}
              value={localVolume}
              onChange={handleVolumeChange}
              className="w-full h-1 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-kawaii-pink
                accent-kawaii-pink"
              style={{ backgroundColor: 'var(--slider-track)' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
