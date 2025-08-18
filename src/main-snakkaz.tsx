import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SnakkaZApp from './SnakkaZApp'
import './styles/snakkaz-unified-design-system.css'

// Initialize SnakkaZ App
console.log('🇳🇴 SnakkaZ Premium Chat - Starting...');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SnakkaZApp />
  </StrictMode>,
)
