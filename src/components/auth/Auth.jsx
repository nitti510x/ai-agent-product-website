import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../../config/supabase'
import { useEffect, useState } from 'react'
import SlackLogo from '../icons/SlackLogo'
import { useSubscription } from '../../contexts/SubscriptionContext'
import { useNavigate } from 'react-router-dom'

export default function AuthUI() {
  const [authView, setAuthView] = useState('sign_in')
  const { selectedPlan, isFreeTrialSelected } = useSubscription();
  const navigate = useNavigate();
  
  // Determine redirect URL based on plan selection
  const getRedirectUrl = () => {
    if (selectedPlan || isFreeTrialSelected) {
      return `${window.location.origin}/dashboard/billing`;
    }
    return `${window.location.origin}/dashboard`;
  };
  
  // Track the current auth view
  useEffect(() => {
    const checkCurrentView = () => {
      // Check for forgot password view - multiple ways to detect it
      const resetButton = document.querySelector('button[type="submit"]');
      const resetLink = document.querySelector('a');
      const emailInput = document.querySelector('input[type="email"]');
      const passwordInput = document.querySelector('input[type="password"]');
      const formTitle = document.querySelector('form p');
      
      // Most reliable check: if we have an email input but no password input, and the submit button mentions "reset"
      if (emailInput && !passwordInput && resetButton && 
          (resetButton.textContent.includes('reset') || resetButton.textContent.includes('Reset'))) {
        setAuthView('forgot_password');
        return;
      }
      
      // Alternative check: if the link mentions "Sign in" and we don't have a password field
      if (resetLink && resetLink.textContent.includes('Sign in') && 
          emailInput && !passwordInput) {
        setAuthView('forgot_password');
        return;
      }
      
      // Check for sign up view
      if (resetButton && resetButton.textContent.includes('Sign up')) {
        setAuthView('sign_up');
        return;
      }
      
      // Default to sign in
      setAuthView('sign_in');
    };
    
    // Initial check with a short delay to ensure DOM is loaded
    setTimeout(checkCurrentView, 100);
    
    // Additional check after a longer delay (for slower loading)
    setTimeout(checkCurrentView, 500);
    
    // Set up observer for view changes
    const observer = new MutationObserver(() => {
      // Run immediately for faster response
      checkCurrentView();
      // And again after a short delay to catch any animations or delayed renders
      setTimeout(checkCurrentView, 100);
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Add click event listeners to links that might change the view
    const handleLinkClick = () => {
      // Check view after a short delay to allow for view change
      setTimeout(checkCurrentView, 100);
      setTimeout(checkCurrentView, 300);
    };
    
    document.addEventListener('click', handleLinkClick);
    
    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  // Fix Slack button text and add Slack logo
  useEffect(() => {
    const fixSlackButton = () => {
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        // Fix Slack_oidc text
        if (button.textContent.includes('Slack_oidc')) {
          button.textContent = button.textContent.replace('Slack_oidc', 'Slack');
        }
        
        // Add Slack logo to Slack buttons
        if (button.textContent.includes('Slack') && !button.querySelector('svg')) {
          // Create the SVG element
          const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
          svgElement.setAttribute('viewBox', '0 0 60 60');
          svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
          svgElement.setAttribute('width', '20');
          svgElement.setAttribute('height', '20');
          svgElement.setAttribute('style', 'margin-right: 8px;');
          svgElement.setAttribute('alt', 'Slack Logo');
          
          // Create title
          const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
          titleElement.textContent = 'Slack Logo';
          svgElement.appendChild(titleElement);
          
          // Create paths
          const paths = [
            { d: 'M22,12 a6,6 0 1 1 6,-6 v6z M22,16 a6,6 0 0 1 0,12 h-16 a6,6 0 1 1 0,-12', fill: '#36C5F0' },
            { d: 'M48,22 a6,6 0 1 1 6,6 h-6z M32,6 a6,6 0 1 1 12,0v16a6,6 0 0 1 -12,0z', fill: '#2EB67D' },
            { d: 'M38,48 a6,6 0 1 1 -6,6 v-6z M54,32 a6,6 0 0 1 0,12 h-16 a6,6 0 1 1 0,-12', fill: '#ECB22E' },
            { d: 'M12,38 a6,6 0 1 1 -6,-6 h6z M16,38 a6,6 0 1 1 12,0v16a6,6 0 0 1 -12,0z', fill: '#E01E5A' }
          ];
          
          paths.forEach(pathData => {
            const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathElement.setAttribute('d', pathData.d);
            pathElement.setAttribute('fill', pathData.fill);
            svgElement.appendChild(pathElement);
          });
          
          // Insert SVG before the text
          const buttonText = button.textContent;
          button.textContent = '';
          button.appendChild(svgElement);
          const textNode = document.createTextNode(' ' + buttonText.trim());
          button.appendChild(textNode);
          
          // Center the content
          button.style.display = 'flex';
          button.style.alignItems = 'center';
          button.style.justifyContent = 'center';
        }
      });
    };

    // Run initially after a short delay to ensure buttons are rendered
    const initialTimer = setTimeout(fixSlackButton, 500);
    
    // Set up a mutation observer to catch dynamically added buttons
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        fixSlackButton();
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Clean up on unmount
    return () => {
      clearTimeout(initialTimer);
      observer.disconnect();
    };
  }, []);

  // Direct DOM manipulation for forgot password page
  useEffect(() => {
    const updateForgotPasswordHeader = () => {
      // Check if we're on the forgot password page by looking for the submit button text
      const resetButton = document.querySelector('button[type="submit"]');
      const emailInput = document.querySelector('input[type="email"]');
      const passwordInput = document.querySelector('input[type="password"]');
      
      if (resetButton && 
          resetButton.textContent.includes('reset') && 
          emailInput && 
          !passwordInput) {
        // We're on the forgot password page, force update the header
        const headerTitle = document.querySelector('.text-4xl');
        const headerDesc = document.querySelector('.text-gray-400');
        
        if (headerTitle && headerDesc) {
          headerTitle.textContent = 'Reset Password';
          headerDesc.textContent = "We'll send you instructions to reset your password";
        }
      }
    };
    
    // Run the check after a short delay
    const timer1 = setTimeout(updateForgotPasswordHeader, 100);
    const timer2 = setTimeout(updateForgotPasswordHeader, 500);
    
    // Set up observer for DOM changes
    const observer = new MutationObserver(() => {
      updateForgotPasswordHeader();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      observer.disconnect();
    };
  }, []);

  // Get the appropriate header and description based on the current view
  const getViewContent = () => {
    switch (authView) {
      case 'sign_up':
        return {
          title: 'Get Started',
          description: 'Create your account to access all features'
        };
      case 'forgot_password':
        return {
          title: 'Reset Password',
          description: "We'll send you instructions to reset your password"
        };
      case 'sign_in':
      default:
        return {
          title: 'Welcome Back',
          description: 'Sign in to continue to your dashboard'
        };
    }
  };

  const { title, description } = getViewContent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark to-dark-lighter">
      <div className="max-w-md w-full p-8 bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 backdrop-blur-sm">
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