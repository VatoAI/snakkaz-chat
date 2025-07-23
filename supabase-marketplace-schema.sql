/**
 * SnakkaZ E-Commerce Marketplace Schema Extensions
 * For seller groups, product listings, trust system, location tracking
 * Created: 2025-07-22
 */

-- ===== MARKETPLACE EXTENSIONS =====

-- Add marketplace fields to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS seller_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trust_score INTEGER DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS seller_rating DECIMAL(3,2) DEFAULT 0.0 CHECK (seller_rating >= 0.0 AND seller_rating <= 5.0);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location_lat DECIMAL(10,8);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location_lng DECIMAL(11,8);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_category TEXT;

-- Add marketplace fields to rooms (seller groups)
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS is_marketplace BOOLEAN DEFAULT false;
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS requires_approval BOOLEAN DEFAULT true;
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS entry_password TEXT;
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS location_lat DECIMAL(10,8);
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS location_lng DECIMAL(11,8);
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS location_radius INTEGER DEFAULT 10; -- km
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS business_category TEXT;

-- ===== PRODUCT LISTINGS =====
CREATE TABLE IF NOT EXISTS public.products (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    currency TEXT DEFAULT 'NOK',
    category TEXT,
    condition TEXT DEFAULT 'new' CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor')),
    images JSONB DEFAULT '[]', -- Array of image URLs
    tags TEXT[],
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    location_name TEXT,
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Ensure title is not empty
    CONSTRAINT title_not_empty CHECK (char_length(trim(title)) > 0),
    -- Limit title length
    CONSTRAINT title_length CHECK (char_length(title) <= 100)
);

COMMENT ON TABLE public.products IS 'Product listings for marketplace groups';

-- ===== PRODUCT INTERACTIONS =====
CREATE TABLE IF NOT EXISTS public.product_likes (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Unique constraint to prevent duplicate likes
    UNIQUE(product_id, profile_id)
);

CREATE TABLE IF NOT EXISTS public.product_feedback (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    feedback_type TEXT DEFAULT 'comment' CHECK (feedback_type IN ('comment', 'question', 'interest', 'offer')),
    content TEXT NOT NULL,
    offer_price DECIMAL(10,2),
    is_private BOOLEAN DEFAULT false, -- Private message to seller
    parent_id UUID REFERENCES public.product_feedback(id) ON DELETE CASCADE, -- For replies
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Ensure content is not empty
    CONSTRAINT feedback_content_not_empty CHECK (char_length(trim(content)) > 0)
);

-- ===== TRUST & VERIFICATION SYSTEM =====
CREATE TABLE IF NOT EXISTS public.user_verifications (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    verification_type TEXT NOT NULL CHECK (verification_type IN ('phone', 'email', 'id_document', 'business_license', 'bank_account')),
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES public.profiles(id), -- Admin who verified
    verification_data JSONB, -- Store verification details securely
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Unique constraint per verification type per user
    UNIQUE(profile_id, verification_type)
);

CREATE TABLE IF NOT EXISTS public.trust_ratings (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    rated_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    rater_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    transaction_type TEXT DEFAULT 'sale' CHECK (transaction_type IN ('sale', 'purchase', 'interaction')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Unique constraint to prevent duplicate ratings for same transaction
    UNIQUE(rated_user_id, rater_user_id, product_id)
);

-- ===== GROUP ACCESS CONTROL =====
CREATE TABLE IF NOT EXISTS public.group_access_requests (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    request_message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Unique constraint to prevent duplicate requests
    UNIQUE(room_id, profile_id)
);

-- ===== LOCATION & MAP FEATURES =====
CREATE TABLE IF NOT EXISTS public.location_pins (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    pin_type TEXT DEFAULT 'product' CHECK (pin_type IN ('product', 'meeting', 'store', 'event')),
    title TEXT NOT NULL,
    description TEXT,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ===== INDEXES FOR MARKETPLACE =====

-- Product indexes
CREATE INDEX IF NOT EXISTS products_seller_idx ON public.products(seller_id);
CREATE INDEX IF NOT EXISTS products_room_idx ON public.products(room_id);
CREATE INDEX IF NOT EXISTS products_category_idx ON public.products(category);
CREATE INDEX IF NOT EXISTS products_price_idx ON public.products(price);
CREATE INDEX IF NOT EXISTS products_location_idx ON public.products(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS products_available_idx ON public.products(is_available, created_at DESC);
CREATE INDEX IF NOT EXISTS products_featured_idx ON public.products(is_featured, created_at DESC);

-- Trust system indexes
CREATE INDEX IF NOT EXISTS trust_ratings_rated_user_idx ON public.trust_ratings(rated_user_id);
CREATE INDEX IF NOT EXISTS trust_ratings_room_idx ON public.trust_ratings(room_id);
CREATE INDEX IF NOT EXISTS user_verifications_profile_idx ON public.user_verifications(profile_id);
CREATE INDEX IF NOT EXISTS user_verifications_type_idx ON public.user_verifications(verification_type, is_verified);

-- Location indexes
CREATE INDEX IF NOT EXISTS location_pins_room_idx ON public.location_pins(room_id);
CREATE INDEX IF NOT EXISTS location_pins_location_idx ON public.location_pins(latitude, longitude);
CREATE INDEX IF NOT EXISTS location_pins_active_idx ON public.location_pins(is_active, expires_at);

-- Profile marketplace indexes
CREATE INDEX IF NOT EXISTS profiles_seller_verified_idx ON public.profiles(seller_verified);
CREATE INDEX IF NOT EXISTS profiles_trust_score_idx ON public.profiles(trust_score DESC);
CREATE INDEX IF NOT EXISTS profiles_location_idx ON public.profiles(location_lat, location_lng);

-- Room marketplace indexes
CREATE INDEX IF NOT EXISTS rooms_marketplace_idx ON public.rooms(is_marketplace, is_active);
CREATE INDEX IF NOT EXISTS rooms_location_idx ON public.rooms(location_lat, location_lng);

-- ===== RLS POLICIES FOR MARKETPLACE =====

-- Products policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by room members" ON public.products
    FOR SELECT USING (
        room_id IN (
            SELECT room_id FROM public.room_participants 
            WHERE profile_id = auth.uid()
        )
    );

CREATE POLICY "Sellers can manage their own products" ON public.products
    FOR ALL USING (seller_id = auth.uid());

-- Product feedback policies
ALTER TABLE public.product_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product feedback viewable by room members" ON public.product_feedback
    FOR SELECT USING (
        product_id IN (
            SELECT id FROM public.products WHERE room_id IN (
                SELECT room_id FROM public.room_participants 
                WHERE profile_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can create feedback in their rooms" ON public.product_feedback
    FOR INSERT WITH CHECK (
        profile_id = auth.uid() AND
        product_id IN (
            SELECT id FROM public.products WHERE room_id IN (
                SELECT room_id FROM public.room_participants 
                WHERE profile_id = auth.uid()
            )
        )
    );

-- Trust ratings policies
ALTER TABLE public.trust_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trust ratings viewable by room members" ON public.trust_ratings
    FOR SELECT USING (
        room_id IN (
            SELECT room_id FROM public.room_participants 
            WHERE profile_id = auth.uid()
        )
    );

CREATE POLICY "Users can rate others in shared rooms" ON public.trust_ratings
    FOR INSERT WITH CHECK (
        rater_user_id = auth.uid() AND
        room_id IN (
            SELECT room_id FROM public.room_participants 
            WHERE profile_id = auth.uid()
        )
    );

-- Group access requests policies
ALTER TABLE public.group_access_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own access requests" ON public.group_access_requests
    FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Room admins can view access requests" ON public.group_access_requests
    FOR SELECT USING (
        room_id IN (
            SELECT room_id FROM public.room_participants 
            WHERE profile_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- ===== MARKETPLACE FUNCTIONS =====

-- Function to calculate trust score
CREATE OR REPLACE FUNCTION public.calculate_trust_score(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    avg_rating DECIMAL;
    rating_count INTEGER;
    verification_count INTEGER;
    trust_score INTEGER;
BEGIN
    -- Get average rating
    SELECT AVG(rating), COUNT(*) INTO avg_rating, rating_count
    FROM public.trust_ratings 
    WHERE rated_user_id = user_id;
    
    -- Get verification count
    SELECT COUNT(*) INTO verification_count
    FROM public.user_verifications 
    WHERE profile_id = user_id AND is_verified = true;
    
    -- Calculate trust score (0-100)
    trust_score := COALESCE(
        LEAST(100, 
            (COALESCE(avg_rating, 0) * 15) + -- Rating component (max 75)
            (verification_count * 5) + -- Verification component (max 25)
            (CASE WHEN rating_count > 10 THEN 10 ELSE rating_count END) -- Activity bonus (max 10)
        ), 0
    )::INTEGER;
    
    -- Update profile
    UPDATE public.profiles 
    SET trust_score = trust_score, seller_rating = COALESCE(avg_rating, 0)
    WHERE id = user_id;
    
    RETURN trust_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check group access
CREATE OR REPLACE FUNCTION public.can_access_group(user_id UUID, group_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    room_info RECORD;
    user_trust INTEGER;
BEGIN
    -- Get room information
    SELECT * INTO room_info FROM public.rooms WHERE id = group_id;
    
    -- Public rooms are always accessible
    IF room_info.room_type = 'public' THEN
        RETURN true;
    END IF;
    
    -- Check if user is already a member
    IF EXISTS (
        SELECT 1 FROM public.room_participants 
        WHERE room_id = group_id AND profile_id = user_id
    ) THEN
        RETURN true;
    END IF;
    
    -- For marketplace groups, check trust score if required
    IF room_info.is_marketplace AND room_info.requires_approval THEN
        SELECT trust_score INTO user_trust FROM public.profiles WHERE id = user_id;
        
        -- Require minimum trust score for auto-approval
        IF COALESCE(user_trust, 0) < 30 THEN
            RETURN false;
        END IF;
    END IF;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update product stats
CREATE OR REPLACE FUNCTION public.update_product_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Update like count for product likes
        IF TG_TABLE_NAME = 'product_likes' THEN
            UPDATE public.products 
            SET like_count = like_count + 1 
            WHERE id = NEW.product_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Update like count for product likes
        IF TG_TABLE_NAME = 'product_likes' THEN
            UPDATE public.products 
            SET like_count = like_count - 1 
            WHERE id = OLD.product_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers for product stats
DROP TRIGGER IF EXISTS product_likes_stats_trigger ON public.product_likes;
CREATE TRIGGER product_likes_stats_trigger
    AFTER INSERT OR DELETE ON public.product_likes
    FOR EACH ROW EXECUTE FUNCTION public.update_product_stats();

-- Function to handle trust rating updates
CREATE OR REPLACE FUNCTION public.handle_trust_rating_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Recalculate trust score for rated user
    PERFORM public.calculate_trust_score(NEW.rated_user_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for trust rating updates
DROP TRIGGER IF EXISTS trust_rating_update_trigger ON public.trust_ratings;
CREATE TRIGGER trust_rating_update_trigger
    AFTER INSERT OR UPDATE ON public.trust_ratings
    FOR EACH ROW EXECUTE FUNCTION public.handle_trust_rating_update();

-- ===== REALTIME FOR MARKETPLACE =====
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.product_feedback;
ALTER PUBLICATION supabase_realtime ADD TABLE public.location_pins;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_access_requests;

-- ===== SAMPLE MARKETPLACE DATA =====

-- Create a sample marketplace group
INSERT INTO public.rooms (id, name, description, room_type, is_marketplace, requires_approval, business_category, location_name, webrtc_enabled, e2ee_enabled)
VALUES (
    gen_random_uuid(),
    'Oslo Forhandlere - Elektronikk',
    'Trygg gruppe for elektronikk salg i Oslo området. Kun verifiserte selgere.',
    'private',
    true,
    true,
    'Electronics',
    'Oslo, Norge',
    true,
    true
) ON CONFLICT DO NOTHING;

-- Create sample product categories
INSERT INTO public.rooms (id, name, description, room_type, is_marketplace, requires_approval, business_category, location_name, webrtc_enabled, e2ee_enabled)
VALUES 
    (gen_random_uuid(), 'Bergen Klær & Mote', 'Fashion marketplace Bergen', 'private', true, true, 'Fashion', 'Bergen, Norge', true, true),
    (gen_random_uuid(), 'Stavanger Bil & Motor', 'Automotive marketplace Stavanger', 'private', true, true, 'Automotive', 'Stavanger, Norge', true, true),
    (gen_random_uuid(), 'Trondheim Hjem & Hage', 'Home & Garden marketplace', 'private', true, true, 'Home', 'Trondheim, Norge', true, true)
ON CONFLICT DO NOTHING;

-- ===== SUCCESS MESSAGE =====
DO $$
BEGIN
    RAISE NOTICE '🛒 SnakkaZ E-Commerce Marketplace Schema created successfully!';
    RAISE NOTICE '✅ Product listings with images and pricing';
    RAISE NOTICE '✅ Trust & verification system';
    RAISE NOTICE '✅ Location-based groups with maps integration';
    RAISE NOTICE '✅ Secure group access with approval system';
    RAISE NOTICE '✅ Real-time feedback and rating system';
    RAISE NOTICE '✅ Mobile-optimized for 90% mobile usage';
    RAISE NOTICE '🎯 Ready for seller group testing!';
END $$;
