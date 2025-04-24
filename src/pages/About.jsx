import React from 'react';
import { FiCheck, FiUsers, FiCode, FiGlobe, FiMessageSquare } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

function About() {
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
          About echoAgents
        </h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
            <p className="text-text-muted mb-6">
              At echoAgents, we're on a mission to revolutionize marketing workflows by bringing AI-powered assistance directly into Slack. 
              We believe that marketing should be efficient, collaborative, and data-driven, and our platform makes that possible.
            </p>
            
            <h2 className="text-2xl font-bold mb-6">Why Choose Us</h2>
            <ul className="space-y-4">
              <li className="flex items-center">
                <FiCheck className="w-6 h-6 text-primary mr-3" />
                <span className="text-text-muted">AI-powered content creation</span>
              </li>
              <li className="flex items-center">
                <FiUsers className="w-6 h-6 text-primary mr-3" />
                <span className="text-text-muted">Team collaboration in Slack</span>
              </li>
              <li className="flex items-center">
                <FiCode className="w-6 h-6 text-primary mr-3" />
                <span className="text-text-muted">Advanced analytics and insights</span>
              </li>
              <li className="flex items-center">
                <FiGlobe className="w-6 h-6 text-primary mr-3" />
                <span className="text-text-muted">Multi-platform integration</span>
              </li>
              <li className="flex items-center">
                <FiMessageSquare className="w-6 h-6 text-primary mr-3" />
                <span className="text-text-muted">24/7 support and assistance</span>
              </li>
            </ul>
          </div>

          <div className="bg-dark-lighter p-8 rounded-xl border border-dark-card">
            <h2 className="text-2xl font-bold mb-6">Our Story</h2>
            <p className="text-text-muted mb-4">
              Founded in 2025, echoAgents was born out of the need for a more efficient marketing workflow. 
              Our team of AI experts and marketing professionals came together to create a solution that 
              would transform how teams work together on marketing projects.
            </p>
            <p className="text-text-muted">
              Today, we're proud to serve businesses of all sizes, helping them streamline their marketing 
              processes and achieve better results through AI-powered assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
