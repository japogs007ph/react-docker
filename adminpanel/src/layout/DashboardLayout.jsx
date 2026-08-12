import { Outlet, Link } from "react-router-dom";
import { logout } from "../auth/AuthService";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6">
        <h2 className="text-2xl font-semibold mb-8">Admin</h2>

        <nav className="space-y-4 text-lg">
          <Link className="block hover:text-blue-400" to="/">Dashboard</Link>
          <Link className="block hover:text-blue-400" to="/users">Users</Link>
          <Link className="block hover:text-blue-400" to="/settings">Settings</Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-1 rounded">
            Logout
          </button>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
