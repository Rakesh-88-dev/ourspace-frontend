import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";

export default function SpecialDatesPage() {
  const [dates, setDates] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [file, setFile] = useState(null);

  const [type, setType] = useState("memory");

  const token = localStorage.getItem("token");

  // 🔥 Fetch
  const fetchDates = async () => {
    try {
      const res = await axios.get(
        "https://ourspace-backend-szfy.onrender.com/api/special-dates",
        {},
      );
      setDates(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (token) fetchDates();
  }, [token]);

  // ➕ Add
  const addDate = async () => {
    if (!title || !date) return alert("Fill all fields");

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("date", date);
      formData.append("type", type);

      if (file) {
        formData.append("image", file); // 🔥 THIS WAS MISSING
      }

      await axios.post("https://ourspace-backend-szfy.onrender.com/api/special-dates", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setTitle("");
      setDate("");
      setType("memory");
      setFile(null); // optional reset
      fetchDates();
    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
    }
  };

  // ❌ Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://ourspace-backend-szfy.onrender.com/api/special-dates/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDates((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // 💡 Days Counter
  const getDaysInfo = (d) => {
    const today = new Date();
    const target = new Date(d.date);

    // ❤️ ONLY for anniversary
    if (d.type === "anniversary") {
      const diff = today - target;
      return `❤️ ${Math.floor(diff / (1000 * 60 * 60 * 24))} days together`;
    }

    // 📍 For normal memories
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

    if (diff === 0) return "💖 Today!";
    if (diff > 0) return `⏳ ${diff} days left`;

    return "📍 Memory";
  };

  // 🔃 Sort
  const sortedDates = [...dates].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 text-white p-6">
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-center mb-8">
        💖 Special Moments
      </h1>

      {/* FORM */}
      <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-lg mb-10">
        <input
          type="text"
          placeholder="First Date ❤️"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-3 rounded-lg bg-white/20 outline-none"
        />

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Pick a date 📅"
            value={date}
            readOnly
            onClick={() => setShowCalendar(true)}
            className="flex-1 p-3 rounded-lg bg-white/20 cursor-pointer"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 mb-2 rounded bg-white/10 text-white"
          >
            <option value="memory">📍 Memory</option>
            <option value="anniversary">❤️ Anniversary</option>
          </select>

          <button
            onClick={addDate}
            className="bg-pink-500 px-4 rounded-lg hover:bg-pink-600"
          >
            Add
          </button>
        </div>

        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      </div>

      {/* TIMELINE */}
      <div className="max-w-xl mx-auto relative">
        {/* LINE */}
        <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-pink-500"></div>

        {sortedDates.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No memories yet 💔</p>
        ) : (
          <div className="space-y-10 pl-10">
            {sortedDates.map((d, index) => {
              console.log("DATE ITEM:", d);
              return(
              <motion.div
                key={d._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.03, y: -3 }}
                className="relative"
              >
                {/* DOT */}
                <div className="absolute -left-6 top-3 w-4 h-4 bg-pink-500 rounded-full border-2 border-white"></div>

                {/* CARD */}
               {/* CARD */}
<div
  className={`rounded-xl overflow-hidden shadow-lg transition hover:scale-[1.02] ${
    d.type === "anniversary"
      ? "bg-pink-500/20 border border-pink-400 shadow-pink-500/40"
      : "bg-white/10"
  }`}
>

  {/* 🖼 IMAGE TOP */}
  {d.image && (
    <div className="relative h-40 w-full overflow-hidden">
      <img
        src={`https://ourspace-backend-szfy.onrender.com/uploads/${d.image}`}
        alt=""
        className="w-full h-full object-cover transition duration-500 hover:scale-110"
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* TITLE ON IMAGE */}
      <div className="absolute bottom-2 left-3 text-white">
        <h2 className="text-lg font-semibold">
          💖 {d.title}
        </h2>
      </div>
    </div>
  )}

  {/* 📋 CONTENT */}
  <div className="p-4">

    <div className="flex justify-between items-center">

      <div className="flex items-center gap-2">
        {!d.image && (
          <h2 className="text-lg font-semibold text-pink-300">
            💖 {d.title}
          </h2>
        )}

        {d.type === "anniversary" && (
          <span className="text-xs bg-pink-500 px-2 py-1 rounded-full">
            🎉 Anniversary
          </span>
        )}
      </div>

      <button
        onClick={() => handleDelete(d._id)}
        className="text-red-400 text-xs"
      >
        ✕
      </button>
    </div>

    <p className="text-sm text-gray-300 mt-2">
      {new Date(d.date).toDateString()}
    </p>

    <p className="text-pink-400 mt-1 font-medium">
      {getDaysInfo(d)}
    </p>

  </div>
</div>
              </motion.div>
              );
})}
          </div>
        )}
      </div>

      {/* 📅 CALENDAR MODAL */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-5 rounded-xl">
            <Calendar
              onClickDay={(value) => {
                setDate(value.toISOString().split("T")[0]);
                setShowCalendar(false);
              }}
            />

            <button
              onClick={() => setShowCalendar(false)}
              className="mt-3 text-red-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
