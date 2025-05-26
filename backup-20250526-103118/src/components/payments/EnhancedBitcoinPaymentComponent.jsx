// Enhanced Bitcoin Payment Component with improved user experience and error handling

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useInterval } from '../hooks/useInterval';
import { formatBitcoin, formatCurrency } from '../utils/formatters';
import { 
  Box, 
  Button, 
  Card, 
  CircularProgress, 
  Divider, 
  IconButton, 
  Paper, 
  Step, 
  StepContent, 
  StepLabel, 
  Stepper, 
  Typography, 
  Tooltip, 
  LinearProgress
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import styled from '@emotion/styled';

// Styled components
const BitcoinCard = styled(Card)`
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const AddressContainer = styled(Paper)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  background-color: ${props => props.theme.palette.background.default};
`;

const AddressText = styled(Typography)`
  font-family: monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

const QRContainer = styled(Box)`
  display: flex;
  justify-content: center;
  margin: 1.5rem 0;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
`;

const TimerContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const StatusBadge = styled(Box)`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-weight: 500;
  font-size: 0.875rem;
  color: ${props => props.color === 'success' ? '#2e7d32' : 
    props.color === 'warning' ? '#ed6c02' : 
    props.color === 'error' ? '#d32f2f' : '#1976d2'};
  background-color: ${props => props.color === 'success' ? 'rgba(46, 125, 50, 0.1)' : 
    props.color === 'warning' ? 'rgba(237, 108, 2, 0.1)' : 
    props.color === 'error' ? 'rgba(211, 47, 47, 0.1)' : 'rgba(25, 118, 210, 0.1)'};
  margin-left: auto;
`;

const PaymentInfoRow = styled(Box)`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

/**
 * Enhanced Bitcoin Payment Component
 * 
 * Features:
 * - QR code for easier payments
 * - Real-time payment status updates
 * - Timer for payment expiration
 * - Step-by-step payment guidance
 * - Copy-to-clipboard functionality
 * - Error handling with retry options
 * - Payment history access
 */
const BitcoinPaymentComponent = ({ 
  paymentId, 
  amount,  
  currency, 
  onPaymentComplete, 
  onError,
  showHistory = false
}) => {
  // State
  const [payment, setPayment] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('initializing'); // initializing, pending, unconfirmed, confirmed, completed, expired, failed
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [confirmations, setConfirmations] = useState(0);
  
  // Refs
  const statusCheckInterval = useRef(null);
  
  // Constants
  const REFRESH_INTERVAL = 15000; // 15 seconds
  const REQUIRED_CONFIRMATIONS = 3;
  
  // Calculate progress percentage for confirmations
  const confirmationProgress = (confirmations / REQUIRED_CONFIRMATIONS) * 100;
  
  // Format the expiration timer
  const formatTimeLeft = (ms) => {
    if (!ms) return '--:--:--';
    
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };
  
  // Get the payment details
  const fetchPayment = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/payments/${paymentId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment details');
      }
      
      const data = await response.json();
      setPayment(data.payment);
      
      // Update payment status
      const status = data.payment.status;
      setPaymentStatus(status);
      
      // Update confirmations if available
      if (data.payment.confirmations) {
        setConfirmations(data.payment.confirmations);
      }
      
      // Calculate time left until expiration
      if (data.payment.expires_at) {
        const expireTime = new Date(data.payment.expires_at).getTime();
        const now = Date.now();
        const msLeft = expireTime - now;
        
        if (msLeft <= 0 && status === 'pending') {
          setPaymentStatus('expired');
        } else {
          setTimeLeft(msLeft);
        }
      }
      
      // Update step based on status
      if (status === 'pending') {
        setActiveStep(0);
      } else if (status === 'unconfirmed') {
        setActiveStep(1);
      } else if (status === 'confirmed') {
        setActiveStep(2);
      } else if (status === 'completed') {
        setActiveStep(3);
        if (onPaymentComplete) onPaymentComplete(data.payment);
        stopStatusCheck();
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching payment:', err);
      setError('Unable to load payment details. Please try refreshing.');
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Check payment status periodically
  const startStatusCheck = () => {
    // Clear any existing interval
    if (statusCheckInterval.current) {
      clearInterval(statusCheckInterval.current);
    }
    
    // Set up new interval
    statusCheckInterval.current = setInterval(() => {
      fetchPayment();
      // Update refresh counter for visual feedback
      setRefreshCounter(prev => prev + 1);
    }, REFRESH_INTERVAL);
  };
  
  // Stop checking status
  const stopStatusCheck = () => {
    if (statusCheckInterval.current) {
      clearInterval(statusCheckInterval.current);
      statusCheckInterval.current = null;
    }
  };
  
  // Handle copy button
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Handle manual refresh
  const handleRefresh = () => {
    fetchPayment();
    setRefreshCounter(prev => prev + 1);
  };
  
  // Create a new payment if the current one is expired
  const handleCreateNewPayment = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          method: 'bitcoin',
          productType: payment?.productType || 'subscription',
          productId: payment?.productId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create new payment request');
      }
      
      const data = await response.json();
      // Redirect to the new payment page
      window.location.href = `/payments/${data.payment.id}`;
    } catch (err) {
      console.error('Error creating new payment:', err);
      setError('Unable to create a new payment. Please try again.');
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };
  
  // View payment history
  const handleViewHistory = () => {
    window.location.href = '/account/payment-history';
  };
  
  // Update time left counter every second
  useInterval(() => {
    if (timeLeft && timeLeft > 0) {
      setTimeLeft(timeLeft - 1000);
    } else if (timeLeft <= 0 && paymentStatus === 'pending') {
      setPaymentStatus('expired');
    }
  }, 1000);
  
  // Initialize component
  useEffect(() => {
    fetchPayment();
    
    // Start checking for payment status updates
    startStatusCheck();
    
    // Clean up on unmount
    return () => {
      stopStatusCheck();
    };
  }, [paymentId]);
  
  // Get status icon and color
  const getStatusDetails = () => {
    switch(paymentStatus) {
      case 'initializing':
        return { 
          icon: <CircularProgress size={20} />, 
          text: 'Initializing payment...', 
          color: 'primary' 
        };
      case 'pending':
        return { 
          icon: <InfoIcon fontSize="small" />, 
          text: 'Awaiting payment', 
          color: 'primary' 
        };
      case 'unconfirmed':
        return { 
          icon: <InfoIcon fontSize="small" />, 
          text: `Awaiting confirmation (${confirmations}/${REQUIRED_CONFIRMATIONS})`, 
          color: 'warning' 
        };
      case 'confirmed':
      case 'completed':
        return { 
          icon: <CheckCircleIcon fontSize="small" />, 
          text: 'Payment confirmed', 
          color: 'success' 
        };
      case 'expired':
        return { 
          icon: <WarningIcon fontSize="small" />, 
          text: 'Payment expired', 
          color: 'error' 
        };
      case 'failed':
        return { 
          icon: <WarningIcon fontSize="small" />, 
          text: 'Payment failed', 
          color: 'error' 
        };
      default:
        return { 
          icon: <InfoIcon fontSize="small" />, 
          text: 'Unknown status', 
          color: 'default' 
        };
    }
  };
  
  // Get Bitcoin payment URI for QR code
  const getBitcoinURI = () => {
    if (!payment || !payment.bitcoin_address) return '';
    
    const amount = payment.btc_amount;
    const address = payment.bitcoin_address;
    const label = 'Snakkaz Chat Premium';
    
    return `bitcoin:${address}?amount=${amount}&label=${encodeURIComponent(label)}`;
  };
  
  // Status details
  const statusDetails = getStatusDetails();
  
  if (loading && !payment) {
    return (
      <BitcoinCard>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </BitcoinCard>
    );
  }
  
  if (error && !payment) {
    return (
      <BitcoinCard>
        <Typography variant="h5" gutterBottom color="error">
          Error Loading Payment
        </Typography>
        <Typography paragraph>{error}</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleRefresh}
          startIcon={<RefreshIcon />}
        >
          Try Again
        </Button>
      </BitcoinCard>
    );
  }
  
  if (!payment) {
    return (
      <BitcoinCard>
        <Typography variant="h5" gutterBottom color="error">
          Payment Not Found
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleCreateNewPayment}
        >
          Create New Payment
        </Button>
      </BitcoinCard>
    );
  }

  return (
    <BitcoinCard>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Bitcoin Payment</Typography>
        <StatusBadge color={statusDetails.color}>
          {statusDetails.icon} 
          <Box component="span" ml={1}>
            {statusDetails.text}
          </Box>
        </StatusBadge>
      </Box>
      
      <Divider />
      
      <Box my={2}>
        <PaymentInfoRow>
          <Typography variant="body2">Amount Due:</Typography>
          <Typography variant="body1" fontWeight="bold">
            {formatCurrency(payment.amount, payment.currency)}
          </Typography>
        </PaymentInfoRow>
        
        <PaymentInfoRow>
          <Typography variant="body2">Bitcoin Amount:</Typography>
          <Typography variant="body1" fontWeight="bold">
            {formatBitcoin(payment.btc_amount)} BTC
          </Typography>
        </PaymentInfoRow>
        
        {paymentStatus === 'pending' && (
          <TimerContainer>
            <Typography variant="body2">Time remaining:</Typography>
            <Typography 
              variant="body1" 
              fontWeight="bold" 
              color={timeLeft < 300000 ? 'error' : 'inherit'}
            >
              {formatTimeLeft(timeLeft)}
            </Typography>
          </TimerContainer>
        )}
      </Box>
      
      {paymentStatus === 'expired' ? (
        <Box textAlign="center" my={3}>
          <Typography variant="h6" color="error" gutterBottom>
            This payment request has expired
          </Typography>
          <Typography paragraph>
            The payment window has closed. Please create a new payment request to continue.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCreateNewPayment}
            fullWidth
          >
            Create New Payment Request
          </Button>
        </Box>
      ) : paymentStatus === 'completed' ? (
        <Box textAlign="center" my={3}>
          <Typography variant="h6" color="primary" gutterBottom>
            Payment Completed Successfully
          </Typography>
          <Typography paragraph>
            Thank you for your payment. Your premium features have been activated.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => window.location.href = '/dashboard'}
            fullWidth
          >
            Continue to Dashboard
          </Button>
        </Box>
      ) : (
        <>
          {(paymentStatus === 'pending' || paymentStatus === 'initializing') && (
            <>
              <Typography variant="subtitle1">
                Send Bitcoin to this address:
              </Typography>
              
              <AddressContainer>
                <AddressText>{payment.bitcoin_address}</AddressText>
                <CopyToClipboard 
                  text={payment.bitcoin_address} 
                  onCopy={handleCopy}
                >
                  <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                    <IconButton>
                      {copied ? <CheckCircleIcon color="success" /> : <CopyIcon />}
                    </IconButton>
                  </Tooltip>
                </CopyToClipboard>
              </AddressContainer>
              
              <QRContainer>
                <QRCode 
                  value={getBitcoinURI()}
                  size={200}
                  level="H"
                  includeMargin
                  renderAs="svg"
                />
              </QRContainer>
              
              <Typography variant="body2" color="textSecondary" align="center" paragraph>
                Scan this QR code with your Bitcoin wallet app to make payment
              </Typography>
            </>
          )}
          
          {paymentStatus === 'unconfirmed' && (
            <Box my={3}>
              <Typography variant="subtitle1" gutterBottom>
                Payment detected! Waiting for blockchain confirmations...
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={confirmationProgress}
                sx={{ my: 2, height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" align="center">
                {confirmations} of {REQUIRED_CONFIRMATIONS} confirmations received
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center" mt={1}>
                This typically takes 10-30 minutes to complete
              </Typography>
            </Box>
          )}
          
          <Box mt={4}>
            <Stepper activeStep={activeStep} orientation="vertical">
              <Step>
                <StepLabel>Payment Initiated</StepLabel>
                <StepContent>
                  <Typography>
                    Send exactly {formatBitcoin(payment.btc_amount)} BTC to the address above.
                  </Typography>
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Payment Detected</StepLabel>
                <StepContent>
                  <Typography>
                    We've detected your payment on the Bitcoin network. Waiting for confirmations.
                  </Typography>
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Payment Confirmed</StepLabel>
                <StepContent>
                  <Typography>
                    Your payment has been confirmed. Activating your premium features...
                  </Typography>
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Complete</StepLabel>
                <StepContent>
                  <Typography>
                    Payment complete! Your premium features are now active.
                  </Typography>
                </StepContent>
              </Step>
            </Stepper>
          </Box>
        </>
      )}
      
      <Divider sx={{ mt: 3, mb: 2 }} />
      
      <Box display="flex" justifyContent="space-between">
        {showHistory && (
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={handleViewHistory}
          >
            Payment History
          </Button>
        )}
        
        <Box ml="auto" display="flex" alignItems="center">
          <Typography 
            variant="caption" 
            color="textSecondary" 
            sx={{ mr: 1 }}
          >
            Last updated: {new Date().toLocaleTimeString()}
          </Typography>
          <Tooltip title="Refresh status">
            <IconButton 
              onClick={handleRefresh} 
              size="small" 
              disabled={loading}
            >
              {loading ? 
                <CircularProgress size={18} /> : 
                <RefreshIcon fontSize="small" />
              }
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Box mt={2}>
        <Typography variant="caption" color="textSecondary">
          Payment ID: {payment.id}
        </Typography>
      </Box>
    </BitcoinCard>
  );
};

export default BitcoinPaymentComponent;
