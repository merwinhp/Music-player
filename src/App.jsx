import { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/Sidebar'
import PlayerBar from './components/PlayerBar'
import LibraryView from './pages/LibraryView'
import PlaylistView from './pages/PlaylistView'
import FolderPicker from './components/FolderPicker'
import Toast from './components/Toast'

function AppContent() {
  const [activeView, setActiveView] = useState('library')
  const { library, isScanning } = useApp()

  return (
    <div className="flex h-screen overflow-hidden bg-kawaii-bg">
      <Toast />
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-6xl mx-auto p-6">
          {library.length === 0 && !isScanning && activeView === 'library' && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="text-8xl mb-6">🎵</div>
              <h2 className="text-2xl font-bold text-kawaii-text mb-2">Welcome to (´꒳`) Player!</h2>
              <p className="text-gray-500 mb-6">Pick a music folder to get started</p>
              <FolderPicker />
            </div>
          )}
          {activeView === 'library' && <LibraryView />}
          {activeView === 'playlists' && <PlaylistView />}
        </div>
      </main>
      <PlayerBar />
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
