# Bitcoin Payment System Documentation

## Overview

The Snakkaz Chat Bitcoin Payment System enables users to make payments using Bitcoin cryptocurrency. This system includes backend services for handling payment processing, frontend components for the user interface, and admin tools for payment verification.

## Components

### Database Structure

The payment system uses two main tables:

1. `payments` table:
   - Stores all payment transactions
   - Tracks payment status (pending, confirmed, completed, failed, refunded)
   - Contains Bitcoin-specific data like addresses and amounts

2. `payment_logs` table:
   - Provides an audit trail for all payment actions
   - Records status changes and admin actions
   - Helps with troubleshooting payment issues

### Backend Services

1. **PaymentService** (`/src/server/paymentService.js`):
   - Creates Bitcoin payment requests
   - Generates unique Bitcoin addresses for payments
   - Converts fiat currency to BTC using current exchange rates
   - Verifies payments on the blockchain
   - Sends email notifications for payment events
   - Processes payment webhooks from payment processors
   - Handles admin payment verification

2. **API Routes** (`/src/server/api/paymentRoutes.js`):
   - Exposes endpoints for creating payments
   - Provides status check endpoints
   - Implements webhook handlers for payment processors
   - Offers admin endpoints for payment management

### Frontend Components

1. **BitcoinPayment** (`/src/components/payment/BitcoinPayment.tsx`):
   - User-facing payment UI component
   - Displays QR code for Bitcoin payments
   - Shows real-time payment status updates
   - Implements payment expiration countdown
   - Handles copy-to-clipboard functionality for Bitcoin addresses

2. **PaymentVerificationPanel** (`/src/components/admin/PaymentVerificationPanel.tsx`):
   - Admin tool for monitoring and managing payments
   - Lists all payment transactions with filtering options
   - Provides detailed payment information views
   - Allows admins to update payment statuses
   - Shows payment logs for auditing

## Payment Flow

1. **Payment Creation**:
   - User selects a subscription plan or product
   - System generates a unique Bitcoin address
   - Payment request is created with a 24-hour expiration
   - User is shown QR code and payment details

2. **Payment Processing**:
   - User sends Bitcoin to the provided address
   - System monitors the blockchain for incoming transactions
   - Payment status is updated based on transaction confirmations
   - Real-time updates via Supabase subscriptions

3. **Payment Completion**:
   - Once payment reaches required confirmations, it's marked as confirmed
   - Subscription or product access is automatically granted
   - User receives confirmation notification
   - Admin can verify and finalize the payment if needed

4. **Admin Verification**:
   - Admins can view all payments through the verification panel
   - Payment status can be manually updated if needed
   - All actions are logged for audit purposes
   - Admin can add notes to payment transactions

## Integration with Subscription System

The Bitcoin payment system integrates with the subscription service:

1. When a payment is confirmed, the subscription service is notified
2. The system automatically activates the corresponding subscription plan
3. User's premium features are immediately enabled

## Error Handling

The payment system includes comprehensive error handling:

1. Payment expiration handling
2. Transaction verification failures
3. Network connectivity issues
4. Blockchain confirmation delays
5. Underpayment/overpayment scenarios

## Security Measures

1. Unique Bitcoin addresses for each payment
2. Secure webhook validation
3. Admin-only access to payment management
4. Comprehensive audit logging
5. Encryption of sensitive payment data

## Testing

For testing the payment system without making actual Bitcoin transactions:

1. The system includes a simulation mode that mimics blockchain confirmations
2. Test payments can be created and processed through the admin panel
3. Exchange rate API can be mocked for consistent testing

## Future Enhancements

Planned future improvements:

1. Support for additional cryptocurrencies (Ethereum, Litecoin)
2. Lightning Network integration for instant payments
3. Enhanced analytics for payment data
4. Automated refund processing
5. Multi-signature wallet support for increased security
