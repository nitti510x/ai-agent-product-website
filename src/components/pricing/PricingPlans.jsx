import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiGlobe, FiBarChart2, FiUsers, FiHeadphones, FiCpu, 
         FiFileText, FiCode, FiLink, FiShield, FiUserCheck, FiStar, FiCheck } from 'react-icons/fi';
import { fetchSubscriptionPlans, formatPrice } from '../../utils/planUtils';
import { useAuth } from '../../context/AuthContext';

// Map of icon names to React icon components
const iconComponents = {
  assistant: FiUser,
  social: FiGlobe,
  analytics: FiBarChart2,
  team: FiUsers,
  support: FiHeadphones,
  generation: FiCpu,
  template: FiFileText,
  api: FiCode,
  integration: FiLink,
  sla: FiShield,
  account: FiUserCheck,
  feature: FiStar
};

// Default icon if not found in the map
const DefaultIcon = FiCheck;

const PricingPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPlans = async () => {
      setLoading(true);
      const plansData = await fetchSubscriptionPlans();
      setPlans(plansData);
      setLoading(false);
    };

    loadPlans();
  }, []);

  const handleSelectPlan = (plan) => {
    if (!user) {
      // Redirect to sign up page if not logged in
      navigate('/signup', { state: { selectedPlan: plan.id } });
    } else {
      // Redirect to checkout page with the selected plan
      navigate('/checkout', { state: { selectedPlan: plan.id } });
    }
  };

  const renderFeatureIcon = (iconName) => {
    const IconComponent = iconComponents[iconName] || DefaultIcon;
    return <IconComponent className="feature-icon" />;
  };

  if (loading) {
    return <div className="loading">Loading pricing plans...</div>;
  }

  return (
    <div className="pricing-container">
      <div className="pricing-plans">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`pricing-card ${plan.name === 'Pro' ? 'popular' : ''}`}
          >
            {plan.name === 'Pro' && <div className="popular-tag">Most Popular</div>}
            
            <div className="plan-header">
              <div className="plan-icon">
                {plan.name === 'Starter' && <FiUser />}
                {plan.name === 'Pro' && <FiStar />}
                {plan.name === 'Business' && <FiUsers />}
                {plan.name === 'Enterprise' && <FiShield />}
              </div>
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                {plan.amount > 0 ? (
                  <>
                    <span className="price">{formatPrice(plan.amount)}</span>
                    <span className="period">/{plan.interval}</span>
                  </>
                ) : (
                  <span className="price">Custom Pricing</span>
                )}
              </div>
              <p className="plan-description">{plan.description}</p>
            </div>
            
            <div className="plan-features">
              {plan.features && plan.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  {renderFeatureIcon(feature.icon)}
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
            
            <div className="plan-action">
              <button 
                className={`btn ${plan.name === 'Enterprise' ? 'btn-outline' : 'btn-primary'}`}
                onClick={() => plan.name === 'Enterprise' 
                  ? window.location.href = 'mailto:sales@yourdomain.com?subject=Enterprise Plan Inquiry' 
                  : handleSelectPlan(plan)
                }
              >
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;
