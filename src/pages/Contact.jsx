import React from 'react';
import { FiPhoneCall, FiMail, FiMapPin, FiClock } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

function Contact() {
  return (
    <div className="bg-dark text-text-light min-h-screen py-20">
      <div className="container mx-auto px-6">
        <RouterLink to="/" className="inline-flex items-center text-text-muted hover:text-secondary mb-8">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </RouterLink>
        
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-text bg-clip-text text-transparent">
          Contact Us
        </h1>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start">
              <FiPhoneCall className="w-8 h-8 text-primary mr-4" />
              <div>
                <h3 className="text-xl font-bold mb-2">Phone Support</h3>
                <p className="text-text-muted">+1 (555) 123-4567</p>
                <p className="text-text-muted">Available 24/7</p>
              </div>
            </div>

            <div className="flex items-start">
              <FiMail className="w-8 h-8 text-primary mr-4" />
              <div>
                <h3 className="text-xl font-bold mb-2">Email Support</h3>
                <p className="text-text-muted">support@mindboltai.com</p>
                <p className="text-text-muted">Response within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start">
              <FiMapPin className="w-8 h-8 text-primary mr-4" />
              <div>
                <h3 className="text-xl font-bold mb-2">Office Location</h3>
                <p className="text-text-muted">123 Digital Street</p>
                <p className="text-text-muted">San Francisco, CA 94105</p>
              </div>
            </div>

            <div className="flex items-start">
              <FiClock className="w-8 h-8 text-primary mr-4" />
              <div>
                <h3 className="text-xl font-bold mb-2">Business Hours</h3>
                <p className="text-text-muted">Monday - Friday: 9 AM - 6 PM PST</p>
                <p className="text-text-muted">Weekends: 10 AM - 4 PM PST</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-lighter p-8 rounded-xl border border-dark-card">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-dark-card bg-dark-lighter text-text-light focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-lg border border-dark-card bg-dark-lighter text-text-light focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg border border-dark-card bg-dark-lighter text-text-light focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                  placeholder="Your message"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-dark py-3 px-6 rounded-lg hover:bg-primary-hover transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
