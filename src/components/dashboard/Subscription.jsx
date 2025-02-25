import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import CancellationModal from './CancellationModal';
import PlanChangeModal from './PlanChangeModal';

function Subscription() {
  const navigate = useNavigate();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isPlanChangeModalOpen, setIsPlanChangeModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const currentPlan = {
    name: 'Pro',
    price: '49',
    billingCycle: 'monthly',
    nextBilling: '2025-03-20',
  };

  const plans = [
    {
      name: "Starter",
      price: "29",
      features: [
        "Basic AI assistance",
        "Up to 10 channels",
        "Standard response time",
        "Email support"
      ]
    },
    {
      name: "Pro",
      price: "49",
      features: [
        "Advanced AI features",
        "Unlimited channels",
        "Priority AI processing",
        "24/7 support",
        "Custom integrations"
      ]
    },
    {
      name: "Enterprise",
      price: "99",
      features: [
        "Custom AI models",
        "Advanced security",
        "Dedicated AI resources",
        "SLA guarantee",
        "Dedicated account manager",
        "Custom training"
      ]
    }
  ];

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
    setIsPlanChangeModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/dashboard/profile')}
          className="flex items-center text-gray-400 hover:text-primary transition-colors mr-4"
        >
          <FiArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-100">Subscription Management</h1>
      </div>

      {/* Current Plan Info */}
      <div className="bg-dark-lighter p-6 rounded-xl border border-dark-card mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-100 mb-2">Current Plan: {currentPlan.name}</h2>
            <p className="text-gray-400">
              Billing cycle: {currentPlan.billingCycle}
              <br />
              Next billing date: {currentPlan.nextBilling}
            </p>
          </div>
          <button 
            onClick={() => setIsCancelModalOpen(true)}
            className="text-red-500 hover:text-red-400 transition-colors"
          >
            Cancel Subscription
          </button>
        </div>
      </div>

      {/* Available Plans */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`p-8 rounded-xl border transition-all duration-300 ${
              plan.name === currentPlan.name 
                ? 'bg-dark-lighter border-primary' 
                : 'bg-dark-lighter border-dark-card hover:border-secondary'
            }`}
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-100">{plan.name}</h3>
            <div className="text-4xl font-bold mb-6 text-gray-100">
              ${plan.price}<span className="text-text-muted text-lg">/mo</span>
            </div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-400">
                  <FiCheck className="text-primary mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            {plan.name === currentPlan.name ? (
              <button
                className="w-full px-6 py-2 rounded-lg bg-dark-card text-gray-400 cursor-not-allowed"
                disabled
              >
                Current Plan
              </button>
            ) : (
              <button
                className="w-full bg-primary hover:bg-primary-hover text-dark font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-glow"
                onClick={() => handlePlanChange(plan)}
              >
                {plan.price > currentPlan.price ? 'Upgrade' : 'Downgrade'}
              </button>
            )}
          </div>
        ))}
      </div>

      <CancellationModal 
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
      />

      <PlanChangeModal
        isOpen={isPlanChangeModalOpen}
        onClose={() => setIsPlanChangeModalOpen(false)}
        selectedPlan={selectedPlan}
        currentPlan={currentPlan}
      />
    </div>
  );
}

export default Subscription;
