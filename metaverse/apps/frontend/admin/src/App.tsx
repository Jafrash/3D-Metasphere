import { Routes, Route } from 'react-router-dom'
import { Dashboard } from './components/dashboard/dashboard'
import { AuthPage } from './components/auth/page'
import { Redirect } from './components/redirect'
import './index.css'
import { CreateAvatar } from './components/add-avatar/add-avatar'
import { CreateElement } from './components/add-element/add-element'
import { CreateMap } from './components/create-map/create-map'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Redirect />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/signup" element={<AuthPage signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-avatar" element={<CreateAvatar />} />
      <Route path="/create-element" element={<CreateElement />} />
      <Route path="/create-map" element={<CreateMap />} />
    </Routes>
  )
}

export default App
