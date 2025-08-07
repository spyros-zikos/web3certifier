import React, { useEffect, useState, useRef } from 'react';

type ConfettiPiece = {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    rotationSpeed: number;
    color: string;
    size: number;
    gravity: number;
};

const confettiColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#fd79a8'];

const createConfetti = (width: number, height: number): ConfettiPiece[] => {
    const newConfetti: ConfettiPiece[] = [];
    // 150 confetti pieces
    for (let i = 0; i < 150; i++) {
        newConfetti.push({
            id: Math.random(),
            x: width / 2, 
            y: height + 200, // Below the screen
            vx: (Math.random() - 0.5) * 20, // [-10, 10] 
            vy: -(Math.random() * 20 + 5), // [-25, -5]
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 20,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            size: Math.random() * 8 + 4,
            gravity: 0.2
        });
    }
    return newConfetti;
};

// Define the Confetti React component
const Confetti = ({ show }: { show: boolean }) => {
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
    const dimensionsRef = useRef({ width: 0, height: 0});

    // Get and update window dimensions
    useEffect(() => {
        const updateDimensions = () => {
            dimensionsRef.current = { width: window.innerWidth, height: window.innerHeight };
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Trigger the confetti animation
    useEffect(() => {
        if (show) {
            const { width, height } = dimensionsRef.current;
            setConfetti(createConfetti(width, height));
            const timer = setTimeout(() => setConfetti([]), 5000); // Clear confetti after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [show])

    // Main animation loop
    useEffect(() => {
        if (confetti.length === 0) return;

        const interval = setInterval(() => {
            setConfetti(prev =>
                prev.map(piece => ({
                    ...piece,
                    x: piece.x + piece.vx,
                    y: piece.y + piece.vy,
                    vy: piece.vy + piece.gravity,
                    rotation: piece.rotation + piece.rotationSpeed
                })).filter(piece => piece.y < dimensionsRef.current.height + 200)
            );
        }, 16);

        return () => clearInterval(interval);
    }, [confetti, dimensionsRef.current.height]);

    // Render the confetti pieces
    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
            {confetti.map(piece => (
                <div
                    key={piece.id}
                    className="absolute"
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

export default Confetti;