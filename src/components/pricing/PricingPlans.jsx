import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiGlobe, FiBarChart2, FiUsers, FiHeadphones, FiCpu, 
         FiFileText, FiCode, FiLink, FiShield, FiUserCheck, FiStar, FiCheck, FiMail } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa6';
import { fetchSubscriptionPlans } from '../../utils/planUtils';
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
  feature: FiStar,
  credit: FaRobot,
  slack: FiCode,
  content: FiFileText,
  card: FiCheck
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
      console.log('Loaded plans:', plansData);
      setPlans(plansData);
      
      // Filter out free trial and enterprise plans
      const filtered = plansData.filter(plan => 
        !plan.name.toLowerCase().includes('free') && 
        !plan.name.toLowerCase().includes('enterprise')
      );
      console.log('Filtered plans:', filtered);
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
                {plan.name.toLowerCase().includes('starter') && <FiUser />}
                {plan.name === 'Pro' && <FiStar />}
                {plan.name === 'Business' && <FiUsers />}
              </div>
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                {plan.price > 0 ? (
                  <>
                    <span className="price">${plan.price}</span>
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
                {plan.features && Array.isArray(plan.features) && plan.features.map((feature, index) => (
                  <li key={index}>
                    {renderFeatureIcon(feature.icon)}
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <button 
              onClick={() => handleSelectPlan(plan)} 
              className={`btn ${plan.name.toLowerCase().includes('enterprise') ? 'btn-outline' : 'btn-primary'}`}
            >
              {plan.name.toLowerCase().includes('enterprise') ? 'Contact Sales' : 'Get Started'}
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
