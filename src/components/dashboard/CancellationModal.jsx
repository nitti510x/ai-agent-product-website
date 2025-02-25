import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

function CancellationModal({ isOpen, onClose }) {
  const [step, setStep] = useState('survey'); // survey or confirmation
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const reasons = [
    { id: 'alternative', label: 'Found a better solution for my needs' },
    { id: 'features', label: 'Need different features' },
    { id: 'not-helpful', label: 'Looking for different capabilities' },
    { id: 'expensive', label: 'Considering other pricing options' },
    { id: 'other', label: 'Other reason' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the cancellation reason to your backend
    setStep('confirmation');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-dark/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-dark-lighter p-8 rounded-xl border border-dark-card w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-primary transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>

        {step === 'survey' ? (
          <>
            <h2 className="text-2xl font-bold text-gray-100 mb-6">
              Help Us Improve
            </h2>
            <p className="text-gray-400 mb-6">
              We'd love to understand your needs better. What's the main reason for making a change?
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {reasons.map((option) => (
                <div key={option.id} className="flex items-center">
                  <input
                    type="radio"
                    id={option.id}
                    name="reason"
                    value={option.id}
                    checked={reason === option.id}
                    onChange={(e) => setReason(e.target.value)}
                    className="hidden"
                  />
                  <label
                    htmlFor={option.id}
                    className={`flex-1 p-3 rounded-lg border ${
                      reason === option.id
                        ? 'border-primary bg-primary/10 text-gray-100'
                        : 'border-dark-card text-gray-400'
                    } hover:border-primary transition-all duration-300 cursor-pointer`}
                  >
                    {option.label}
                  </label>
                </div>
              ))}

              {reason === 'other' && (
                <textarea
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  placeholder="Please share your thoughts..."
                  className="w-full bg-dark border border-dark-card rounded-lg px-4 py-2 text-gray-100 focus:border-primary focus:outline-none"
                  rows="3"
                />
              )}

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-dark font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-glow"
                disabled={!reason || (reason === 'other' && !otherReason)}
              >
                Submit Feedback
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">
              Thank You for Your Feedback
            </h2>
            <p className="text-gray-400 mb-6">
              We appreciate your input. Your subscription will remain active until the end of your current billing period.
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

export default CancellationModal;
