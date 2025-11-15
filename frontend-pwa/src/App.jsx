import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Placeholder components - se implementarán en fases posteriores
const Login = () => <div className="flex items-center justify-center h-full"><h1 className="text-2xl">Login - Por implementar</h1></div>
const Dashboard = () => <div className="flex items-center justify-center h-full"><h1 className="text-2xl">Dashboard - Por implementar</h1></div>

function App() {
  return (
    <Router>
      <div className="h-full">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
