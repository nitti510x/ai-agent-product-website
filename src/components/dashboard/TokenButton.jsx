import React from 'react';
import { Link } from 'react-router-dom';
import { FaRobot } from 'react-icons/fa6';

const TokenButton = ({ tokenCount = 0 }) => {
  return (
    <Link 
      to="/dashboard/tokens"
      className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-[#111418] border border-emerald-500/30 text-white hover:border-emerald-400/50 transition-all duration-300 shadow-lg shadow-emerald-900/20 group overflow-hidden"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 to-blue-900/20 opacity-50"></div>
      
      {/* Subtle animated glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Icon container with pulse effect */}
      <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 border border-emerald-500/30">
        <FaRobot className="text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300" size={16} />
        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      </div>
      
      {/* Token count with subtle animation */}
      <div className="relative z-10 flex flex-col">
        <span className="font-bold text-base text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300">
          {tokenCount.toLocaleString()}
        </span>
        <span className="text-[10px] text-emerald-500/70 -mt-1 font-medium">TOKENS</span>
      </div>
    </Link>
  );
};

export default TokenButton;
