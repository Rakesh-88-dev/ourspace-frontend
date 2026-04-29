import { motion } from "framer-motion";

const planets = [
  {
    size: 120,
    color: "bg-gradient-to-br from-purple-500 to-pink-500",
    top: "10%",
    left: "5%",
    delay: 0,
  },
  {
    size: 80,
    color: "bg-gradient-to-br from-blue-500 to-cyan-400",
    top: "60%",
    left: "80%",
    delay: 1,
  },
  {
    size: 60,
    color: "bg-gradient-to-br from-yellow-400 to-orange-500",
    top: "75%",
    left: "20%",
    delay: 2,
  },
];

export default function Planets() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {planets.map((p, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${p.color} blur-xl opacity-70`}
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}