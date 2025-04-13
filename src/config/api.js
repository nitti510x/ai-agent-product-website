/**
 * Returns the appropriate API URL based on the environment
 * @returns {string} The API URL
 */
export const apiUrl = () => {
  // The official API endpoint should always be used
  // NEVER change this to a local endpoint in committed code
  return import.meta.env.VITE_AGENT_API_URL || 'https://db.api.geniusos.co';
};

/**
 * Returns the base URL for the application
 * @returns {string} The base URL
 */
export const baseUrl = () => {
  return import.meta.env.VITE_SITE_URL || 'https://opagents.geniusos.co';
};
