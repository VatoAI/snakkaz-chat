import React from 'react'
import ReactDOM from 'react-dom/client'
import AppV2 from './App-V2'

// Simple console log for debugging
console.log('🚀 SnakkaZ Beta V2 - Main.tsx loading...')

// Ensure root element exists
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

// Create React root and render
const root = ReactDOM.createRoot(rootElement)

root.render(
  <React.StrictMode>
    <AppV2 />
  </React.StrictMode>
)

console.log('✅ SnakkaZ Beta V2 - Rendered successfully!')