import React, { useState, useRef, useEffect } from 'react';

const ConfettiPresentBox = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);

  const confettiColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#fd79a8'];

  const createConfetti: any = () => {
    const newConfetti = [];
    for (let i = 0; i < 100; i++) {
      newConfetti.push({
        id: Math.random(),
        x: Math.random() * 400,
        y: 200,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * -15 - 5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 20,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        size: Math.random() * 8 + 4,
        gravity: 0.3
      });
    }
    return newConfetti;
  };

  const handleBoxClick = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsOpened(true);
    
    const newConfetti = createConfetti();
    setConfetti(newConfetti);

    // Reset after animation
    setTimeout(() => {
      setIsOpened(false);
      setIsAnimating(false);
      setConfetti([]);
    }, 4000);
  };

  useEffect(() => {
    if (confetti.length === 0) return;

    const interval = setInterval(() => {
      setConfetti((prev: any) => 
        prev.map((piece: any) => ({
          ...piece,
          x: piece.x + piece.vx,
          y: piece.y + piece.vy,
          vy: piece.vy + piece.gravity,
          rotation: piece.rotation + piece.rotationSpeed
        })).filter((piece: any) => piece.y < 600)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [confetti]);

  return (
    <div className="relative left-1/3">
        <div onClick={handleBoxClick} className="w-40 h-40">🎁</div>

        {/* Confetti */}
        {confetti.map((piece: any) => (
            <div
            key={piece.id}
            className="absolute pointer-events-none"
            style={{
                left: piece.x,
                top: piece.y,
                transform: `rotate(${piece.rotation}deg)`,
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '0'
            }}
            ></div>
        ))}
    </div>
  );
};

export default ConfettiPresentBox;