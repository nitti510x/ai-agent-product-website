import React from 'react';
import { FiHelpCircle, FiMessageSquare, FiFileText, FiExternalLink } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';

function Help() {
  return (
    <div>
      {/* Page title */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Help & Support</h2>
          <p className="text-gray-400 text-sm mt-1">Get assistance with your AI assistants and token usage</p>
        </div>
      </div>

      {/* Help sections grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Documentation section */}
        <div className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6">
          <div className="flex items-center mb-4">
            <FiFileText className="text-emerald-400 w-6 h-6 mr-3" />
            <h3 className="text-lg font-semibold text-white">Documentation</h3>
          </div>
          <p className="text-gray-300 mb-4">
            Explore our comprehensive documentation to learn how to get the most out of your AI assistants and manage your tokens effectively.
          </p>
          <a 
            href="#" 
            className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View documentation <FiExternalLink className="ml-2" />
          </a>
        </div>

        {/* Contact support section */}
        <div className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6">
          <div className="flex items-center mb-4">
            <FiMessageSquare className="text-emerald-400 w-6 h-6 mr-3" />
            <h3 className="text-lg font-semibold text-white">Contact Support</h3>
          </div>
          <p className="text-gray-300 mb-4">
            Need personalized assistance? Our support team is ready to help you with any questions or issues you may encounter.
          </p>
          <a 
            href="mailto:support@geniusos.co" 
            className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Email support <FiExternalLink className="ml-2" />
          </a>
        </div>
      </div>

      {/* FAQ section */}
      <div className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6 mb-8">
        <div className="flex items-center mb-6">
          <FiHelpCircle className="text-emerald-400 w-6 h-6 mr-3" />
          <h3 className="text-lg font-semibold text-white">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-4">
          <div className="border-b border-gray-700 pb-4">
            <h4 className="text-white font-medium mb-2">What are tokens and how do they work?</h4>
            <p className="text-gray-300">
              Tokens (<IoDiamond className="inline mx-1" />) are the currency used to power your AI assistants. Each interaction with an AI assistant consumes tokens based on the complexity and length of the task. Your subscription plan includes a monthly allocation of tokens, and you can purchase additional token packs if needed.
            </p>
          </div>

          <div className="border-b border-gray-700 pb-4">
            <h4 className="text-white font-medium mb-2">How do I know when I'm running low on tokens?</h4>
            <p className="text-gray-300">
              Your token balance is always displayed in the top navigation bar. Additionally, you'll receive notifications when your token balance falls below certain thresholds. You can view detailed token usage in the Token Management section.
            </p>
          </div>

          <div className="border-b border-gray-700 pb-4">
            <h4 className="text-white font-medium mb-2">What's the difference between plan tokens and token packs?</h4>
            <p className="text-gray-300">
              Plan tokens are included with your subscription and reset at the end of each billing cycle. Token packs are additional tokens you purchase separately that don't expire with your billing cycle. The system automatically uses plan tokens first before using tokens from your purchased packs.
            </p>
          </div>

          <div className="border-b border-gray-700 pb-4">
            <h4 className="text-white font-medium mb-2">How do I upgrade my subscription?</h4>
            <p className="text-gray-300">
              You can upgrade your subscription at any time by visiting the Billing section. Choose from our available plans to find the one that best suits your needs. Your new plan will take effect immediately, and you'll be charged the prorated difference.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">Can I integrate the AI assistants with other tools?</h4>
            <p className="text-gray-300">
              Yes, our AI assistants are designed to integrate with popular platforms like Slack, WordPress, and social media. Each assistant has specific integration options available in their settings page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
