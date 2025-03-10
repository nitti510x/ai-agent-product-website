/**
 * Returns the appropriate API URL based on the environment
 * @returns {string} The API URL
 */
export const apiUrl = () => {
  // Check if we should use the local API
  const useLocalApi = import.meta.env.VITE_USE_LOCAL_API === 'true';
  
  // Use Supabase Edge Functions by default
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    console.error('VITE_SUPABASE_URL is not defined in environment variables');
    return '';
  }
  
  // If using local API is explicitly enabled (development only), use the external API URL
  if (useLocalApi) {
    // Always use the external API URL in production
    return 'https://agent.ops.geniusos.co/api';
  }
  
  // Convert Supabase URL to Edge Functions URL
  // Format: https://<project_ref>.supabase.co -> https://<project_ref>.supabase.co/functions/v1
  return `${supabaseUrl}/functions/v1`;
};
