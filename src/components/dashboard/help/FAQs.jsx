import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';

function FAQs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState({});

  // FAQ categories and questions
  const faqCategories = [
    {
      id: 'tokens',
      title: 'Tokens & Billing',
      faqs: [
        {
          id: 'tokens-1',
          question: 'What are tokens and how do they work?',
          answer: 'Tokens (<FaRobot className="inline mx-1" />) are the currency used to power your AI assistants. Each interaction with an AI assistant consumes tokens based on the complexity and length of the task. Your subscription plan includes a monthly allocation of tokens, and you can purchase additional token packs if needed.'
        },
        {
          id: 'tokens-2',
          question: 'How do I know when I\'m running low on tokens?',
          answer: 'Your token balance is always displayed in the top navigation bar. Additionally, you\'ll receive notifications when your token balance falls below certain thresholds. You can view detailed token usage in the Token Management section.'
        },
        {
          id: 'tokens-3',
          question: 'What\'s the difference between plan tokens and token packs?',
          answer: 'Plan tokens are included with your subscription and reset at the end of each billing cycle. Token packs are additional tokens you purchase separately that don\'t expire with your billing cycle. The system automatically uses plan tokens first before using tokens from your purchased packs.'
        },
        {
          id: 'tokens-4',
          question: 'How do I upgrade my subscription?',
          answer: 'You can upgrade your subscription at any time by visiting the Billing section. Choose from our available plans to find the one that best suits your needs. Your new plan will take effect immediately, and you\'ll be charged the prorated difference.'
        }
      ]
    },
    {
      id: 'agents',
      title: 'AI Agents',
      faqs: [
        {
          id: 'agents-1',
          question: 'What AI agents are available?',
          answer: 'We currently offer three AI agents: Slack App for team communication, Image Creator for generating images, and Copy Creator for writing content. Each agent has specific capabilities and token consumption rates.'
        },
        {
          id: 'agents-2',
          question: 'Can I integrate the AI assistants with other tools?',
          answer: 'Yes, our AI assistants are designed to integrate with popular platforms like Slack, WordPress, and social media. Each assistant has specific integration options available in their settings page.'
        },
        {
          id: 'agents-3',
          question: 'How do I customize an AI agent?',
          answer: 'Each AI agent has its own settings page where you can customize its behavior, output style, and integration preferences. Navigate to the specific agent in the dashboard and click on Settings to access these options.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account Management',
      faqs: [
        {
          id: 'account-1',
          question: 'How do I change my password?',
          answer: 'You can change your password in the Account > Security section. You\'ll need to enter your current password and then your new password twice to confirm the change.'
        },
        {
          id: 'account-2',
          question: 'Can I have multiple users on my account?',
          answer: 'Yes, depending on your subscription plan, you can add team members to your account. Each team member will have their own login credentials and permission levels that you can set.'
        },
        {
          id: 'account-3',
          question: 'How do I cancel my subscription?',
          answer: 'You can cancel your subscription in the Billing section. Please note that cancellation will take effect at the end of your current billing cycle, and you\'ll still have access to your account until then.'
        }
      ]
    }
  ];

  // Toggle FAQ expansion
  const toggleFaq = (faqId) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [faqId]: !prev[faqId]
    }));
  };

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery.trim() === '' 
    ? faqCategories 
    : faqCategories.map(category => ({
        ...category,
        faqs: category.faqs.filter(faq => 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.faqs.length > 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-sm mt-1">Find answers to common questions about our platform</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-4 mb-8">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-card/70 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* FAQ sections */}
      {filteredFaqs.map(category => (
        <div key={category.id} className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-6">{category.title}</h3>
          
          <div className="space-y-4">
            {category.faqs.map(faq => (
              <div key={faq.id} className="border-b border-gray-700 pb-4 last:border-b-0 last:pb-0">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="flex justify-between items-center w-full text-left"
                >
                  <h4 className="text-white font-medium">{faq.question}</h4>
                  {expandedFaqs[faq.id] ? (
                    <FiChevronUp className="text-gray-400" />
                  ) : (
                    <FiChevronDown className="text-gray-400" />
                  )}
                </button>
                
                {expandedFaqs[faq.id] && (
                  <div className="mt-2 text-gray-300">
                    <p dangerouslySetInnerHTML={{ __html: faq.answer.replace('<FaRobot className="inline mx-1" />', '💎') }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Can't find answer section */}
      <div className="bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-2xl shadow-2xl border border-primary/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Can't find what you're looking for?</h3>
        <p className="text-gray-300 mb-4">
          Our support team is ready to help you with any questions or issues you may have.
        </p>
        <a 
          href="/dashboard/help/support" 
          className="inline-flex items-center bg-primary hover:bg-primary/80 text-black font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}

export default FAQs;
