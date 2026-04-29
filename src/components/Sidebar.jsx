import { Home, User, LogOut, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

/* 🔥 Typing Animation (NO export here) */
function TypingText({
  words = ["OurSpace", "Memories", "Love", "Dreams"],
  speed = 80,
  delay = 1500,
}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    const timeout = setTimeout(() => {
      setText((prev) =>
        isDeleting
          ? currentWord.substring(0, prev.length - 1)
          : currentWord.substring(0, prev.length + 1)
      );

      if (!isDeleting && text === currentWord) {
        setTimeout(() => setIsDeleting(true), delay);
      }

      if (isDeleting && text === "") {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, speed, delay]);

  return (
    <span className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
      {text}
      <span className="animate-pulse">|</span>
    </span>
  );
}

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
          onClick={() => setOpen(true)}
          className="bg-black/70 p-2 rounded-lg backdrop-blur text-white"
        >
          <Menu />
        </button>
      </div>

      {/* 🔥 Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen
          ${collapsed ? "w-20 items-center p-3" : "w-64 p-5"}
          bg-black/70 backdrop-blur-xl
          flex flex-col justify-between overflow-y-auto z-40
          transition-all duration-300

          ${open ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
        `}
      >
        {/* 🔝 Top */}
        <div>
          {/* ✅ LOGO + TYPING */}
          <div
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-3"
            } mb-8 cursor-pointer`}
            onClick={() => navigate("/dashboard")}
          >
            <img
              src="/favicon.png"
              alt="OurSpace"
              className={`object-contain ${
                collapsed ? "h-10 w-10" : "h-10"
              }`}
            />

            {!collapsed && <TypingText />}
          </div>

          {/* Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mb-6 p-2 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition"
          >
            <Menu size={20} />
          </button>

          {/* 🔗 Menu */}
          <div className="space-y-2">
            <SidebarItem
              icon={<Home size={20} />}
              label="Home"
              active={isActive("/dashboard")}
              collapsed={collapsed}
              onClick={() => {
                navigate("/dashboard");
                setOpen(false);
              }}
            />

            <SidebarItem
              icon="💫"
              label="Wishlist"
              active={isActive("/wishlist")}
              collapsed={collapsed}
              onClick={() => {
                navigate("/wishlist");
                setOpen(false);
              }}
            />

            <SidebarItem
              icon="💬"
              label="Chat"
              active={isActive("/chat")}
              collapsed={collapsed}
              onClick={() => {
                navigate("/chat");
                setOpen(false);
              }}
            />

            <SidebarItem
              icon={<User size={20} />}
              label="Profile"
              active={isActive("/profile")}
              collapsed={collapsed}
              onClick={() => {
                navigate("/profile");
                setOpen(false);
              }}
            />

            <SidebarItem
              icon="💖"
              label="Special Dates"
              active={isActive("/special-dates")}
              collapsed={collapsed}
              onClick={() => {
                navigate("/special-dates");
                setOpen(false);
              }}
            />
          </div>
        </div>

        {/* 🔻 Bottom */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={logout}
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-3"
            } w-full px-3 py-2 rounded-lg transition text-gray-300 hover:bg-white/10 hover:text-red-400`}
          >
            <LogOut size={20} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </div>

      {/* 🌑 MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}

/* 🔥 Sidebar Item */
function SidebarItem({ icon, label, active, collapsed, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center ${
        collapsed ? "justify-center" : "gap-3"
      } w-full px-3 py-2 rounded-lg transition ${
        active
          ? "bg-pink-500/20 text-pink-400"
          : "text-gray-300 hover:bg-white/10 hover:text-pink-400"
      }`}
    >
      {icon}
      {!collapsed && label}
    </button>
  );
}