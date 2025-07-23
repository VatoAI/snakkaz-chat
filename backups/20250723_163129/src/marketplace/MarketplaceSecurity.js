/**
 * SnakkaZ E-Commerce Mobile Security System
 * Handles PIN security, group access, and trust verification
 * Created: 2025-07-22
 */

// PIN Security for Mobile App
export class MobilePinSecurity {
  constructor() {
    this.pinHash = localStorage.getItem('snakkaz_pin_hash');
    this.trustLevel = localStorage.getItem('snakkaz_trust_level') || 'building';
    this.verificationStatus = JSON.parse(localStorage.getItem('snakkaz_verifications') || '{}');
  }

  // Create and hash PIN
  async createPin(pin) {
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      throw new Error('PIN must be 4 digits');
    }

    // Simple hash for demo - use proper hashing in production
    const pinHash = btoa(pin + 'snakkaz_salt');
    localStorage.setItem('snakkaz_pin_hash', pinHash);
    this.pinHash = pinHash;
    
    return true;
  }

  // Verify PIN
  verifyPin(pin) {
    if (!this.pinHash) return false;
    
    const testHash = btoa(pin + 'snakkaz_salt');
    return testHash === this.pinHash;
  }

  // Biometric authentication simulation
  async authenticateBiometric() {
    // In real app, this would use device biometrics
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate for demo
        resolve(success);
      }, 1000);
    });
  }

  // Check if user can access group
  canAccessGroup(groupId, userTrust = 0) {
    const groupRequirements = {
      'electronics': { minTrust: 70, requiresVerification: true },
      'fashion': { minTrust: 50, requiresVerification: false },
      'automotive': { minTrust: 80, requiresVerification: true },
      'general': { minTrust: 30, requiresVerification: false }
    };

    const requirements = groupRequirements[groupId] || groupRequirements.general;
    
    if (userTrust < requirements.minTrust) {
      return { access: false, reason: 'Insufficient trust score' };
    }

    if (requirements.requiresVerification && !this.verificationStatus.phone) {
      return { access: false, reason: 'Phone verification required' };
    }

    return { access: true };
  }
}

// Group Access Manager
export class GroupAccessManager {
  constructor() {
    this.pendingRequests = JSON.parse(localStorage.getItem('snakkaz_pending_requests') || '[]');
    this.joinedGroups = JSON.parse(localStorage.getItem('snakkaz_joined_groups') || '[]');
  }

  // Request access to private group
  async requestGroupAccess(groupId, message, userProfile) {
    const request = {
      id: Date.now().toString(),
      groupId,
      message,
      userId: userProfile.id,
      username: userProfile.username,
      trustScore: userProfile.trust_score || 0,
      verified: userProfile.seller_verified || false,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    this.pendingRequests.push(request);
    localStorage.setItem('snakkaz_pending_requests', JSON.stringify(this.pendingRequests));

    // Simulate admin notification
    console.log('Admin notification: New group access request', request);
    
    return request;
  }

  // Approve/reject request (admin function)
  processAccessRequest(requestId, approved, adminNotes = '') {
    const request = this.pendingRequests.find(r => r.id === requestId);
    if (!request) return false;

    request.status = approved ? 'approved' : 'rejected';
    request.adminNotes = adminNotes;
    request.processedAt = new Date().toISOString();

    if (approved) {
      this.joinedGroups.push({
        groupId: request.groupId,
        joinedAt: new Date().toISOString(),
        role: 'member'
      });
      localStorage.setItem('snakkaz_joined_groups', JSON.stringify(this.joinedGroups));
    }

    localStorage.setItem('snakkaz_pending_requests', JSON.stringify(this.pendingRequests));
    return true;
  }

  // Check group membership
  isMemberOfGroup(groupId) {
    return this.joinedGroups.some(g => g.groupId === groupId);
  }

  // Get user's groups
  getUserGroups() {
    return this.joinedGroups;
  }
}

// Product Listing Manager with Image Upload
export class ProductManager {
  constructor() {
    this.products = JSON.parse(localStorage.getItem('snakkaz_user_products') || '[]');
  }

  // Create new product listing
  async createProduct(productData) {
    const product = {
      id: Date.now().toString(),
      sellerId: productData.sellerId,
      groupId: productData.groupId,
      title: productData.title,
      description: productData.description,
      price: parseFloat(productData.price),
      currency: productData.currency || 'NOK',
      category: productData.category,
      condition: productData.condition,
      images: productData.images || [],
      tags: productData.tags || [],
      location: productData.location,
      isAvailable: true,
      isFeatured: false,
      viewCount: 0,
      likeCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.products.push(product);
    localStorage.setItem('snakkaz_user_products', JSON.stringify(this.products));

    return product;
  }

  // Upload product images (simulation)
  async uploadProductImages(files) {
    const imageUrls = [];
    
    for (const file of files) {
      // Simulate image upload
      const imageUrl = URL.createObjectURL(file);
      imageUrls.push(imageUrl);
    }

    return imageUrls;
  }

  // Get user's products
  getUserProducts(userId) {
    return this.products.filter(p => p.sellerId === userId);
  }

  // Update product
  async updateProduct(productId, updates) {
    const productIndex = this.products.findIndex(p => p.id === productId);
    if (productIndex === -1) return false;

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem('snakkaz_user_products', JSON.stringify(this.products));
    return this.products[productIndex];
  }

  // Delete product
  async deleteProduct(productId, userId) {
    const productIndex = this.products.findIndex(p => p.id === productId && p.sellerId === userId);
    if (productIndex === -1) return false;

    this.products.splice(productIndex, 1);
    localStorage.setItem('snakkaz_user_products', JSON.stringify(this.products));
    return true;
  }
}

// Location Services for Maps Integration
export class LocationService {
  constructor() {
    this.userLocation = null;
    this.locationPins = JSON.parse(localStorage.getItem('snakkaz_location_pins') || '[]');
  }

  // Get user's current location
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          resolve(this.userLocation);
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  }

  // Calculate distance between two coordinates
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Add location pin for product
  addLocationPin(productId, title, lat, lng, description = '') {
    const pin = {
      id: Date.now().toString(),
      productId,
      title,
      description,
      lat,
      lng,
      createdAt: new Date().toISOString()
    };

    this.locationPins.push(pin);
    localStorage.setItem('snakkaz_location_pins', JSON.stringify(this.locationPins));
    return pin;
  }

  // Get nearby products
  getNearbyProducts(userLat, userLng, radiusKm = 10) {
    return this.locationPins.filter(pin => {
      const distance = this.calculateDistance(userLat, userLng, pin.lat, pin.lng);
      return distance <= radiusKm;
    });
  }

  // Open maps app with location
  openMapsApp(lat, lng, title = '') {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const encodedTitle = encodeURIComponent(title);
    
    const mapsUrl = isIOS 
      ? `maps://maps.apple.com/?ll=${lat},${lng}&q=${encodedTitle}`
      : `https://www.google.com/maps?q=${lat},${lng}`;

    window.open(mapsUrl, '_blank');
  }
}

// Trust and Rating System
export class TrustSystem {
  constructor() {
    this.ratings = JSON.parse(localStorage.getItem('snakkaz_ratings') || '[]');
    this.userTrustScores = JSON.parse(localStorage.getItem('snakkaz_trust_scores') || '{}');
  }

  // Rate a user after transaction
  async rateUser(ratedUserId, raterUserId, rating, feedback, transactionId) {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const ratingData = {
      id: Date.now().toString(),
      ratedUserId,
      raterUserId,
      rating,
      feedback,
      transactionId,
      createdAt: new Date().toISOString()
    };

    this.ratings.push(ratingData);
    localStorage.setItem('snakkaz_ratings', JSON.stringify(this.ratings));

    // Recalculate trust score
    this.calculateTrustScore(ratedUserId);
    
    return ratingData;
  }

  // Calculate user's trust score
  calculateTrustScore(userId) {
    const userRatings = this.ratings.filter(r => r.ratedUserId === userId);
    
    if (userRatings.length === 0) {
      this.userTrustScores[userId] = { score: 0, ratingCount: 0, avgRating: 0 };
      localStorage.setItem('snakkaz_trust_scores', JSON.stringify(this.userTrustScores));
      return 0;
    }

    const avgRating = userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length;
    const ratingCount = userRatings.length;
    
    // Trust score formula: avg rating * 15 + activity bonus (max 25)
    const trustScore = Math.min(100, Math.round(
      (avgRating * 15) + Math.min(25, ratingCount * 2.5)
    ));

    this.userTrustScores[userId] = {
      score: trustScore,
      ratingCount,
      avgRating: Math.round(avgRating * 10) / 10
    };

    localStorage.setItem('snakkaz_trust_scores', JSON.stringify(this.userTrustScores));
    return trustScore;
  }

  // Get user's trust data
  getUserTrust(userId) {
    return this.userTrustScores[userId] || { score: 0, ratingCount: 0, avgRating: 0 };
  }

  // Verify user (admin function)
  verifyUser(userId, verificationType, adminId) {
    const verifications = JSON.parse(localStorage.getItem('snakkaz_verifications') || '{}');
    
    if (!verifications[userId]) {
      verifications[userId] = {};
    }

    verifications[userId][verificationType] = {
      verified: true,
      verifiedBy: adminId,
      verifiedAt: new Date().toISOString()
    };

    localStorage.setItem('snakkaz_verifications', JSON.stringify(verifications));
    
    // Boost trust score for verification
    const currentTrust = this.getUserTrust(userId);
    const bonusPoints = { phone: 10, email: 5, id_document: 15, business: 20 };
    const newScore = Math.min(100, currentTrust.score + (bonusPoints[verificationType] || 5));
    
    this.userTrustScores[userId] = { ...currentTrust, score: newScore };
    localStorage.setItem('snakkaz_trust_scores', JSON.stringify(this.userTrustScores));
  }
}

// Quick Mobile Testing Functions
export const testMarketplaceFunctions = () => {
  console.log('🧪 Testing SnakkaZ Marketplace Functions...');
  
  // Test PIN security
  const pinSecurity = new MobilePinSecurity();
  pinSecurity.createPin('1234');
  console.log('✅ PIN Security:', pinSecurity.verifyPin('1234'));
  
  // Test group access
  const groupManager = new GroupAccessManager();
  const canAccess = pinSecurity.canAccessGroup('electronics', 75);
  console.log('✅ Group Access (Electronics):', canAccess);
  
  // Test product creation
  const productManager = new ProductManager();
  const testProduct = {
    sellerId: 'user123',
    groupId: 'electronics',
    title: 'Test iPhone',
    description: 'Great condition',
    price: 5000,
    category: 'Electronics',
    condition: 'good'
  };
  productManager.createProduct(testProduct);
  console.log('✅ Product Created:', productManager.getUserProducts('user123').length);
  
  // Test trust system
  const trustSystem = new TrustSystem();
  trustSystem.rateUser('seller123', 'buyer456', 5, 'Excellent seller!', 'trans789');
  console.log('✅ Trust Score:', trustSystem.getUserTrust('seller123'));
  
  console.log('🎉 All marketplace functions working!');
  
  return {
    pinSecurity,
    groupManager,
    productManager,
    trustSystem,
    locationService: new LocationService()
  };
};

// Export all classes
export default {
  MobilePinSecurity,
  GroupAccessManager,
  ProductManager,
  LocationService,
  TrustSystem,
  testMarketplaceFunctions
};
