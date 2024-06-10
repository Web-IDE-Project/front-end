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
        <Route path="my" element={<ContainerList category="내 컨테이너" />} />
        <Route
          path="lecture"
          element={<ContainerList category="강의 컨테이너" />}
        />
        <Route
          path="question"
          element={<ContainerList category="질문 컨테이너" />}
        />
      </Route>
      <Route
        path="/container/:containerId/workspace"
        element={<EditorPage />}
      />
    </Routes>
  )
}

export default App
