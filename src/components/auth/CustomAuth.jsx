import { supabase } from '../../config/supabase';
import { useEffect, useState } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

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
        // Add name field for sign up
        setTimeout(addNameField, 100)
      } else {
        setView('sign_in')
        // Add sign in handler
        setTimeout(addSignInHandler, 100)
      }
    }

    // Function to add name field to sign up form
    const addNameField = () => {
      // Only proceed if we're on sign up view
      if (view !== 'sign_up') return
      
      // Check if name field already exists
      if (document.getElementById('name-field-container')) return
      
      // Get the email field container
      const emailContainer = document.querySelector('form > div:first-child')
      if (!emailContainer) return
      
      // Create name field container
      const nameContainer = document.createElement('div')
      nameContainer.id = 'name-field-container'
      nameContainer.style.marginBottom = '16px'
      
      // Create label
      const nameLabel = document.createElement('label')
      nameLabel.textContent = 'Name'
      nameLabel.style.display = 'block'
      nameLabel.style.color = '#94a3b8'
      nameLabel.style.fontSize = '14px'
      nameLabel.style.marginBottom = '4px'
      nameLabel.htmlFor = 'name-field'
      
      // Create input
      const nameInput = document.createElement('input')
      nameInput.id = 'name-field'
      nameInput.type = 'text'
      nameInput.placeholder = 'Your full name'
      nameInput.style.width = '100%'
      nameInput.style.padding = '12px 16px'
      nameInput.style.borderRadius = '12px'
      nameInput.style.backgroundColor = 'transparent'
      nameInput.style.border = '2px solid #2f3946'
      nameInput.style.color = 'white'
      nameInput.style.fontSize = '16px'
      
      // Append elements
      nameContainer.appendChild(nameLabel)
      nameContainer.appendChild(nameInput)
      
      // Insert before email container
      emailContainer.parentNode.insertBefore(nameContainer, emailContainer)
      
      // Find the form and add submit event listener
      const form = document.querySelector('form')
      if (form && !form.dataset.hasCustomListener) {
        form.dataset.hasCustomListener = 'true'
        form.addEventListener('submit', async (e) => {
          e.preventDefault()
          
          const nameValue = nameInput.value.trim()
          const emailValue = form.querySelector('input[type="email"]').value.trim()
          const passwordValue = form.querySelector('input[type="password"]').value.trim()
          
          if (!nameValue || !emailValue || !passwordValue) {
            return // Let the default validation handle this
          }
          
          try {
            // Sign up the user
            const { data, error } = await supabase.auth.signUp({
              email: emailValue,
              password: passwordValue,
              options: {
                data: {
                  full_name: nameValue
                }
              }
            })
            
            if (error) throw error
            
            // Redirect to dashboard on success
            if (data?.user) {
              window.location.href = '/dashboard'
            }
          } catch (error) {
            console.error('Error signing up:', error.message)
            // Display error message
            const errorDiv = document.createElement('div')
            errorDiv.textContent = error.message
            errorDiv.style.color = 'red'
            errorDiv.style.marginTop = '8px'
            form.appendChild(errorDiv)
          }
        })
      }
    }

    // Function to add sign in handler
    const addSignInHandler = () => {
      // Only proceed if we're on sign in view
      if (view !== 'sign_in') return
      
      // Find the form and add submit event listener
      const form = document.querySelector('form')
      if (form && !form.dataset.hasSignInListener) {
        form.dataset.hasSignInListener = 'true'
        form.addEventListener('submit', async (e) => {
          e.preventDefault()
          
          const emailValue = form.querySelector('input[type="email"]').value.trim()
          const passwordValue = form.querySelector('input[type="password"]').value.trim()
          
          if (!emailValue || !passwordValue) {
            return // Let the default validation handle this
          }
          
          try {
            console.log('Attempting to sign in with:', { email: emailValue });
            // Sign in the user
            const { data, error } = await supabase.auth.signInWithPassword({
              email: emailValue,
              password: passwordValue
            })
            
            console.log('Sign in response:', { data, error });
            
            if (error) throw error
            
            // Redirect to dashboard on success
            if (data?.user) {
              console.log('Sign in successful, redirecting to dashboard');
              window.location.href = '/dashboard'
            }
          } catch (error) {
            console.error('Error signing in:', error.message)
            // Display error message
            let errorDiv = document.querySelector('#auth-sign-in-error')
            if (!errorDiv) {
              errorDiv = document.createElement('div')
              errorDiv.id = 'auth-sign-in-error'
              errorDiv.style.color = 'red'
              errorDiv.style.marginTop = '8px'
              errorDiv.style.textAlign = 'center'
              form.appendChild(errorDiv)
            }
            errorDiv.textContent = error.message
          }
        })
      }
    }

    // Function to add reset password handler
    const addResetPasswordHandler = () => {
      // Only proceed if we're on forgot password view
      if (view !== 'forgot_password') return
      
      // Find the form and add submit event listener
      const form = document.querySelector('form')
      if (form && !form.dataset.hasResetPasswordListener) {
        form.dataset.hasResetPasswordListener = 'true'
        form.addEventListener('submit', async (e) => {
          e.preventDefault()
          
          const emailValue = form.querySelector('input[type="email"]').value.trim()
          
          if (!emailValue) {
            return // Let the default validation handle this
          }
          
          try {
            // Create a status message element
            let statusDiv = document.querySelector('#auth-reset-status')
            if (!statusDiv) {
              statusDiv = document.createElement('div')
              statusDiv.id = 'auth-reset-status'
              statusDiv.style.marginTop = '16px'
              statusDiv.style.padding = '12px'
              statusDiv.style.borderRadius = '8px'
              statusDiv.style.textAlign = 'center'
              form.appendChild(statusDiv)
            }
            
            statusDiv.textContent = 'Sending reset instructions...'
            statusDiv.style.backgroundColor = '#2f3946'
            statusDiv.style.color = 'white'
            
            console.log('Attempting to reset password for:', emailValue);
            
            // Send password reset email
            const { error } = await supabase.auth.resetPasswordForEmail(emailValue, {
              redirectTo: `${window.location.origin}/auth/reset-password`,
            })
            
            if (error) throw error
            
            // Show success message
            statusDiv.textContent = 'Password reset instructions sent to your email!'
            statusDiv.style.backgroundColor = 'rgba(50, 255, 159, 0.2)'
            statusDiv.style.color = '#32FF9F'
            
            // Disable the form
            const submitButton = form.querySelector('button[type="submit"]')
            if (submitButton) {
              submitButton.disabled = true
              submitButton.textContent = 'Email Sent'
              submitButton.style.opacity = '0.7'
            }
            
            // Add a button to go back to sign in
            const backButton = document.createElement('button')
            backButton.textContent = 'Back to Sign In'
            backButton.className = 'w-full flex items-center justify-center bg-[#2E2E2E] text-white py-3 px-4 rounded-xl mt-4 font-bold hover:bg-[#3d3d3d] transition-colors'
            backButton.onclick = () => {
              window.location.href = '/auth/sign-in'
            }
            form.appendChild(backButton)
            
          } catch (error) {
            console.error('Error resetting password:', error.message)
            
            // Display error message
            let errorDiv = document.querySelector('#auth-reset-error')
            if (!errorDiv) {
              errorDiv = document.createElement('div')
              errorDiv.id = 'auth-reset-error'
              errorDiv.style.color = 'red'
              errorDiv.style.marginTop = '16px'
              errorDiv.style.textAlign = 'center'
              form.appendChild(errorDiv)
            }
            errorDiv.textContent = error.message
          }
        })
      }
    }

    // Run the check initially
    checkForCurrentView()
    
    // Set up an interval to check periodically
    const intervalId = setInterval(() => {
      checkForCurrentView()
      
      // Add the appropriate handlers based on the current view
      if (view === 'sign_in') {
        addSignInHandler()
      } else if (view === 'sign_up') {
        addNameField()
      } else if (view === 'forgot_password') {
        addResetPasswordHandler()
      }
    }, 300)
    
    // Also check on clicks
    const handleClick = () => {
      setTimeout(() => {
        checkForCurrentView()
        
        // Add the appropriate handlers based on the current view
        if (view === 'sign_in') {
          addSignInHandler()
        } else if (view === 'sign_up') {
          addNameField()
        } else if (view === 'forgot_password') {
          addResetPasswordHandler()
        }
      }, 100)
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
                link_text: "Don't have an account? Sign up"
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
