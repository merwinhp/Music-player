import { parseBlob } from 'music-metadata-browser'
import { uuid } from './uuid'

export async function readMetadata(file) {
  const metadata = await parseBlob(file)
  const { common, format } = metadata

  const title = common.title || file.name.replace(/\.[^/.]+$/, '')
  const artist = common.artist || 'Unknown Artist'
  const album = common.album || 'Unknown Album'

  let coverArt = null
  if (common.picture && common.picture.length > 0) {
    const pic = common.picture[0]
    const blob = new Blob([pic.data], { type: pic.format })
    coverArt = await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  }

  const duration = format.duration || 0

  return {
    id: uuid(),
    title,
    artist,
    album,
    duration,
    coverArt,
    folder: file._folderPath || '',
    fileRef: file,
  }
}
