import { Routes, Route } from 'react-router-dom'
import LoginRegister from './pages/Login'
import TaskCRUD from './pages/task'
import EditUser from './pages/perfil'
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginRegister />} />
      <Route path="/login" element={<LoginRegister />} />
      <Route path="/task" element={<TaskCRUD />} />
      <Route path="/perfil" element={<EditUser />} />
    </Routes>
  )
}

export default App