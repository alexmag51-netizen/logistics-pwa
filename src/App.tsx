import { useEffect, useState } from 'react'

export default function App() {
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // флажок для отладки: PWA в standalone?
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
      <div style={{ textAlign: 'center' }}>
        <h1>🚀 Logistics PWA — Hello World</h1>
        <p>Это базовый каркас. PWA уже подключена.</p>
        <p style={{opacity:.7}}>
          Статус: {installed ? 'Установлено как приложение' : 'Открыто в браузере'}
        </p>
      </div>
    </div>
  )
}
