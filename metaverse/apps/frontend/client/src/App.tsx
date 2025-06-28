import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthPage } from './components/auth/page'
import Dashboard from './components/dashboard/dashboard'
import { Home } from './components/home'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<AuthPage signup={false} />} />
        <Route path="/signup" element={<AuthPage signup={true} />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
