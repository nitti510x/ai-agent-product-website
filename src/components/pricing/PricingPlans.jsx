import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiGlobe, FiBarChart2, FiUsers, FiHeadphones, FiCpu, 
         FiFileText, FiCode, FiLink, FiShield, FiUserCheck, FiStar, FiCheck, FiMail } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
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
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPlans = async () => {
      setLoading(true);
      const plansData = await fetchSubscriptionPlans();
      setPlans(plansData);
      
      // Filter out free and enterprise plans
      const filtered = plansData.filter(plan => 
        plan.name.toLowerCase() !== 'free' && 
        plan.name.toLowerCase() !== 'enterprise'
      );
      setFilteredPlans(filtered);
      
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
        {filteredPlans.map((plan) => (
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
              </div>
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                {plan.amount > 0 ? (
                  <>
                    <span className="price">${plan.amount === 0 ? "500" : formatPrice(plan.amount)}</span>
                    <span className="period">/{plan.interval}</span>
                  </>
                ) : (
                  <span className="price">Custom Pricing</span>
                )}
              </div>
              <p className="plan-description">{plan.description}</p>
            </div>
            
            <div className="plan-features">
              <h4>Features</h4>
              <ul>
                {plan.features && Object.entries(plan.features).map(([key, value]) => (
                  <li key={key}>
                    <FiCheck className="check-icon" />
                    {typeof value === 'object' ? (
                      <span>{key}: {JSON.stringify(value)}</span>
                    ) : (
                      <span>{key.toLowerCase().includes('token') || key.toLowerCase().includes('credit') ? 
                        <>{value} <IoDiamond className="inline text-primary" /> {key}</> : 
                        value}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            
            <button 
              onClick={() => handleSelectPlan(plan)} 
              className={`btn ${plan.name === 'Enterprise' ? 'btn-outline' : 'btn-primary'}`}
            >
              {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
            </button>
          </div>
        ))}
      </div>
      
      {/* Contact for custom plans */}
      <div className="enterprise-contact">
        <div className="enterprise-card">
          <div className="enterprise-header">
            <div className="enterprise-icon">
              <FiShield />
            </div>
            <h3>Need a Custom Solution?</h3>
            <p>Looking for Enterprise features or have specific requirements? Contact our team to discuss custom plans tailored to your needs.</p>
          </div>
          
          <a 
            href="mailto:sales@geniusos.co" 
            className="btn btn-outline enterprise-btn"
          >
            <FiMail className="mail-icon" />
            Contact Sales
          </a>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
