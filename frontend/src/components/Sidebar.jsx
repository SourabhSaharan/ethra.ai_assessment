import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaTasks,
} from "react-icons/fa";

import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: <FaProjectDiagram />,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: <FaTasks />,
    },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 h-screen p-5">
      <h1 className="text-2xl font-bold text-cyan-400 mb-10">
        Ethra.ai
      </h1>

      <div className="flex flex-col gap-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
              location.pathname === item.path
                ? "bg-cyan-500 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;