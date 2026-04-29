import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await axios.post("https://ourspace-backend-szfy.onrender.com/api/auth/login", {
        email,
        password,
      });
       console.log("LOGIN RESPONSE:", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data._id);
      localStorage.setItem("name", res.data.name); // 🔥 ADD THIS

      setSuccess(true);

setTimeout(() => {
  setFadeOut(true); // start fade
}, 600);

setTimeout(() => {
  navigate("/welcome");
}, 1200);
    } catch (err) {
      console.log(err); // 🔍 debug

  toast.error(err.response?.data?.message || "Login failed");

  setShake(true);

  setTimeout(() => {
    setShake(false);
  }, 500);
}
finally {
    setLoading(false); // ✅ ALWAYS runs
  }
  };

 return (
  <div
  className={`h-screen flex relative bg-[#0f172a] text-white overflow-hidden transition-opacity duration-700 ${
    fadeOut ? "opacity-0" : "opacity-100"
  }`}
>

    {/* ✨ Animated Background */}
    <div className="absolute inset-0 -z-10">
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>
    </div>

    {/* 💖 LEFT SIDE */}
    <div className="hidden md:flex w-1/2 items-center justify-center p-10 relative">
      <div className="z-10">
        <h1 className="text-5xl font-bold mb-4 text-white">
          OurSpace ❤️
        </h1>
        <p className="text-lg text-gray-300 max-w-sm">
          Capture memories. Celebrate moments. Stay connected.
        </p>
      </div>

      {/* subtle overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-600/20"></div>
    </div>

    {/* 🔐 RIGHT SIDE */}
    <div className="flex w-full md:w-1/2 items-center justify-center px-6">

      <form
  onSubmit={handleLogin}
  className={`w-full max-w-sm bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-xl space-y-4 transition ${
    shake ? "animate-shake" : ""
  }`}
>
        <h2 className="text-2xl font-semibold text-center">
          Login
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 rounded-md bg-white/10 outline-none focus:ring-2 focus:ring-pink-500 transition placeholder-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    className="w-full px-4 py-2 pr-10 rounded-md bg-white/10 outline-none focus:ring-2 focus:ring-pink-500 transition placeholder-gray-400"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  {/* Toggle button */}
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
  >
    {showPassword ? "👁️" : "🙈"}
  </button>
</div>

        {/* Button */}
       <button
  type="submit"
  disabled={loading || success}
  className={`w-full py-2 rounded-md font-medium flex items-center justify-center gap-2 transition
    ${
      success
        ? "bg-green-500"
        : "bg-pink-500 hover:bg-pink-600"
    }
  `}
>
  {success ? (
    <>
      <span className="text-lg">✔️</span>
      Success
    </>
  ) : loading ? (
    <>
      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      Logging in...
    </>
  ) : (
    "Login 💖"
  )}
</button>
        {/* Register */}
        <p className="text-sm text-gray-400 text-center">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-pink-400 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  </div>
);
}