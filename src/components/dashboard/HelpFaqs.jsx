import React, { useState } from 'react';
import { FiHelpCircle, FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa6';
import PageHeader from './PageHeader';

function HelpFaqs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // FAQ categories and questions
  const faqCategories = [
    {
      id: 'general',
      name: 'General',
      faqs: [
        {
          id: 'what-is-geniusos',
          question: 'What is GeniusOS?',
          answer: 'GeniusOS is an AI assistant platform that helps businesses automate tasks, generate content, and provide customer support through customizable AI agents. Our platform uses advanced natural language processing to understand and respond to user requests in a human-like manner.'
        },
        {
          id: 'how-to-get-started',
          question: 'How do I get started with GeniusOS?',
          answer: "To get started, simply create an account, choose a subscription plan, and start configuring your AI assistants. You can customize each assistant's behavior, knowledge base, and integration options to suit your specific needs."
        }
      ]
    },
    {
      id: 'tokens',
      name: 'Tokens & Billing',
      faqs: [
        {
          id: 'what-are-tokens',
          question: 'What are tokens and how do they work?',
          answer: 'Tokens are the currency used to power your AI assistants. Each interaction with an AI assistant consumes tokens based on the complexity and length of the task. Your subscription plan includes a monthly allocation of tokens, and you can purchase additional token packs if needed.'
        },
        {
          id: 'token-balance',
          question: 'How do I know when I\'m running low on tokens?',
          answer: 'Your token balance is always displayed in the top navigation bar. Additionally, you\'ll receive notifications when your token balance falls below certain thresholds. You can view detailed token usage in the Token Management section.'
        },
        {
          id: 'token-types',
          question: 'What\'s the difference between plan tokens and token packs?',
          answer: 'Plan tokens are included with your subscription and reset at the end of each billing cycle. Token packs are additional tokens you purchase separately that don\'t expire with your billing cycle. The system automatically uses plan tokens first before using tokens from your purchased packs.'
        },
        {
          id: 'upgrade-subscription',
          question: 'How do I upgrade my subscription?',
          answer: 'You can upgrade your subscription at any time by visiting the Billing section. Choose from our available plans to find the one that best suits your needs. Your new plan will take effect immediately, and you\'ll be charged the prorated difference.'
        }
      ]
    },
    {
      id: 'assistants',
      name: 'AI Assistants',
      faqs: [
        {
          id: 'customize-assistant',
          question: 'How do I customize my AI assistant?',
          answer: 'You can customize your AI assistant by going to the AI Agents section and selecting the assistant you want to modify. From there, you can adjust its name, description, behavior, knowledge base, and integration settings. Changes take effect immediately.'
        },
        {
          id: 'assistant-integrations',
          question: 'Can I integrate the AI assistants with other tools?',
          answer: 'Yes, our AI assistants are designed to integrate with popular platforms like Slack, WordPress, and social media. Each assistant has specific integration options available in their settings page.'
        },
        {
          id: 'assistant-limit',
          question: 'How many AI assistants can I create?',
          answer: 'The number of AI assistants you can create depends on your subscription plan. Free plans typically allow 1-2 assistants, while premium plans offer more. You can view your current limits in the Subscription section.'
        }
      ]
    },
    {
      id: 'technical',
      name: 'Technical Support',
      faqs: [
        {
          id: 'data-security',
          question: 'How is my data secured?',
          answer: 'We take data security seriously. All data is encrypted both in transit and at rest. We use industry-standard security protocols and regularly perform security audits. Your data is never shared with third parties without your explicit consent.'
        },
        {
          id: 'api-access',
          question: 'Do you provide API access?',
          answer: 'Yes, we offer API access for Business and Enterprise plans. This allows you to integrate GeniusOS capabilities directly into your own applications and services. API documentation is available in the Developer section.'
        }
      ]
    }
  ];

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

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <div>
      <PageHeader 
        title="Frequently Asked Questions"
        description="Find answers to common questions about GeniusOS and its features"
      />

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs..."
            className="w-full bg-dark-card border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* FAQ Categories */}
      {filteredFaqs.length > 0 ? (
        filteredFaqs.map(category => (
          <div key={category.id} className="mb-8">
            {category.faqs.length > 0 && (
              <>
                <div className="flex items-center mb-4">
                  <FiHelpCircle className="text-emerald-400 w-6 h-6 mr-3" />
                  <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                </div>
                
                <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 overflow-hidden mb-6">
                  {category.faqs.map(faq => (
                    <div key={faq.id} className="border-b border-gray-700 last:border-b-0">
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-dark-card/50 transition-colors"
                      >
                        <span className="text-white font-bold">{faq.question}</span>
                        {expandedFaq === faq.id ? (
                          <FiChevronUp className="text-gray-400" />
                        ) : (
                          <FiChevronDown className="text-gray-400" />
                        )}
                      </button>
                      
                      {expandedFaq === faq.id && (
                        <div className="px-6 py-4 bg-dark-card/30 text-gray-400">
                          {faq.id === 'what-are-tokens' ? (
                            <p>
                              Tokens (<FaRobot className="inline mx-1" />) are the currency used to power your AI assistants. Each interaction with an AI assistant consumes tokens based on the complexity and length of the task. Your subscription plan includes a monthly allocation of tokens, and you can purchase additional token packs if needed.
                            </p>
                          ) : (
                            <p>{faq.answer}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-8 text-center">
          <FiHelpCircle className="text-gray-400 w-12 h-12 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
          <p className="text-gray-400">
            We couldn't find any FAQs matching your search. Try a different search term or browse the categories.
          </p>
        </div>
      )}

      {/* Still Need Help */}
      <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-700/30 rounded-2xl p-6 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Still Need Help?</h3>
        <p className="text-gray-400 mb-4">
          If you couldn't find an answer to your question, our support team is here to help.
        </p>
        <a 
          href="/dashboard/help/support" 
          className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
        >
          <FiHelpCircle className="mr-2" />
          Contact Support
        </a>
      </div>
    </div>
  );
}

export default HelpFaqs;
