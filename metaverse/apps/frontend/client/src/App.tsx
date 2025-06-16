import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Game } from './pages/Game'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { useAuth } from './lib/auth'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
