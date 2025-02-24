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
        <div className="ml-3 text-2xl flex items-center tracking-wide">
          <span className="font-normal text-[#53D3FF]">intell</span>
          <span className="font-bold tracking-[0.03em] bg-gradient-to-r from-[#53FFCB] to-[#53D3FF] bg-clip-text text-transparent uppercase">AGENTS</span>
        </div>
      </div>
    </div>
  );
}

export default Logo;