import React, { useState } from 'react';
import { FiMessageSquare, FiSend, FiUser, FiMail, FiHelpCircle } from 'react-icons/fi';
import PageHeader from './PageHeader';

function HelpSupport() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div>
      <PageHeader 
        title="Contact Support"
        description="Get help from our support team with any questions or issues you may have"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Contact Form */}
        <div className="md:col-span-2 bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6">
          <div className="flex items-center mb-6">
            <FiMessageSquare className="text-emerald-400 w-6 h-6 mr-3" />
            <h3 className="text-2xl font-bold text-white">Send a Message</h3>
          </div>
          
          {submitted ? (
            <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-6 text-center">
              <FiMessageSquare className="text-emerald-400 w-12 h-12 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Message Sent!</h4>
              <p className="text-gray-400 mb-4">
                Thank you for contacting us. We've received your message and will respond to you shortly.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2 font-bold">Your Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-dark border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 mb-2 font-bold">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-dark border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-gray-400 mb-2 font-bold">Subject</label>
                <div className="relative">
                  <FiHelpCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-dark border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="How can we help you?"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 mb-2 font-bold">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Please describe your issue or question in detail..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center justify-center w-full py-3 rounded-lg transition-colors ${
                  isSubmitting
                    ? 'bg-emerald-700/50 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                } text-white`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend className="mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
        
        {/* Contact Information */}
        <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6">
          <div className="flex items-center mb-6">
            <FiMessageSquare className="text-emerald-400 w-6 h-6 mr-3" />
            <h3 className="text-2xl font-bold text-white">Contact Info</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-bold mb-2">Email Support</h4>
              <p className="text-gray-400">
                <a href="mailto:support@geniusos.co" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  support@geniusos.co
                </a>
              </p>
              <p className="text-gray-400 mt-1">
                Response time: Within 24 hours
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-2">Business Hours</h4>
              <p className="text-gray-400">
                Monday - Friday: 9:00 AM - 6:00 PM PST
              </p>
              <p className="text-gray-400">
                Saturday - Sunday: Closed
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-2">Priority Support</h4>
              <p className="text-gray-400">
                Business and Enterprise plan customers receive priority support with faster response times.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpSupport;
