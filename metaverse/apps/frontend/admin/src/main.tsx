import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import "./index.css"
import { Navbar } from './components/nav/navbar'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')
const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <main className="flex flex-col gap-10 h-screen p-5 max-w-screen-2xl mx-auto"> 
    <Navbar />
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </main>
  </StrictMode>
)
