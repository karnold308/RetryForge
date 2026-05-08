import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '/src/styles/App.css'
import Root from './Root.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
