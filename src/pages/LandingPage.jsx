import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { 
  FiArrowRight, 
  FiCheck, 
  FiMessageSquare, 
  FiUsers, 
  FiSearch, 
  FiLayers,
  FiZap,
  FiCpu,
  FiClock,
  FiTrendingUp,
  FiBarChart2,
  FiMessageCircle,
  FiGlobe,
  FiMail,
  FiPhoneCall,
  FiCommand,
  FiSettings,
  FiRefreshCw
} from 'react-icons/fi';
import { 
  RiRobot2Line,
  RiCodeLine,
  RiCustomerService2Line,
  RiComputerLine,
  RiDatabaseLine,
  RiFacebookBoxFill,
  RiLinkedinBoxFill,
  RiTwitterXFill,
  RiInstagramLine,
  RiFileTextLine,
  RiMegaphoneLine,
  RiVirusLine,
  RiSlackFill,
  RiCustomerServiceFill,
  RiTeamFill,
  RiRocketLine,
  RiHashtag,
  RiGlobalLine,
  RiTimeLine,
  RiPaletteLine,
  RiWordpressFill
} from 'react-icons/ri';
import Logo from '../components/Logo';

function LandingPage() {
  const navItems = ['Features', 'Pricing', 'Integration', 'Support'];

  return (
    <div className="bg-dark text-text-light">
      {/* Navigation */}
      <nav className="fixed w-full bg-dark/95 backdrop-blur-sm z-50 border-b border-dark-lighter">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo className="h-8" />
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <ScrollLink
                  key={item}
                  to={item.toLowerCase()}
                  smooth={true}
                  duration={500}
                  className="cursor-pointer hover:text-secondary transition-colors hover:shadow-glow-blue"
                >
                  {item}
                </ScrollLink>
              ))}
            </div>
            <div className="flex gap-4">
              <RouterLink to="/login" className="btn-primary hover:shadow-glow-strong transition-all duration-300">
                Login
              </RouterLink>
              <button className="btn-outline hover:shadow-glow-blue-strong transition-all duration-300">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="flex items-center mb-4">
                <RiSlackFill className="w-12 h-12 text-primary mr-4" />
                <span className="text-xl text-secondary">Marketing AI Agents for Slack</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-text bg-clip-text text-transparent">
                AI-Powered <span className="text-secondary">Marketing</span> Right in Slack
              </h1>
              <p className="text-xl text-text-muted mb-10">
                Transform your marketing workflow with our AI assistant. Create, schedule, and analyze content 
                for all social platforms directly from your Slack workspace.
              </p>
              <div className="flex gap-4">
                <button className="btn-primary flex items-center hover:shadow-glow-strong transition-all duration-300">
                  <RiSlackFill className="w-6 h-6 mr-2" />
                  Add to Slack
                </button>
                <button className="btn-outline hover:shadow-glow-blue-strong transition-all duration-300">
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative">
                {/* Main Slack Screenshot */}
                <div className="relative rounded-xl overflow-hidden shadow-xl">
                  <img 
                    src="https://cdn.sanity.io/images/599r6htc/localized/b0e7b3f1b97d54f7cff61084c29ab2e64a490c05-1600x1003.png?w=800&q=75&fit=max&auto=format"
                    alt="Slack Interface"
                    className="w-full rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/20 to-transparent"></div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -right-4 -bottom-4 w-64 bg-dark-lighter p-4 rounded-lg border border-dark-card shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center mb-3">
                    <RiRobot2Line className="w-6 h-6 text-primary mr-2" />
                    <span className="text-sm font-semibold">AI Assistant</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">Engagement</span>
                      <span className="text-primary font-semibold">150%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">Time Saved</span>
                      <span className="text-primary font-semibold">10h</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">Content</span>
                      <span className="text-primary font-semibold">3x</span>
                    </div>
                  </div>
                </div>

                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-48 bg-dark-lighter p-4 rounded-lg border border-dark-card shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center mb-3">
                    <RiSlackFill className="w-6 h-6 text-primary mr-2" />
                    <span className="text-sm font-semibold">Commands</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="bg-dark rounded-md px-3 py-1 text-text-muted">/post create</div>
                    <div className="bg-dark rounded-md px-3 py-1 text-text-muted">/schedule view</div>
                    <div className="bg-dark rounded-md px-3 py-1 text-text-muted">/analytics</div>
                  </div>
                </div>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-secondary/30 blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the component remains unchanged */}
      {/* Features Section */}
      <section id="features" className="py-20 bg-dark-lighter">
        {/* ... */}
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        {/* ... */}
      </section>

      {/* Integration Section */}
      <section id="integration" className="py-20 bg-dark-lighter">
        {/* ... */}
      </section>

      {/* Support Section */}
      <section id="support" className="py-20">
        {/* ... */}
      </section>

      {/* Footer */}
      <footer className="bg-dark-lighter py-20 border-t border-dark-card">
        {/* ... */}
      </footer>
    </div>
  );
}

export default LandingPage;
