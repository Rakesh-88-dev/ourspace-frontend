import { Home, User, LogOut, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Profiler, useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => location.pathname === path;

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* ☰ Mobile Toggle */}
      <div className="md:hidden fixed top-3 left-3 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="bg-black/70 p-2 rounded-lg backdrop-blur text-white"
        >
          <Menu />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen ${
          collapsed ? "w-20 items-center p-3" : "w-64 p-5"
        } bg-black/90 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between overflow-y-auto z-40 transition-all duration-300`}
      >
        {/* 🔥 Top */}
        <div>
          <h1
            className={`text-2xl font-bold text-pink-500 mb-10 ${
              collapsed ? "hidden" : "block"
            }`}
          >
            OurSpace ❤️
          </h1>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mb-4 p-2 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition"
          >
            <Menu size={20} />
          </button>

          <div className="space-y-2">
            {/* Home */}
            <button
              onClick={() => navigate("/dashboard")}
              className={`flex items-center ${
                collapsed ? "justify-center" : "gap-3"
              } w-full px-3 py-2 rounded-lg transition ${
                isActive("/dashboard")
                  ? "bg-pink-500/20 text-pink-400"
                  : "text-gray-300 hover:bg-white/10 hover:text-pink-400 cursor-pointer"
              }`}
            >
              <Home size={20} />
              {!collapsed && "Home"}
            </button>

            <button
              onClick={() => navigate("/chat")}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-white/10 hover:text-pink-400 cursor-pointer"
            >
              💬 {!collapsed && "Chat"}
            </button>

            {/* Profile */}
            <button
              onClick={() => navigate("/profile")}
              className={`flex items-center ${
                collapsed ? "justify-center" : "gap-3"
              } w-full px-3 py-2 rounded-lg transition ${
                isActive("/dashboard")
                  ? "bg-pink-500/20 text-pink-400"
                  : "text-gray-300 hover:bg-white/10 hover:text-pink-400 cursor-pointer"
              }`}
            >
              <User size={20} />
              {!collapsed && "Profile"}
            </button>
            <button
              onClick={() => navigate("/special-dates")}
              className={`flex items-center ${
                collapsed ? "justify-center" : "gap-3"
              } w-full px-3 py-2 rounded-lg transition ${
                isActive("/special-dates")
                  ? "bg-pink-500/20 text-pink-400"
                  : "text-gray-300 hover:bg-white/10 hover:text-pink-400 cursor-pointer"
              }`}
            >
              💖 {!collapsed && "Special Dates"}
            </button>
          </div>
        </div>

        {/* 🔥 Bottom */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={() => navigate("/login")}
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-3"
            } w-full px-3 py-2 rounded-lg transition ${
              isActive("/dashboard")
                ? "bg-pink-500/20 text-pink-400"
                : "text-gray-300 hover:bg-white/10 hover:text-pink-400 cursor-pointer"
            }`}
          >
            <LogOut size={20} />
            {!collapsed && "Home"}
          </button>
        </div>
      </div>

      {/* 🔥 Overlay for mobile */}
      
    </>
  );
}
