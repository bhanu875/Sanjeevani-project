import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* AUTH */
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";

/* HOME */
import Home from "./pages/Home";

/* USER */
import UserDashboard from "./pages/users/UserDashboard";
import MyAppointments from "./pages/users/MyAppointments";
import PlantDetails from "./pages/PlantDetails";

import ExploreBySymptoms from "./pages/ExploreBySymptoms";


/* HERBAL GARDEN */
import VirtualGarden from "./pages/VirtualGarden"; // 🌿 2D Virtual Garden

/* COMMUNITY */
import Community from "./pages/community/Community";

/* WELLNESS */
import Appointment from "./pages/Appointment/Appointment";

/* PROTECTION */
import ProtectedRoute from "./components/ProtectedRoute";

/* ADMIN */
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProtectedRoute from "./pages/admin/AdminProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ================= HERBAL GARDEN ================= */}
        <Route
          path="/herbal-garden"
          element={
            <ProtectedRoute>
              <VirtualGarden />
            </ProtectedRoute>
          }
        />

        {/* ================= COMMUNITY ================= */}
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />

        {/* ================= USER ================= */}
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
<Route
  path="/plants/:id"
  element={
    <ProtectedRoute>
      <PlantDetails />
    </ProtectedRoute>
  }
/>
<Route
  path="/explore-by-symptoms"
  element={
    <ProtectedRoute>
      <ExploreBySymptoms />
    </ProtectedRoute>
  }
/>

        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/appointments"
          element={
            <ProtectedRoute>
              <MyAppointments />
            </ProtectedRoute>
          }
        />

        {/* ================= WELLNESS ================= */}
        <Route
          path="/wellness"
          element={
            <ProtectedRoute>
              <Appointment />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ================= */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        {/* ================= REDIRECTS ================= */}
        <Route
          path="/products"
          element={<Navigate to="/herbal-garden" replace />}
        />
        <Route
          path="/exploreproducts"
          element={<Navigate to="/herbal-garden" replace />}
        />
        <Route path="/cart" element={<Navigate to="/" replace />} />
        <Route path="/orders" element={<Navigate to="/" replace />} />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
