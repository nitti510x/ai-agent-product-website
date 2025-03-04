import React from 'react';

function Logo({ className = "h-8" }) {
  return (
    <div className={`${className} flex items-center`}>
      <div className="flex items-center">
        <img 
          src="https://geniusos.co/wp-content/uploads/2023/08/geniusos-logo-transparent.png.webp" 
          alt="Logo"
          className="h-10 w-auto"
        />
        <div className="ml-3 text-2xl flex items-center tracking-wide font-sans">
          {/* Intelli part with regular weight and cyan color */}
          <span 
            className="font-normal tracking-tight text-[#53D3FF]" 
            style={{ 
              letterSpacing: '-0.01em',
              textShadow: '0 0 5px rgba(83, 211, 255, 0.4)'
            }}
          >
            Intelli
          </span>
          
          {/* Agents part with bold weight, slight italic, and stronger neon blue glow */}
          <span 
            className="font-bold tracking-normal bg-gradient-to-r from-[#53FFCB] to-[#53D3FF] bg-clip-text text-transparent italic"
            style={{ 
              letterSpacing: '0.02em',
              textShadow: '0 0 10px rgba(83, 255, 203, 0.6), 0 0 4px rgba(83, 211, 255, 0.6)'
            }}
          >
            Agents
          </span>
        </div>
      </div>
    </div>
  );
}

export default Logo;