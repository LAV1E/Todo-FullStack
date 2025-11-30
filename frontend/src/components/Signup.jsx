import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  // NEW — show/hide password toggle
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
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
    <div className="max-w-md mx-auto bg-white shadow p-6 rounded">
      <h1 className="text-xl font-semibold text-center mb-4">Signup</h1>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <form className="space-y-3" onSubmit={handleSubmit}>
        {/* Name */}
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* Email */}
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* Password + Show/Hide */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full border px-3 py-2 rounded"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* Toggle */}
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <button className="w-full bg-black text-white rounded py-2">
          Create Account
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <Link className="text-blue-600" to="/login">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;
