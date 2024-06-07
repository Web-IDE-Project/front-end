import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage/LandingPage'
import LoginPage from './pages/LoginPage/LoginPage'
import SignUpPage from './pages/SignUpPage/SignUpPage'
import ContainerPage from './pages/ContainerPage/ContainerPage'
import EditorPage from './pages/EditorPage/EditorPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/container" element={<ContainerPage />} />
      <Route path="/editor" element={<EditorPage />} />
    </Routes>
  )
}

export default App
