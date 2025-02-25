import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../../config/supabase'

export default function AuthUI() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark to-dark-lighter">
      <div className="max-w-md w-full p-8 bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#32FF9F] to-[#2AC4FF] text-transparent bg-clip-text">Welcome Back</h2>
          <p className="text-gray-400 mt-2">Sign in to continue to your dashboard</p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brandButtonText: "black",
                  defaultButtonBackground: "#32FF9F",
                  defaultButtonBackgroundHover: "#2ce28f",
                  inputBackground: "transparent",
                  inputBorder: "#2f3946",
                  inputBorderHover: "#32FF9F",
                  inputBorderFocus: "#2AC4FF",
                },
                space: {
                  buttonPadding: "12px 16px",
                  inputPadding: "12px 16px",
                },
                borderWidths: {
                  buttonBorderWidth: "0",
                  inputBorderWidth: "2px",
                },
                radii: {
                  borderRadiusButton: "12px",
                  buttonBorderRadius: "12px",
                  inputBorderRadius: "12px",
                }
              }
            },
            style: {
              button: {
                fontSize: '16px',
                fontWeight: '600',
              },
              anchor: {
                color: '#2AC4FF',
                fontSize: '14px',
              },
              container: {
                gap: '16px',
              },
              divider: {
                backgroundColor: '#2f3946',
              },
              label: {
                color: '#94a3b8',
                fontSize: '14px',
              },
              input: {
                fontSize: '16px',
                color: 'white',
              },
              message: {
                fontSize: '14px',
                color: '#94a3b8',
              },
              socialButtons: {
                gap: '12px',
              },
              socialButtonsProvider: {
                background: 'white',
                color: 'black',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '16px',
                fontWeight: '500',
                height: '44px',
                borderRadius: '12px',
                "&:hover": {
                  background: '#f1f5f9',
                }
              }
            }
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email address',
                password_label: 'Password',
                email_input_placeholder: 'name@example.com',
                password_input_placeholder: 'Your secure password',
                button_label: 'Sign in',
                loading_button_label: 'Signing in ...',
                social_provider_text: "Continue with {{provider}}",
                link_text: "Already have an account? Sign in"
              }
            }
          }}
          theme="dark"
          providers={['google']}
          socialLayout="vertical"
          redirectTo={`${window.location.origin}/dashboard`}
        />
      </div>
    </div>
  )
}