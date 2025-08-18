import "./styles/design-system.css"
import "./styles/snakkaz-unified-design-system.css"
import React from 'react'
import ReactDOM from 'react-dom/client'
import SnakkaZApp from './SnakkaZApp.tsx'
import './index.css' // PERFECT LIQUID DREAM DESIGN IMPORTED!

// FIXED MAIN.TSX - CSS IMPORT ADDED - Using SnakkaZ App
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <SnakkaZApp />
    </React.StrictMode>,
)
