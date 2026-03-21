import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import AdminPanel from "./pages/AdminPanel"
import OrgRegistration from "./pages/OrgRegistration"
import StudentFeed from "./pages/StudentFeed"
import ProtectedRoute from "./components/ProtectedRoute"

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public routes */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected — any logged in user */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Your route — student feed */}
          <Route path="/feed" element={
            <ProtectedRoute>
              <StudentFeed />
            </ProtectedRoute>
          } />

          {/* Protected — admin only */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          } />

          {/* Protected — organization only */}
          <Route path="/org/register" element={
            <ProtectedRoute allowedRoles={['organization']}>
              <OrgRegistration />
            </ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App