import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import StarBackground from "../components/StarBackground";
import Planets from "../components/Planets";

const BASE_URL = "https://ourspace-backend-szfy.onrender.com";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeFilter, setActiveFilter] = useState("All dreams");

  const token = localStorage.getItem("token");

  const emojis = ["❤️", "🔥", "😍"];

  const categories = [
    "All",
    "🌍 Places",
    "✨ Experiences",
    "🍔 Food",
    "🎯 Goals",
  ];

  const filters = ["All dreams", "Still dreaming", "Made real", "Shared 💑"];

  // 🔥 FETCH
  const fetchItems = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ➕ ADD
  const addItem = async () => {
    if (!title) return;

    try {
      await axios.post(
        `${BASE_URL}/api/wishlist`,
        {
          title,
          link,
          category: selectedCategory === "All" ? "🌍 Places" : selectedCategory,
          shared: false,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTitle("");
      setLink("");
      fetchItems();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ TOGGLE ACHIEVED
  const toggleBought = async (id) => {
    await axios.put(
      `${BASE_URL}/api/wishlist/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchItems();
  };

  // ❌ DELETE
  const deleteItem = async (id) => {
    await axios.delete(`${BASE_URL}/api/wishlist/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchItems();
  };

  // ❤️ REACTION
  const handleReact = async (id, emoji) => {
    await axios.put(
      `${BASE_URL}/api/wishlist/react`,
      { id, emoji },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchItems();
  };

  // 💑 TOGGLE SHARE
  const toggleShare = async (item) => {
    await axios.put(
      `${BASE_URL}/api/wishlist/${item._id}`,
      { shared: !item.shared },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchItems();
  };

  // 🎯 FILTER LOGIC
  const filteredItems = items.filter((item) => {
    // CATEGORY
    if (selectedCategory !== "All" && item.category !== selectedCategory) {
      return false;
    }

    // STATUS
    if (activeFilter === "Still dreaming" && item.bought) return false;
    if (activeFilter === "Made real" && !item.bought) return false;

    // SHARED
    if (activeFilter === "Shared 💑" && !item.shared) return false;

    return true;
  });

  const colors = [
    "from-pink-500 to-purple-500",
    "from-purple-500 to-indigo-500",
    "from-blue-500 to-cyan-500",
    "from-orange-400 to-pink-500",
  ];

  return (
    <>
      {/* 🌌 BACKGROUND */}
      <StarBackground />
      <Planets />

      <div className="fixed inset-0 bg-black/60 z-0"></div>

      {/* 💖 MAIN */}
      <div className="relative z-10 min-h-screen text-white p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          💫 Our Dream Board
        </h1>

        {/* INPUT */}
        <div className="max-w-4xl mx-auto mb-8 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
          <div className="flex gap-3 flex-wrap">
            <input
              placeholder="What do we dream about? ✨"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl bg-white/10 outline-none"
            />

            <input
              placeholder="Optional link 🌐"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl bg-white/10 outline-none"
            />

            <button
              onClick={addItem}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition"
            >
              Add dream 💖
            </button>
          </div>

          {/* 🌈 CATEGORIES */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1 text-sm rounded-full transition ${
                  selectedCategory === c
                    ? "bg-pink-500"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 🎯 FILTERS */}
        <div className="flex gap-3 justify-center mb-6 flex-wrap">
          {filters.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-1 rounded-full transition text-sm ${
                activeFilter === tab
                  ? "bg-pink-500"
                  : "bg-white/10 hover:bg-pink-500/30"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 🧠 CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item, index) => {
              const color = colors[index % colors.length];

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ scale: 1.04 }}
                  className={`relative p-[1px] rounded-2xl bg-gradient-to-r ${color}`}
                >
                  <div
                    className={`rounded-2xl p-4 h-full ${
                      item.bought
                        ? "bg-green-500/10 border border-green-400 line-through"
                        : "bg-[#0f172a]"
                    }`}
                  >
                    <h2 className="text-lg font-semibold mb-2">
                      {item.title}
                    </h2>

                    <p className="text-xs opacity-60 mb-2">
                      {item.category || "🌍 Places"}
                    </p>

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-400 underline"
                      >
                        View inspiration 🌐
                      </a>
                    )}

                    {/* ❤️ REACTIONS */}
                    <div className="flex gap-3 mt-3 text-sm">
                      {emojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReact(item._id, emoji)}
                          className="hover:scale-125 transition"
                        >
                          {emoji} {item.reactions?.[emoji] || 0}
                        </button>
                      ))}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={() => toggleBought(item._id)}
                        className={`px-3 py-1 rounded ${
                          item.bought
                            ? "bg-green-500/20 text-green-400"
                            : "bg-white/10"
                        }`}
                      >
                        {item.bought ? "💖 Achieved" : "✨ Manifesting"}
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleShare(item)}
                          className="text-pink-400"
                        >
                          💑
                        </button>

                        <button
                          onClick={() => deleteItem(item._id)}
                          className="text-red-400"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}