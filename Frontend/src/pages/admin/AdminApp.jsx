import { useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

const AdminApp = () => {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("adminLoggedIn")
  );

  if (!loggedIn) {
    return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  }

  return <AdminDashboard />;
};

export default AdminApp;
