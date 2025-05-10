-- Create bitcoin wallets table
CREATE TABLE bitcoin_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  balance DECIMAL(16,8) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  wallet_name TEXT DEFAULT 'Primary Wallet',
  wallet_type TEXT DEFAULT 'electrum',
  encrypted_data TEXT,
  UNIQUE(user_id, address)
);

-- Add RLS (Row Level Security) policies
ALTER TABLE bitcoin_wallets ENABLE ROW LEVEL SECURITY;

-- Create policy for wallet data selection (users can only see their own wallets)
CREATE POLICY "Users can view their own wallets" 
  ON bitcoin_wallets 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for wallet data insertion (users can only create wallets for themselves)
CREATE POLICY "Users can create their own wallets" 
  ON bitcoin_wallets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy for wallet data update (users can only update their own wallets)
CREATE POLICY "Users can update their own wallets" 
  ON bitcoin_wallets 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create functions for balance update
CREATE OR REPLACE FUNCTION update_wallet_balance(
  wallet_id UUID,
  new_balance DECIMAL(16,8)
) RETURNS SETOF bitcoin_wallets AS $$
BEGIN
  RETURN QUERY
  UPDATE bitcoin_wallets
  SET 
    balance = new_balance,
    last_synced = NOW()
  WHERE 
    id = wallet_id
    AND user_id = auth.uid()
  RETURNING *;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create index on user_id for faster lookups
CREATE INDEX bitcoin_wallets_user_id_idx ON bitcoin_wallets(user_id);