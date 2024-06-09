import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage/LandingPage'
import LoginPage from './pages/LoginPage/LoginPage'
import SignUpPage from './pages/SignUpPage/SignUpPage'
import ContainerPage from './pages/ContainerPage/ContainerPage'
import EditorPage from './pages/EditorPage/EditorPage'
import ContainerList from './pages/ContainerPage/ContainerList'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/container" element={<ContainerPage />}>
        <Route index element={<Navigate to="my" />} />
        <Route path="my" element={<ContainerList category="my" />} />
        <Route path="lecture" element={<ContainerList category="lecture" />} />
        <Route
          path="question"
          element={<ContainerList category="question" />}
        />
      </Route>
      <Route path="/editor" element={<EditorPage />} />
    </Routes>
  )
}

export default App
