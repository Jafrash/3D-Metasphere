import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthPage } from './components/auth/page'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage signup={false} />} />
        <Route path="/signup" element={<AuthPage signup={true} />} />
      </Routes>
    </Router>
  )
}

export default App
