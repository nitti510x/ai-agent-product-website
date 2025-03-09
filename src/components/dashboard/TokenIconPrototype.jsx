import React from 'react';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';

/**
 * This is a prototype component to demonstrate how the robot icon would look
 * compared to the diamond icon for representing tokens/credits in the application.
 */
function TokenIconPrototype() {
  // Sample credit values
  const credits = [1250, 850, 320, 0];
  
  return (
    <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-gray-800/30 p-6">
      <h2 className="text-xl font-bold text-white mb-6">Token Icon Prototype</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Current Design with Diamond Icon */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Current Design (Diamond)</h3>
          <div className="space-y-4">
            <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <IoDiamond className="mr-1" />
                <span className="text-gray-400 text-xs uppercase font-medium">Credits</span>
              </div>
              
              {credits.map((credit, index) => (
                <div key={index} className="flex items-center text-white py-2 border-b border-gray-700/30 last:border-0">
                  <IoDiamond className="mr-1 text-emerald-400" />
                  <span className="text-sm">{credit.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Proposed Design with Robot Icon */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Proposed Design (Robot)</h3>
          <div className="space-y-4">
            <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <FaRobot className="mr-1" />
                <span className="text-gray-400 text-xs uppercase font-medium">Credits</span>
              </div>
              
              {credits.map((credit, index) => (
                <div key={index} className="flex items-center text-white py-2 border-b border-gray-700/30 last:border-0">
                  <FaRobot className="mr-1 text-emerald-400" />
                  <span className="text-sm">{credit.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">Comparison in Context</h3>
        <div className="bg-dark-card/80 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center">
                    <IoDiamond className="mr-1" />
                    Current
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FaRobot className="mr-1" />
                    Proposed
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-blue-400 font-medium">AJ</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">Alex Johnson</div>
                      <div className="text-sm text-gray-400">alex@example.com</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-white">
                    <IoDiamond className="mr-1 text-emerald-400" />
                    <span className="text-sm">1,250</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-white">
                    <FaRobot className="mr-1 text-emerald-400" />
                    <span className="text-sm">1,250</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 text-gray-400 text-sm">
        <p>
          <strong>Design Considerations:</strong>
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>The diamond icon has a clean, modern look that fits with the application's design aesthetic</li>
          <li>The robot icon better represents the AI-powered nature of the geniusOS platform</li>
          <li>Changing the icon would require updates across many components in the application</li>
          <li>Users are already familiar with the diamond icon for credits</li>
        </ul>
      </div>
    </div>
  );
}

export default TokenIconPrototype;
