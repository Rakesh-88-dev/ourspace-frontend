import { useState, useEffect } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const BASE_URL = "http://localhost:5000"; // ✅ 
  // change later for production

  const [stats, setStats] = useState({
  dreams: 0,
  achieved: 0,
  shared: 0,
  memories: 0,
});

const fetchStats = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setStats(res.data);
  } catch (err) {
    console.error("Error fetching stats:", err);
  }
};

  // 🔥 FETCH USER
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
  fetchUser();
  fetchStats();
}, []);

  // 🔥 AVATAR UPLOAD
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await axios.put(
        `${BASE_URL}/api/users/me`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("UPDATED USER:", res.data);

      setUser(res.data);
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      setLoading(false);
      setPreview(null);
    }
  };

  // 🔥 UPDATE PROFILE
  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await axios.put(
        `${BASE_URL}/api/users/me`,
        {
          name: user.name,
          bio: user.bio,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data);
      setEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-white p-6">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen text-white p-6 bg-gradient-to-br from-black via-gray-900 to-black">
      <h1 className="text-3xl font-bold mb-8 text-center">
        👤 Your Profile
      </h1>

      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">

        {/* TOP */}
        <div className="flex flex-col md:flex-row items-center gap-8">

          {/* AVATAR */}
          <label htmlFor="avatarInput" className="relative group cursor-pointer">
            <img
              src={
                preview
                  ? preview
                  : user.avatar
                  ? `${user.avatar}?t=${Date.now()}`
                  : "/favicon.png"
              }
              className="w-36 h-36 rounded-full object-cover border-4 border-pink-500 shadow-lg transition group-hover:scale-105"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition">
              <span className="text-sm">Change</span>
            </div>

            {/* Loading */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full">
                ⏳
              </div>
            )}
          </label>

          <input
            type="file"
            id="avatarInput"
            hidden
            onChange={handleAvatarChange}
          />

          {/* INFO */}
          <div className="flex-1 text-center md:text-left">
            {editing ? (
              <>
                <input
                  value={user.name}
                  onChange={(e) =>
                    setUser({ ...user, name: e.target.value })
                  }
                  className="w-full p-3 bg-black/40 rounded-lg border border-white/10"
                />

                <input
                  value={user.bio || ""}
                  onChange={(e) =>
                    setUser({ ...user, bio: e.target.value })
                  }
                  className="w-full p-3 bg-black/40 rounded-lg border border-white/10 mt-3"
                />
              </>
            ) : (
              <>
                <h2 className="text-3xl font-semibold">
                  {user.name}
                </h2>

                <p className="text-gray-400 mt-1">
                  {user.email}
                </p>

                <p className="mt-3 text-gray-300 italic">
                  {user.bio || "No bio yet..."}
                </p>
              </>
            )}

            <div className="mt-5 flex gap-3 justify-center md:justify-start">
              <button
                onClick={() => setEditing(!editing)}
                className="px-5 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg"
              >
                {editing ? "Cancel" : "Edit"}
              </button>

              {editing && (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-5 py-2 bg-green-500 hover:bg-green-600 rounded-lg disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-8 border-t border-white/10"></div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <Stat title="Dreams" value={stats.dreams} />
<Stat title="Achieved" value={stats.achieved} />
<Stat title="Shared" value={stats.shared} />
<Stat title="Memories" value={stats.memories} />
        </div>

        {/* PARTNER */}
        <div className="mt-10 bg-white/5 p-6 rounded-2xl text-center border border-white/10">
          <h3 className="text-xl font-semibold mb-2">
            💑 Your Partner
          </h3>

          <p className="text-gray-400">
            Not connected yet
          </p>

          <button className="mt-4 px-5 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg">
            Invite Partner
          </button>
        </div>
      </div>
    </div>
  );
}

// ✅ FIXED STAT COMPONENT
function Stat({ title, value }) {
  return (
    <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:scale-105 transition">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  );
}