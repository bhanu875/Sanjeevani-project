import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { signupUser } from "../api/authApi";

const Signup = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showRules, setShowRules] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const rules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const isPasswordValid = Object.values(rules).every(Boolean);
  const isConfirmValid = password && password === confirm;
  const canSubmit = isPasswordValid && isConfirmValid;

  const detectCaps = (e) => {
    if (e.getModifierState) {
      setCapsOn(e.getModifierState("CapsLock"));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setServerError("");

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const phone = e.target.phone.value.trim();

    const newErrors = {};
    if (!name) newErrors.name = "Full name required";
    if (!email && !phone) newErrors.contact = "Email or phone required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await signupUser({ name, email, phone, password });
      if (res?.message === "Signup successful") {
        setShowSuccess(true);
      } else {
        setServerError(res?.message || "Signup failed");
      }
    } catch {
      setServerError("Server not reachable");
    }
  };

  return (
    <>
      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl px-10 py-8 text-center w-[360px]">
            <h2 className="text-xl font-semibold text-sanjeevani-green-dark">
              Signup Successful
            </h2>
            <button
              onClick={() => navigate("/login")}
              className="mt-6 w-full py-3 rounded-xl bg-sanjeevani-green text-white font-medium"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-sanjeevani-green-dark via-sanjeevani-brown-light to-sanjeevani-brown-dark px-6">
        <div className="w-[420px] bg-white rounded-[1.6rem] px-9 py-9 shadow-[0_25px_60px_rgba(74,59,42,0.35)]">

          {/* BRAND */}
          <div className="text-center mb-6">
            <h1 className="text-[2rem] font-semibold tracking-[0.22em] text-sanjeevani-brown-dark">
              SANJEEVANI
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Ayurveda • Wellness • Care
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSignup}>
            <input name="name" placeholder="Full name" className="auth-input" />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}

            <input name="email" placeholder="Email address" className="auth-input" />
            <input name="phone" placeholder="Phone number" className="auth-input" />
            {errors.contact && (
              <p className="text-xs text-red-500">{errors.contact}</p>
            )}

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="auth-input pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowRules(true)}
                onKeyUp={detectCaps}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {capsOn && showRules && (
              <p className="text-xs text-orange-600 font-medium">
                Caps Lock is ON
              </p>
            )}

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
                placeholder="Confirm password"
                className="auth-input pr-12"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {confirm && !isConfirmValid && (
              <p className="text-xs text-red-500">Passwords do not match</p>
            )}

            {serverError && (
              <p className="text-sm text-red-600 text-center">{serverError}</p>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full py-3 mt-3 rounded-xl text-white font-medium transition
                ${
                  canSubmit
                    ? "bg-gradient-to-r from-sanjeevani-green-dark to-sanjeevani-green hover:brightness-110"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-700">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-sanjeevani-green-dark hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
