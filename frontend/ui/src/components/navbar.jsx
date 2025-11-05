import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Navbar() {
  const { isAuthenticated, userType, logout } = useAuth(); // 👈 get userType too
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-glass shadow-smooth flex justify-between items-center px-8 py-4">
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-semibold tracking-tight cursor-pointer"
      >
        CollegeGPT
      </h1>

      <div className="flex space-x-3 items-center">
        {/* 👇 Show Admin Button only if admin is logged in */}
        {isAuthenticated && userType === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Admin Dashboard
          </button>
        )}

        {!isAuthenticated ? (
          <>
            <Link to="/login" className="text-gray-800 hover:text-black">
              Login
            </Link>
            <Link to="/register" className="text-gray-800 hover:text-black">
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-900"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
