import Sidebar from "../components/Sidebar";
import AddMemory from "../components/AddMemory";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ColorThief from "color-thief-browser";


export default function Dashboard() {
  const [memories, setMemories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newCaption, setNewCaption] = useState("");
  const [todayMemories, setTodayMemories] = useState([]);
  const [user, setUser] = useState(null);
  const [dates, setDates] = useState([]);

  const [viewerOpen, setViewerOpen] = useState(false);
const [currentIndex, setCurrentIndex] = useState(0);
const [bgIndex, setBgIndex] = useState(0);
const [bgColor, setBgColor] = useState("rgba(0,0,0,0.4)");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        "https://ourspace-backend-szfy.onrender.com/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("USER DATA:", res.data); // 👈 DEBUG
      setUser(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  fetchUser();
}, []);

  const fetchTodayMemories = async () => {
  const res = await axios.get(
    "https://ourspace-backend-szfy.onrender.com/api/memories/on-this-day",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  setTodayMemories(res.data);
};

 const fetchMemories = async () => {
    try {
      const res = await axios.get(
        "https://ourspace-backend-szfy.onrender.com/api/memories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API DATA:", res.data);

      setMemories(res.data || []);
    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
      setMemories([]);
    }
  };

  // 🔥 SINGLE CLEAN EFFECT
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchMemories();
  }, [token]);
  console.log("MEMORIES STATE:", memories);

  // 🎞️ AUTO BACKGROUND CHANGE
useEffect(() => {
  if (memories.length === 0) return;

  const interval = setInterval(() => {
    setBgIndex((prev) => (prev + 1) % memories.length);
  }, 5000); // every 5 sec

  return () => clearInterval(interval);
}, [memories]);



  // 🗑️ DELETE
  const deleteMemory = async (id) => {
    if (!window.confirm("Delete this memory?")) return;

    await axios.delete(`https://ourspace-backend-szfy.onrender.com/api/memories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchMemories();
  };

  // ✏️ UPDATE
  const updateMemory = async (id) => {
    await axios.put(
      `https://ourspace-backend-szfy.onrender.com/api/memories/${id}`,
      { caption: newCaption },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    setEditingId(null);
    fetchMemories();
  };

  const handleLike = async (id) => {
    try {
      const res = await axios.put(
        `https://ourspace-backend-szfy.onrender.com/api/memories/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMemories((prev) =>
        prev.map((m) => (m._id === id ? { ...res.data, showHeart: true } : m)),
      );

      // remove heart after animation
      setTimeout(() => {
        setMemories((prev) =>
          prev.map((m) => (m._id === id ? { ...m, showHeart: false } : m)),
        );
      }, 600);
    } catch (err) {
      console.log(err);
    }
  };
const fetchUser = async () => {
  const res = await axios.get(
    "https://ourspace-backend-szfy.onrender.com/api/auth/profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  setUser(res.data);
};

const fetchDates = async () => {
  try {
    const res = await axios.get(
      "https://ourspace-backend-szfy.onrender.com/api/special-dates",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("DATES:", res.data); // debug
    setDates(res.data);

  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
  }
};

useEffect(() => {
  if (token) {
    fetchDates();
  }
}, [token]);

const getAnniversaryInfo = (date) => {
  const today = new Date();
  const original = new Date(date);

  // Create this year's anniversary
  const thisYear = new Date(
    today.getFullYear(),
    original.getMonth(),
    original.getDate()
  );

  // If anniversary already passed → use next year
  const nextAnniversary =
    thisYear < today
      ? new Date(
          today.getFullYear() + 1,
          original.getMonth(),
          original.getDate()
        )
      : thisYear;

  const diff = Math.ceil(
    (nextAnniversary - today) / (1000 * 60 * 60 * 24)
  );

  if (diff === 0) return "💖 Today is your anniversary!";
  if (thisYear < today)
    return `❤️ ${Math.abs(diff)} days since last anniversary`;

  return `⏳ ${diff} days until anniversary`;
};


const getDaysTogether = () => {
  if (!dates || dates.length === 0) return 0;

  const sorted = [...dates].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const firstDate = new Date(sorted[0].date);
  const today = new Date();

  const diff = today - firstDate;

  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const getNextDate = () => {
  const today = new Date();

  const upcoming = dates
    .map((d) => {
      const date = new Date(d.date);
      date.setFullYear(today.getFullYear());
      return { ...d, date };
    })
    .filter((d) => d.date >= today)
    .sort((a, b) => a.date - b.date);

  return upcoming[0];
};
  
console.log("BG IMAGE:", memories[bgIndex]);
 return (
  <div className="flex relative bg-[#0f172a] min-h-screen text-white overflow-hidden">

    {/* 💖 BACKGROUND SLIDESHOW */}
{memories.length > 0 && (
  <div className="absolute inset-0 -z-0">
    {memories.map((m, i) => {
      const img =
        m.imageUrl ||
        `https://ourspace-backend-szfy.onrender.com/uploads/${m.image}`;

      return (
        <img
          key={i}
          src={img}
          className={`absolute inset-0 w-full h-full object-cover blur-md scale-110 transition-opacity duration-1000 ${
  i === bgIndex ? "opacity-50" : "opacity-0"
}`}
        />
      );
    })}
  </div>
)}

{/* Dark Overlay */}
<div className="absolute inset-0 -z-10 bg-black/30"></div>
    <Sidebar />

    <div className="flex-1 p-6 ml-16 md:ml-64 flex justify-center relative z-10">
      <div className="w-full max-w-5xl px-4 py-6 space-y-8">

        {/* Header */}
        {/* 💖 HERO SECTION (NEW - PREMIUM UI) */}
<div className="relative h-56 rounded-2xl overflow-hidden mb-6">

  {memories.length > 0 && (
    <img
      src={
        memories[0].imageUrl
          ? memories[0].imageUrl
          : `https://ourspace-backend-szfy.onrender.com/uploads/${memories[0].image}`
      }
      className="absolute inset-0 w-full h-full object-cover"
    />
  )}

  {/* Overlay */}
  <div className="absolute inset-0 bg-black/60"></div>

  {/* Content */}
  <div className="relative z-10 p-6 flex flex-col justify-end h-full">
    <h1 className="text-3xl font-bold">
      Welcome Back {user?.name || "❤️"}
    </h1>

    <p className="text-gray-300 text-sm">
      Relive your beautiful memories
    </p>
  </div>
</div>

        {/* ❤️ DAYS TOGETHER */}
        <div className="bg-white/10 p-6 rounded-2xl text-center">
          <h2 className="text-gray-300 text-sm">❤️ Days Together</h2>
          <h1 className="text-4xl font-bold text-pink-400">
            {getDaysTogether()} days
          </h1>
        </div>

        {/* 📊 STATS */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 p-4 rounded-xl">
            💖 <p className="text-sm">Memories</p>
            <h2 className="text-xl font-bold">{memories.length}</h2>
          </div>

          <div className="bg-white/10 p-4 rounded-xl">
            📅 <p className="text-sm">Special Dates</p>
            <h2 className="text-xl font-bold">{dates.length}</h2>
          </div>
        </div>

        {/* ⏳ UPCOMING SPECIAL DATE */}
        {getNextDate() && (
          <div className="bg-white/10 p-4 rounded-xl">
            <h2 className="text-pink-400 mb-2">⏳ Upcoming</h2>
            <p>💖 {getNextDate().title}</p>
            <p className="text-sm text-gray-400">
              {new Date(getNextDate().date).toDateString()}
            </p>
          </div>
        )}

        {/* Add Memory */}
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg p-5 rounded-2xl shadow-lg border border-white/10">
          <AddMemory refresh={fetchMemories} />
        </div>

        {/* 📅 ON THIS DAY */}
        {todayMemories.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-3 text-pink-400">
              📅 On This Day ❤️
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {todayMemories.map((m) => (
                <div key={m._id} className="h-40 overflow-hidden rounded-xl">
                  <img
                    src={m.imageUrl}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🎞️ MEMORIES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {memories.map((m,index) => (
            <div key={m._id} className="animate-fadeIn">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl border border-white/10 hover:scale-[1.02] transition duration-300">

                {/* Image */}
                <div
                  className="relative"
                  onDoubleClick={() => handleLike(m._id)}
                >
                  <div className="w-full h-48 overflow-hidden">
                    <img
  src={m.imageUrl}
  className="w-full h-full object-cover cursor-pointer"
  onClick={() => {
    setCurrentIndex(index);
    setViewerOpen(true);
  }}
/>
                  </div>

                  {m.showHeart && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-white text-6xl animate-heartPop">
                        ❤️
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-sm text-pink-400 font-semibold">
                    {m.userId?.name || "User"}
                  </p>

                  {editingId === m._id ? (
                    <>
                      <input
                        value={newCaption}
                        onChange={(e) => setNewCaption(e.target.value)}
                        className="w-full p-2 rounded text-black"
                      />

                      <button
                        onClick={() => updateMemory(m._id)}
                        className="mt-2 px-3 py-1 bg-green-500 rounded text-white"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-semibold">{m.caption}</p>

                      <p className="text-xs text-gray-300 mt-1">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </p>

                      <div className="flex gap-6 mt-3 text-xl items-center">
                        {(() => {
                          const isLiked = m.likes?.some(
                            (id) =>
                              id.toString() ===
                              localStorage.getItem("userId")
                          );

                          return (
                            <button
                              onClick={() => handleLike(m._id)}
                              className="flex items-center gap-1 hover:scale-110 transition"
                            >
                              <span
                                className={`${
                                  isLiked ? "text-red-500" : "text-gray-400"
                                }`}
                              >
                                {isLiked ? "❤️" : "🤍"}
                              </span>

                              <span className="text-sm">
                                {m.likes?.length || 0}
                              </span>
                            </button>
                          );
                        })()}

                        <span
                          onClick={() => {
                            setEditingId(m._id);
                            setNewCaption(m.caption);
                          }}
                          className="cursor-pointer hover:scale-125"
                        >
                          ✏️
                        </span>

                        <span
                          onClick={() => deleteMemory(m._id)}
                          className="cursor-pointer text-red-400 hover:scale-125"
                        >
                          🗑️
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
    {viewerOpen && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">

    {/* Close Button */}
    <button
      onClick={() => setViewerOpen(false)}
      className="absolute top-5 right-5 text-white text-3xl"
    >
      ✖
    </button>

    {/* Left Arrow */}
    <button
      onClick={() =>
        setCurrentIndex((prev) =>
          prev === 0 ? memories.length - 1 : prev - 1
        )
      }
      className="absolute left-5 text-white text-3xl"
    >
      ⬅️
    </button>

    {/* Image */}
    {/* 🖼️ IMAGE + DETAILS */}
<div className="max-w-5xl w-full px-4 flex flex-col md:flex-row gap-6">

  {/* IMAGE */}
  <div className="flex-1 flex items-center justify-center">
    <img
      src={memories[currentIndex]?.imageUrl}
      className="max-h-[80vh] object-contain rounded-lg"
    />
  </div>

  {/* DETAILS PANEL */}
  <div className="w-full md:w-80 bg-white/10 backdrop-blur-lg p-4 rounded-xl">

    {/* USER */}
    <p className="text-pink-400 font-semibold mb-2">
      {memories[currentIndex]?.userId?.name || "User"}
    </p>

    {/* CAPTION */}
    <p className="text-lg font-semibold mb-2">
      {memories[currentIndex]?.caption}
    </p>

    {/* DATE */}
    <p className="text-sm text-gray-400 mb-4">
      {new Date(memories[currentIndex]?.createdAt).toLocaleDateString()}
    </p>

    {/* LIKES */}
    <div className="flex items-center gap-2 mb-4">
      ❤️ {memories[currentIndex]?.likes?.length || 0} likes
    </div>

    {/* ACTIONS */}
    <div className="flex gap-4 text-xl">

      <span
        onClick={() => handleLike(memories[currentIndex]._id)}
        className="cursor-pointer hover:scale-125"
      >
        ❤️
      </span>

      <span
        onClick={() => {
          setEditingId(memories[currentIndex]._id);
          setNewCaption(memories[currentIndex].caption);
        }}
        className="cursor-pointer"
      >
        ✏️
      </span>

      <span
        onClick={() => deleteMemory(memories[currentIndex]._id)}
        className="cursor-pointer text-red-400"
      >
        🗑️
      </span>

    </div>

  </div>
</div>

    {/* Right Arrow */}
    <button
      onClick={() =>
        setCurrentIndex((prev) =>
          prev === memories.length - 1 ? 0 : prev + 1
        )
      }
      className="absolute right-5 text-white text-3xl"
    >
      ➡️
    </button>
  </div>
)}
  </div>
);
}
