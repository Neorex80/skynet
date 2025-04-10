import React, { useEffect, useRef, useState } from 'react';

interface InteractiveBackgroundProps {
  isDarkMode: boolean;
}

type Point = {
  x: number;
  y: number;
  size: number;
  baseSize: number;
  opacity: number;
  baseOpacity: number;
  velocityX: number;
  velocityY: number;
};

const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({ isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const pointsRef = useRef<Point[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const PROXIMITY_THRESHOLD = 150; // How close the mouse needs to be to interact with points
  const MAX_SIZE_INCREASE = 2.0; // Maximum increase in size when mouse is near
  const MAX_OPACITY_INCREASE = 0.5; // Maximum increase in opacity when mouse is near
  const POINTS_DENSITY = 2200; // Total number of points (increased for more richness)
  const POINT_SPEED = 0.04; // Base movement speed of points

  // Initialize the points
  useEffect(() => {
    const initPoints = () => {
      if (!containerRef.current) return;
      
      const { width, height } = containerRef.current.getBoundingClientRect();
      
      // Calculate point count based on screen size
      const pointCount = Math.min(POINTS_DENSITY, Math.floor(width * height / 600));
      
      // Create points
      const newPoints: Point[] = [];
      
      for (let i = 0; i < pointCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        
        const baseSize = Math.random() * 0.8 + 0.4; // Varied size range
        const baseOpacity = Math.random() * 0.15 + 0.05; // Varied opacity for depth
        
        // Add subtle random movement
        const velocityX = (Math.random() - 0.5) * POINT_SPEED;
        const velocityY = (Math.random() - 0.5) * POINT_SPEED;
        
        newPoints.push({
          x,
          y,
          size: baseSize,
          baseSize,
          opacity: baseOpacity,
          baseOpacity,
          velocityX,
          velocityY
        });
      }
      
      pointsRef.current = newPoints;
    };

    // Initialize and handle window resize
    initPoints();
    
    const handleResize = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      initPoints();
      draw();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    
    // Also track touch movements for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (containerRef.current && e.touches[0]) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        });
      }
    };

    // When mouse leaves, set position to null
    const handleMouseLeave = () => {
      setMousePosition(null);
    };
    
    // When touch ends, set position to null
    const handleTouchEnd = () => {
      // Don't immediately set to null to allow for a smoother fade-out effect
      setTimeout(() => setMousePosition(null), 500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Calculate the distance between two points
  const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  // Update and draw the points
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx || !containerRef.current) return;
    
    const { width, height } = containerRef.current.getBoundingClientRect();
    
    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    }
    
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);
    
    // Define colors based on theme - more vivid colors
    const pointColor = isDarkMode 
      ? 'rgba(59, 130, 246, ' // Blue in dark mode
      : 'rgba(37, 99, 235, '; // Blue in light mode
    
    // Draw connections between points
    ctx.strokeStyle = isDarkMode ? 'rgba(59, 130, 246, 0.05)' : 'rgba(37, 99, 235, 0.05)';
    ctx.lineWidth = 0.5;

    const CONNECTION_DISTANCE = 100; // Maximum distance to draw connections
    
    for (let i = 0; i < pointsRef.current.length; i++) {
      for (let j = i + 1; j < pointsRef.current.length; j++) {
        const point1 = pointsRef.current[i];
        const point2 = pointsRef.current[j];
        const distance = calculateDistance(point1.x, point1.y, point2.x, point2.y);
        
        if (distance < CONNECTION_DISTANCE) {
          // Calculate opacity based on distance
          const opacity = 0.1 * (1 - distance / CONNECTION_DISTANCE);
          ctx.beginPath();
          ctx.moveTo(point1.x, point1.y);
          ctx.lineTo(point2.x, point2.y);
          ctx.strokeStyle = isDarkMode 
            ? `rgba(59, 130, 246, ${opacity})` 
            : `rgba(37, 99, 235, ${opacity})`;
          ctx.stroke();
        }
      }
    }
    
    // Update and draw each point
    pointsRef.current.forEach(point => {
      // Update position with velocity (subtle movement)
      point.x += point.velocityX;
      point.y += point.velocityY;
      
      // Bounce off edges
      if (point.x < 0 || point.x > width) point.velocityX *= -1;
      if (point.y < 0 || point.y > height) point.velocityY *= -1;
      
      // Ensure the point stays in bounds
      point.x = Math.max(0, Math.min(width, point.x));
      point.y = Math.max(0, Math.min(height, point.y));
      
      // Reset to base values first
      point.size = point.baseSize;
      point.opacity = point.baseOpacity;
      
      // If mouse position is available, calculate interaction
      if (mousePosition) {
        const distance = calculateDistance(point.x, point.y, mousePosition.x, mousePosition.y);
        
        if (distance < PROXIMITY_THRESHOLD) {
          // Calculate influence factor (1 at center, 0 at threshold) with smooth falloff
          const factor = 1 - (distance / PROXIMITY_THRESHOLD);
          
          // Apply influence to size and opacity with easing
          const easedFactor = Math.pow(factor, 2); // Square for smoother curve
          point.size += MAX_SIZE_INCREASE * easedFactor;
          point.opacity += MAX_OPACITY_INCREASE * easedFactor;
        }
      }
      
      // Draw the point
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
      
      ctx.fillStyle = `${pointColor}${point.opacity})`;
      ctx.fill();
    });
    
    // Continue the animation
    animationFrameRef.current = requestAnimationFrame(draw);
  };

  // Start the animation when component mounts
  useEffect(() => {
    draw();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePosition, isDarkMode]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full z-0 overflow-hidden"
    >
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full"
      />
      {/* Add a subtle gradient overlay for depth */}
      <div 
        className={`absolute inset-0 -z-10 pointer-events-none ${
          isDarkMode 
            ? 'bg-gradient-to-br from-[#0a0a15]/90 via-[#0a0a15]/40 to-[#0f0f30]/20' 
            : 'bg-gradient-to-br from-white/90 via-white/40 to-blue-100/20'
        }`}
      />
    </div>
  );
};

export default InteractiveBackground;