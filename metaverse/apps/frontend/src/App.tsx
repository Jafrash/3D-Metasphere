import type React from "react"
import { BrowserRouter} from "react-router-dom"
import "./App.css"
import { AuthProvider } from "./contexts/AuthContext.tsx"

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

/* const App=()=>{
  return (
    <>
      <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Router>
      </AuthProvider>

    </>
  )
}

*/

