import { Navigate } from "react-router-dom";

const AdminProtected = ({ children }) => {
  const isAdmin = localStorage.getItem("adminLoggedIn");

  if (!isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default AdminProtected;
