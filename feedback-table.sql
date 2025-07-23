-- User Feedback & Improvement System Table
-- Created: 2025-07-22
-- Purpose: Collect user feedback, bug reports, feature requests

CREATE TABLE IF NOT EXISTS user_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('general', 'bug', 'feature', 'performance', 'security', 'ui', 'marketplace', 'mobile')),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
    message TEXT NOT NULL,
    email TEXT,
    page TEXT,
    user_agent TEXT,
    screen_resolution TEXT,
    viewport TEXT,
    session_id TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'in_progress', 'resolved', 'closed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_feedback_type ON user_feedback(type);
CREATE INDEX IF NOT EXISTS idx_user_feedback_status ON user_feedback(status);
CREATE INDEX IF NOT EXISTS idx_user_feedback_priority ON user_feedback(priority);
CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON user_feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_user_feedback_rating ON user_feedback(rating);

-- RLS Policies
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Allow anonymous feedback submission
CREATE POLICY "Allow anonymous feedback submission" ON user_feedback
    FOR INSERT
    WITH CHECK (true);

-- Allow users to read their own feedback
CREATE POLICY "Users can read their own feedback" ON user_feedback
    FOR SELECT
    USING (user_id = auth.uid() OR user_id IS NULL);

-- Admin can do everything
CREATE POLICY "Admins can manage all feedback" ON user_feedback
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Update trigger
CREATE OR REPLACE FUNCTION update_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_feedback_updated_at
    BEFORE UPDATE ON user_feedback
    FOR EACH ROW
    EXECUTE FUNCTION update_feedback_updated_at();

-- Comments
COMMENT ON TABLE user_feedback IS 'User feedback, bug reports, and feature requests for SnakkaZ Beta';
COMMENT ON COLUMN user_feedback.type IS 'Type of feedback: general, bug, feature, performance, security, ui, marketplace, mobile';
COMMENT ON COLUMN user_feedback.rating IS 'User satisfaction rating from 1-10';
COMMENT ON COLUMN user_feedback.status IS 'Processing status: new, reviewing, in_progress, resolved, closed';
COMMENT ON COLUMN user_feedback.priority IS 'Priority level: low, medium, high, critical';
COMMENT ON COLUMN user_feedback.session_id IS 'Analytics session ID for tracking';
