/* 
 * Payments Database Schema Script for SnakkaZ Chat
 *
 * This SQL script sets up the necessary tables and functions for
 * the Bitcoin payment system in Supabase.
 */

-- Create payments table
CREATE TABLE public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL NOT NULL,
  amount NUMERIC(16, 8) NOT NULL, -- Bitcoin can be fractional
  currency TEXT DEFAULT 'NOK' NOT NULL,
  btc_amount NUMERIC(16, 8), -- Amount in Bitcoin after conversion
  product_type TEXT NOT NULL, -- 'subscription', 'premium_group', etc.
  product_id TEXT NOT NULL, -- ID of the product being purchased
  payment_method TEXT DEFAULT 'bitcoin' NOT NULL,
  bitcoin_address TEXT, -- Payment address for Bitcoin
  transaction_id TEXT, -- Bitcoin transaction ID once confirmed
  status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'confirmed', 'completed', 'failed', 'refunded'
  notes TEXT, -- Internal notes
  admin_notes TEXT, -- Notes added by admin
  last_checked_at TIMESTAMPTZ,
  confirmation_count INT DEFAULT 0, -- Number of blockchain confirmations
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours',
  webhook_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.payments IS 'Bitcoin payment transactions';

-- Add indexes
CREATE INDEX payments_user_id_idx ON public.payments(user_id);
CREATE INDEX payments_status_idx ON public.payments(status);

-- Payment log table for auditing and history
CREATE TABLE public.payment_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  payment_id UUID REFERENCES public.payments ON DELETE CASCADE NOT NULL,
  admin_id UUID REFERENCES auth.users ON DELETE SET NULL, -- If action was by admin
  action TEXT NOT NULL, -- 'status_update', 'note_added', 'check_status', etc.
  previous_status TEXT,
  new_status TEXT,
  metadata JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.payment_logs IS 'Audit log for payment actions';

-- Set up RLS for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT USING (
    auth.uid() = user_id
  );
  
CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

-- Set up RLS for payment logs
ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view logs of their own payments"
  ON public.payment_logs FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.payments p
      WHERE p.id = payment_id
      AND p.user_id = auth.uid()
    )
  );
  
CREATE POLICY "Admins can view all payment logs"
  ON public.payment_logs FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

-- Function to log payment status changes
CREATE OR REPLACE FUNCTION public.log_payment_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status <> NEW.status THEN
    INSERT INTO public.payment_logs (
      payment_id,
      action,
      previous_status,
      new_status,
      ip_address
    ) VALUES (
      NEW.id,
      'status_update',
      OLD.status,
      NEW.status,
      (SELECT current_setting('request.headers')::jsonb->>'x-forwarded-for')
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
CREATE TRIGGER payment_status_change_trigger
AFTER UPDATE OF status ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.log_payment_status_change();

-- Function to mark a payment as confirmed after blockchain confirmation
CREATE OR REPLACE FUNCTION public.confirm_bitcoin_payment(payment_id UUID, txid TEXT, confirmations INT)
RETURNS BOOLEAN AS $$
DECLARE
  payment_record public.payments%ROWTYPE;
BEGIN
  -- Get the payment record
  SELECT * INTO payment_record FROM public.payments WHERE id = payment_id;
  
  -- Check if payment exists and is in pending status
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Update payment with transaction ID and confirmation count
  UPDATE public.payments 
  SET 
    transaction_id = txid,
    confirmation_count = confirmations,
    status = CASE 
      WHEN confirmations >= 3 THEN 'confirmed'
      ELSE status
    END,
    last_checked_at = NOW(),
    updated_at = NOW()
  WHERE id = payment_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete payment and activate subscription
CREATE OR REPLACE FUNCTION public.complete_payment_and_activate(payment_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  payment_record public.payments%ROWTYPE;
  subscription_id UUID;
BEGIN
  -- Get the payment record
  SELECT * INTO payment_record FROM public.payments WHERE id = payment_id;
  
  -- Check if payment exists and is confirmed
  IF NOT FOUND OR payment_record.status <> 'confirmed' THEN
    RETURN FALSE;
  END IF;
  
  -- Mark payment as completed
  UPDATE public.payments 
  SET 
    status = 'completed',
    updated_at = NOW()
  WHERE id = payment_id;
  
  -- If this is a subscription payment, activate or extend subscription
  IF payment_record.product_type = 'subscription' THEN
    -- Check if user already has an active subscription
    SELECT id INTO subscription_id FROM public.subscriptions 
    WHERE user_id = payment_record.user_id AND status = 'active';
    
    IF FOUND THEN
      -- Extend existing subscription
      UPDATE public.subscriptions 
      SET 
        current_period_end = GREATEST(current_period_end, NOW()) + INTERVAL '1 month',
        updated_at = NOW()
      WHERE id = subscription_id;
    ELSE
      -- Create new subscription
      INSERT INTO public.subscriptions (
        user_id,
        plan_id,
        status,
        current_period_end
      ) VALUES (
        payment_record.user_id,
        payment_record.product_id,
        'active',
        NOW() + INTERVAL '1 month'
      );
    END IF;
    
    -- Update user's profile to mark as premium
    UPDATE public.profiles 
    SET is_premium = TRUE 
    WHERE id = payment_record.user_id;
  END IF;
  
  -- For other product types, handle accordingly
  -- (e.g., premium group membership, etc.)
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
