import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Toast() {
  const { toast } = useApp()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (toast) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 2800)
      return () => clearTimeout(timer)
    }
  }, [toast])

  if (!visible || !toast) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-fade-in">
      <div className="rounded-2xl shadow-lg border px-5 py-3 text-sm font-semibold text-kawaii-text"
        style={{ backgroundColor: 'var(--color-kawaii-surface)', borderColor: 'var(--divider)' }}>
        {toast}
      </div>
    </div>
  )
}
