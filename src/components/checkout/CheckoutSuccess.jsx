import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FiCheck, FiMail, FiArrowRight, FiZap, FiStar, FiTrendingUp, FiLayers, FiSlack } from 'react-icons/fi';
import confetti from 'canvas-confetti';

const CheckoutSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, isFreeTrialSelected, planName } = location.state || {};
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Redirect if no email (user didn't come from checkout)
  useEffect(() => {
    if (!email) {
      navigate('/');
    }
  }, [email, navigate]);
  
  // Trigger confetti animation on load
  useEffect(() => {
    if (email) {
      // Trigger confetti
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      
      const randomInRange = (min, max) => Math.random() * (max - min) + min;
      
      const confettiAnimation = () => {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          setAnimationComplete(true);
          return;
        }
        
        // Launch confetti from both sides
        confetti({
          particleCount: 3,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { y: 0.6 },
          colors: ['#32FF9F', '#2AC4FF', '#FFFFFF'],
          disableForReducedMotion: true
        });
        
        confetti({
          particleCount: 3,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { y: 0.6, x: 1 },
          colors: ['#32FF9F', '#2AC4FF', '#FFFFFF'],
          disableForReducedMotion: true
        });
        
        requestAnimationFrame(confettiAnimation);
      };
      
      requestAnimationFrame(confettiAnimation);
    }
  }, [email]);
  
  if (!email) return null;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-dark-lighter py-12 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary/5 rounded-full filter blur-3xl animate-pulse" style={{animationDuration: '7s'}}></div>
      </div>
      
      {/* Sparkle elements */}
      <div className="absolute top-20 right-20 text-xl animate-bounce" style={{animationDuration: '3s'}}>✨</div>
      <div className="absolute bottom-20 left-20 text-xl animate-bounce" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}>✨</div>
      
      <div className="max-w-3xl mx-auto p-8 rounded-xl border-2 border-primary bg-dark shadow-glow relative z-10 overflow-hidden">
        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-primary/30 to-transparent rounded-br-3xl z-0"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-secondary/30 to-transparent rounded-tl-3xl z-0"></div>
        
        <div className="text-center mb-10 relative z-10">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-primary to-secondary mb-6 transition-all duration-1000 ${animationComplete ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
            <FiCheck className="text-dark w-12 h-12" />
          </div>
          
          <h1 className={`text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text transition-all duration-1000 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {isFreeTrialSelected ? 'Your Free Trial is Ready!' : 'Welcome to the Pro Experience!'}
          </h1>
          
          <p className={`text-gray-300 text-xl mb-6 max-w-xl mx-auto transition-all duration-1000 delay-300 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {isFreeTrialSelected 
              ? 'Your 14-day journey to AI-powered social media success starts now.' 
              : `Your ${planName} plan has been activated. Get ready to revolutionize your social media strategy!`
            }
          </p>
        </div>
        
        <div className={`bg-dark-card rounded-xl p-8 mb-8 border border-dark-card/50 transition-all duration-1000 delay-500 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="flex items-start">
            <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-full mr-5 flex-shrink-0">
              <FiMail className="text-dark w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white mb-3">Check Your Email</h3>
              <p className="text-gray-300 mb-4 text-lg">
                We've sent login instructions to <span className="text-white font-medium underline decoration-primary decoration-2">{email}</span>
              </p>
              <div className="bg-dark-lighter p-4 rounded-lg border border-dark-card mb-4">
                <h4 className="font-bold text-white mb-2 flex items-center">
                  <FiZap className="text-primary mr-2" /> What's included in your email:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start text-gray-300">
                    <div className="bg-primary/20 p-1 rounded-full mr-3 mt-0.5 flex-shrink-0">
                      <FiCheck className="text-primary w-3 h-3" />
                    </div>
                    <span>Your temporary password to log in</span>
                  </li>
                  <li className="flex items-start text-gray-300">
                    <div className="bg-primary/20 p-1 rounded-full mr-3 mt-0.5 flex-shrink-0">
                      <FiCheck className="text-primary w-3 h-3" />
                    </div>
                    <span>Quick start guide to set up your first AI agent</span>
                  </li>
                  <li className="flex items-start text-gray-300">
                    <div className="bg-primary/20 p-1 rounded-full mr-3 mt-0.5 flex-shrink-0">
                      <FiCheck className="text-primary w-3 h-3" />
                    </div>
                    <span>Instructions to connect your Slack workspace</span>
                  </li>
                </ul>
              </div>
              <p className="text-gray-400">
                Didn't receive the email? Check your spam folder or contact our support team at <a href="mailto:support@geniusos.co" className="text-secondary hover:underline">support@geniusos.co</a>
              </p>
            </div>
          </div>
        </div>
        
        <div className={`text-center transition-all duration-1000 delay-700 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <Link 
            to="/auth/sign-in" 
            className="inline-flex items-center justify-center bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-dark font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-glow text-lg"
          >
            Go to Login <FiArrowRight className="ml-2" />
          </Link>
          
          <p className="text-gray-400 mt-6">
            Need help getting started? Check out our <a href="#" className="text-secondary hover:underline">quick start guide</a>
          </p>
        </div>
      </div>
      
      <div className={`max-w-4xl mx-auto mt-12 grid md:grid-cols-3 gap-6 relative z-10 transition-all duration-1000 delay-1000 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="bg-dark-card p-6 rounded-xl border border-dark-card/50 transform transition-all duration-300 hover:scale-105 hover:border-primary/30">
          <div className="flex items-center mb-4">
            <div className="bg-primary/20 p-2 rounded-full mr-3">
              <FiSlack className="text-primary w-6 h-6" />
            </div>
            <h3 className="font-bold text-white">Connect Slack</h3>
          </div>
          <p className="text-gray-400">Integrate with your Slack workspace to start using AI agents directly in your conversations.</p>
        </div>
        
        <div className="bg-dark-card p-6 rounded-xl border border-dark-card/50 transform transition-all duration-300 hover:scale-105 hover:border-primary/30">
          <div className="flex items-center mb-4">
            <div className="bg-secondary/20 p-2 rounded-full mr-3">
              <FiLayers className="text-secondary w-6 h-6" />
            </div>
            <h3 className="font-bold text-white">Create Templates</h3>
          </div>
          <p className="text-gray-400">Set up custom templates for your most common social media content types.</p>
        </div>
        
        <div className="bg-dark-card p-6 rounded-xl border border-dark-card/50 transform transition-all duration-300 hover:scale-105 hover:border-primary/30">
          <div className="flex items-center mb-4">
            <div className="bg-primary/20 p-2 rounded-full mr-3">
              <FiTrendingUp className="text-primary w-6 h-6" />
            </div>
            <h3 className="font-bold text-white">Track Results</h3>
          </div>
          <p className="text-gray-400">Monitor the performance of your AI-generated content across all platforms.</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
