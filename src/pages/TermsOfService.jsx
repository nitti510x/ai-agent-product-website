import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

function TermsOfService() {
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
          Terms of Service
        </h1>

        <div className="max-w-3xl mx-auto">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">1. Acceptance of Terms</h2>
            <p className="text-text-muted mb-4">
              By accessing or using echoAgents services, you agree to be bound by these Terms of Service. 
              If you do not agree with any part of these terms, you must not use our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">2. Services Description</h2>
            <p className="text-text-muted mb-4">
              echoAgents provides AI-powered marketing assistance through Slack. Our services include content creation, 
              analytics, and team collaboration features.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 text-text-muted mb-6">
              <li>Maintain the security of your account credentials</li>
              <li>Use the services only for legitimate purposes</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Respect intellectual property rights</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">4. Intellectual Property</h2>
            <p className="text-text-muted mb-4">
              All content, trademarks, and intellectual property rights in our services belong to echoAgents or its licensors. 
              You may not use our intellectual property without explicit permission.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">5. Limitation of Liability</h2>
            <p className="text-text-muted mb-4">
              echoAgents is not liable for any indirect, incidental, or consequential damages arising from the use of our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">6. Changes to Terms</h2>
            <p className="text-text-muted mb-4">
              We may update these Terms of Service from time to time. The most recent version will always be 
              available on our website. Your continued use of our services after any changes indicates 
              your acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">7. Contact Us</h2>
            <p className="text-text-muted mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-text-muted">
              support@echoagents.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
