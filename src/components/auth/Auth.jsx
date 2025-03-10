import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../../config/supabase'
import { useEffect, useState, useRef } from 'react'
import SlackLogo from '../icons/SlackLogo'
import { useSubscription } from '../../contexts/SubscriptionContext'
import { useNavigate } from 'react-router-dom'

export default function AuthUI() {
  const [authView, setAuthView] = useState('sign_in')
  const observersEnabled = useRef(false)
  const { selectedPlan, isFreeTrialSelected } = useSubscription()
  const navigate = useNavigate()

  // Determine redirect URL based on plan selection
  const getRedirectUrl = () => {
    // Use auth/callback route for OAuth redirects
    return `${window.location.origin}/auth/callback`
  }

  // Check if we're in a safe context for observers and DOM manipulation
  useEffect(() => {
    try {
      // Test if we can safely use observers
      const testDiv = document.createElement('div')
      const testObserver = new MutationObserver(() => {})
      testObserver.observe(testDiv, { childList: true })
      testDiv.appendChild(document.createElement('span'))
      testObserver.disconnect()

      // If we got here, observers are safe to use
      observersEnabled.current = true
    } catch (e) {
      console.warn('MutationObserver not available in this context, using fallback polling')
      observersEnabled.current = false
    }
  }, [])

  // Track the current auth view using polling instead of MutationObserver
  useEffect(() => {
    // Skip in non-browser environments
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }

    const checkCurrentView = () => {
      try {
        // Check for sign-in form
        const signInForm = document.querySelector('[data-supabase-auth="sign-in"]')
        if (signInForm) {
          setAuthView('sign_in')
          return
        }

        // Check for sign-up form
        const signUpForm = document.querySelector('[data-supabase-auth="sign-up"]')
        if (signUpForm) {
          setAuthView('sign_up')
          return
        }

        // Check for forgot password form
        const forgotPasswordForm = document.querySelector('[data-supabase-auth="forgotten-password"]')
        if (forgotPasswordForm) {
          setAuthView('forgot_password')
          return
        }
      } catch (e) {
        console.warn('Error checking auth view:', e)
      }
    }

    // Initial check
    checkCurrentView()

    // Use polling as a safer alternative to MutationObserver
    const interval = setInterval(checkCurrentView, 500)

    return () => {
      clearInterval(interval)
    }
  }, [])

  // Fix Slack button text and add Slack logo using polling
  useEffect(() => {
    // Skip in non-browser environments
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }

    const fixSlackButton = () => {
      try {
        const buttons = document.querySelectorAll('button')
        buttons.forEach(button => {
          if (button.textContent.includes('Slack')) {
            // Only modify if we haven't already added our custom content
            if (!button.querySelector('.slack-logo-container')) {
              // Store original text
              const originalText = button.textContent.trim()

              // Clear the button's content
              button.innerHTML = ''

              // Create container for logo and text
              const container = document.createElement('div')
              container.className = 'slack-logo-container'
              container.style.display = 'flex'
              container.style.alignItems = 'center'
              container.style.justifyContent = 'center'
              container.style.gap = '8px'

              // Add Slack logo
              const logoContainer = document.createElement('div')
              logoContainer.style.width = '20px'
              logoContainer.style.height = '20px'
              logoContainer.innerHTML = SlackLogo()
              container.appendChild(logoContainer)

              // Add text
              const textSpan = document.createElement('span')
              textSpan.textContent = originalText
              container.appendChild(textSpan)

              // Add the container to the button
              button.appendChild(container)
            }
          }
        })
      } catch (e) {
        console.warn('Error fixing Slack button:', e)
      }
    }

    // Initial fix with delay to ensure DOM is loaded
    const initialTimer = setTimeout(fixSlackButton, 500)

    // Use polling as a safer alternative to MutationObserver
    const interval = setInterval(fixSlackButton, 1000)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [])

  // Direct DOM manipulation for forgot password page
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }

    const updateForgotPasswordHeader = () => {
      // Check if we're on the forgot password page by looking for the submit button text
      const resetButton = document.querySelector('button[type="submit"]')
      const emailInput = document.querySelector('input[type="email"]')
      const passwordInput = document.querySelector('input[type="password"]')

      if (resetButton && resetButton.textContent.includes('reset') && emailInput && !passwordInput) {
        // We're on the forgot password page, force update the header
        const headerTitle = document.querySelector('.text-4xl')
        const headerDesc = document.querySelector('.text-gray-400')

        if (headerTitle && headerDesc) {
          headerTitle.textContent = 'Reset Password'
          headerDesc.textContent = "We'll send you instructions to reset your password"
        }
      }
    }

    // Run the check after a short delay
    const timer1 = setTimeout(updateForgotPasswordHeader, 100)
    const timer2 = setTimeout(updateForgotPasswordHeader, 500)

    // Use polling as a safer alternative to MutationObserver
    const interval = setInterval(updateForgotPasswordHeader, 1000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearInterval(interval)
    }
  }, [])

  // Get the appropriate header and description based on the current view
  const getViewContent = () => {
    switch (authView) {
      case 'sign_up':
        return {
          title: 'Get Started',
          description: 'Create your account to access all features'
        }
      case 'forgot_password':
        return {
          title: 'Reset Password',
          description: "We'll send you instructions to reset your password"
        }
      case 'sign_in':
      default:
        return {
          title: 'Welcome Back',
          description: 'Sign in to continue to your dashboard'
        }
    }
  }

  const { title, description } = getViewContent()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark to-dark-lighter">
      <div className="max-w-md w-full p-8 bg-[#1A1E23] rounded-2xl shadow-2xl border border-dark-card/30 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#32FF9F] to-[#2AC4FF] text-transparent bg-clip-text">{title}</h2>
          <p className="text-gray-400 mt-2">{description}</p>
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
                background: '#2E2E2E',
                color: 'white',
                fontFamily: 'system-ui, sans-serif',
                fontSize: '16px',
                fontWeight: '700',
                height: '44px',
                borderRadius: '12px',
                "&:hover": {
                  background: '#3d3d3d',
                }
              },
              providers: {
                slack_oidc: {
                  button: {
                    backgroundColor: '#4A154B',
                    color: 'white',
                    "&:hover": {
                      backgroundColor: '#611f64',
                    }
                  },
                  iconButton: {
                    // Custom styling for Slack icon
                  }
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
                link_text: "Don't have an account? Sign up"
              },
              forgotten_password: {
                email_label: 'Email address',
                email_input_placeholder: 'Your email address',
                button_label: 'Send reset instructions',
                loading_button_label: 'Sending reset instructions...',
                link_text: 'Remembered your password? Sign in',
                confirmation_text: 'Check your email for the password reset link'
              }
            },
            translations: {
              en: {
                providers: {
                  slack_oidc: 'Slack'
                }
              }
            }
          }}
          theme="dark"
          providers={['slack_oidc', 'google']}
          socialLayout="vertical"
          redirectTo={getRedirectUrl()}
        />
      </div>
    </div>
  )
}