import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function MainLayout({ children }) {
  return (
    <div className="flex bg-slate-950 text-white min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export default MainLayout;