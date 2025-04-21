import React from 'react';
import PageHeader from '../components/dashboard/PageHeader';

export default function Personalization() {
  return (
    <div>
      <PageHeader
        title={<span>Personalization <span role="img" aria-label="sparkles">✨</span></span>}
        description={
          <>
            This section lets you deeply personalize your GeniusOS experience:
            <ul className="list-disc text-gray-400 ml-6 mt-4 space-y-2 max-w-2xl">
              <li>
                <span className="font-semibold text-emerald-400">Import your main website sitemap</span> to enable GeniusOS to crawl your site and learn about your pages and structure.
              </li>
              <li>
                <span className="font-semibold text-emerald-400">Submit a separate product sitemap</span> so your product catalog can be indexed and leveraged by your AI agents.
              </li>
              <li>
                <span className="font-semibold text-emerald-400">Connect your social media accounts</span> (Facebook, Instagram, LinkedIn, Twitter/X, etc.) to aggregate post content and analytics. Each platform has a dedicated connect button below.
              </li>
              <li>
                <span className="font-semibold text-emerald-400">Update your Organization/Company Profile</span> to keep your company data current and accurate for all agents.
              </li>
            </ul>
          </>
        }
      />
      <div className="mt-10 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Website Sitemap Section */}
        <div className="bg-[#1A1E23] border border-gray-700/40 rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-semibold text-white mb-2">Website Sitemap</h2>
          <p className="text-gray-400 text-sm mb-4">Import your main sitemap.xml to let GeniusOS crawl your site.</p>
          <button className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-medium transition">Import Sitemap</button>
        </div>
        {/* Product Sitemap Section */}
        <div className="bg-[#1A1E23] border border-gray-700/40 rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-semibold text-white mb-2">Product Sitemap</h2>
          <p className="text-gray-400 text-sm mb-4">Submit a product-specific sitemap for your catalog.</p>
          <button className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-medium transition">Submit Product Sitemap</button>
        </div>
        {/* Organization/Company Profile Section */}
        <div className="bg-[#1A1E23] border border-gray-700/40 rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-semibold text-white mb-2">Organization/Company Profile</h2>
          <p className="text-gray-400 text-sm mb-4">Keep your company data up to date for all GeniusOS features and agents.</p>
          <a href="/dashboard/account/organization" className="inline-block px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white font-medium transition">Go to Organization Profile</a>
        </div>
      </div>
      {/* Social Media Aggregation Section */}
      <div className="mt-10 bg-[#1A1E23] border border-gray-700/40 rounded-xl p-6 shadow-md">
        <h2 className="text-lg font-semibold text-white mb-4">Social Media Aggregation</h2>
        <p className="text-gray-400 text-sm mb-6">Connect your accounts to aggregate posts and analytics from each platform.</p>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center px-4 py-2 rounded-lg bg-[#1877F3] hover:bg-[#145db2] text-white font-medium transition"><span className="mr-2">📘</span>Connect Facebook</button>
          <button className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-400 hover:via-red-400 hover:to-yellow-400 text-white font-medium transition"><span className="mr-2">📸</span>Connect Instagram</button>
          <button className="flex items-center px-4 py-2 rounded-lg bg-[#1DA1F2] hover:bg-[#0d8ddb] text-white font-medium transition"><span className="mr-2">🐦</span>Connect Twitter/X</button>
          <button className="flex items-center px-4 py-2 rounded-lg bg-[#0A66C2] hover:bg-[#084e8a] text-white font-medium transition"><span className="mr-2">💼</span>Connect LinkedIn</button>
        </div>
      </div>
    </div>
  );
}
