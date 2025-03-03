/**
 * Returns the appropriate API URL based on the environment
 * @returns {string} The API URL
 */
export const apiUrl = () => {
  // Check if we should use the local API
  const useLocalApi = import.meta.env.VITE_USE_LOCAL_API === 'true';
  
  // Use local API in development if specified
  if (useLocalApi) {
    return import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  }
  
  // Otherwise use Supabase Edge Functions
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    console.error('VITE_SUPABASE_URL is not defined in environment variables');
    return '';
  }
  
  // Convert Supabase URL to Edge Functions URL
  // Example: https://your-project.supabase.co -> https://your-project.functions.supabase.co
  const edgeFunctionsUrl = supabaseUrl
    .replace('supabase.co', 'functions.supabase.co')
    .replace('supabase.in', 'functions.supabase.co');
  
  return edgeFunctionsUrl;
};
