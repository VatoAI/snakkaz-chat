import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'
import './styles/ultra-premium-4k.css'

console.log('🚀 SnakkaZ Beta V2 - Ultra Modern Loading...')

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

console.log('✨ SnakkaZ Beta V2 - Successfully Rendered!')