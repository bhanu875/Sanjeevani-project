import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const rules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const isPasswordValid = Object.values(rules).every(Boolean);
  const isConfirmValid = password && password === confirmPassword;
  const canSubmit = isPasswordValid && isConfirmValid && email;

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!isPasswordValid) {
      setError("Password does not meet requirements");
      return;
    }

    if (!isConfirmValid) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        password,
      });

      if (res.data.message === "Password reset successful") {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(res.data.message || "Password reset failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-sanjeevani-green-dark via-sanjeevani-brown-light to-sanjeevani-brown-dark px-6">
        <div className="w-[380px] bg-white rounded-[1.6rem] px-9 py-9 shadow-[0_25px_60px_rgba(74,59,42,0.35)] text-center">
          <h2 className="text-xl font-semibold text-sanjeevani-green-dark mb-4">
            Password Reset Successful!
          </h2>
          <p className="text-gray-600 mb-4">
            Your password has been reset. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-sanjeevani-green-dark via-sanjeevani-brown-light to-sanjeevani-brown-dark px-6">
      <div className="w-[380px] bg-white rounded-[1.6rem] px-9 py-9 shadow-[0_25px_60px_rgba(74,59,42,0.35)]">
        {/* BRAND */}
        <div className="text-center mb-6">
          <h1 className="text-[1.9rem] font-semibold tracking-[0.22em] text-sanjeevani-brown-dark">
            SANJEEVANI
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Reset Your Password
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email address"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className="auth-input pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setShowRules(true)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {showRules && (
            <div className="text-xs space-y-1">
              <p className={rules.length ? "text-green-600" : "text-red-500"}>• Minimum 8 characters</p>
              <p className={rules.upper ? "text-green-600" : "text-red-500"}>• One uppercase letter</p>
              <p className={rules.lower ? "text-green-600" : "text-red-500"}>• One lowercase letter</p>
              <p className={rules.number ? "text-green-600" : "text-red-500"}>• One number</p>
              <p className={rules.special ? "text-green-600" : "text-red-500"}>• One special character</p>
            </div>
          )}

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              className="auth-input pr-12"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {confirmPassword && !isConfirmValid && (
            <p className="text-xs text-red-500">Passwords do not match</p>
          )}

          {/* ERROR */}
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={!canSubmit || loading}
            className={`w-full py-3 rounded-xl text-white font-medium transition
              ${
                canSubmit
                  ? "bg-gradient-to-r from-sanjeevani-green-dark to-sanjeevani-green hover:brightness-110"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* FOOTER LINKS */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="block text-sm text-sanjeevani-green-dark hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
