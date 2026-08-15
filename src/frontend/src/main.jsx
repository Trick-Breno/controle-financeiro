import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { MovimentacoesProvider } from './contexts/MovimentacoesContext.jsx'
import { CarteirasProvider } from './contexts/CarteirasContext.jsx'
import { App } from './App.jsx'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <MovimentacoesProvider>
        <CarteirasProvider>
          <App />
        </CarteirasProvider>
        </MovimentacoesProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)