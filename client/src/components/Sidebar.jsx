import { NavLink } from 'react-router-dom';
import logo from '/logo.png'

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-full p-4 bg-gray-100 w-64 md:w-56 lg:w-48 xl:w-50">
      <div className="mb-4">
        <img src={logo} alt="Logo" className="h-20 rounded-full" />
      </div>
      <nav className="flex flex-col gap-4 mb-11">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `p-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/data-entry"
          className={({ isActive }) =>
            `p-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`
          }
        >
          Data Entry
        </NavLink>
        <NavLink
          to="/export-import"
          className={({ isActive }) =>
            `p-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`
          }
        >
          Export & Import
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) =>
            `p-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`
          }
        >
          Users
        </NavLink>
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `p-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`
          }
        >
          Log Out
        </NavLink>
      </nav>

     
    </div>
  );
};

export default Sidebar;
