import React, { useState } from 'react';
import { useAuth } from './AuthProvider.js';

const AuthForm = () => {
  const { signUp, signIn, loading, verifyBetaInvite, useBetaInvite } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin', 'signup', 'invite'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    displayName: '',
    inviteCode: ''
  });
  const [errors, setErrors] = useState({});
  const [inviteVerified, setInviteVerified] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (mode === 'signup' && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Signup specific validations
    if (mode === 'signup') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.username) {
        newErrors.username = 'Username is required';
      } else if (!/^[A-Za-z0-9_]{3,24}$/.test(formData.username)) {
        newErrors.username = 'Username must be 3-24 characters, alphanumeric and underscore only';
      }

      if (!formData.displayName) {
        newErrors.displayName = 'Display name is required';
      }

      if (!inviteVerified) {
        newErrors.inviteCode = 'Valid beta invite code required';
      }
    }

    // Invite verification
    if (mode === 'invite') {
      if (!formData.inviteCode) {
        newErrors.inviteCode = 'Invite code is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInviteVerification = async (e) => {
    e.preventDefault();
    
    if (!formData.inviteCode) {
      setErrors({ inviteCode: 'Please enter an invite code' });
      return;
    }

    try {
      const result = await verifyBetaInvite(formData.inviteCode);
      
      if (result.valid) {
        setInviteVerified(true);
        setMode('signup');
        setErrors({});
      } else {
        setErrors({ inviteCode: result.error });
      }
    } catch (error) {
      setErrors({ inviteCode: 'Error verifying invite code' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      let result;
      
      if (mode === 'signin') {
        result = await signIn(formData.email, formData.password);
      } else if (mode === 'signup') {
        // Use the beta invite first
        const inviteResult = await useBetaInvite(formData.inviteCode);
        if (!inviteResult.success) {
          setErrors({ inviteCode: 'Failed to use invite code' });
          return;
        }

        result = await signUp(
          formData.email,
          formData.password,
          formData.username,
          formData.displayName
        );
      }

      if (result?.error) {
        setErrors({ submit: result.error.message });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
    }
  };

  const inputClasses = `
    w-full px-4 py-3 rounded-lg border-2 border-gray-300 
    bg-white/80 backdrop-blur-sm
    focus:border-blue-500 focus:bg-white focus:outline-none
    transition-all duration-200
    placeholder-gray-500
  `;

  const buttonClasses = `
    w-full bg-gradient-to-r from-blue-600 to-purple-600 
    hover:from-blue-700 hover:to-purple-700
    text-white font-semibold py-3 px-6 rounded-lg
    transition-all duration-200 transform hover:scale-105
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    backdrop-blur-sm
  `;

  if (mode === 'invite') {
    return React.createElement('div', { className: 'max-w-md mx-auto' },
      React.createElement('div', { 
        className: 'bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-xl' 
      },
        React.createElement('div', { className: 'text-center mb-6' },
          React.createElement('h2', { className: 'text-3xl font-bold text-white mb-2' }, '🎉 SnakkaZ Beta'),
          React.createElement('p', { className: 'text-white/80' }, 'Enter your beta invite code to continue')
        ),
        
        React.createElement('form', { onSubmit: handleInviteVerification },
          React.createElement('div', { className: 'mb-4' },
            React.createElement('input', {
              type: 'text',
              name: 'inviteCode',
              placeholder: 'Enter beta invite code',
              value: formData.inviteCode,
              onChange: handleInputChange,
              className: inputClasses,
              disabled: loading
            }),
            errors.inviteCode && React.createElement('p', { className: 'text-red-300 text-sm mt-1' }, errors.inviteCode)
          ),
          
          React.createElement('button', {
            type: 'submit',
            disabled: loading,
            className: buttonClasses
          }, loading ? 'Verifying...' : 'Verify Invite Code')
        ),
        
        React.createElement('div', { className: 'text-center mt-4' },
          React.createElement('button', {
            type: 'button',
            onClick: () => setMode('signin'),
            className: 'text-white/80 hover:text-white underline'
          }, 'Already have an account? Sign in')
        )
      )
    );
  }

  return React.createElement('div', { className: 'max-w-md mx-auto' },
    React.createElement('div', { 
      className: 'bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-xl' 
    },
      React.createElement('div', { className: 'text-center mb-6' },
        React.createElement('h2', { className: 'text-3xl font-bold text-white mb-2' }, 
          mode === 'signin' ? 'Welcome Back' : 'Join SnakkaZ Beta'
        ),
        React.createElement('p', { className: 'text-white/80' }, 
          mode === 'signin' 
            ? 'Sign in to your account' 
            : 'Create your account and start chatting'
        )
      ),
      
      React.createElement('form', { onSubmit: handleSubmit },
        // Email field
        React.createElement('div', { className: 'mb-4' },
          React.createElement('input', {
            type: 'email',
            name: 'email',
            placeholder: 'Email address',
            value: formData.email,
            onChange: handleInputChange,
            className: inputClasses,
            disabled: loading
          }),
          errors.email && React.createElement('p', { className: 'text-red-300 text-sm mt-1' }, errors.email)
        ),

        // Password field
        React.createElement('div', { className: 'mb-4' },
          React.createElement('input', {
            type: 'password',
            name: 'password',
            placeholder: 'Password',
            value: formData.password,
            onChange: handleInputChange,
            className: inputClasses,
            disabled: loading
          }),
          errors.password && React.createElement('p', { className: 'text-red-300 text-sm mt-1' }, errors.password)
        ),

        // Signup specific fields
        mode === 'signup' && [
          React.createElement('div', { key: 'confirmPassword', className: 'mb-4' },
            React.createElement('input', {
              type: 'password',
              name: 'confirmPassword',
              placeholder: 'Confirm password',
              value: formData.confirmPassword,
              onChange: handleInputChange,
              className: inputClasses,
              disabled: loading
            }),
            errors.confirmPassword && React.createElement('p', { className: 'text-red-300 text-sm mt-1' }, errors.confirmPassword)
          ),

          React.createElement('div', { key: 'username', className: 'mb-4' },
            React.createElement('input', {
              type: 'text',
              name: 'username',
              placeholder: 'Username (3-24 characters)',
              value: formData.username,
              onChange: handleInputChange,
              className: inputClasses,
              disabled: loading
            }),
            errors.username && React.createElement('p', { className: 'text-red-300 text-sm mt-1' }, errors.username)
          ),

          React.createElement('div', { key: 'displayName', className: 'mb-4' },
            React.createElement('input', {
              type: 'text',
              name: 'displayName',
              placeholder: 'Display name',
              value: formData.displayName,
              onChange: handleInputChange,
              className: inputClasses,
              disabled: loading
            }),
            errors.displayName && React.createElement('p', { className: 'text-red-300 text-sm mt-1' }, errors.displayName)
          ),

          inviteVerified && React.createElement('div', { key: 'inviteStatus', className: 'mb-4 text-center' },
            React.createElement('p', { className: 'text-green-300 text-sm' }, 
              '✅ Beta invite verified!'
            )
          )
        ],

        // Submit button
        React.createElement('button', {
          type: 'submit',
          disabled: loading,
          className: buttonClasses
        }, loading 
          ? (mode === 'signin' ? 'Signing in...' : 'Creating account...') 
          : (mode === 'signin' ? 'Sign In' : 'Create Account')
        ),

        // Error message
        errors.submit && React.createElement('p', { className: 'text-red-300 text-sm text-center mt-4' }, errors.submit)
      ),

      // Mode switching
      React.createElement('div', { className: 'text-center mt-6 space-y-2' },
        mode === 'signin' ? [
          React.createElement('button', {
            key: 'switchToSignup',
            type: 'button',
            onClick: () => setMode('invite'),
            className: 'text-white/80 hover:text-white underline block mx-auto'
          }, "Don't have an account? Get a beta invite"),
          
          React.createElement('button', {
            key: 'forgotPassword',
            type: 'button',
            className: 'text-white/60 hover:text-white/80 underline text-sm'
          }, 'Forgot password?')
        ] : [
          React.createElement('button', {
            key: 'switchToSignin',
            type: 'button',
            onClick: () => setMode('signin'),
            className: 'text-white/80 hover:text-white underline'
          }, 'Already have an account? Sign in')
        ]
      )
    )
  );
};

export default AuthForm;
