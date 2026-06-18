import { openDB } from 'idb'
import { uuid } from './uuid'

const dbPromise = openDB('music-player-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('tracks')) {
      db.createObjectStore('tracks', { keyPath: 'id' })
    }
    if (!db.objectStoreNames.contains('playlists')) {
      db.createObjectStore('playlists', { keyPath: 'id' })
    }
  },
})

export async function saveTracks(tracks) {
  const db = await dbPromise
  const tx = db.transaction('tracks', 'readwrite')
  await tx.store.clear()
  for (const track of tracks) {
    await tx.store.put(track)
  }
  await tx.done
}

export async function loadTracks() {
  const db = await dbPromise
  return db.getAll('tracks')
}

export async function clearTracks() {
  const db = await dbPromise
  await db.clear('tracks')
}

export async function createPlaylist(name) {
  const db = await dbPromise
  const playlist = {
    id: uuid(),
    name,
    trackIds: [],
    createdAt: Date.now(),
  }
  await db.add('playlists', playlist)
  return playlist
}

export async function loadPlaylists() {
  const db = await dbPromise
  return db.getAll('playlists')
}

export async function addTrackToPlaylist(playlistId, trackId) {
  const db = await dbPromise
  const playlist = await db.get('playlists', playlistId)
  if (!playlist) return
  if (!playlist.trackIds.includes(trackId)) {
    playlist.trackIds.push(trackId)
    await db.put('playlists', playlist)
  }
  return playlist
}

export async function removeTrackFromPlaylist(playlistId, trackId) {
  const db = await dbPromise
  const playlist = await db.get('playlists', playlistId)
  if (!playlist) return
  playlist.trackIds = playlist.trackIds.filter(id => id !== trackId)
  await db.put('playlists', playlist)
  return playlist
}

export async function deletePlaylist(playlistId) {
  const db = await dbPromise
  await db.delete('playlists', playlistId)
}

export async function renamePlaylist(playlistId, newName) {
  const db = await dbPromise
  const playlist = await db.get('playlists', playlistId)
  if (!playlist) return
  playlist.name = newName
  await db.put('playlists', playlist)
  return playlist
}
