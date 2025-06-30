import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { AuthPage } from './components/auth/page'
import Dashboard from './components/dashboard/dashboard'
import { Home } from './components/home'
import { SpaceMain } from './components/space/main'
import { CreateNewSpace } from './components/new-space/create-new-space'
import { MapViaId } from './components/new-space/new-space-via-mapId'
import { NewEmptySpace } from './components/new-space/new-empty-space'

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<AuthPage signup={false} />} />
          <Route path="/signup" element={<AuthPage signup={true} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-space" element={<CreateNewSpace />} />
          <Route path="/new-space/create" element={<NewEmptySpace />} />
          <Route path="/new-space/:mapId" element={<MapViaId id={window.location.pathname.split("/").pop() || ""} />} />
          <Route path="/space/:spaceId" element={<SpaceMain spaceId={window.location.pathname.split("/").pop() || ""} />} />
        </Routes>
      </Router>
    </RecoilRoot>
  )
}

export default App
