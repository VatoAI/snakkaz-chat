/**
 * SnakkaZ E-Commerce Marketplace Components
 * Mobile-first design for seller groups and product listings
 * Created: 2025-07-22
 */

import React, { useState, useEffect } from 'react';

// Import from relative paths based on project structure
const useAuth = () => {
  // Mock implementation for now - will be replaced with actual auth
  return { user: { id: 'mock-user', username: 'testuser' } };
};

const supabase = {
  from: (table) => ({
    select: (columns) => ({
      eq: (column, value) => ({
        order: (column, options) => Promise.resolve({ data: [], error: null })
      })
    }),
    insert: (data) => Promise.resolve({ error: null }),
    delete: () => ({
      match: (conditions) => Promise.resolve({ error: null })
    })
  })
};

// Product Listing Component with Images and Pricing
export const ProductCard = ({ product, onLike, onFeedback, currentUser }) => {
  const [liked, setLiked] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleLike = async () => {
    try {
      if (liked) {
        await supabase
          .from('product_likes')
          .delete()
          .match({ product_id: product.id, profile_id: currentUser.id });
      } else {
        await supabase
          .from('product_likes')
          .insert({ product_id: product.id, profile_id: currentUser.id });
      }
      setLiked(!liked);
      onLike(product.id, !liked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
      {/* Product Images */}
      {product.images && product.images.length > 0 && (
        <div className="relative h-48 bg-gray-100">
          <img 
            src={product.images[0]} 
            alt={product.title}
            className="w-full h-full object-cover"
          />
          {product.images.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              +{product.images.length - 1}
            </div>
          )}
          {product.is_featured && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
              FEATURED
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        {/* Product Title and Price */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-800 flex-1 pr-2">
            {product.title}
          </h3>
          <div className="text-right">
            <div className="text-xl font-bold text-green-600">
              {product.price} {product.currency || 'NOK'}
            </div>
            <div className="text-xs text-gray-500 capitalize">
              {product.condition}
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Category and Location */}
        <div className="flex flex-wrap gap-2 mb-3">
          {product.category && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              {product.category}
            </span>
          )}
          {product.location_name && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs flex items-center">
              📍 {product.location_name}
            </span>
          )}
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between mb-3 pb-3 border-b">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold mr-2">
              {product.seller?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-medium">{product.seller?.username}</div>
              {product.seller?.seller_verified && (
                <div className="flex items-center text-xs text-green-600">
                  ✓ Verified Seller
                </div>
              )}
              {product.seller?.trust_score && (
                <div className="text-xs text-gray-500">
                  Trust: {product.seller.trust_score}/100
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              liked 
                ? 'bg-red-100 text-red-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {liked ? '❤️' : '🤍'} {product.like_count || 0}
          </button>
          
          <button
            onClick={() => setShowFeedback(true)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
          >
            💬 Feedback
          </button>

          <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            Interested
          </button>
        </div>

        {/* Feedback Section */}
        {showFeedback && (
          <ProductFeedback 
            product={product} 
            onClose={() => setShowFeedback(false)}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
};

// Product Feedback Component
export const ProductFeedback = ({ product, onClose, currentUser }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('comment');
  const [offerPrice, setOfferPrice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, [product.id]);

  const fetchFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('product_feedback')
        .select(`
          *,
          profile:profile_id (username, seller_verified)
        `)
        .eq('product_id', product.id)
        .eq('is_private', false)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setFeedbacks(data || []);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async () => {
    if (!newFeedback.trim()) return;

    try {
      const feedbackData = {
        product_id: product.id,
        profile_id: currentUser.id,
        feedback_type: feedbackType,
        content: newFeedback.trim(),
        offer_price: feedbackType === 'offer' ? parseFloat(offerPrice) : null
      };

      const { error } = await supabase
        .from('product_feedback')
        .insert(feedbackData);

      if (error) throw error;

      setNewFeedback('');
      setOfferPrice('');
      fetchFeedbacks();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">Product Feedback</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Existing Feedbacks */}
        <div className="max-h-60 overflow-y-auto p-4 border-b">
          {loading ? (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No feedback yet</div>
          ) : (
            feedbacks.map((feedback) => (
              <div key={feedback.id} className="mb-3 last:mb-0">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-xs font-semibold">
                    {feedback.profile?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{feedback.profile?.username}</span>
                      {feedback.profile?.seller_verified && (
                        <span className="text-xs text-green-600">✓</span>
                      )}
                      <span className="text-xs text-gray-500 capitalize">
                        {feedback.feedback_type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{feedback.content}</p>
                    {feedback.offer_price && (
                      <div className="text-sm text-green-600 font-medium mt-1">
                        Offer: {feedback.offer_price} NOK
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* New Feedback Form */}
        <div className="p-4">
          <div className="mb-3">
            <select 
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
            >
              <option value="comment">Comment</option>
              <option value="question">Question</option>
              <option value="interest">Show Interest</option>
              <option value="offer">Make Offer</option>
            </select>
          </div>

          {feedbackType === 'offer' && (
            <div className="mb-3">
              <input
                type="number"
                placeholder="Your offer price"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
              />
            </div>
          )}

          <div className="mb-3">
            <textarea
              placeholder="Write your feedback..."
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm resize-none"
              rows="3"
            />
          </div>

          <button
            onClick={submitFeedback}
            disabled={!newFeedback.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

// Group Access Request Component
export const GroupAccessRequest = ({ room, onRequestSent }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const submitRequest = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('group_access_requests')
        .insert({
          room_id: room.id,
          profile_id: user.id,
          request_message: message.trim() || 'Requesting to join the group'
        });

      if (error) throw error;

      onRequestSent?.();
    } catch (error) {
      console.error('Error submitting access request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">Request Access</h3>
        <p className="text-gray-600 text-sm mb-3">
          This is a private marketplace group. Tell the admins why you want to join:
        </p>
        
        <textarea
          placeholder="Hi! I'm interested in joining this group because..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border rounded-lg text-sm resize-none"
          rows="4"
        />
      </div>

      <button
        onClick={submitRequest}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending Request...' : 'Send Access Request'}
      </button>
    </div>
  );
};

// Trust System Component
export const TrustBadge = ({ user, showDetails = false }) => {
  const getTrustColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (score >= 40) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getTrustLevel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Building';
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getTrustColor(user.trust_score || 0)}`}>
        Trust: {user.trust_score || 0}/100
      </div>
      
      {user.seller_verified && (
        <div className="bg-blue-100 text-blue-800 border-blue-200 px-2 py-1 rounded-full text-xs font-medium border">
          ✓ Verified
        </div>
      )}

      {showDetails && (
        <div className="text-xs text-gray-500">
          {getTrustLevel(user.trust_score || 0)} • {user.seller_rating || 0}/5 ⭐
        </div>
      )}
    </div>
  );
};

// Mobile Location Pin Component
export const LocationPin = ({ pin, onNavigate }) => {
  const handleNavigate = () => {
    if (!pin.latitude || !pin.longitude) return;

    // Detect if iOS or Android and use appropriate maps
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const mapsUrl = isIOS 
      ? `https://maps.apple.com/?ll=${pin.latitude},${pin.longitude}&q=${encodeURIComponent(pin.title)}`
      : `https://www.google.com/maps?q=${pin.latitude},${pin.longitude}`;

    window.open(mapsUrl, '_blank');
    onNavigate?.(pin);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 mb-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-sm">{pin.title}</h4>
          {pin.description && (
            <p className="text-xs text-gray-600 mt-1">{pin.description}</p>
          )}
          {pin.address && (
            <p className="text-xs text-gray-500 mt-1">📍 {pin.address}</p>
          )}
        </div>
        
        <button
          onClick={handleNavigate}
          className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors"
        >
          Navigate
        </button>
      </div>
    </div>
  );
};

export default {
  ProductCard,
  ProductFeedback,
  GroupAccessRequest,
  TrustBadge,
  LocationPin
};
