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
          {/* Left parenthesis sound wave */}
          <div className="mr-1.5 flex items-center">
            <svg 
              width="10" 
              height="24" 
              viewBox="0 0 10 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="transform translate-y-[1px]"
            >
              <path 
                d="M8 4C5 7 3 10 3 12C3 14 5 17 8 20" 
                stroke="url(#left-wave-gradient)" 
                strokeWidth="1.5" 
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="left-wave-gradient" x1="3" y1="12" x2="8" y2="12" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#53FFCB" />
                  <stop offset="1" stopColor="#53D3FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          {/* Combined echoAgents text */}
          <div className="flex items-center">
            {/* Echo part with regular weight and cyan color */}
            <span 
              className="font-normal tracking-tight text-[#53D3FF]" 
              style={{ 
                letterSpacing: '-0.01em',
                textShadow: '0 0 5px rgba(83, 211, 255, 0.4)'
              }}
            >
              echo
            </span>
            
            {/* Agents part with bold weight, slight italic, and gradient color without glow */}
            <span 
              className="font-bold tracking-normal bg-gradient-to-r from-[#53FFCB] to-[#53D3FF] bg-clip-text text-transparent italic"
              style={{ 
                letterSpacing: '0.02em'
                /* Removed text shadow to eliminate fuzziness */
              }}
            >
              Agents
            </span>
          </div>
          
          {/* Right parenthesis sound wave */}
          <div className="ml-1.5 flex items-center">
            <svg 
              width="10" 
              height="24" 
              viewBox="0 0 10 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="transform translate-y-[1px]"
            >
              <path 
                d="M2 4C5 7 7 10 7 12C7 14 5 17 2 20" 
                stroke="url(#right-wave-gradient)" 
                strokeWidth="1.5" 
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="right-wave-gradient" x1="7" y1="12" x2="2" y2="12" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#53FFCB" />
                  <stop offset="1" stopColor="#53D3FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Logo;