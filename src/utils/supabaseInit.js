import { createClient } from '@supabase/supabase-js';

// Create a memory-based storage that works in all contexts
class MemoryStorage {
  constructor() {
    this.store = new Map();
  }
  
  getItem(key) {
    return this.store.get(key) || null;
  }
  
  setItem(key, value) {
    this.store.set(key, value);
  }
  
  removeItem(key) {
    this.store.delete(key);
  }
}

// Create a storage solution that works in all contexts
const createStorageSolution = () => {
  // Default to memory storage
  let storage = new MemoryStorage();
  
  // Try to use localStorage if available
  if (typeof window !== 'undefined') {
    try {
      // Test if localStorage is available
      window.localStorage.setItem('supabase_test', 'test');
      window.localStorage.removeItem('supabase_test');
      
      // If we got here, localStorage is available
      storage = window.localStorage;
    } catch (e) {
      console.warn('localStorage not available, using memory storage instead');
    }
  }
  
  return storage;
};

// Initialize Supabase with the appropriate storage solution
const initializeSupabase = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or anonymous key is missing from environment variables');
    return null;
  }
  
  try {
    // Create Supabase client with our storage solution
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: createStorageSolution(),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    return null;
  }
};

// Initialize the Supabase client
const supabase = initializeSupabase();

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Export both default and named exports
export { supabase, isAuthenticated };
export default supabase;
