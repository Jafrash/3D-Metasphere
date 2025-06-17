import { Routes, Route } from 'react-router-dom'
import { SpaceManagement } from './pages/SpaceManagement'
import { ElementManagement } from './pages/ElementManagement'
import { UserManagement } from './pages/UserManagement'
import { Dashboard } from './components/dashboard/dashboard'
import { AuthPage } from './components/auth/page'

import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-gray-800">Metasphere Admin</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage signup />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/spaces" element={<SpaceManagement />} />
          <Route path="/elements" element={<ElementManagement />} />
          <Route path="/users" element={<UserManagement />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
