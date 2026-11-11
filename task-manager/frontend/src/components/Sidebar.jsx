
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-heading">
        <h2>Workspace</h2>
      </div>

      <nav className="sidebar-navigation">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
          end
        >
          <span>📊</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span>📋</span>
          My Tasks
        </NavLink>

      </nav>
    </aside>
  );
}

export default Sidebar;
