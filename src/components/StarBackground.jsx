import { useEffect, useRef } from "react";

export default function StarBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let stars = [];
    let shootingStars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      stars = Array.from({ length: 150 }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        speed: Math.random() * 0.3 + 0.1,
      }));
    };

    // 🌠 CREATE SHOOTING STAR
    const createShootingStar = () => {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: 0,
        length: Math.random() * 80 + 50,
        speed: Math.random() * 6 + 4,
        opacity: 1,
      });
    };

    const draw = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ⭐ NORMAL STARS
      stars.forEach((star) => {
        star.y += star.speed;

        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.globalAlpha = Math.random();
        ctx.fill();
      });

      // 🌠 SHOOTING STARS
      shootingStars.forEach((s, i) => {
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.length, s.y + s.length);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.globalAlpha = s.opacity;
        ctx.stroke();

        s.x -= s.speed;
        s.y += s.speed;
        s.opacity -= 0.01;

        if (s.opacity <= 0) {
          shootingStars.splice(i, 1);
        }
      });

      requestAnimationFrame(draw);
    };

    resize();
    draw();

    // 🌠 SPAWN SHOOTING STARS RANDOMLY
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        createShootingStar();
      }
    }, 800);

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      clearInterval(interval);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
    />
  );
}