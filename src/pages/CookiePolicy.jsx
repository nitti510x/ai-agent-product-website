import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

function CookiePolicy() {
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
          Cookie Policy
        </h1>

        <div className="max-w-3xl mx-auto">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">1. What Are Cookies?</h2>
            <p className="text-text-muted mb-4">
              Cookies are small text files that are stored on your device when you visit a website. 
              They help us provide you with a better experience while using our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">2. Types of Cookies We Use</h2>
            <p className="text-text-muted mb-4">
              We use different types of cookies for various purposes:
            </p>

            <h3 className="text-xl font-bold mt-4 mb-4">Essential Cookies</h3>
            <ul className="list-disc pl-6 text-text-muted mb-6">
              <li>These cookies are necessary for the website to function properly</li>
              <li>They enable basic features like page navigation and access to secure areas</li>
            </ul>

            <h3 className="text-xl font-bold mt-4 mb-4">Analytical Cookies</h3>
            <ul className="list-disc pl-6 text-text-muted mb-6">
              <li>These cookies help us understand how visitors interact with our website</li>
              <li>They provide insights that help us improve our services</li>
            </ul>

            <h3 className="text-xl font-bold mt-4 mb-4">Marketing Cookies</h3>
            <ul className="list-disc pl-6 text-text-muted mb-6">
              <li>These cookies are used to show relevant advertisements</li>
              <li>They help us deliver personalized content based on your interests</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">3. Managing Cookies</h2>
            <p className="text-text-muted mb-4">
              You can control cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul className="list-disc pl-6 text-text-muted mb-6">
              <li>View and delete cookies</li>
              <li>Block cookies from specific websites</li>
              <li>Set your browser to ask for permission before accepting cookies</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">4. Third Party Cookies</h2>
            <p className="text-text-muted mb-4">
              Our website may contain links to third-party websites that have their own cookie policies. 
              We encourage you to review their policies when you visit those sites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">5. Changes to This Policy</h2>
            <p className="text-text-muted mb-4">
              We may update this Cookie Policy from time to time. The most recent version will always be 
              available on our website. Your continued use of our services after any changes indicates 
              your acceptance of the updated policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default CookiePolicy;
