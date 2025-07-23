/**
 * SnakkaZ Marketplace Mobile App
 * Main marketplace interface for seller groups
 * Created: 2025-07-22
 */

import React, { useState, useEffect } from 'react';
import { ProductCard, GroupAccessRequest, TrustBadge, LocationPin } from './MarketplaceComponents';

// Mock data for development
const mockProducts = [
  {
    id: '1',
    title: 'iPhone 14 Pro Max 256GB - Perfekt stand',
    description: 'Selger min iPhone 14 Pro Max. Kun brukt i 6 måneder med skjermbeskytter og deksel hele tiden.',
    price: 12500,
    currency: 'NOK',
    condition: 'like_new',
    category: 'Electronics',
    images: ['https://via.placeholder.com/400x300?text=iPhone+14+Pro'],
    location_name: 'Oslo Sentrum',
    is_featured: true,
    like_count: 15,
    view_count: 89,
    seller: {
      username: 'techseller99',
      seller_verified: true,
      trust_score: 92,
      seller_rating: 4.8
    }
  },
  {
    id: '2',
    title: 'MacBook Air M2 - 2022 modell',
    description: 'Perfekt for studenter og lett arbeid. Inkluderer originalemballasje og lader.',
    price: 8900,
    currency: 'NOK',
    condition: 'good',
    category: 'Electronics',
    images: ['https://via.placeholder.com/400x300?text=MacBook+Air'],
    location_name: 'Bergen',
    like_count: 8,
    view_count: 45,
    seller: {
      username: 'studentselger',
      seller_verified: false,
      trust_score: 67,
      seller_rating: 4.2
    }
  }
];

const mockGroups = [
  {
    id: '1',
    name: 'Oslo Elektronikk - Verifiserte Selgere',
    description: 'Trygg handel med elektronikk i Oslo området. Kun verifiserte selgere.',
    is_marketplace: true,
    requires_approval: true,
    business_category: 'Electronics',
    location_name: 'Oslo, Norge',
    member_count: 234
  },
  {
    id: '2',
    name: 'Bergen Fashion & Klær',
    description: 'Mote og klær i Bergen. Både nye og brukte varer.',
    is_marketplace: true,
    requires_approval: true,
    business_category: 'Fashion',
    location_name: 'Bergen, Norge',
    member_count: 156
  }
];

export const MarketplaceApp = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [products, setProducts] = useState(mockProducts);
  const [groups, setGroups] = useState(mockGroups);
  const [userLocation, setUserLocation] = useState(null);

  const currentUser = { id: 'current-user', username: 'currentuser' };

  // Get user location for location-based features
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log('Location access denied')
      );
    }
  }, []);

  const handleProductLike = (productId, liked) => {
    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, like_count: p.like_count + (liked ? 1 : -1) }
        : p
    ));
  };

  const TabButton = ({ id, label, icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex-1 flex flex-col items-center py-2 px-1 text-xs font-medium transition-colors ${
        active 
          ? 'text-blue-600 border-b-2 border-blue-600' 
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      <span className="text-lg mb-1">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">SnakkaZ</h1>
            <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              Beta
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative">
              <span className="text-lg">🔔</span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
            <button className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-semibold">
              {currentUser.username.charAt(0).toUpperCase()}
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-t bg-white">
          <TabButton 
            id="feed" 
            label="Feed" 
            icon="🏪" 
            active={activeTab === 'feed'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            id="groups" 
            label="Groups" 
            icon="👥" 
            active={activeTab === 'groups'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            id="map" 
            label="Map" 
            icon="🗺️" 
            active={activeTab === 'map'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            id="sell" 
            label="Sell" 
            icon="➕" 
            active={activeTab === 'sell'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            id="profile" 
            label="Profile" 
            icon="👤" 
            active={activeTab === 'profile'} 
            onClick={setActiveTab} 
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {/* Product Feed */}
        {activeTab === 'feed' && (
          <div className="p-4">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Latest Products</h2>
                <button className="text-blue-600 text-sm font-medium">Filter</button>
              </div>
              
              {/* Location indicator */}
              {userLocation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-blue-800 text-sm">
                    <span>📍</span>
                    <span>Showing products near your location</span>
                  </div>
                </div>
              )}
            </div>

            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onLike={handleProductLike}
                currentUser={currentUser}
              />
            ))}
          </div>
        )}

        {/* Groups Tab */}
        {activeTab === 'groups' && (
          <div className="p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-3">Marketplace Groups</h2>
              <div className="text-sm text-gray-600 mb-3">
                Join seller groups in your area for trusted marketplace access
              </div>
            </div>

            {groups.map(group => (
              <div key={group.id} className="bg-white rounded-lg shadow-md mb-4 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{group.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{group.description}</p>
                  </div>
                  {group.requires_approval && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      Approval Required
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span>👥 {group.member_count} members</span>
                  <span>📍 {group.location_name}</span>
                  <span className="capitalize">📦 {group.business_category}</span>
                </div>

                <button
                  onClick={() => setSelectedGroup(group)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {group.requires_approval ? 'Request Access' : 'Join Group'}
                </button>
              </div>
            ))}

            {/* Group Access Request Modal */}
            {selectedGroup && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
                <div className="bg-white rounded-t-xl w-full max-h-[80vh] overflow-y-auto">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Join {selectedGroup.name}</h3>
                    <button 
                      onClick={() => setSelectedGroup(null)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-4">
                    <GroupAccessRequest 
                      room={selectedGroup} 
                      onRequestSent={() => {
                        setSelectedGroup(null);
                        alert('Access request sent! You will be notified when approved.');
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Map Tab */}
        {activeTab === 'map' && (
          <div className="p-4">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h2 className="text-lg font-semibold mb-3">Location-Based Products</h2>
              <div className="text-sm text-gray-600 mb-3">
                Find products and sellers near you
              </div>
              
              {/* Map placeholder */}
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-4">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">🗺️</div>
                  <div>Interactive Map</div>
                  <div className="text-sm">Shows nearby products and sellers</div>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium">
                Open in Maps App
              </button>
            </div>

            {/* Nearby products list */}
            <div className="space-y-2">
              <h3 className="font-medium">Nearby Products</h3>
              {products.slice(0, 3).map(product => (
                <LocationPin
                  key={product.id}
                  pin={{
                    id: product.id,
                    title: product.title,
                    description: `${product.price} ${product.currency}`,
                    latitude: 59.9139, // Oslo coordinates
                    longitude: 10.7522,
                    address: product.location_name
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sell Tab */}
        {activeTab === 'sell' && (
          <div className="p-4">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-6xl mb-4">📸</div>
              <h2 className="text-xl font-semibold mb-2">Sell Your Products</h2>
              <p className="text-gray-600 text-sm mb-6">
                Take photos, set your price, and reach verified buyers in your area
              </p>
              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium text-lg mb-3">
                + Create New Listing
              </button>
              <div className="text-xs text-gray-500">
                Join marketplace groups to start selling
              </div>
            </div>

            {/* Selling tips */}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">Selling Tips</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Take clear, well-lit photos</li>
                <li>• Write detailed descriptions</li>
                <li>• Set competitive prices</li>
                <li>• Respond quickly to buyers</li>
                <li>• Meet in safe, public places</li>
              </ul>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="p-4">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-semibold flex items-center justify-center">
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{currentUser.username}</h2>
                  <TrustBadge user={{ trust_score: 85, seller_verified: true, seller_rating: 4.7 }} showDetails />
                </div>
                <button className="text-blue-600 text-sm font-medium">Edit</button>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-lg font-semibold">12</div>
                  <div className="text-xs text-gray-500">Products Sold</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">4.7</div>
                  <div className="text-xs text-gray-500">Avg Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">85%</div>
                  <div className="text-xs text-gray-500">Trust Score</div>
                </div>
              </div>
            </div>

            {/* Profile actions */}
            <div className="space-y-3">
              <button className="w-full bg-white border rounded-lg p-4 text-left flex items-center justify-between">
                <span>🛡️ Verification Status</span>
                <span className="text-sm text-green-600">Verified</span>
              </button>
              <button className="w-full bg-white border rounded-lg p-4 text-left flex items-center justify-between">
                <span>📊 Sales Analytics</span>
                <span className="text-gray-400">→</span>
              </button>
              <button className="w-full bg-white border rounded-lg p-4 text-left flex items-center justify-between">
                <span>⚙️ Settings</span>
                <span className="text-gray-400">→</span>
              </button>
              <button className="w-full bg-white border rounded-lg p-4 text-left flex items-center justify-between">
                <span>❓ Help & Support</span>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MarketplaceApp;
