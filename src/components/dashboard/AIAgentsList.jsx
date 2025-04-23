import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSettings, FiActivity, FiBarChart2, FiHelpCircle } from 'react-icons/fi';
import { RiSlackFill, RiImageLine, RiFileTextLine, RiLinkedinBoxFill, RiWordpressFill, RiInstagramLine, RiFacebookBoxFill, RiTwitterXFill, RiSearchLine, RiFlowChart, RiRobot2Line, RiPulseLine, RiQuillPenLine, RiLayoutGridFill, RiAiGenerate, RiMagicLine, RiSparkling2Line, RiMegaphoneLine } from 'react-icons/ri';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot, FaBrain, FaWandMagicSparkles } from 'react-icons/fa6';
import { apiUrl } from '../../config/api';
import { useOrganization } from '../../contexts/OrganizationContext';
import PageHeader from './PageHeader';

function AIAgentsList() {
  // Define a consistent gradient matching the site style
  const mainGradient = 'from-emerald-400 to-blue-500';
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { subscription, getPlanName, isAgentInUserPlan } = useOrganization();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        console.log('Fetching agents from:', `${apiUrl()}/agents/active`);
        const response = await fetch(`${apiUrl()}/agents/active`, {
          method: 'GET',
          headers: { 'accept': 'application/json' }
        });
        
        if (!response.ok) {
          throw new Error(`Error fetching agents: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Agents data received:', data);
        
        // Filter out background agents
        const filteredAgents = (data.agents || []).filter(agent => !agent.is_background_agent);
        console.log('Filtered agents (excluding background agents):', filteredAgents);
        
        setAgents(filteredAgents);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch agents:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchAgents();
  }, []);

  // Function to get the appropriate icon based on system_name
  const getAgentIcon = (systemName, isMainAgent = true, isGray = false) => {
    switch (systemName) {
      case 'slack_app_agent':
        return <RiSlackFill className={`w-8 h-8 ${isGray ? 'text-gray-500' : 'text-emerald-400'}`} />;
      case 'social_media_manager_agent':
        return <RiPulseLine className={`w-8 h-8 ${isGray ? 'text-gray-500' : 'text-emerald-400'}`} />;
      case 'ai_content_manager_agent':
        return <FaBrain className={`w-8 h-8 ${isGray ? 'text-gray-500' : 'text-emerald-400'}`} />;
      case 'market_research_agent':
        return <RiSearchLine className={`w-8 h-8 ${isGray ? 'text-gray-500' : 'text-emerald-400'}`} />;
      case 'content_writer_agent':
        return <RiQuillPenLine className={`w-8 h-8 ${isGray ? 'text-gray-500' : 'text-emerald-400'}`} />;
      case 'image_generator_agent':
        return <RiImageLine className={`w-8 h-8 ${isGray ? 'text-gray-500' : 'text-emerald-400'}`} />;
      case 'echo_prompt_agent':
        return <FaWandMagicSparkles className={`w-8 h-8 ${isGray ? 'text-gray-500' : 'text-emerald-400'}`} />;
      case 'prompt_personalizer_agent':
        return <FaWandMagicSparkles className={`w-8 h-8 ${isGray ? 'text-gray-500' : 'text-emerald-400'}`} />;
      case 'workflow_helper_agent':
        return <RiFlowChart className={`w-8 h-8 ${isGray ? 'text-gray-500' : 'text-emerald-400'}`} />;
      case 'linkedin_influencer_agent':
        return <RiLinkedinBoxFill className={`w-8 h-8 ${isGray ? 'text-gray-500' : 'text-emerald-400'}`} />;
      case 'facebook_influencer_agent':
        return <RiFacebookBoxFill className={`w-8 h-8 ${isGray ? 'text-gray-500' : 'text-emerald-400'}`} />;
      case 'instagram_influencer_agent':
        return <RiInstagramLine className={`w-8 h-8 ${isGray ? 'text-gray-500' : 'text-emerald-400'}`} />;
      case 'twitter_marketer_agent':
        return <RiTwitterXFill className={`w-8 h-8 ${isGray ? 'text-gray-500' : 'text-emerald-400'}`} />;
      case 'wordpress_blogger_agent':
        return <RiWordpressFill className={`w-8 h-8 ${isGray ? 'text-gray-500' : 'text-emerald-400'}`} />;
      case 'threads_influencer_agent':
        // Official Threads by Meta logo SVG, styled to match other agent icons
        return (
          <svg aria-label="Threads" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" className={`w-8 h-8 ${isGray ? 'text-gray-500' : 'text-emerald-400'} fill-current`}>
            <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"></path>
          </svg>
        );
      case 'youtube_influencer_agent':
        // Official YouTube SVG icon styled to match agent icons
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={`w-8 h-8 ${isGray ? 'text-gray-500' : 'text-emerald-400'}`}>
            <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z"/>
          </svg>
        );
      case 'threads_influencer_agent':
        // Official Threads by Meta logo SVG, styled to match other agent icons
        return (
          <svg aria-label="Threads" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" className={`w-8 h-8 ${isGray ? 'text-gray-500' : 'text-emerald-400'} fill-current`}>
            <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"></path>
          </svg>
        );
      case 'campaign_manager_agent':
        return <RiMegaphoneLine className={`w-8 h-8 ${isGray ? 'text-gray-500' : 'text-emerald-400'}`} />;
      default:
        return <FaRobot className={`w-8 h-8 ${isGray ? 'text-gray-500' : 'text-emerald-400'}`} />;
    }
  };

  // Function to get the setup status indicator
  const getSetupStatusIndicator = (status, operationalStatus, isDisabled) => {
    if (isDisabled) {
      return (
        <div className="absolute top-3 right-3 flex items-center z-20">
          <IoDiamond className="text-purple-400 w-4 h-4 mr-1" />
          <span className="text-xs text-purple-300">Premium</span>
        </div>
      );
    }
    
    switch (status) {
      case 'operational':
        return (
          <div className="absolute top-3 right-3 z-20 flex items-center">
            <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-lg ring-2 ring-emerald-500/50"></div>
          </div>
        );
      case 'pending':
        return (
          <div className="absolute top-3 right-3 z-20 flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-lg ring-2 ring-yellow-500/50"></div>
          </div>
        );
      default:
        return (
          <div className="absolute top-3 right-3 z-20 flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-400 shadow-lg ring-2 ring-red-500/50"></div>
          </div>
        );
    }
  };

  // Function to open Slack app
  const openSlackApp = () => {
    window.open('https://slack.com/app', '_blank');
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-400 mb-4">Error loading agents: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-[#1A1E23] hover:bg-black/30 text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Split agents into those in the user's plan and those not
  const agentsInPlan = agents.filter(isAgentInUserPlan);
  const agentsNotInPlan = agents.filter((a) => !isAgentInUserPlan(a));

  return (
    <div>
      <PageHeader 
        title="Your AI Marketing Team"
        description="Manage your AI agents' tasks and performance"
        actions={
          <div className="flex items-center gap-6">
            <Link 
              to="/dashboard/help/quicksetup" 
              className="flex items-center gap-2 text-white hover:text-gray-200 transition-all duration-300 group"
            >
              <FiSettings className="w-4 h-4 group-hover:rotate-45 transition-transform duration-500" />
              <span className="text-sm">Quick Setup Guide</span>
            </Link>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); openSlackApp(); }}
              className="flex items-center px-6 py-2 bg-[#4A154B] hover:bg-[#611f64] text-white font-medium rounded-lg border border-purple-300/20 transition-all duration-300 shadow-sm hover:shadow-purple-500/20 hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet" width="20" height="20" style={{ marginRight: '8px' }} alt="Slack Logo">
                <title>Slack Logo</title>
                <path d="M22,12 a6,6 0 1 1 6,-6 v6z M22,16 a6,6 0 0 1 0,12 h-16 a6,6 0 1 1 0,-12" fill="#36C5F0"></path>
                <path d="M48,22 a6,6 0 1 1 6,6 h-6z M32,6 a6,6 0 1 1 12,0v16a6,6 0 0 1 -12,0z" fill="#2EB67D"></path>
                <path d="M38,48 a6,6 0 1 1 -6,6 v-6z M54,32 a6,6 0 0 1 0,12 h-16 a6,6 0 1 1 0,-12" fill="#ECB22E"></path>
                <path d="M12,38 a6,6 0 1 1 -6,-6 h6z M16,38 a6,6 0 1 1 12,0v16a6,6 0 0 1 -12,0z" fill="#E01E5A"></path>
              </svg>
              Join Slack Community
            </a>
          </div>
        }
      />

      {/* AGENTS IN PLAN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {agentsInPlan.map((agent) => (
          <div 
            key={agent.system_name} 
            className={`bg-[#1A1E23] border border-gray-700/40 rounded-xl overflow-hidden shadow-md relative`}
          >
            {getSetupStatusIndicator('operational', 'active', false)}
            
            {/* Agent header with icon */}
            <div className="flex items-center p-4 pb-3 border-b border-gray-800/30">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-[#111418] to-[#1E2328] flex items-center justify-center text-emerald-400 mr-3`}>
                {getAgentIcon(agent.system_name)}
              </div>
              <div>
                <h3 className="font-medium text-white text-sm">
                  {agent.name}
                </h3>
                <p className="text-gray-400 text-xs">{agent.blurb}</p>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="p-4 pt-3 flex flex-col gap-2">
              <div className="flex justify-between gap-2">
                <Link
                  to={`/dashboard/activity/${agent.system_name}`}
                  className="flex items-center justify-center px-3 py-2 rounded-lg bg-[#111418] hover:bg-black/30 text-white hover:text-emerald-400 transition-all duration-300 text-xs flex-1 border border-gray-800/40 hover:border-emerald-400/30"
                >
                  <FiActivity className="mr-1" />
                  Activity
                </Link>
                <Link
                  to={`/dashboard/usage/${agent.system_name}`}
                  className="flex items-center justify-center px-3 py-2 rounded-lg bg-[#111418] hover:bg-black/30 text-white hover:text-emerald-400 transition-all duration-300 text-xs flex-1 border border-gray-800/40 hover:border-emerald-400/30"
                >
                  <FiBarChart2 className="mr-1" />
                  Usage
                </Link>
              </div>
              <Link
                to={`/dashboard/settings/${agent.system_name}`}
                className="flex items-center justify-center px-3 py-2 rounded-lg bg-[#111418] hover:bg-black/30 text-white hover:text-emerald-400 transition-all duration-300 text-xs w-full border border-gray-800/40 hover:border-emerald-400/30"
              >
                <FiSettings className="mr-1" />
                Configure
              </Link>
              <Link
                to={`/dashboard/setup/${agent.system_name}`}
                className="flex items-center justify-center px-3 py-2 rounded-lg bg-[#111418] hover:bg-black/30 text-white hover:text-emerald-400 transition-all duration-300 text-xs w-full border border-gray-800/40 hover:border-emerald-400/30"
              >
                <FiHelpCircle className="mr-1" />
                Setup Guide
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* UPGRADE OPTIONS */}
      {agentsNotInPlan.length > 0 && (
        <>
          <div className="my-12 border-t border-gray-700/40"></div>
          <div className="mb-4 text-xs text-purple-400 font-semibold uppercase tracking-wide">Other AI Agents Available</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {agentsNotInPlan.map((agent) => (
              <div 
                key={agent.system_name} 
                className={`bg-[#1A1E23] border border-gray-700/40 rounded-xl overflow-hidden shadow-md relative opacity-75 p-6`}
              >
                {getSetupStatusIndicator('operational', 'active', true)}
                
                {/* Agent header with icon */}
                <div className="flex items-center p-4 pb-3 border-b border-gray-800/30">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#111418] to-[#1E2328] flex items-center justify-center text-gray-500 mr-3">
                    {getAgentIcon(agent.system_name, false, true)}
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-sm">
                      {agent.name}
                    </h3>
                    <p className="text-gray-400 text-xs">{agent.blurb}</p>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="p-4 pt-3 flex flex-col gap-2">
                  <Link
                    to="/dashboard/account/billing"
                    className="flex items-center justify-center px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white transition-all duration-300 text-xs w-full border border-purple-400/30 hover:shadow-glow"
                  >
                    <IoDiamond className="w-3.5 h-3.5 mr-1.5" />
                    Upgrade Plan to Access
                  </Link>
                  <Link
                    to={`/dashboard/agents/${agent.system_name}`}
                    className="flex items-center mt-2 text-purple-400 hover:text-purple-300 transition-colors text-xs justify-center"
                  >
                    <FiHelpCircle className="w-3.5 h-3.5 mr-1.5" />
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AIAgentsList;