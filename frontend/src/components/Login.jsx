import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // NEW — password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md bg-white mx-auto p-6 shadow rounded">
      <h1 className="text-xl font-semibold text-center mb-4">Login</h1>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Email */}
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* Password + Show/Hide */}
        <div className="relative">
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* Toggle button */}
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <button className="w-full py-2 bg-black text-white rounded">
          Login
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        Don't have an account? <Link className="text-blue-600" to="/signup">Signup</Link>
      </p>
    </div>
  );
};

export default Login;
