import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWJzZHF0YmJuZnNwamxmdGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM1ODI0NTcsImV4cCI6MjAwOTE1ODQ1N30.mock-key'

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Add a flag to check if we're using mock credentials
export const isUsingMockSupabase = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY