import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  // 🔥 PASSWORD STRENGTH
  const getStrength = () => {
    if (password.length < 4) return "weak";
    if (password.length < 8) return "medium";
    return "strong";
  };

  const strength = getStrength();
  localStorage.setItem("name", name);


  // 🧑‍🎨 HANDLE AVATAR
  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match ❌");
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);

      if (avatar) formData.append("avatar", avatar);

      await axios.post(
        "https://ourspace-backend-szfy.onrender.com/api/auth/register",
        formData
      );

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");

      setShake(true);
      setTimeout(() => setShake(false), 400);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex relative bg-[#0f172a] text-white overflow-hidden">

      {/* ✨ Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
      </div>

      {/* 🎉 FULL SCREEN SUCCESS */}
      {success && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-green-400 mb-4">
              🎉 Account Created!
            </h1>
            <p className="text-gray-300">
              Redirecting to login...
            </p>
          </div>
        </div>
      )}

      {/* 💖 LEFT SIDE */}
      <div className="hidden md:flex w-1/2 items-center justify-center p-10 relative">
        <div className="z-10">
          <h1 className="text-5xl font-bold mb-4">
            Create Your Space ❤️
          </h1>
          <p className="text-lg text-gray-300 max-w-sm">
            Capture memories. Celebrate moments. Build your story.
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-600/20"></div>
      </div>

      {/* 🔐 RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6">

        <form
          onSubmit={handleRegister}
          className={`w-full max-w-sm bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-xl space-y-4 transition ${
            shake ? "animate-shake" : ""
          }`}
        >
          <h2 className="text-2xl font-semibold text-center">
            Create Account
          </h2>

          {/* 🧑‍🎨 AVATAR */}
          <div className="flex flex-col items-center">
            <label className="cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/20">
                {preview ? (
                  <img
                    src={preview}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">+</span>
                )}
              </div>
              <input
                type="file"
                hidden
                onChange={handleAvatar}
              />
            </label>
            <p className="text-xs text-gray-400 mt-1">
              Upload Avatar
            </p>
          </div>

          {/* NAME */}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 rounded-md bg-white/10 outline-none focus:ring-2 focus:ring-pink-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-md bg-white/10 outline-none focus:ring-2 focus:ring-pink-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* PASSWORD */}
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-4 py-2 rounded-md bg-white/10 outline-none focus:ring-2 focus:ring-pink-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* CONFIRM PASSWORD */}
          <input
            type="password"
            placeholder="Confirm Password"
            className={`w-full px-4 py-2 rounded-md bg-white/10 outline-none ${
              confirmPassword && password !== confirmPassword
                ? "ring-2 ring-red-500"
                : "focus:ring-2 focus:ring-pink-500"
            }`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {/* PASSWORD STRENGTH */}
          <div className="h-2 bg-white/10 rounded overflow-hidden">
            <div
              className={`h-full ${
                strength === "weak"
                  ? "w-1/3 bg-red-500"
                  : strength === "medium"
                  ? "w-2/3 bg-yellow-400"
                  : "w-full bg-green-500"
              }`}
            ></div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-2 bg-pink-500 rounded-md hover:bg-pink-600 transition flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Creating...
              </>
            ) : (
              "Register 💖"
            )}
          </button>

          {/* LOGIN */}
          <p className="text-sm text-gray-400 text-center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-pink-400 cursor-pointer"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}