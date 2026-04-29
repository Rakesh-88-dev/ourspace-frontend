import { useState, useEffect } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const BASE_URL = "https://ourspace-backend-szfy.onrender.com";

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
  }, []);

  // 🔥 AUTO UPLOAD AVATAR (BEST UX)
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

  // 🔥 UPDATE NAME + BIO
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
    <div className="min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-6">👤 Your Profile</h1>

      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">

        <div className="flex flex-col md:flex-row items-center gap-6">

          {/* 🔥 AVATAR */}
          <label htmlFor="avatarInput" className="cursor-pointer relative">
            <img
              src={
                preview
                  ? preview
                  : user.avatar
                  ? user.avatar // ✅ Cloudinary direct URL
                  : "/favicon.png"
              }
              className="w-32 h-32 rounded-full object-cover border-2 border-pink-500 hover:opacity-80 transition"
            />

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
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
                  className="w-full p-2 bg-black/40 rounded"
                />

                <input
                  value={user.bio || ""}
                  onChange={(e) =>
                    setUser({ ...user, bio: e.target.value })
                  }
                  className="w-full p-2 bg-black/40 rounded mt-2"
                />
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-gray-400">{user.email}</p>
                <p className="mt-2 text-sm text-gray-300">
                  {user.bio || "No bio yet..."}
                </p>
              </>
            )}

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-1 bg-pink-500 rounded"
              >
                {editing ? "Cancel" : "Edit Profile"}
              </button>

              {editing && (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-1 bg-green-500 rounded disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-center">
          <Stat title="Dreams" value="12" />
          <Stat title="Achieved" value="5" />
          <Stat title="Shared" value="3" />
          <Stat title="Memories" value="8" />
        </div>

        {/* PARTNER */}
        <div className="mt-8 bg-white/5 p-4 rounded-xl text-center">
          <h3 className="text-lg font-semibold mb-2">💑 Your Partner</h3>
          <p className="text-gray-400">Not connected yet</p>
          <button className="mt-3 px-4 py-1 bg-purple-500 rounded">
            Invite Partner
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white/5 p-3 rounded-lg">
      <p className="text-xl font-bold">{value}</p>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  );
}