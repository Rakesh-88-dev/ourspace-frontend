import { useState } from "react";
import axios from "axios";

export default function AddMemory({ refresh }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert("Please select an image");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const uploadRes = await axios.post(
        "https://ourspace-backend-szfy.onrender.com/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


      const imageUrl = uploadRes.data.url;

      await axios.post(
        "https://ourspace-backend-szfy.onrender.com/api/memories",
        { imageUrl, caption },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setFile(null);
      setCaption("");
      refresh();

    }  catch (err) {
    console.log("UPLOAD ERROR:", err.response?.data || err.message);
    alert("Upload failed ❌");
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* 📸 Upload Box */}
      <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-pink-400 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition">

        <span className="text-pink-400 text-lg">
          📸 Click to upload
        </span>

        <span className="text-sm text-gray-300">
          PNG, JPG, JPEG
        </span>

        <input
          type="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </label>

      {/* 👀 Preview */}
      {file && (
        <img
          src={URL.createObjectURL(file)}
          className="w-full h-40 object-cover rounded-lg"
        />
      )}

      {/* ✏️ Caption */}
      <input
        type="text"
        placeholder="Write a memory ❤️"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full p-2 rounded bg-white/10 text-white placeholder-gray-300 outline-none"
      />

      {/* 🚀 Upload Button */}
      <button
        type="submit"
        className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-semibold hover:scale-105 transition cursor-pointer"
      >
        Upload Memory ❤️
      </button>

    </form>
  );
}