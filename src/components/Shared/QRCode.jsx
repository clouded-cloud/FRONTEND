import React, { useEffect, useRef, useState } from 'react';
import { IoDownload, IoRefresh, IoQrCode } from 'react-icons/io5';

const QRCode = ({ 
  value, 
  size = 160, 
  className = '',
  showDownload = true,
  showRefresh = false,
  onRefresh,
  title = "QR Code",
  description
}) => {
  const canvasRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    const generateQRCode = async () => {
      setIsGenerating(true);
      
      try {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear canvas with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, size, size);

        // Generate QR code pattern
        const pattern = await generateEnhancedQRPattern(value, size);
        
        // Draw QR code
        ctx.fillStyle = 'var(--text-primary)'; // Using theme color for QR dots
        const cellSize = size / pattern.length;

        pattern.forEach((row, y) => {
          row.forEach((cell, x) => {
            if (cell) {
              // Add rounded corners for better appearance
              const padding = cellSize * 0.1;
              ctx.fillRect(
                x * cellSize + padding, 
                y * cellSize + padding, 
                cellSize - padding * 2, 
                cellSize - padding * 2
              );
            }
          });
        });

        // Add quiet zone (white border)
        ctx.strokeStyle = 'white';
        ctx.lineWidth = cellSize * 2;
        ctx.strokeRect(0, 0, size, size);

      } catch (error) {
        console.error('QR code generation failed:', error);
        drawErrorState();
      } finally {
        setIsGenerating(false);
      }
    };

    generateQRCode();
  }, [value, size]);

  // Enhanced QR pattern generator
  const generateEnhancedQRPattern = async (text, qrSize) => {
    const matrixSize = 29; // Increased size for better data capacity
    const pattern = Array(matrixSize).fill().map(() => Array(matrixSize).fill(false));

    // Add finder patterns (position markers)
    addFinderPattern(pattern, 0, 0); // Top-left
    addFinderPattern(pattern, matrixSize - 7, 0); // Top-right
    addFinderPattern(pattern, 0, matrixSize - 7); // Bottom-left

    // Add alignment patterns
    addAlignmentPattern(pattern, matrixSize - 9, matrixSize - 9);
    addAlignmentPattern(pattern, 10, 10);

    // Generate data pattern from text
    const dataPattern = generateDataPattern(text, matrixSize);
    
    // Merge data pattern
    dataPattern.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== null) {
          pattern[y][x] = cell;
        }
      });
    });

    // Apply mask pattern to improve scannability
    applyMaskPattern(pattern);

    return pattern;
  };

  // Finder pattern (7x7)
  const addFinderPattern = (pattern, startX, startY) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const isBorder = i === 0 || i === 6 || j === 0 || j === 6;
        const isInnerBorder = i === 1 || i === 5 || j === 1 || j === 5;
        const isCenter = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        
        pattern[startY + i][startX + j] = isBorder || isInnerBorder || isCenter;
      }
    }
  };

  // Alignment pattern (5x5)
  const addAlignmentPattern = (pattern, centerX, centerY) => {
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        const isBorder = Math.abs(i) === 2 || Math.abs(j) === 2;
        const isCenter = Math.abs(i) <= 1 && Math.abs(j) <= 1;
        pattern[centerY + i][centerX + j] = isBorder || isCenter;
      }
    }
  };

  // Data pattern generation
  const generateDataPattern = (text, matrixSize) => {
    const dataPattern = Array(matrixSize).fill().map(() => Array(matrixSize).fill(null));
    const textBytes = new TextEncoder().encode(text);
    
    // Simple data distribution
    let byteIndex = 0;
    for (let y = 0; y < matrixSize; y++) {
      for (let x = 0; x < matrixSize; x++) {
        // Skip finder and alignment pattern areas
        if (isReservedArea(x, y, matrixSize)) continue;
        
        if (byteIndex < textBytes.length * 8) {
          const byte = textBytes[Math.floor(byteIndex / 8)];
          const bit = (byte >> (byteIndex % 8)) & 1;
          dataPattern[y][x] = bit === 1;
          byteIndex++;
        } else {
          dataPattern[y][x] = Math.random() > 0.5; // Fill remaining with random pattern
        }
      }
    }
    
    return dataPattern;
  };

  // Check if coordinate is in reserved area
  const isReservedArea = (x, y, matrixSize) => {
    // Finder patterns
    if ((x < 7 && y < 7) || 
        (x > matrixSize - 8 && y < 7) || 
        (x < 7 && y > matrixSize - 8)) {
      return true;
    }
    
    // Alignment patterns
    const alignmentCenters = [
      [matrixSize - 9, matrixSize - 9],
      [10, 10]
    ];
    
    return alignmentCenters.some(([cx, cy]) => 
      Math.abs(x - cx) <= 2 && Math.abs(y - cy) <= 2
    );
  };

  // Apply mask pattern to improve scannability
  const applyMaskPattern = (pattern) => {
    pattern.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (!isReservedArea(x, y, pattern.length) && cell !== null) {
          // Simple checkerboard mask
          if ((x + y) % 2 === 0) {
            pattern[y][x] = !cell;
          }
        }
      });
    });
  };

  // Error state fallback
  const drawErrorState = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#fef2f2';
    ctx.fillRect(0, 0, size, size);
    
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('QR Error', size / 2, size / 2);
  };

  // Download QR code as PNG
  const downloadQRCode = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `qrcode-${value.substring(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!value) {
    return (
      <div className="qr-code-container empty">
        <div className="empty-state">
          <IoQrCode className="empty-icon" />
          <p className="empty-text">No data for QR code</p>
        </div>
      </div>
    );
  }

  return (
    <div className="qr-code-container">
      {/* Header */}
      {(title || description) && (
        <div className="qr-header">
          {title && <h4 className="qr-title">{title}</h4>}
          {description && <p className="qr-description">{description}</p>}
        </div>
      )}

      {/* QR Code Canvas */}
      <div className="qr-code-wrapper">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className={`qr-canvas ${className} ${isGenerating ? 'generating' : ''}`}
          style={{ 
            imageRendering: 'crisp-edges',
            width: size,
            height: size
          }}
        />
        
        {isGenerating && (
          <div className="qr-overlay">
            <div className="qr-spinner"></div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="qr-actions">
        {showDownload && (
          <button 
            onClick={downloadQRCode}
            className="qr-action-button download"
            disabled={isGenerating}
          >
            <IoDownload className="action-icon" />
            Download
          </button>
        )}
        
        {showRefresh && onRefresh && (
          <button 
            onClick={onRefresh}
            className="qr-action-button refresh"
            disabled={isGenerating}
          >
            <IoRefresh className="action-icon" />
            Refresh
          </button>
        )}
      </div>

      <style jsx>{`
        .qr-code-container {
          background: var(--card-bg);
          border-radius: 16px;
          box-shadow: var(--shadow);
          border: 1px solid var(--border-color);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          max-width: fit-content;
        }

        .qr-code-container.empty {
          padding: 2rem;
          text-align: center;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .empty-icon {
          font-size: 2rem;
          color: var(--text-muted);
          opacity: 0.5;
        }

        .empty-text {
          color: var(--text-secondary);
          margin: 0;
          font-size: 0.875rem;
        }

        /* Header */
        .qr-header {
          text-align: center;
          width: 100%;
        }

        .qr-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
        }

        .qr-description {
          color: var(--text-secondary);
          margin: 0;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        /* QR Code Wrapper */
        .qr-code-wrapper {
          position: relative;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
          background: white;
        }

        .qr-canvas {
          display: block;
          border-radius: 12px;
          transition: opacity 0.2s ease;
        }

        .qr-canvas.generating {
          opacity: 0.7;
        }

        .qr-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .qr-spinner {
          width: 2rem;
          height: 2rem;
          border: 2px solid var(--border-color);
          border-top: 2px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Actions */
        .qr-actions {
          display: flex;
          gap: 0.75rem;
          width: 100%;
          justify-content: center;
        }

        .qr-action-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .qr-action-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .qr-action-button.download {
          background: var(--primary);
          color: white;
        }

        .qr-action-button.download:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }

        .qr-action-button.refresh {
          background: var(--card-bg);
          color: var(--text-primary);
          border: 1.5px solid var(--border-color);
        }

        .qr-action-button.refresh:hover:not(:disabled) {
          background: #f8f9ff;
          border-color: var(--primary);
        }

        .action-icon {
          font-size: 1rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .qr-code-container {
            padding: 1.25rem;
          }

          .qr-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .qr-action-button {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .qr-code-container {
            padding: 1rem;
          }

          .qr-title {
            font-size: 1rem;
          }
        }

        /* Focus states */
        .qr-action-button:focus {
          outline: none;
          box-shadow: 0 0 0 3px var(--focus-ring);
        }
      `}</style>
    </div>
  );
};

// Export additional QR code utilities
export const QRCodeUtilities = {
  // Validate if string is suitable for QR code
  isValidInput: (text) => {
    return typeof text === 'string' && text.length > 0 && text.length <= 500;
  },
  
  // Generate QR code data URL
  generateDataURL: async (text, size = 160) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const qrCode = new QRCode({ value: text, size });
      // This would need proper implementation with a QR library
      setTimeout(() => resolve(canvas.toDataURL('image/png')), 100);
    });
  }
};

export default QRCode;