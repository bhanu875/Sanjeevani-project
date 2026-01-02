import { Link, useNavigate } from "react-router-dom";

const UserMenu = ({ onClose }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border z-50">
      <ul className="py-2 text-sm text-gray-700">
        <li>
          <Link
            to="/user/dashboard"
            onClick={onClose}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            Dashboard
          </Link>
        </li>

        <li>
          <Link
            to="/user/appointments"
            onClick={onClose}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            My Appointments
          </Link>
        </li>


        <hr className="my-2" />

        <li>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserMenu;
