import { Howl } from 'howler'

class AudioPlayerService {
  constructor() {
    this.howl = null
    this._onEndCallback = null
    this._onProgressCallback = null
    this._progressInterval = null
  }

  load(url, format) {
    return new Promise((resolve, reject) => {
      this.unload()

      const options = {
        src: [url],
        html5: true,
        volume: 0.8,
        onload: () => {
          this._startProgress()
          resolve()
        },
        onloaderror: (_id, err) => {
          reject(err)
        },
        onplayerror: () => {
          reject(new Error('Playback error'))
        },
        onend: () => {
          this._stopProgress()
          if (this._onEndCallback) this._onEndCallback()
        },
      }

      if (format) {
        options.format = format
      }

      this.howl = new Howl(options)
    })
  }

  play() {
    if (this.howl) this.howl.play()
  }

  pause() {
    if (this.howl) this.howl.pause()
  }

  stop() {
    if (this.howl) this.howl.stop()
  }

  seek(seconds) {
    if (this.howl) {
      if (seconds !== undefined) {
        this.howl.seek(seconds)
      } else {
        return this.howl.seek()
      }
    }
    return 0
  }

  duration() {
    if (this.howl) return this.howl.duration()
    return 0
  }

  setVolume(vol) {
    if (this.howl) this.howl.volume(vol)
  }

  onEnd(callback) {
    this._onEndCallback = callback
  }

  onProgress(callback) {
    this._onProgressCallback = callback
  }

  unload() {
    this._stopProgress()
    if (this.howl) {
      this.howl.unload()
      this.howl = null
    }
  }

  _startProgress() {
    this._stopProgress()
    this._progressInterval = setInterval(() => {
      if (this.howl && this.howl.playing()) {
        const sec = this.howl.seek()
        if (this._onProgressCallback) this._onProgressCallback(sec)
      }
    }, 500)
  }

  _stopProgress() {
    if (this._progressInterval) {
      clearInterval(this._progressInterval)
      this._progressInterval = null
    }
  }
}

export default new AudioPlayerService()
