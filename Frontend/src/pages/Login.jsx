import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../api/authApi";

const Login = () => {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("Please enter email/phone and password");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser({
        identifier: identifier.trim(),
        password,
      });

      if (res?.token) {
        // 🔐 Store auth data
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));

        // 🔀 Redirect based on role
        if (res.user?.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError(res?.message || "Login failed");
      }
    } catch (err) {
      setError("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-sanjeevani-green-dark via-sanjeevani-brown-light to-sanjeevani-brown-dark px-6">
      <div className="w-[380px] bg-white rounded-[1.6rem] px-9 py-9 shadow-[0_25px_60px_rgba(74,59,42,0.35)]">

        {/* BRAND */}
        <div className="text-center mb-6">
          <h1 className="text-[1.9rem] font-semibold tracking-[0.22em] text-sanjeevani-brown-dark">
            SANJEEVANI
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Ayurveda • Wellness • Care
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* EMAIL / PHONE */}
          <input
            placeholder="Email or Phone"
            className="auth-input"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="auth-input pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-sanjeevani-green text-white font-medium hover:brightness-110 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* FOOTER LINKS */}
        <div className="mt-6 text-center space-y-2">
          <Link
            to="/reset-password"
            className="block text-sm text-sanjeevani-green-dark hover:underline"
          >
            Forgot password?
          </Link>

          <p className="text-sm text-gray-700">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-sanjeevani-green-dark hover:underline"
            >
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
