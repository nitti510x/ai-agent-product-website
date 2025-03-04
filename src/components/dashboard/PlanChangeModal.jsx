import React, { useState } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';

function PlanChangeModal({ isOpen, onClose, selectedPlan, currentPlan, action }) {
  const [step, setStep] = useState('confirmation'); // confirmation or success

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the plan change request to your backend
    setStep('success');
  };

  if (!isOpen) return null;

  const isUpgrade = selectedPlan.price > currentPlan.price;
  const priceDifference = Math.abs(selectedPlan.price - currentPlan.price);
  const prorateDays = 20; // This would be calculated based on billing cycle

  return (
    <div className="fixed inset-0 bg-dark/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-dark-lighter p-8 rounded-xl border border-dark-card w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-primary transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>

        {step === 'confirmation' ? (
          <>
            <h2 className="text-2xl font-bold text-gray-100 mb-6">
              {isUpgrade ? 'Upgrade to ' : 'Switch to '}{selectedPlan.name} Plan
            </h2>
            <div className="space-y-4 mb-6">
              <div className="bg-dark p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-100 mb-2">Plan Summary</h3>
                <div className="space-y-2 text-gray-400">
                  <p>New Plan: {selectedPlan.name}</p>
                  <p>Price: ${selectedPlan.price === "0.00" ? "500" : selectedPlan.price}/mo</p>
                  <p>Prorated Amount: ${((priceDifference / 30) * prorateDays).toFixed(2)}</p>
                </div>
              </div>
              
              <div className="bg-dark p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-100 mb-2">New Features</h3>
                <ul className="space-y-2">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-400">
                      <FiCheck className="text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-dark font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-glow"
              >
                Confirm {isUpgrade ? 'Upgrade' : 'Downgrade'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">
              {isUpgrade ? 'Upgrade' : 'Plan Change'} Successful!
            </h2>
            <p className="text-gray-400 mb-6">
              Your subscription has been updated to the {selectedPlan.name} plan.
              {isUpgrade 
                ? ' You now have access to all the new features!'
                : ' The changes will be reflected in your next billing cycle.'}
            </p>
            <button
              onClick={onClose}
              className="bg-primary hover:bg-primary-hover text-dark font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-glow"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlanChangeModal;