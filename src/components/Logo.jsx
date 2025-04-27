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
        <div className="ml-6 text-2xl flex items-center tracking-wide font-sans" style={{ transform: 'translateY(-2px)' }}>
          {/* Combined MindBolt AI text with lightning bolt icon */}
          <div className="flex items-center">
            {/* Mind part with regular weight and cyan color */}
            <span 
              className="font-medium tracking-tight text-[#53D3FF]" 
              style={{ 
                letterSpacing: '0.02em',
                textShadow: '0 0 8px rgba(83, 211, 255, 0.35)',
                background: 'linear-gradient(to right, rgba(63, 193, 235, 1), #53D3FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Mind
            </span>
            
            {/* Lightning bolt icon - increased size by ~15% */}
            <svg 
              width="21" 
              height="25" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="mx-1 transform translate-y-[1px]"
              style={{
                filter: 'drop-shadow(0 0 3.5px rgba(83, 255, 203, 0.45))'
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
                  <stop stopColor="#4DF0C0" />
                  <stop offset="1" stopColor="#53D3FF" />
                </linearGradient>
                <linearGradient id="bolt-stroke-gradient" x1="4" y1="12" x2="19.5" y2="12" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4DF0C0" />
                  <stop offset="1" stopColor="#53D3FF" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Bolt part with more italic styling and subtle underline speed trail */}
            <div className="relative">
              <span 
                className="font-bold tracking-normal bg-gradient-to-r from-[#53FFCB] to-[#53D3FF] bg-clip-text text-transparent"
                style={{ 
                  letterSpacing: '0.03em',
                  textShadow: '0 0 2px rgba(255, 255, 255, 0.15)',
                  fontStyle: 'italic',
                  transform: 'skewX(-12deg)',
                  display: 'inline-block'
                }}
              >
                Bolt
              </span>
              
              {/* Speed trail underline with improved fade */}
              <div 
                className="absolute bottom-0 left-0 w-full h-[2px]"
                style={{
                  background: 'linear-gradient(to right, transparent, rgba(83, 255, 203, 0.8) 25%, rgba(83, 211, 255, 0.25) 65%, rgba(83, 211, 255, 0.1) 85%, transparent)',
                  transform: 'translateY(1px)'
                }}
              ></div>
            </div>
            
            {/* AI part with slightly toned down glow for better balance */}
            <span 
              className="font-extrabold ml-1.5 tracking-normal text-white"
              style={{ 
                letterSpacing: '0.05em',
                textShadow: '0 0 8px rgba(83, 211, 255, 0.35)'
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