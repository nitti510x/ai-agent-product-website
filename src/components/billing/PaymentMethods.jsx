import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiCreditCard, FiPlus, FiTrash2, FiAlertTriangle, FiCheck } from 'react-icons/fi';
import { supabase } from '../../config/supabase.js';
import { subscriptionService } from '../../config/postgres.js';

function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    name: '',
    isDefault: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }
        
        // Fetch payment methods from the subscription service
        const userPaymentMethods = await subscriptionService.getUserPaymentMethods(user.id);
        setPaymentMethods(userPaymentMethods || []);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        setError('Failed to load payment methods');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaymentMethods();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.cardNumber.trim()) {
      errors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      errors.cardNumber = 'Invalid card number';
    }
    
    if (!formData.expiryDate.trim()) {
      errors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      errors.expiryDate = 'Invalid format (MM/YY)';
    }
    
    if (!formData.cvc.trim()) {
      errors.cvc = 'CVC is required';
    } else if (!/^\d{3,4}$/.test(formData.cvc)) {
      errors.cvc = 'Invalid CVC';
    }
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Add payment method via subscription service
      await subscriptionService.addPaymentMethod(user.id, {
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        expiryDate: formData.expiryDate,
        cvc: formData.cvc,
        name: formData.name,
        isDefault: formData.isDefault
      });
      
      // Refresh payment methods
      const userPaymentMethods = await subscriptionService.getUserPaymentMethods(user.id);
      setPaymentMethods(userPaymentMethods || []);
      
      // Reset form
      setFormData({
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        name: '',
        isDefault: false
      });
      
      setShowAddForm(false);
      setSuccessMessage('Payment method added successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error adding payment method:', error);
      setError('Failed to add payment method: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (paymentMethodId) => {
    if (!window.confirm('Are you sure you want to remove this payment method?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Delete payment method via subscription service
      await subscriptionService.deletePaymentMethod(user.id, paymentMethodId);
      
      // Refresh payment methods
      const userPaymentMethods = await subscriptionService.getUserPaymentMethods(user.id);
      setPaymentMethods(userPaymentMethods || []);
      
      setSuccessMessage('Payment method removed successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error removing payment method:', error);
      setError('Failed to remove payment method: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (paymentMethodId) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Set default payment method via subscription service
      await subscriptionService.setDefaultPaymentMethod(user.id, paymentMethodId);
      
      // Refresh payment methods
      const userPaymentMethods = await subscriptionService.getUserPaymentMethods(user.id);
      setPaymentMethods(userPaymentMethods || []);
      
      setSuccessMessage('Default payment method updated');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error setting default payment method:', error);
      setError('Failed to update default payment method: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (number) => {
    return `•••• •••• •••• ${number.slice(-4)}`;
  };

  if (loading && paymentMethods.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center mb-8">
        <div className="bg-gradient-to-r from-[#32FF9F] to-[#2AC4FF] h-8 w-1 rounded-full mr-3"></div>
        <h1 className="text-3xl font-bold text-white">Payment Methods</h1>
      </div>

      {error && (
        <div className="mb-8 bg-red-900/20 border border-red-500/50 text-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <FiAlertTriangle className="mr-2" size={20} />
            <span>{error}</span>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-8 bg-green-900/20 border border-green-500/50 text-green-500 p-4 rounded-lg">
          <div className="flex items-center">
            <FiCheck className="mr-2" size={20} />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      <div className="bg-dark-card rounded-2xl shadow-2xl border border-dark-card/30 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Your Payment Methods</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-dark rounded-lg flex items-center transition-colors"
          >
            {showAddForm ? 'Cancel' : (
              <>
                <FiPlus className="mr-2" />
                Add Payment Method
              </>
            )}
          </button>
        </div>
        
        {showAddForm && (
          <div className="mb-8 bg-dark-lighter rounded-xl p-6 border border-dark-card/50">
            <h3 className="text-xl font-bold text-white mb-4">Add New Payment Method</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-400 mb-2" htmlFor="cardNumber">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className={`w-full bg-dark border ${formErrors.cardNumber ? 'border-red-500' : 'border-dark-card'} rounded-lg p-3 text-white focus:outline-none focus:border-primary`}
                  />
                  {formErrors.cardNumber && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.cardNumber}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-2" htmlFor="expiryDate">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className={`w-full bg-dark border ${formErrors.expiryDate ? 'border-red-500' : 'border-dark-card'} rounded-lg p-3 text-white focus:outline-none focus:border-primary`}
                    />
                    {formErrors.expiryDate && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.expiryDate}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 mb-2" htmlFor="cvc">
                      CVC
                    </label>
                    <input
                      type="text"
                      id="cvc"
                      name="cvc"
                      value={formData.cvc}
                      onChange={handleInputChange}
                      placeholder="123"
                      className={`w-full bg-dark border ${formErrors.cvc ? 'border-red-500' : 'border-dark-card'} rounded-lg p-3 text-white focus:outline-none focus:border-primary`}
                    />
                    {formErrors.cvc && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.cvc}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-2" htmlFor="name">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={`w-full bg-dark border ${formErrors.name ? 'border-red-500' : 'border-dark-card'} rounded-lg p-3 text-white focus:outline-none focus:border-primary`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 text-primary focus:ring-primary border-dark-card rounded"
                  />
                  <label className="text-gray-400" htmlFor="isDefault">
                    Set as default payment method
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-dark-lighter hover:bg-dark-card text-gray-400 rounded-lg mr-4 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-dark rounded-lg flex items-center transition-colors"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-dark mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiCreditCard className="mr-2" />
                      Add Payment Method
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {paymentMethods.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FiCreditCard className="mx-auto mb-4 h-12 w-12 opacity-30" />
            <p>No payment methods found.</p>
            <p className="mt-2">Add a payment method to make purchases and manage subscriptions.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div 
                key={method.id} 
                className={`p-4 rounded-xl ${method.isDefault ? 'bg-primary/10 border border-primary/30' : 'bg-dark-lighter border border-dark-card/50'}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-dark-card p-2 rounded-lg mr-4">
                      <FiCreditCard size={24} className={method.isDefault ? 'text-primary' : 'text-gray-400'} />
                    </div>
                    <div>
                      <div className="text-white font-semibold flex items-center">
                        {formatCardNumber(method.last4)}
                        {method.isDefault && (
                          <span className="ml-3 px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-gray-400 text-sm">
                        Expires {method.expMonth}/{method.expYear} • {method.brand}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        className="px-3 py-1.5 bg-dark-card hover:bg-dark text-gray-400 hover:text-primary rounded-lg text-sm transition-colors"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(method.id)}
                      className="p-2 bg-dark-card hover:bg-red-900/20 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentMethods;
