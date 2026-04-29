import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/kp.jpeg"
import img2 from "../assets/kp1.jpeg"
import img3 from "../assets/kp2.jpeg"
import bg1 from "../assets/kp3.jpeg"
import bg2 from "../assets/kp4.jpeg"
import bg3 from "../assets/kp5.jpeg"

export default function Welcome() {
  const backgrounds = [bg1, bg2, bg3];
  const navigate = useNavigate();


  const name = localStorage.getItem("name") || "User";
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < 2) setStep(step + 1);
    }, 2500);

    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div
  className="h-screen flex items-center justify-center text-white relative overflow-hidden bg-cover bg-center transition-all duration-700"
  style={{
    backgroundImage: `url(${backgrounds[step]})`,
  }}
>
  <div className="absolute inset-0 bg-black/60"></div>

      {/* ✨ Background */}
      <div className="absolute inset-0 -z-10">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
      </div>

      <div className="relative z-10 text-center max-w-lg px-6">

        {/* STEP 1 */}
        {step === 0 && (
          <div className="animate-fadeIn space-y-4">
            <img
              src={img3}
              className="w-48 h-48 object-cover rounded-2xl mx-auto shadow-lg"
            />

            <h1 className="text-4xl font-bold">
              Welcome, {name} ❤️
            </h1>

            <p className="text-gray-300">
              Your space is ready.
            </p>
          </div>
        )}

        {/* STEP 2 */}
        {step === 1 && (
          <div className="animate-fadeIn space-y-4">
            <img
              src={img1}
              className="w-48 h-48 object-cover rounded-2xl mx-auto shadow-lg"
            />

            <h1 className="text-3xl font-bold">
              Every moment matters 💑
            </h1>

            <p className="text-gray-300">
              Capture your memories, celebrate your journey together,
              and never forget the little things.
            </p>
          </div>
        )}

        {/* STEP 3 */}
        {step === 2 && (
          <div className="animate-fadeIn space-y-4">
            <img
              src={img2}
              className="w-48 h-48 object-cover rounded-2xl mx-auto shadow-lg"
            />

            <h1 className="text-3xl font-bold">
              Let’s begin ✨
            </h1>

            <button
              onClick={() => navigate("/dashboard")}
              className="bg-pink-500 px-6 py-2 rounded-lg hover:bg-pink-600 transition"
            >
              Enter Your Space 💖
            </button>
          </div>
        )}
        <div className="flex justify-center gap-2 mt-6">
  {[0, 1, 2].map((i) => (
    <div
      key={i}
      className={`h-2 rounded-full transition-all duration-300 ease-out ${
        step === i
          ? "w-6 bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.6)]"
          : "w-2 bg-gray-500/50"
      }`}
    ></div>
  ))}
</div>
      </div>
    </div>
  );
}