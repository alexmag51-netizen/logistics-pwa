import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// авто-обновление PWA (чтобы не залипала на старых кэшах)
import { registerSW } from 'virtual:pwa-register'
const updateSW = registerSW({
  onNeedRefresh() { updateSW(true) },
  onOfflineReady() { /* опционально показать тост */ }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
