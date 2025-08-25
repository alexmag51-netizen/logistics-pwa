import { useEffect, useState } from 'react'
import Orders from './Orders'

export default function App() {
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const isStandalone =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    setInstalled(isStandalone)
  }, [])

  return (
    <div style={{
      minHeight: '100svh',
      display: 'grid',
      placeItems: 'center',
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    }}>
      <div style={{ textAlign: 'center', width: '100%' }}>
        <h1>🚀 Logistics PWA</h1>
        <p style={{ opacity: .7 }}>
          Статус: {installed ? 'Установлено как приложение' : 'Открыто в браузере'}
        </p>
        <Orders />
      </div>
    </div>
  )
}
