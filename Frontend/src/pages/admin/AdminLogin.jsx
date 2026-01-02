import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    
    if (!identifier || !password) {
      setError("Please enter both email/phone and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        setError("Invalid server response. Please try again.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Check if user is admin
      if (data.user?.role !== "admin") {
        setError("Access denied. Admin credentials required.");
        setLoading(false);
        return;
      }

      // Store JWT and user data
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("adminLoggedIn", "true");

      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-white">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            🔐 Admin Login
          </h2>
          <p className="text-sm text-gray-600">
            Access the admin dashboard
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email or Phone
            </label>
            <input
              type="text"
              placeholder="Enter admin email or phone"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                         transition-all"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                         transition-all"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 
                       text-white py-3 rounded-lg font-semibold
                       hover:from-green-700 hover:to-emerald-700 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Only authorized administrators can access this page
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
