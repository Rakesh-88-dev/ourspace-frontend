import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://ourspace-backend-szfy.onrender.com/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data);
      } catch {
        navigate("/login");
      }
    };

    fetchUser();
  }, []);

  if (!user) return <p className="p-4">Loading...</p>;

  

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center">

        <img
          src="https://i.pravatar.cc/150"
          alt="profile"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />

        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-gray-500">{user.email}</p>

        <button className="mt-4 px-4 py-2 bg-pink-500 text-white rounded">
          Edit Profile
        </button>
      </div>

    
    </div>
  );
}