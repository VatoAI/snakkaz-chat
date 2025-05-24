-- Electrum integration database schema additions

-- Table for Electrum-specific payment details
CREATE TABLE IF NOT EXISTS electrum_payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  bitcoin_address TEXT NOT NULL UNIQUE,
  expected_amount BIGINT NOT NULL, -- Amount in satoshis
  received_amount BIGINT, -- Actual amount received
  status TEXT NOT NULL CHECK (status IN ('pending', 'unconfirmed', 'confirmed', 'completed', 'failed', 'expired')),
  transaction_id TEXT, -- Bitcoin transaction ID when payment is received
  confirmations INT DEFAULT 0, -- Number of confirmations
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ,
  last_checked_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_electrum_payments_status ON electrum_payments(status);
CREATE INDEX IF NOT EXISTS idx_electrum_payments_bitcoin_address ON electrum_payments(bitcoin_address);
CREATE INDEX IF NOT EXISTS idx_electrum_payments_payment_id ON electrum_payments(payment_id);
CREATE INDEX IF NOT EXISTS idx_electrum_payments_user_id ON electrum_payments(user_id);

-- Table for transaction cache
CREATE TABLE IF NOT EXISTS electrum_transaction_cache (
  id SERIAL PRIMARY KEY,
  transaction_id TEXT NOT NULL UNIQUE,
  transaction_data JSONB NOT NULL,
  first_seen_at TIMESTAMPTZ NOT NULL,
  last_updated_at TIMESTAMPTZ NOT NULL
);

-- Function to confirm Bitcoin payment
CREATE OR REPLACE FUNCTION confirm_electrum_payment(
  payment_id_param UUID,
  txid_param TEXT,
  confirmations_param INT
)
RETURNS BOOLEAN AS $$
DECLARE
  current_payment RECORD;
BEGIN
  -- Get current payment
  SELECT * INTO current_payment
  FROM electrum_payments
  WHERE payment_id = payment_id_param;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payment not found';
  END IF;

  -- Update payment details
  UPDATE electrum_payments
  SET
    status = CASE
      WHEN confirmations_param >= 3 THEN 'confirmed'
      ELSE 'unconfirmed'
    END,
    transaction_id = txid_param,
    confirmations = confirmations_param,
    updated_at = NOW(),
    last_checked_at = NOW()
  WHERE payment_id = payment_id_param;

  -- Also update main payments table
  IF confirmations_param >= 3 THEN
    UPDATE payments
    SET
      status = 'confirmed',
      transaction_id = txid_param,
      updated_at = NOW()
    WHERE id = payment_id_param;
  END IF;

  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$ LANGUAGE plpgsql;

-- Function to mark payment as expired
CREATE OR REPLACE FUNCTION expire_electrum_payments()
RETURNS INT AS $$
DECLARE
  expired_count INT;
BEGIN
  -- Find and update expired payments (older than 24 hours)
  WITH updated AS (
    UPDATE electrum_payments
    SET
      status = 'expired',
      updated_at = NOW()
    WHERE
      status = 'pending'
      AND created_at < NOW() - INTERVAL '24 hours'
    RETURNING payment_id
  )
  -- Also update main payments table
  UPDATE payments
  SET
    status = 'failed',
    failure_reason = 'expired',
    updated_at = NOW()
  FROM updated
  WHERE payments.id = updated.payment_id;

  GET DIAGNOSTICS expired_count = ROW_COUNT;
  RETURN expired_count;
END;
$$ LANGUAGE plpgsql;

-- View for payment reporting
CREATE OR REPLACE VIEW electrum_payment_stats AS
SELECT
  date_trunc('day', e.created_at) AS day,
  COUNT(e.id) AS total_payments,
  COUNT(CASE WHEN e.status IN ('confirmed', 'completed') THEN 1 END) AS confirmed_payments,
  SUM(CASE WHEN e.status IN ('confirmed', 'completed') THEN e.received_amount ELSE 0 END) AS total_satoshis_received,
  AVG(CASE WHEN e.status IN ('confirmed', 'completed') THEN (EXTRACT(EPOCH FROM (e.updated_at - e.created_at)) / 60) ELSE NULL END) AS avg_confirmation_minutes
FROM
  electrum_payments e
GROUP BY
  date_trunc('day', e.created_at)
ORDER BY
  day DESC;
