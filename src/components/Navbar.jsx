import NotificationBell from "./NotificationBell";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-indigo-600 font-bold text-xl">📢 CollegeHub</span>
      </div>
      <div className="flex items-center gap-4">
        <NotificationBell count={3} />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
            {user?.name?.[0] ?? "U"}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name}</span>
        </div>
      </div>
    </nav>
  );
}