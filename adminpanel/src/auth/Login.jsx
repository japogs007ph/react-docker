import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "./AuthService";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.target;
    const username = form.username.value;
    const password = form.password.value;

    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow w-80"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <input
          name="username"
          type="text"
          placeholder="Username"
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          required
        />

        {/* show error */}
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading} // ✅ prevent multiple clicks
          className={`w-full py-2 rounded text-white ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Signing in..." : "Login"} {/* ✅ dynamic text */}
        </button>
      
      </form>
    </div>
  );
}
