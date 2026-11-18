import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import App1 from './Building/main1'

import { ErrorWatch } from './components/ErrorWatch.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <App1 /> */}
    <ErrorWatch />
  </StrictMode>,
)

/* ------------------------------------------------------------------ */
/*  Service worker — dev kills it, prod registers the fixed version   */
/* ------------------------------------------------------------------ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    if (import.meta.env.DEV) {
      try {
        const regs = await navigator.serviceWorker.getRegistrations()
        await Promise.all(regs.map((r) => r.unregister()))
        const keys = await caches.keys()
        await Promise.all(keys.map((k) => caches.delete(k)))
        // eslint-disable-next-line no-console
        console.info('[sw] dev mode: unregistered + caches cleared')
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[sw] dev cleanup failed', e)
      }
      return
    }

    try {
      await navigator.serviceWorker.register('/service-worker.js')
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[sw] registration failed', e)
    }
  })
}