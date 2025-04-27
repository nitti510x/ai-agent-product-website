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
        <div className="ml-6 text-2xl flex items-center tracking-wide font-sans">
          {/* Combined MindBolt AI text with lightning bolt icon */}
          <div className="flex items-center">
            {/* Mind part with regular weight and cyan color */}
            <span 
              className="font-medium tracking-tight text-[#53D3FF]" 
              style={{ 
                letterSpacing: '0.02em',
                textShadow: '0 0 8px rgba(83, 211, 255, 0.35)'
              }}
            >
              Mind
            </span>
            
            {/* Lightning bolt icon */}
            <svg 
              width="18" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="mx-1 transform translate-y-[1px]"
              style={{
                filter: 'drop-shadow(0 0 3px rgba(83, 255, 203, 0.4))'
              }}
            >
              <path 
                d="M13 2L4.094 12.688L10 13.5L9 22L19.5 10.5L13 9.5L13 2Z" 
                fill="url(#bolt-gradient)" 
                stroke="url(#bolt-stroke-gradient)" 
                strokeWidth="1.5" 
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="bolt-gradient" x1="4" y1="12" x2="19.5" y2="12" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#53FFCB" />
                  <stop offset="1" stopColor="#53D3FF" />
                </linearGradient>
                <linearGradient id="bolt-stroke-gradient" x1="4" y1="12" x2="19.5" y2="12" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#53FFCB" />
                  <stop offset="1" stopColor="#53D3FF" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Bolt AI part with bold weight, slight italic, and gradient color without glow */}
            <span 
              className="font-bold tracking-normal bg-gradient-to-r from-[#53FFCB] to-[#53D3FF] bg-clip-text text-transparent italic"
              style={{ 
                letterSpacing: '0.03em',
                textShadow: '0 0 1px rgba(255, 255, 255, 0.1)'
              }}
            >
              Bolt
            </span>
            
            {/* AI part with slightly different styling */}
            <span 
              className="font-extrabold ml-1.5 tracking-normal text-white"
              style={{ 
                letterSpacing: '0.05em',
                textShadow: '0 0 10px rgba(83, 211, 255, 0.4)'
              }}
            >
              AI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Logo;