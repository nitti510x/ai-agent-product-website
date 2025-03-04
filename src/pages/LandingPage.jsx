import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
import { useSubscription } from '../contexts/SubscriptionContext';

function LandingPage() {
  const navItems = ['Features', 'Pricing', 'Integration', 'Support'];
  const navigate = useNavigate();
  const { selectPlan, selectFreeTrial } = useSubscription();

  // Function to handle plan selection and redirect to checkout
  const handlePlanSelection = (plan) => {
    selectPlan({
      name: plan.name,
      price: plan.price,
      interval: plan.interval || 'month',
      features: plan.features
    });
    navigate('/checkout');
  };

  // Function to handle free trial selection
  const handleFreeTrialSelection = () => {
    selectFreeTrial();
    navigate('/checkout');
  };

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
              <a 
                href="https://slack.com/oauth/v2/authorize?client_id=8454604752182.8465324270118&scope=app_mentions:read,channels:history,chat:write,files:write,im:history,im:write,im:read&user_scope=identity.basic,identity.email,identity.team" 
                className="flex items-center"
              >
                <img 
                  alt="Add to Slack" 
                  height="40" 
                  width="139" 
                  src="https://platform.slack-edge.com/img/add_to_slack.png" 
                  srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" 
                />
              </a>
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
                <span className="text-xl text-secondary">AI Agents for Marketing in Slack</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-text bg-clip-text text-transparent">
                AI-Powered <span className="text-secondary">Marketing</span> Right in Slack
              </h1>
              <p className="text-xl text-text-muted mb-10">
                Transform your marketing workflow with our AI assistant. Create, schedule, and analyze content 
                for all social platforms directly from your Slack workspace.
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://slack.com/oauth/v2/authorize?client_id=8454604752182.8465324270118&scope=app_mentions:read,channels:history,chat:write,files:write,im:history,im:write,im:read&user_scope=identity.basic,identity.email,identity.team" 
                  className="flex items-center"
                >
                  <img 
                    alt="Add to Slack" 
                    height="40" 
                    width="139" 
                    src="https://platform.slack-edge.com/img/add_to_slack.png" 
                    srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" 
                  />
                </a>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
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
            <div className="p-8 rounded-xl bg-dark border border-dark-card hover:border-secondary transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-primary/30 to-transparent rounded-br-3xl z-0"></div>
              <div className="absolute top-4 left-4 text-lg z-10">📝</div>
              <div className="flex items-start mb-6">
                <div className="bg-gradient-primary bg-clip-text text-transparent transform hover:scale-110 transition-transform duration-300">
                  <RiFileTextLine className="w-12 h-12" />
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-100">Content Creation</h3>
                  <p className="text-text-muted">AI-powered content creation directly in Slack</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "✨", text: "Multi-platform content" },
                  { icon: "🤖", text: "Brand voice matching" },
                  { icon: "💬", text: "Viral potential analysis" },
                  { icon: "📝", text: "Audience targeting" },
                  { icon: "📱", text: "SEO optimization" },
                  { icon: "💳", text: "Performance tracking" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center text-text-muted hover:text-text-light transition-colors">
                    <div className="bg-primary/20 p-1.5 rounded-full mr-3 min-w-[36px] flex items-center justify-center">
                      <span className="text-lg">{feature.icon}</span>
                    </div>
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-xl bg-dark border border-dark-card hover:border-secondary transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-secondary/20 to-transparent rounded-br-3xl z-0"></div>
              <div className="absolute top-4 left-4 text-lg z-10">📱</div>
              <div className="flex items-start mb-6">
                <div className="bg-gradient-primary bg-clip-text text-transparent transform hover:scale-110 transition-transform duration-300">
                  <RiMegaphoneLine className="w-12 h-12" />
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-100">Campaign Management</h3>
                  <p className="text-text-muted">Manage all your social campaigns from Slack</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "✨", text: "Cross-platform posting" },
                  { icon: "🤖", text: "Campaign scheduling" },
                  { icon: "💬", text: "ROI tracking" },
                  { icon: "📝", text: "A/B testing" },
                  { icon: "📱", text: "Audience insights" },
                  { icon: "💳", text: "Performance analytics" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center text-text-muted hover:text-text-light transition-colors">
                    <div className="bg-primary/20 p-1.5 rounded-full mr-3 min-w-[36px] flex items-center justify-center">
                      <span className="text-lg">{feature.icon}</span>
                    </div>
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-xl bg-dark border border-dark-card hover:border-secondary transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-br-3xl z-0"></div>
              <div className="absolute top-4 left-4 text-lg z-10">📊</div>
              <div className="flex items-start mb-6">
                <div className="bg-gradient-primary bg-clip-text text-transparent transform hover:scale-110 transition-transform duration-300">
                  <RiHashtag className="w-12 h-12" />
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-100">Marketing Analytics</h3>
                  <p className="text-text-muted">Real-time marketing insights in your Slack channels</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "✨", text: "Engagement metrics" },
                  { icon: "🤖", text: "Trend analysis" },
                  { icon: "💬", text: "Competitor tracking" },
                  { icon: "📝", text: "Content performance" },
                  { icon: "📱", text: "Audience growth" },
                  { icon: "💳", text: "ROI reporting" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center text-text-muted hover:text-text-light transition-colors">
                    <div className="bg-primary/20 p-1.5 rounded-full mr-3 min-w-[36px] flex items-center justify-center">
                      <span className="text-lg">{feature.icon}</span>
                    </div>
                    <span>{feature.text}</span>
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
          <div className="text-center mb-12">
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              Choose the perfect plan for your team. Select the option that best fits your needs and start transforming your social media strategy today.
            </p>
          </div>

          {/* Free Trial Section */}
          <div className="mb-12 max-w-3xl mx-auto p-8 rounded-xl border-2 border-primary bg-dark shadow-glow-strong relative overflow-visible mt-8">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-dark px-6 py-1 rounded-full text-sm font-bold z-20">
              Limited Time Offer
            </div>
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary/10 rounded-full blur-xl"></div>
            <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-primary/10 rounded-full blur-xl"></div>
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-primary/30 to-transparent rounded-br-3xl z-0"></div>
            <div className="absolute top-4 left-4 text-xl z-10">✨</div>
            <div className="text-center mb-8 relative z-10">
              <h3 className="text-3xl font-bold mb-2 bg-gradient-text bg-clip-text text-transparent">Unleash Your AI Potential</h3>
              <div className="text-4xl font-bold mb-3 text-white flex items-center justify-center">
                <span className="mr-3">14-Day Free Trial</span>
                <span className="bg-primary text-dark text-sm px-3 py-1 rounded-full">No Credit Card</span>
              </div>
              <p className="text-text-muted text-lg">
                <span className="inline-block bg-dark-lighter px-3 py-1 rounded-lg mb-2">✨ Perfect for teams ready to revolutionize their social media strategy</span>
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-8 relative z-10">
              {[
                { icon: "✨", text: "50 credits (Enough for multiple posts)" },
                { icon: "🤖", text: "1 AI Agent (Link 1 social account)" },
                { icon: "💬", text: "Slack Access (For your workspace)" },
                { icon: "📝", text: "Content Generation AI Agents" },
                { icon: "📱", text: "Social Media AI Agents" },
                { icon: "💳", text: "No credit card required" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center text-gray-300 bg-dark-lighter p-3 rounded-lg hover:bg-dark-card transition-all duration-200">
                  <div className="bg-primary/20 p-1.5 rounded-full mr-3 min-w-[36px] flex items-center justify-center">
                    <span className="text-lg">{feature.icon}</span>
                  </div>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
            
            <button 
              onClick={handleFreeTrialSelection}
              className="w-full bg-primary hover:bg-primary-hover text-dark hover:shadow-glow-strong py-3 px-6 rounded-lg transition-all duration-300 font-bold text-lg relative z-10 flex items-center justify-center">
              <span>Start Your Free Trial</span>
              <span className="ml-2 bg-dark-lighter text-white text-xs px-2 py-1 rounded-full">Takes 30 Seconds</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Starter Plan */}
            <div className="p-8 rounded-xl border border-dark-card bg-dark hover:border-secondary transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-primary/30 to-transparent rounded-br-3xl z-0"></div>
              <div className="absolute top-4 left-4 text-lg z-10">🚀</div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-100">Starter</h3>
                <div className="text-4xl font-bold mb-2 bg-gradient-text bg-clip-text text-transparent">
                  $15<span className="text-lg text-text-muted">/mo</span>
                </div>
                <p className="text-text-muted">Perfect for small teams getting started with AI marketing</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  { icon: "✨", text: "1 AI Marketing Assistant" },
                  { icon: "🤖", text: "3 Social Media Platforms" },
                  { icon: "💬", text: "Basic Analytics" },
                  { icon: "📝", text: "5 Team Members" },
                  { icon: "📱", text: "Standard Support" },
                  { icon: "💳", text: "1,000 AI Generations/mo" }
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-400">
                    <div className="bg-primary/20 p-1.5 rounded-full mr-3 min-w-[36px] flex items-center justify-center">
                      <span className="text-lg">{feature.icon}</span>
                    </div>
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handlePlanSelection({
                  name: 'Starter',
                  price: 15,
                  features: [
                    "1 AI Marketing Assistant",
                    "3 Social Media Platforms",
                    "Basic Analytics",
                    "5 Team Members",
                    "Standard Support",
                    "1,000 AI Generations/mo"
                  ]
                })}
                className="w-full bg-dark-card hover:bg-dark-lighter text-gray-100 hover:shadow-glow-blue py-2 px-6 rounded-lg transition-all duration-300">
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-xl border border-primary bg-dark shadow-glow relative overflow-visible">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-dark px-4 py-1 rounded-full text-sm font-bold z-20 shadow-glow-sm">
                Most Popular
              </div>
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-secondary/30 to-transparent rounded-br-3xl z-0"></div>
              <div className="absolute top-4 left-4 text-lg z-10">⚡</div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-100">Pro</h3>
                <div className="text-4xl font-bold mb-2 bg-gradient-text bg-clip-text text-transparent">
                  $30<span className="text-lg text-text-muted">/mo</span>
                </div>
                <p className="text-text-muted">Ideal for growing businesses scaling their marketing</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  { icon: "✨", text: "3 AI Marketing Assistants" },
                  { icon: "🤖", text: "All Social Platforms" },
                  { icon: "💬", text: "Advanced Analytics" },
                  { icon: "📝", text: "15 Team Members" },
                  { icon: "📱", text: "Priority Support" },
                  { icon: "💳", text: "5,000 AI Generations/mo" },
                  { icon: "📈", text: "Custom Templates" },
                  { icon: "🔒", text: "API Access" }
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-400">
                    <div className="bg-primary/20 p-1.5 rounded-full mr-3 min-w-[36px] flex items-center justify-center">
                      <span className="text-lg">{feature.icon}</span>
                    </div>
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handlePlanSelection({
                  name: 'Pro',
                  price: 30,
                  features: [
                    "3 AI Marketing Assistants",
                    "All Social Platforms",
                    "Advanced Analytics",
                    "15 Team Members",
                    "Priority Support",
                    "5,000 AI Generations/mo",
                    "Custom Templates",
                    "API Access"
                  ]
                })}
                className="w-full bg-primary hover:bg-primary-hover text-dark hover:shadow-glow-strong py-2 px-6 rounded-lg transition-all duration-300">
                Get Started
              </button>
            </div>

            {/* Business Plan */}
            <div className="p-8 rounded-xl border border-dark-card bg-dark hover:border-secondary transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-500/30 to-transparent rounded-br-3xl z-0"></div>
              <div className="absolute top-4 left-4 text-lg z-10">💼</div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-100">Business</h3>
                <div className="text-4xl font-bold mb-2 bg-gradient-text bg-clip-text text-transparent">
                  $79<span className="text-lg text-text-muted">/mo</span>
                </div>
                <p className="text-text-muted">Custom solutions for large organizations</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  { icon: "✨", text: "Unlimited AI Assistants" },
                  { icon: "🤖", text: "All Social Platforms" },
                  { icon: "💬", text: "Enterprise Analytics" },
                  { icon: "📝", text: "Unlimited Team Members" },
                  { icon: "📱", text: "24/7 Dedicated Support" },
                  { icon: "💳", text: "Unlimited AI Generations" },
                  { icon: "📈", text: "Custom Integration" },
                  { icon: "🔒", text: "SLA Guarantee" }
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-400">
                    <div className="bg-primary/20 p-1.5 rounded-full mr-3 min-w-[36px] flex items-center justify-center">
                      <span className="text-lg">{feature.icon}</span>
                    </div>
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handlePlanSelection({
                  name: 'Business',
                  price: 79,
                  features: [
                    "Unlimited AI Assistants",
                    "All Social Platforms",
                    "Enterprise Analytics",
                    "Unlimited Team Members",
                    "24/7 Dedicated Support",
                    "Unlimited AI Generations",
                    "Custom Integration",
                    "SLA Guarantee"
                  ]
                })}
                className="w-full bg-dark-card hover:bg-dark-lighter text-gray-100 hover:shadow-glow-blue py-2 px-6 rounded-lg transition-all duration-300">
                Get Started
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 rounded-xl border border-dark-card bg-dark hover:border-secondary transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-purple-500/30 to-transparent rounded-br-3xl z-0"></div>
              <div className="absolute top-4 left-4 text-lg z-10">🏢</div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-100">Enterprise</h3>
                <div className="text-4xl font-bold mb-2 bg-gradient-text bg-clip-text text-transparent">
                  Custom Pricing
                </div>
                <p className="text-text-muted">Tailored solutions for large organizations with custom requirements</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  { icon: "✨", text: "Unlimited AI Assistants" },
                  { icon: "🤖", text: "All Social Platforms" },
                  { icon: "💬", text: "Enterprise Analytics" },
                  { icon: "📝", text: "Custom Integrations" },
                  { icon: "📱", text: "Dedicated Account Manager" },
                  { icon: "💳", text: "Unlimited AI Generations" },
                  { icon: "📈", text: "Priority Feature Access" },
                  { icon: "🔒", text: "Custom SLA" }
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-400">
                    <div className="bg-primary/20 p-1.5 rounded-full mr-3 min-w-[36px] flex items-center justify-center">
                      <span className="text-lg">{feature.icon}</span>
                    </div>
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => window.location.href = 'mailto:sales@geniusos.co?subject=Enterprise%20Plan%20Inquiry'}
                className="w-full bg-dark-card hover:bg-dark-lighter text-gray-100 hover:shadow-glow-blue py-2 px-6 rounded-lg transition-all duration-300">
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
                      { icon: "✨", text: "AI content creation" },
                      { icon: "🤖", text: "Multi-platform publishing" },
                      { icon: "💬", text: "Campaign automation" },
                      { icon: "📝", text: "Performance tracking" },
                      { icon: "📱", text: "Team collaboration" },
                      { icon: "💳", text: "Real-time analytics" }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center text-text-muted group-hover:text-text-light transition-colors">
                        <div className="bg-primary/20 p-1.5 rounded-full mr-3 min-w-[36px] flex items-center justify-center">
                          <span className="text-lg">{feature.icon}</span>
                        </div>
                        <span>{feature.text}</span>
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
                  { icon: "✨", text: "Viral content generation" },
                  { icon: "🤖", text: "Engagement analytics" },
                  { icon: "💬", text: "Audience targeting" },
                  { icon: "📝", text: "Campaign automation" }
                ]
              },
              {
                name: "LinkedIn",
                icon: <RiLinkedinBoxFill className="w-16 h-16" />,
                features: [
                  { icon: "✨", text: "B2B content strategy" },
                  { icon: "🤖", text: "Lead generation" },
                  { icon: "💬", text: "Industry insights" },
                  { icon: "📝", text: "Professional networking" }
                ]
              },
              {
                name: "X (Twitter)",
                icon: <RiTwitterXFill className="w-16 h-16" />,
                features: [
                  { icon: "✨", text: "Trend monitoring" },
                  { icon: "🤖", text: "Viral tweet creation" },
                  { icon: "💬", text: "Audience growth" },
                  { icon: "📝", text: "Real-time engagement" }
                ]
              },
              {
                name: "Instagram",
                icon: <RiInstagramLine className="w-16 h-16" />,
                features: [
                  { icon: "✨", text: "Visual storytelling" },
                  { icon: "🤖", text: "Content curation" },
                  { icon: "💬", text: "Growth strategies" },
                  { icon: "📝", text: "Engagement boosting" }
                ]
              },
              {
                name: "WordPress",
                icon: <RiWordpressFill className="w-16 h-16" />,
                features: [
                  { icon: "✨", text: "Blog automation" },
                  { icon: "🤖", text: "SEO optimization" },
                  { icon: "💬", text: "Content scheduling" },
                  { icon: "📝", text: "Analytics tracking" }
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
                      <div className="bg-primary/20 p-1.5 rounded-full mr-3 min-w-[36px] flex items-center justify-center">
                        <span className="text-lg">{feature.icon}</span>
                      </div>
                      <span>{feature.text}</span>
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
              &copy; 2025 IntelliAgents. All rights reserved.
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
