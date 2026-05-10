import { useNavigate } from "react-router-dom";

function Topbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <div className="h-20 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-8">
      <div>
        <h2 className="text-2xl font-bold">
          Team Task Manager
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold">
          S
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-400 transition-all px-4 py-2 rounded-lg font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Topbar;