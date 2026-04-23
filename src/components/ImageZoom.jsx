import React, { useState, useRef } from 'react';

const ImageZoom = ({ imageUrl, altText = "Product Image" }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    // Get the bounding rectangle of the image to calculate exact mouse coordinates
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    
    // Calculate mouse position as a percentage
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setPosition({ x, y });
  };

  return (
    <div
      style={{
        overflow: 'hidden',
        width: '100%',
        maxWidth: '500px', // Adjust this based on your layout
        borderRadius: '8px',
        cursor: 'crosshair',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        ref={imageRef}
        src={imageUrl}
        alt={altText}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          // The Magic: Scale up and dynamically shift the origin point to the mouse cursor!
          transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
          transformOrigin: `${position.x}% ${position.y}%`,
          transition: 'transform 0.2s ease-out', // Smooth zoom in/out
        }}
      />
    </div>
  );
};

export default ImageZoom;