import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

function PrivacyPolicy() {
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
          Privacy Policy
        </h1>

        <div className="max-w-3xl mx-auto">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">1. Information We Collect</h2>
            <p className="text-text-muted mb-4">
              We collect information that you provide directly to us, such as when you create an account, 
              use our services, or communicate with us. This information may include:
            </p>
            <ul className="list-disc pl-6 text-text-muted mb-6">
              <li>Basic account information (name, email)</li>
              <li>Payment information</li>
              <li>Marketing preferences</li>
              <li>Usage data of our services</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">2. How We Use Your Information</h2>
            <p className="text-text-muted mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-text-muted mb-6">
              <li>Provide and maintain our services</li>
              <li>Improve our services</li>
              <li>Send you important updates and notifications</li>
              <li>Process payments</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">3. Data Sharing</h2>
            <p className="text-text-muted mb-4">
              We do not sell or rent your personal information to third parties. We may share your information:
            </p>
            <ul className="list-disc pl-6 text-text-muted mb-6">
              <li>With service providers who help us operate our services</li>
              <li>As required by law</li>
              <li>With your consent</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">4. Your Rights</h2>
            <p className="text-text-muted mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-text-muted mb-6">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your information</li>
              <li>Object to processing of your information</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">5. Security</h2>
            <p className="text-text-muted mb-4">
              We implement security measures to protect your information from unauthorized access, alteration, 
              disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc pl-6 text-text-muted mb-6">
              <li>Data encryption</li>
              <li>Secure servers</li>
              <li>Access controls</li>
              <li>Regular security audits</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">6. Contact Us</h2>
            <p className="text-text-muted mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-text-muted">
              privacy@mindboltai.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
