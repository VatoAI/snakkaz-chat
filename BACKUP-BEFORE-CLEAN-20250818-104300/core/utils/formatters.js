/**
 * Formatting utilities for Bitcoin and currency amounts
 */

/**
 * Format a Bitcoin amount with appropriate precision
 * 
 * @param {number} amount - The Bitcoin amount to format
 * @param {number} precision - Number of decimal places (default: 8)
 * @returns {string} - Formatted Bitcoin amount
 */
export function formatBitcoin(amount, precision = 8) {
  if (amount === undefined || amount === null) {
    return '0.00000000';
  }
  
  // Ensure amount is a number
  const numAmount = Number(amount);
  
  // Check for NaN
  if (isNaN(numAmount)) {
    return '0.00000000';
  }
  
  // Format with specified precision
  return numAmount.toFixed(precision);
}

/**
 * Format a currency amount with appropriate currency symbol and locale
 * 
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (NOK, USD, EUR, etc.)
 * @param {string} locale - Locale for formatting (default: 'no-NO')
 * @returns {string} - Formatted currency amount
 */
export function formatCurrency(amount, currency = 'NOK', locale = 'no-NO') {
  if (amount === undefined || amount === null) {
    return '0.00';
  }
  
  // Ensure amount is a number
  const numAmount = Number(amount);
  
  // Check for NaN
  if (isNaN(numAmount)) {
    return '0.00';
  }
  
  // Currency formatting based on locale and currency code
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount);
}

/**
 * Calculate Bitcoin amount from fiat currency
 * 
 * @param {number} amount - Fiat currency amount
 * @param {string} currency - Currency code
 * @param {number} exchangeRate - Bitcoin exchange rate in the specified currency
 * @returns {number} - Equivalent Bitcoin amount
 */
export function calculateBitcoinAmount(amount, currency, exchangeRate) {
  if (!amount || !exchangeRate || exchangeRate <= 0) {
    return 0;
  }
  
  return amount / exchangeRate;
}

/**
 * Format satoshi amount (Bitcoin's smallest unit)
 * 
 * @param {number} satoshis - Amount in satoshis
 * @returns {string} - Formatted satoshi amount
 */
export function formatSatoshis(satoshis) {
  if (satoshis === undefined || satoshis === null) {
    return '0';
  }
  
  // Ensure amount is a number and integer
  const numAmount = Math.floor(Number(satoshis));
  
  // Check for NaN
  if (isNaN(numAmount)) {
    return '0';
  }
  
  // Format with thousand separators
  return numAmount.toLocaleString();
}

/**
 * Format payment status for display
 * 
 * @param {string} status - Payment status code
 * @returns {string} - Human-readable status
 */
export function formatPaymentStatus(status) {
  const statusMap = {
    'pending': 'Awaiting Payment',
    'unconfirmed': 'Payment Detected',
    'confirmed': 'Payment Confirmed',
    'completed': 'Completed',
    'failed': 'Failed',
    'expired': 'Expired',
    'refunded': 'Refunded'
  };
  
  return statusMap[status] || 'Unknown';
}
