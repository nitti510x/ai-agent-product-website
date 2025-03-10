// Debug helper for Supabase authentication
export const debugSupabaseAuth = () => {
  console.log('Debugging Supabase Authentication');
  
  // Log environment variables (safe ones only)
  console.log('Environment:', {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    siteUrl: import.meta.env.VITE_SITE_URL
  });
  
  // Test fetch to Supabase
  console.log('Testing fetch to Supabase...');
  fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/user`, {
    headers: {
      'Content-Type': 'application/json',
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
    }
  })
    .then(response => {
      console.log('Supabase response status:', response.status);
      return response.text();
    })
    .then(text => {
      console.log('Supabase response:', text);
    })
    .catch(error => {
      console.error('Supabase fetch error:', error);
    });
    
  // Check localStorage access
  try {
    localStorage.setItem('supabase_test', 'test');
    console.log('localStorage test:', localStorage.getItem('supabase_test'));
    localStorage.removeItem('supabase_test');
  } catch (error) {
    console.error('localStorage access error:', error);
  }
  
  // Return helpful message
  return 'Check browser console for debug information';
};
