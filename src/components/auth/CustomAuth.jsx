import { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../../config/supabase'

export default function CustomAuth() {
  const [view, setView] = useState('sign_in')

  // Track the current auth view
  useEffect(() => {
    // Simple function to check if we're on the forgot password view or sign up view
    const checkForCurrentView = () => {
      // Look for the "Send reset password instructions" button
      const resetButton = Array.from(document.querySelectorAll('button')).find(
        button => button.textContent.includes('Send reset password instructions')
      )
      
      // Look for the "Sign up" button
      const signUpButton = Array.from(document.querySelectorAll('button')).find(
        button => button.textContent.includes('Sign up') && !button.textContent.includes("Don't have an account")
      )
      
      if (resetButton) {
        setView('forgot_password')
      } else if (signUpButton) {
        setView('sign_up')
      } else {
        setView('sign_in')
      }
    }

    // Run the check initially
    checkForCurrentView()
    
    // Set up an interval to check periodically
    const intervalId = setInterval(checkForCurrentView, 300)
    
    // Also check on clicks
    const handleClick = () => {
      setTimeout(checkForCurrentView, 100)
    }
    document.addEventListener('click', handleClick)
    
    return () => {
      clearInterval(intervalId)
      document.removeEventListener('click', handleClick)
    }
  }, [])

  const handleSlackLogin = () => {
    supabase.auth.signInWithOAuth({
      provider: 'slack_oidc',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
  }

  console.log('Current view:', view) // Debug log

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark to-dark-lighter">
      <div className="max-w-md w-full p-8 bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 backdrop-blur-sm">
        <div className="text-center mb-8">
          {view === 'forgot_password' ? (
            <>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-[#32FF9F] to-[#2AC4FF] text-transparent bg-clip-text">Reset Password</h2>
              <p className="text-gray-400 mt-2">Enter your email to receive reset instructions</p>
            </>
          ) : view === 'sign_up' ? (
            <>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-[#32FF9F] to-[#2AC4FF] text-transparent bg-clip-text">Get Started</h2>
              <p className="text-gray-400 mt-2">Create your account to get started</p>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-[#32FF9F] to-[#2AC4FF] text-transparent bg-clip-text">Welcome Back</h2>
              <p className="text-gray-400 mt-2">Sign in to continue to your dashboard</p>
            </>
          )}
        </div>
        
        {/* Custom Slack Button - show on both sign_in and sign_up views */}
        {(view === 'sign_in' || view === 'sign_up') && (
          <button 
            onClick={handleSlackLogin}
            className="w-full flex items-center justify-center gap-3 bg-[#2E2E2E] text-white py-3 px-4 rounded-xl mb-4 font-bold hover:bg-[#3d3d3d] transition-colors"
            id="slack-login-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet" alt="Slack Logo">
              <title>Slack Logo SVG</title>
              <path d="M22,12 a6,6 0 1 1 6,-6 v6z M22,16 a6,6 0 0 1 0,12 h-16 a6,6 0 1 1 0,-12" fill="#36C5F0"/>
              <path d="M48,22 a6,6 0 1 1 6,6 h-6z M32,6 a6,6 0 1 1 12,0v16a6,6 0 0 1 -12,0z" fill="#2EB67D"/>
              <path d="M38,48 a6,6 0 1 1 -6,6 v-6z M54,32 a6,6 0 0 1 0,12 h-16 a6,6 0 1 1 0,-12" fill="#ECB22E"/>
              <path d="M12,38 a6,6 0 1 1 -6,-6 h6z M16,38 a6,6 0 1 1 12,0v16a6,6 0 0 1 -12,0z" fill="#E01E5A"/>
            </svg>
            {view === 'sign_up' ? 'Sign up with Slack' : 'Continue with Slack'}
          </button>
        )}
        
        {/* Standard Auth UI for Google and Email/Password */}
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
                margin: '16px 0',
              },
              label: {
                color: '#94a3b8',
                fontSize: '14px',
                marginBottom: '4px',
              },
              input: {
                fontSize: '16px',
                color: 'white',
                marginBottom: '16px',
              },
              message: {
                fontSize: '14px',
                color: '#94a3b8',
                margin: '8px 0',
              },
              socialButtons: {
                gap: '12px',
                marginBottom: '16px',
              },
              socialButtonsProvider: {
                background: '#2E2E2E',
                color: 'white',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '16px',
                fontWeight: '700',
                height: '44px',
                borderRadius: '12px',
                marginBottom: '8px',
                "&:hover": {
                  background: '#3d3d3d',
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
              },
              sign_up: {
                email_label: 'Email address',
                password_label: 'Password',
                email_input_placeholder: 'name@example.com',
                password_input_placeholder: 'Your secure password',
                button_label: 'Sign up',
                loading_button_label: 'Signing up ...',
                social_provider_text: "Sign up with {{provider}}",
                link_text: "Already have an account? Sign in"
              }
            }
          }}
          theme="dark"
          providers={view === 'sign_up' ? ['google'] : ['google']}
          socialLayout="vertical"
          redirectTo={`${window.location.origin}/dashboard`}
          providerScopes={{
            slack_oidc: 'users:read'
          }}
          view={view === 'forgot_password' ? 'forgotten_password' : undefined}
          classNames={{
            container: 'auth-container',
            button: 'auth-button',
            divider: 'auth-divider',
            input: 'auth-input',
            label: 'auth-label',
            message: 'auth-message',
            anchor: 'auth-anchor',
            socialButtonsProviderContainer: 'auth-social-container'
          }}
        />
      </div>
    </div>
  )
}
