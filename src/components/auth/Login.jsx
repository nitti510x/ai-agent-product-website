import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSupabase } from '../../contexts/SupabaseContext';

function Login() {
  const { supabase } = useSupabase();

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="bg-dark-lighter p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
          Welcome to geniusOS AIForce
        </h2>
        {!import.meta.env.VITE_SUPABASE_URL ? (
          <div className="text-center text-gray-400">
            <p className="mb-4">Please connect to Supabase to enable authentication.</p>
            <p>Click the "Connect to Supabase" button in the top right corner to get started.</p>
          </div>
        ) : (
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#10B981',
                    brandAccent: '#059669',
                  }
                }
              }
            }}
            providers={['google', 'facebook', 'twitter', 'linkedin']}
            socialLayout="horizontal"
            theme="dark"
          />
        )}
      </div>
    </div>
  );
}

export default Login;