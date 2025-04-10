import React, { useEffect, useRef } from 'react';

interface ZevLogoProps {
  size?: number;
  className?: string;
  variant?: 'dark' | 'light';
}

const ZevLogo: React.FC<ZevLogoProps> = ({ 
  size = 40, 
  className = '', 
  variant = 'dark'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = size;
    canvas.height = size;
    
    // Scale for high-resolution displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    
    // Adjust canvas CSS size
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Define constants in shared scope so they're available to all functions
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4;
    
    // Draw logo
    const drawZevLogo = () => {
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      if (variant === 'light') {
        gradient.addColorStop(0, '#1d4ed8'); // Blue 700
        gradient.addColorStop(1, '#3b82f6'); // Blue 500
      } else {
        gradient.addColorStop(0, '#2563eb'); // Blue 600
        gradient.addColorStop(1, '#60a5fa'); // Blue 400
      }
      
      // Add glow effect
      const addGlow = (color: string, blur: number) => {
        ctx.shadowColor = color;
        ctx.shadowBlur = blur;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      };
      
      // Apply glow effect
      if (variant === 'dark') {
        addGlow('rgba(59, 130, 246, 0.8)', size * 0.15);
      } else {
        addGlow('rgba(59, 130, 246, 0.4)', size * 0.08);
      }
      
      // Draw brain-inspired neural network pattern
      ctx.strokeStyle = gradient;
      ctx.lineWidth = size * 0.06;
      ctx.lineCap = 'round';
      
      // Draw central node - bigger and more prominent
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw connection nodes in circular pattern
      const nodeCount = 7; // Increased nodes for more complex appearance
      const connectionNodes = [];
      
      for (let i = 0; i < nodeCount; i++) {
        const angle = (Math.PI * 2 * i) / nodeCount;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        // Store node position
        connectionNodes.push({ x, y, angle });
        
        // Draw node with varied sizes
        ctx.beginPath();
        const nodeSize = (i % 2 === 0) ? size * 0.09 : size * 0.07;
        ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw connection to center
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      
      // Draw some interconnections between outer nodes
      for (let i = 0; i < nodeCount; i++) {
        const connection1 = connectionNodes[i];
        const connection2 = connectionNodes[(i + 2) % nodeCount];
        const connection3 = connectionNodes[(i + 3) % nodeCount];
        
        // Only connect some nodes for cleaner look
        if (i % 2 === 0) {
          ctx.beginPath();
          ctx.moveTo(connection1.x, connection1.y);
          
          // Create curved connections
          const controlX = centerX + radius * 0.8 * Math.cos((connection1.angle + connection2.angle) / 2);
          const controlY = centerY + radius * 0.8 * Math.sin((connection1.angle + connection2.angle) / 2);
          
          ctx.quadraticCurveTo(controlX, controlY, connection2.x, connection2.y);
          ctx.stroke();
          
          // Add some extra connections for complexity
          if (i % 3 === 0) {
            ctx.beginPath();
            ctx.moveTo(connection1.x, connection1.y);
            
            // Different curve pattern
            const control2X = centerX + radius * 0.6 * Math.cos((connection1.angle + connection3.angle) / 2);
            const control2Y = centerY + radius * 0.6 * Math.sin((connection1.angle + connection3.angle) / 2);
            
            ctx.quadraticCurveTo(control2X, control2Y, connection3.x, connection3.y);
            ctx.stroke();
          }
        }
      }
      
      // Add an outer ring glow for enhanced visual effect
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
      ctx.strokeStyle = variant === 'dark' 
        ? 'rgba(59, 130, 246, 0.2)' // Blue with transparency for dark mode
        : 'rgba(37, 99, 235, 0.1)'; // Slightly darker blue for light mode
      ctx.lineWidth = size * 0.02;
      ctx.stroke();
      
      // Reset shadow for clean rendering
      ctx.shadowBlur = 0;
    };
    
    // Execute drawing
    drawZevLogo();
    
    // Add animation effect
    let animationFrame: number | null = null;
    let angle = 0;
    
    const animateLogo = () => {
      // Very subtle breathing animation
      angle += 0.02;
      const scale = 1 + Math.sin(angle) * 0.01; // Very subtle scale change
      
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(scale, scale);
      ctx.translate(-centerX, -centerY);
      drawZevLogo();
      ctx.restore();
      
      animationFrame = requestAnimationFrame(animateLogo);
    };
    
    // Start animation
    animateLogo();
    
    // Cleanup
    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [size, variant]);
  
  return (
    <canvas 
      ref={canvasRef}
      className={className}
      style={{ width: size, height: size }}
    />
  );
};

export default ZevLogo;