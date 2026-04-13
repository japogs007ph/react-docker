import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  activateUser,
} from "../users/UserService";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  async function loadUsers() {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  // ✅ open modal (create)
  function handleAdd() {
    setSelectedUser(null);
    setShowModal(true);
  }

  // ✅ open modal (edit)
  function handleEdit(user) {
    setSelectedUser(user);
    setShowModal(true);
  }

  // ✅ save (create or update)
  async function handleSave(form) {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.Id, form);
      } else {
        await createUser(form);
      }

      setShowModal(false);
      loadUsers();
    } catch (err) {
      console.error(err);
      const message = err.response?.data || "Something went wrong";
      alert(message); // you can replace with toast later
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this user?")) return;

    await deleteUser(id);
    loadUsers();
  }

  async function handleActivate(id) {
    if (!window.confirm("Activate this user?")) return;

    await activateUser(id);
    loadUsers();
  }

  if (loading) return <p className="text-center mt-10">Loading users...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">User Management</h1>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add User
        </button>
      </div>

      <table className="w-full border border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left font-semibold text-gray-700">Username</th>
            <th className="p-2 text-left font-semibold text-gray-700">Role</th>
            <th className="p-2 text-left font-semibold text-gray-700">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.Id} className="border-t hover:bg-gray-50">
              <td className="p-2 align-middle">{u.UserName}</td>
              <td className="p-2 align-middle">{u.Role}</td>
              <td className="p-2 align-middle">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    u.IsActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {u.IsActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => handleEdit(u)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>

                {u.IsActive ? (
                  <button
                    onClick={() => handleDelete(u.Id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => handleActivate(u.Id)}
                    className="bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Activate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Modal */}
      {showModal && (
        <UserModal
          user={selectedUser}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function UserModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    userName: user?.UserName || "",
    password: "",
    role: user?.Role || "User",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    await onSave(form);

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded w-80"
      >
        <h2 className="text-lg font-bold mb-3">
          {user ? "Edit User" : "Add User"}
        </h2>

        <input
          name="userName"
          value={form.userName}
          onChange={handleChange}
          placeholder="Username"
          className="w-full mb-2 p-2 border rounded"
          required
        />

        {!user && (
          <input
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="Password"
            className="w-full mb-2 p-2 border rounded"
            required
          />
        )}

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="User">User</option>
        </select>

        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose}>
            Cancel
          </button>

          <button
            disabled={loading}
            className={`px-3 py-1 rounded text-white ${
              loading
                ? "bg-blue-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}