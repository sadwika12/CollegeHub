
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider }    from "./context/AuthContext"
import Login               from "./pages/Login"
import Register            from "./pages/Register"
import Dashboard           from "./pages/Dashboard"
import AdminPanel          from "./pages/AdminPanel"
import OrgRegistration     from "./pages/OrgRegistration"
import StudentFeed         from "./pages/StudentFeed"
import Bookmarks           from "./pages/Bookmarks"
import Profile             from "./pages/Profile"
import MyPosts             from "./pages/MyPosts"
import CreatePost          from "./pages/CreatePost"
import DeptPosts           from "./pages/DeptPosts"
import FacultyList         from "./pages/FacultyList"
import Requests            from "./pages/Requests"
import SubmitRequest       from "./pages/SubmitRequest"
import AllPosts            from "./pages/AllPosts"
import Settings            from "./pages/Settings"
import ProtectedRoute      from "./components/ProtectedRoute"


const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route path="/login"    element={<Login />}    />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard"      element={<ProtectedRoute><Dashboard /></ProtectedRoute>}      />
          <Route path="/feed"           element={<ProtectedRoute><StudentFeed /></ProtectedRoute>}    />
          <Route path="/bookmarks"      element={<ProtectedRoute><Bookmarks /></ProtectedRoute>}      />
          <Route path="/profile"        element={<ProtectedRoute><Profile /></ProtectedRoute>}        />
          <Route path="/my-posts"       element={<ProtectedRoute><MyPosts /></ProtectedRoute>}        />
          <Route path="/create"         element={<ProtectedRoute><CreatePost /></ProtectedRoute>}     />
          <Route path="/all-posts"      element={<ProtectedRoute><AllPosts /></ProtectedRoute>}       />
          <Route path="/settings"       element={<ProtectedRoute><Settings /></ProtectedRoute>}       />
          <Route path="/submit-request" element={<ProtectedRoute><SubmitRequest /></ProtectedRoute>}  />

          <Route path="/requests"       element={<ProtectedRoute><Requests /></ProtectedRoute>}       />
          <Route path="/dept-posts"     element={<ProtectedRoute><DeptPosts /></ProtectedRoute>}      />
          <Route path="/faculty"        element={<ProtectedRoute><FacultyList /></ProtectedRoute>}    />

          <Route path="/admin"          element={<ProtectedRoute><AdminPanel /></ProtectedRoute>}     />

          <Route path="/org/register"   element={<ProtectedRoute><OrgRegistration /></ProtectedRoute>} />

          <Route path="/"  element={<Navigate to="/login" replace />} />
          <Route path="*"  element={<Navigate to="/login" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
