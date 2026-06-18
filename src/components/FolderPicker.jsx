import { FolderOpen } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { scanFolder } from '../utils/scanFolder'
import { readMetadata } from '../utils/readMetadata'
import { uuid } from '../utils/uuid'

export default function FolderPicker() {
  const { browserWarning, setScanning, setLibraryTracks, addToLibrary, showToast } = useApp()

  const handlePick = async () => {
    if (!window.showDirectoryPicker) {
      showToast('Your browser does not support folder picking. Please use Chrome, Edge, or Brave.')
      return
    }

    try {
      const dirHandle = await window.showDirectoryPicker()
      setScanning(true, { current: 0, total: 0 })

      const files = await scanFolder(dirHandle)

      if (files.length === 0) {
        setScanning(false)
        showToast('No audio files found in that folder')
        return
      }

      setScanning(true, { current: 0, total: files.length })

      let tracks = []
      for (let i = 0; i < files.length; i++) {
        try {
          const meta = await readMetadata(files[i])
          tracks.push(meta)
        } catch {
          const name = files[i].name.replace(/\.[^/.]+$/, '')
          tracks.push({
            id: uuid(),
            title: name,
            artist: 'Unknown Artist',
            album: 'Unknown Album',
            duration: 0,
            coverArt: null,
            folder: files[i]._folderPath || '',
            fileRef: files[i],
          })
        }
        setScanning(true, { current: i + 1, total: files.length })
      }

      addToLibrary(tracks)
      setScanning(false)
      showToast(`Loaded ${tracks.length} tracks!`)
    } catch (err) {
      if (err.name !== 'AbortError' && err.name !== 'SecurityError') {
        console.error('Folder pick error:', err)
      }
      setScanning(false)
    }
  }

  if (browserWarning) {
    const isSecure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center max-w-md">
        <p className="text-yellow-800 font-medium">⚠️ Folder picking not available</p>
        <p className="text-yellow-600 text-sm mt-1">
          {isSecure
            ? 'Please use Chrome, Edge, or Brave — your browser doesn\'t support the File System Access API.'
            : 'Access this page via localhost or HTTPS to enable folder selection.'}
        </p>
      </div>
    )
  }

  return (
    <button
      onClick={handlePick}
      className="flex items-center gap-2 bg-kawaii-pink text-white font-bold px-6 py-3 rounded-full shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
    >
      <FolderOpen size={20} />
      Pick Music Folder
    </button>
  )
}
