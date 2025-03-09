import React, { useState } from 'react';
import { FiMessageSquare, FiSend, FiPaperclip, FiInfo } from 'react-icons/fi';
import { IoDiamond } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';

function Support() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('normal');
  const [attachments, setAttachments] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would send the support request to the backend
    console.log({ subject, message, category, priority, attachments });
    setSubmitted(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const newAttachments = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Contact Support</h2>
          <p className="text-gray-400 text-sm mt-1">Get help from our support team</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Support form */}
        <div className="md:col-span-2">
          {!submitted ? (
            <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6">
              <div className="flex items-center mb-6">
                <FiMessageSquare className="text-primary mr-3 w-5 h-5" />
                <h3 className="text-lg font-semibold text-white">Submit a Support Request</h3>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="category" className="block text-white font-medium mb-2">Category</label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full bg-dark-card/70 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                    >
                      <option value="" disabled>Select a category</option>
                      <option value="billing">Billing & Subscription</option>
                      <option value="tokens">Token Management</option>
                      <option value="agents">AI Agents</option>
                      <option value="account">Account Issues</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-white font-medium mb-2">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      placeholder="Brief description of your issue"
                      className="w-full bg-dark-card/70 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block text-white font-medium mb-2">Priority</label>
                    <div className="flex space-x-4">
                      {['low', 'normal', 'high'].map((p) => (
                        <label key={p} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="priority"
                            value={p}
                            checked={priority === p}
                            onChange={() => setPriority(p)}
                            className="sr-only"
                          />
                          <span className={`w-4 h-4 mr-2 rounded-full border ${
                            priority === p 
                              ? 'border-primary bg-primary' 
                              : 'border-gray-500'
                          }`}></span>
                          <span className="text-gray-300 capitalize">{p}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-white font-medium mb-2">Message</label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      placeholder="Describe your issue in detail"
                      rows={6}
                      className="w-full bg-dark-card/70 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Attachments</label>
                    <div className="flex items-center">
                      <label className="cursor-pointer bg-dark-card/70 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 hover:border-primary transition-colors">
                        <FiPaperclip className="inline mr-2" />
                        Add Files
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <span className="text-gray-400 text-sm ml-4">Max 5 files, 10MB each</span>
                    </div>
                    
                    {attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-dark-card/70 border border-gray-700 rounded-lg px-4 py-2">
                            <div className="flex items-center">
                              <FiPaperclip className="text-gray-400 mr-2" />
                              <span className="text-gray-300">{file.name}</span>
                              <span className="text-gray-500 text-sm ml-2">
                                ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="text-gray-400 hover:text-red-400"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-primary hover:bg-primary/80 text-black font-medium px-6 py-2 rounded-lg transition-colors flex items-center"
                    >
                      <FiSend className="mr-2" />
                      Submit Request
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-primary/30 p-6 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMessageSquare className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Support Request Submitted</h3>
              <p className="text-gray-300 mb-6">
                Thank you for contacting us. We've received your support request and will get back to you as soon as possible.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-primary hover:bg-primary/80 text-black font-medium px-6 py-2 rounded-lg transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          )}
        </div>
        
        {/* Support info sidebar */}
        <div className="space-y-6">
          <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Support Hours</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>9:00 AM - 6:00 PM PST</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span>10:00 AM - 4:00 PM PST</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span>Closed</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Response times may vary based on request volume and priority.
            </p>
          </div>
          
          <div className="bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Other Ways to Get Help</h3>
            <ul className="space-y-4">
              <li>
                <a href="/dashboard/help" className="flex items-center text-gray-300 hover:text-primary transition-colors">
                  <FiInfo className="mr-2" />
                  <span>Check our Documentation</span>
                </a>
              </li>
              <li>
                <a href="/dashboard/help/faqs" className="flex items-center text-gray-300 hover:text-primary transition-colors">
                  <FiMessageSquare className="mr-2" />
                  <span>Browse our FAQs</span>
                </a>
              </li>
              <li>
                <a href="mailto:support@geniusos.co" className="flex items-center text-gray-300 hover:text-primary transition-colors">
                  <FiSend className="mr-2" />
                  <span>Email: support@geniusos.co</span>
                </a>
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-2xl shadow-2xl border border-primary/30 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Premium Support</h3>
            <p className="text-gray-300 mb-4">
              Get priority support with faster response times and dedicated support specialists.
            </p>
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-white">$99</span>
              <span className="text-gray-400 ml-2">/ month</span>
            </div>
            <button className="w-full bg-primary hover:bg-primary/80 text-black font-medium py-2 rounded-lg transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;
