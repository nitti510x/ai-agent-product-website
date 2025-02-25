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

      {/* Features Section */}
      <section id="features" className="py-20 bg-dark-lighter">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-text bg-clip-text text-transparent">
            Marketing Power in Slack
          </h2>
          <p className="text-text-muted text-center mb-16 max-w-2xl mx-auto">
            Create, manage, and analyze your social media content without leaving Slack. Our AI assistant handles everything from content creation to performance tracking.
          </p>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="p-8 rounded-xl bg-dark border border-dark-card hover:border-primary transition-all duration-300 group">
              <div className="flex items-start mb-6">
                <div className="bg-gradient-primary bg-clip-text text-transparent transform group-hover:scale-110 transition-transform duration-300">
                  <RiFileTextLine className="w-12 h-12" />
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-100">Content Creation</h3>
                  <p className="text-text-muted">AI-powered content creation directly in Slack</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Multi-platform content",
                  "Brand voice matching",
                  "Viral potential analysis",
                  "Audience targeting",
                  "SEO optimization",
                  "Performance tracking"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center text-text-muted group-hover:text-text-light transition-colors">
                    <FiCheck className="text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-xl bg-dark border border-dark-card hover:border-primary transition-all duration-300 group">
              <div className="flex items-start mb-6">
                <div className="bg-gradient-primary bg-clip-text text-transparent transform group-hover:scale-110 transition-transform duration-300">
                  <RiMegaphoneLine className="w-12 h-12" />
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-100">Campaign Management</h3>
                  <p className="text-text-muted">Manage all your social campaigns from Slack</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Cross-platform posting",
                  "Campaign scheduling",
                  "ROI tracking",
                  "A/B testing",
                  "Audience insights",
                  "Performance analytics"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center text-text-muted group-hover:text-text-light transition-colors">
                    <FiCheck className="text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-xl bg-dark border border-dark-card hover:border-primary transition-all duration-300 group">
              <div className="flex items-start mb-6">
                <div className="bg-gradient-primary bg-clip-text text-transparent transform group-hover:scale-110 transition-transform duration-300">
                  <RiHashtag className="w-12 h-12" />
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-100">Marketing Analytics</h3>
                  <p className="text-text-muted">Real-time marketing insights in your Slack channels</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Engagement metrics",
                  "Trend analysis",
                  "Competitor tracking",
                  "Content performance",
                  "Audience growth",
                  "ROI reporting"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center text-text-muted group-hover:text-text-light transition-colors">
                    <FiCheck className="text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-text bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <p className="text-text-muted text-center mb-16 max-w-2xl mx-auto">
            Choose the perfect plan for your team. All plans include a 14-day free trial.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="p-8 rounded-xl border border-dark-card bg-dark hover:border-secondary transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-100">Starter</h3>
                <div className="text-4xl font-bold mb-2 bg-gradient-text bg-clip-text text-transparent">
                  $29<span className="text-lg text-text-muted">/mo</span>
                </div>
                <p className="text-text-muted">Perfect for small teams getting started with AI marketing</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "1 AI Marketing Assistant",
                  "3 Social Media Platforms",
                  "Basic Analytics",
                  "5 Team Members",
                  "Standard Support",
                  "1,000 AI Generations/mo"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-400">
                    <FiCheck className="text-primary mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full bg-dark-card hover:bg-dark-lighter text-gray-100 hover:shadow-glow-blue py-2 px-6 rounded-lg transition-all duration-300">
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-xl border border-primary bg-dark shadow-glow relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-dark px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-100">Pro</h3>
                <div className="text-4xl font-bold mb-2 bg-gradient-text bg-clip-text text-transparent">
                  $79<span className="text-lg text-text-muted">/mo</span>
                </div>
                <p className="text-text-muted">Ideal for growing businesses scaling their marketing</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "3 AI Marketing Assistants",
                  "All Social Platforms",
                  "Advanced Analytics",
                  "15 Team Members",
                  "Priority Support",
                  "5,000 AI Generations/mo",
                  "Custom Templates",
                  "API Access"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-400">
                    <FiCheck className="text-primary mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full bg-primary hover:bg-primary-hover text-dark hover:shadow-glow-strong py-2 px-6 rounded-lg transition-all duration-300">
                Get Started
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 rounded-xl border border-dark-card bg-dark hover:border-secondary transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-100">Enterprise</h3>
                <div className="text-4xl font-bold mb-2 bg-gradient-text bg-clip-text text-transparent">
                  Custom
                </div>
                <p className="text-text-muted">Custom solutions for large organizations</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited AI Assistants",
                  "All Social Platforms",
                  "Enterprise Analytics",
                  "Unlimited Team Members",
                  "24/7 Dedicated Support",
                  "Unlimited AI Generations",
                  "Custom Integration",
                  "SLA Guarantee"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-400">
                    <FiCheck className="text-primary mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full bg-dark-card hover:bg-dark-lighter text-gray-100 hover:shadow-glow-blue py-2 px-6 rounded-lg transition-all duration-300">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section id="integration" className="py-20 bg-dark-lighter">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-text bg-clip-text text-transparent">
            Multi-Platform Publishing
          </h2>
          <p className="text-text-muted text-center mb-16 max-w-2xl mx-auto">
            Create once in Slack, publish everywhere. Our AI adapts your content for each platform while maintaining your brand's voice.
          </p>

          {/* Slack Featured Card */}
          <div className="mb-8">
            <div className="bg-dark p-8 rounded-xl border border-primary hover:shadow-glow transition-all duration-300 group">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center mb-4">
                    <RiSlackFill className="w-12 h-12 text-primary" />
                    <h4 className="text-2xl font-bold ml-4 text-gray-100">Your Marketing Hub</h4>
                  </div>
                  <p className="text-text-muted mb-6">
                    Turn your Slack workspace into a powerful marketing command center. Create, schedule, and analyze 
                    content for all social platforms with simple Slack commands.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      "AI content creation",
                      "Multi-platform publishing",
                      "Campaign automation",
                      "Performance tracking",
                      "Team collaboration",
                      "Real-time analytics"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center text-text-muted group-hover:text-text-light transition-colors">
                        <FiCheck className="text-primary mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60" 
                    alt="Slack Integration"
                    className="w-full rounded-lg shadow-xl transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-50 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Platform Cards */}
          <div className="grid md:grid-cols-5 gap-8">
            {[
              {
                name: "Facebook",
                icon: <RiFacebookBoxFill className="w-16 h-16" />,
                features: [
                  "Viral content generation",
                  "Engagement analytics",
                  "Audience targeting",
                  "Campaign automation"
                ]
              },
              {
                name: "LinkedIn",
                icon: <RiLinkedinBoxFill className="w-16 h-16" />,
                features: [
                  "B2B content strategy",
                  "Lead generation",
                  "Industry insights",
                  "Professional networking"
                ]
              },
              {
                name: "X (Twitter)",
                icon: <RiTwitterXFill className="w-16 h-16" />,
                features: [
                  "Trend monitoring",
                  "Viral tweet creation",
                  "Audience growth",
                  "Real-time engagement"
                ]
              },
              {
                name: "Instagram",
                icon: <RiInstagramLine className="w-16 h-16" />,
                features: [
                  "Visual storytelling",
                  "Content curation",
                  "Growth strategies",
                  "Engagement boosting"
                ]
              },
              {
                name: "WordPress",
                icon: <RiWordpressFill className="w-16 h-16" />,
                features: [
                  "Blog automation",
                  "SEO optimization",
                  "Content scheduling",
                  "Analytics tracking"
                ]
              }
            ].map((platform, index) => (
              <div key={index} className="bg-dark p-6 rounded-xl border border-dark-card hover:border-primary transition-all duration-300 group">
                <div className="text-center mb-6">
                  <div className="flex justify-center items-center mb-4">
                    <div className="bg-gradient-primary bg-clip-text text-transparent transform group-hover:scale-110 transition-transform duration-300">
                      {platform.icon}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-gray-100">{platform.name}</h4>
                </div>
                <ul className="space-y-2">
                  {platform.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-text-muted group-hover:text-text-light transition-colors">
                      <FiCheck className="text-primary mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-text bg-clip-text text-transparent">
            We're Here to Help
          </h2>
          <p className="text-text-muted text-center mb-16 max-w-2xl mx-auto">
            Get the support you need, when you need it. Our team is available 24/7.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiMail className="w-12 h-12" />,
                title: "Email Support",
                description: "Get answers within 24 hours",
                action: "Contact Support"
              },
              {
                icon: <RiCustomerServiceFill className="w-12 h-12" />,
                title: "Live Chat",
                description: "Instant help during business hours",
                action: "Start Chat"
              },
              {
                icon: <FiGlobe className="w-12 h-12" />,
                title: "Knowledge Base",
                description: "Detailed guides and tutorials",
                action: "Browse Articles"
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="p-8 rounded-xl border border-dark-card hover:border-primary bg-dark-lighter transition-all duration-300 text-center group"
              >
                <div className="text-primary mb-6 flex justify-center">
                  <div className="bg-gradient-primary bg-clip-text text-transparent transform group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-100">{item.title}</h3>
                <p className="text-text-muted mb-6">{item.description}</p>
                <button className="btn-primary hover:shadow-glow-strong transition-all duration-300">
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-lighter py-20 border-t border-dark-card">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <Logo className="h-8 mb-6" />
              <p className="text-text-muted mb-6">
                Transform your marketing workflow with AI-powered assistance right in Slack.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-text-muted hover:text-secondary transition-colors">
                  <RiFacebookBoxFill className="w-6 h-6" />
                </a>
                <a href="#" className="text-text-muted hover:text-secondary transition-colors">
                  <RiTwitterXFill className="w-6 h-6" />
                </a>
                <a href="#" className="text-text-muted hover:text-secondary transition-colors">
                  <RiLinkedinBoxFill className="w-6 h-6" />
                </a>
                <a href="#" className="text-text-muted hover:text-secondary transition-colors">
                  <RiInstagramLine className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-100 mb-6">Product</h4>
              <ul className="space-y-4">
                {['Features', 'Pricing', 'Integrations', 'Enterprise', 'Security'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-text-muted hover:text-secondary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-100 mb-6">Resources</h4>
              <ul className="space-y-4">
                {['Documentation', 'API Reference', 'Guides', 'Case Studies', 'Blog'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-text-muted hover:text-secondary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-100 mb-6">Company</h4>
              <ul className="space-y-4">
                {['About', 'Careers', 'Contact', 'Privacy', 'Terms'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-text-muted hover:text-secondary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-dark-card mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-text-muted text-sm mb-4 md:mb-0">
              &copy; 2025 IntellAgents. All rights reserved.
            </p>
            <div className="flex space-x-8">
              <a href="#" className="text-text-muted hover:text-secondary transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-text-muted hover:text-secondary transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-text-muted hover:text-secondary transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;