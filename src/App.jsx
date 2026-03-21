import { AuthProvider } from "./context/AuthContext";
import StudentFeed from "./pages/StudentFeed";

export default function App() {
  return (
    <AuthProvider>
      <StudentFeed />
    </AuthProvider>
  );
}