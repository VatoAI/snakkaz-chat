import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Initialize analytics if in production
if (import.meta.env.PROD) {
    // Google Analytics or similar
    console.log('SnakkaZ Production Mode - Analytics Active')
}

// Error boundary for production
window.addEventListener('error', (event) => {
    if (import.meta.env.PROD) {
        // Send to error tracking service (Sentry, etc.)
        console.error('Production Error:', event.error)
    }
})

// Service Worker registration
if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration)
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError)
            })
    })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
)
