
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <h2>Task Manager</h2>
      </div>

      <div className="navbar-user">
        <div className="navbar-avatar">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>

        <div className="navbar-user-details">
          <h4>{user?.name || "User"}</h4>
          <p>{user?.email || ""}</p>
        </div>

        <button
          className="navbar-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
