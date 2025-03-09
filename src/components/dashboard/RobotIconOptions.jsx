import React from 'react';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';
import { TbRobot, TbRobotFace } from 'react-icons/tb';
import { GiRobotGolem, GiRobotHelmet } from 'react-icons/gi';
import { RiRobotFill, RiRobotLine } from 'react-icons/ri';
import { MdSmartToy } from 'react-icons/md';

/**
 * This component displays various robot icon options from different icon libraries
 * to compare with the current diamond icon used for tokens/credits.
 */
function RobotIconOptions() {
  // Sample credit value
  const creditValue = 1250;
  
  // Icon options to display
  const iconOptions = [
    { name: 'Current (Diamond)', icon: IoDiamond, library: 'Ionicons (io5)' },
    { name: 'Font Awesome Robot', icon: FaRobot, library: 'Font Awesome (fa6)' },
    { name: 'Tabler Robot', icon: TbRobot, library: 'Tabler Icons (tb)' },
    { name: 'Tabler Robot Face', icon: TbRobotFace, library: 'Tabler Icons (tb)' },
    { name: 'Game Icons Robot', icon: GiRobotGolem, library: 'Game Icons (gi)' },
    { name: 'Game Icons Robot Helmet', icon: GiRobotHelmet, library: 'Game Icons (gi)' },
    { name: 'Remix Robot Fill', icon: RiRobotFill, library: 'Remix Icons (ri)' },
    { name: 'Remix Robot Line', icon: RiRobotLine, library: 'Remix Icons (ri)' },
    { name: 'Material Smart Toy', icon: MdSmartToy, library: 'Material Design (md)' }
  ];
  
  return (
    <div className="bg-[#1d2127] rounded-2xl shadow-2xl border border-gray-800/30 p-6">
      <h2 className="text-xl font-bold text-white mb-6">Robot Icon Options</h2>
      <p className="text-gray-400 mb-6">
        Compare different robot icons from React Icons libraries as alternatives to the diamond icon for representing tokens/credits.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {iconOptions.map((option, index) => (
          <div key={index} className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl p-4">
            <h3 className="text-md font-semibold text-white mb-2">{option.name}</h3>
            <p className="text-xs text-gray-500 mb-3">{option.library}</p>
            
            {/* Icon in table header */}
            <div className="flex items-center mb-4 bg-black/30 p-2 rounded">
              <option.icon className="mr-1" />
              <span className="text-gray-400 text-xs uppercase font-medium">Credits</span>
            </div>
            
            {/* Icon with credit value */}
            <div className="flex items-center text-white mb-4 bg-black/30 p-2 rounded">
              <option.icon className="mr-1 text-emerald-400" />
              <span className="text-sm">{creditValue.toLocaleString()}</span>
            </div>
            
            {/* Icon sizes */}
            <div className="flex items-center justify-between mt-4">
              <option.icon className="text-emerald-400" size={16} />
              <option.icon className="text-emerald-400" size={20} />
              <option.icon className="text-emerald-400" size={24} />
              <option.icon className="text-emerald-400" size={32} />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-gray-400 text-sm">
        <p>
          <strong>Design Considerations:</strong>
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>The diamond icon has a clean, modern look that fits with the application's design aesthetic</li>
          <li>Robot icons better represent the AI-powered nature of the geniusOS platform</li>
          <li>Consider which icon is most recognizable at small sizes in the UI</li>
          <li>Consider which icon best matches your existing design system</li>
        </ul>
      </div>
    </div>
  );
}

export default RobotIconOptions;
