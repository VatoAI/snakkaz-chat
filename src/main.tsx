import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/modern-chat-system.css'
import './components/layout/MainApp.css'
import './pages/Dashboard.css'
import './pages/Profile.css'
import './pages/Settings.css'
import './pages/Notifications.css'
import './features/chat/components/FreshChat.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
