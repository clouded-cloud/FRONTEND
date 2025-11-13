import React, { useEffect, useRef } from 'react';

const QRCode = ({ value, size = 128, className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    // Simple QR code generation (basic implementation)
    // For production, consider using a proper QR code library like qrcode.js
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);

    // Simple pattern for demo (replace with actual QR generation)
    const pattern = generateSimpleQRPattern(value);

    // Draw pattern
    ctx.fillStyle = 'black';
    const cellSize = size / pattern.length;

    pattern.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      });
    });
  }, [value, size]);

  // Simple pattern generator (for demo purposes)
  const generateSimpleQRPattern = (text) => {
    const size = 21; // Standard QR size
    const pattern = Array(size).fill().map(() => Array(size).fill(false));

    // Add finder patterns (corners)
    // Top-left
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if ((i === 0 || i === 6 || j === 0 || j === 6) ||
            (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
          pattern[i][j] = true;
        }
      }
    }

    // Top-right
    for (let i = 0; i < 7; i++) {
      for (let j = 14; j < 21; j++) {
        if ((i === 0 || i === 6 || j === 14 || j === 20) ||
            (i >= 2 && i <= 4 && j >= 16 && j <= 18)) {
          pattern[i][j] = true;
        }
      }
    }

    // Bottom-left
    for (let i = 14; i < 21; i++) {
      for (let j = 0; j < 7; j++) {
        if ((i === 14 || i === 20 || j === 0 || j === 6) ||
            (i >= 16 && i <= 18 && j >= 2 && j <= 4)) {
          pattern[i][j] = true;
        }
      }
    }

    // Add some data pattern based on text
    const textHash = text.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    for (let i = 8; i < 13; i++) {
      for (let j = 8; j < 13; j++) {
        pattern[i][j] = (textHash & (1 << ((i-8) * 5 + (j-8)))) !== 0;
      }
    }

    return pattern;
  };

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={className}
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

export default QRCode;
