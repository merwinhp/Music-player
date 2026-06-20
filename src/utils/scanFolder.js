const AUDIO_EXTENSIONS = new Set([
  '.mp3', '.flac', '.wav', '.ogg', '.m4a', '.aac',
  '.opus', '.webm', '.aiff', '.aif', '.wma', '.alac',
  '.ape', '.wv', '.tta', '.dsf', '.dff', '.mpc',
])

export async function scanFolder(directoryHandle) {
  const files = []
  const rootName = directoryHandle.name

  async function walk(dirHandle, path) {
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file') {
        const ext = entry.name.slice(entry.name.lastIndexOf('.')).toLowerCase()
        if (AUDIO_EXTENSIONS.has(ext)) {
          const file = await entry.getFile()
          Object.defineProperty(file, 'name', { value: entry.name })
          Object.defineProperty(file, '_folderPath', { value: path })
          files.push(file)
        }
      } else if (entry.kind === 'directory') {
        await walk(entry, `${path}/${entry.name}`)
      }
    }
  }

  await walk(directoryHandle, rootName)
  return files
}
