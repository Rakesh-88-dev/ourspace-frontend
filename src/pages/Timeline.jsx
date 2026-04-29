import { useEffect, useState } from "react";
import axios from "axios";
import AddMemory from "../components/AddMemory";
import { useNavigate } from "react-router-dom";

export default function Timeline() {
  const [memories, setMemories] = useState([]);
  const navigate = useNavigate();

  const fetchMemories = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://ourspace-backend-szfy.onrender.com/api/memories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMemories(res.data);
    } catch {
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-md">

        <button
          onClick={logout}
          className="m-2 px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>

        <AddMemory refresh={fetchMemories} />

        {memories.map((m) => (
          <div key={m._id} className="bg-white rounded shadow mb-4">
            <img src={m.imageUrl} className="w-full h-80 object-cover" />
            <div className="p-2">
              <p>{m.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}