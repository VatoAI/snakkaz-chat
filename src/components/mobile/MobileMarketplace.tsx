import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
    Store,
    Search,
    Filter,
    Plus,
    Heart,
    Share,
    Star,
    MapPin,
    Clock,
    Shield,
    Truck,
    CreditCard,
    ArrowLeft,
    MessageCircle,
    Phone,
    Eye,
    Bookmark,
    Tag
} from 'lucide-react';

interface MarketplaceItem {
    id: string;
    title: string;
    price: number;
    currency: string;
    description: string;
    images: string[];
    seller: {
        id: string;
        name: string;
        rating: number;
        verified: boolean;
    };
    category: string;
    location: string;
    createdAt: string;
    condition: 'new' | 'used' | 'refurbished';
    delivery: boolean;
    pickup: boolean;
    views: number;
    saves: number;
}

interface MobileMarketplaceProps {
    onClose?: () => void;
}

const MobileMarketplace: React.FC<MobileMarketplaceProps> = ({ onClose }) => {
    const { user } = useAuth();
    const { toast } = useToast();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('alle');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
    const [savedItems, setSavedItems] = useState<string[]>([]);

    // Mock marketplace data - in real app, this would come from Supabase
    const [items, setItems] = useState<MarketplaceItem[]>([
        {
            id: '1',
            title: 'iPhone 15 Pro - Perfekt stand',
            price: 12000,
            currency: 'NOK',
            description: 'Selger min iPhone 15 Pro i perfekt stand. Kjøpt for 3 måneder siden, alltid hatt beskyttelse på. Komplett med original eske og lader.',
            images: ['📱'],
            seller: {
                id: 'seller1',
                name: 'Lars Hansen',
                rating: 4.8,
                verified: true
            },
            category: 'elektronikk',
            location: 'Oslo',
            createdAt: new Date().toISOString(),
            condition: 'used',
            delivery: true,
            pickup: true,
            views: 234,
            saves: 12
        },
        {
            id: '2',
            title: 'Designer sofa - Som ny',
            price: 8500,
            currency: 'NOK',
            description: 'Vakker designersofa fra Ekornes. Selges grunnet flytting. Ingen skader eller slitasje.',
            images: ['🛋️'],
            seller: {
                id: 'seller2',
                name: 'Emma Nordahl',
                rating: 4.9,
                verified: true
            },
            category: 'mobler',
            location: 'Bergen',
            createdAt: new Date().toISOString(),
            condition: 'used',
            delivery: false,
            pickup: true,
            views: 156,
            saves: 8
        },
        {
            id: '3',
            title: 'Gaming PC - High-end setup',
            price: 25000,
            currency: 'NOK',
            description: 'Kraftig gaming PC med RTX 4080, Ryzen 9 7900X, 32GB RAM. Perfekt for streaming og gaming.',
            images: ['🖥️'],
            seller: {
                id: 'seller3',
                name: 'Alex Gaming',
                rating: 4.7,
                verified: true
            },
            category: 'elektronikk',
            location: 'Trondheim',
            createdAt: new Date().toISOString(),
            condition: 'used',
            delivery: true,
            pickup: true,
            views: 89,
            saves: 15
        }
    ]);

    const categories = [
        { id: 'alle', name: 'Alle kategorier', icon: '📋' },
        { id: 'elektronikk', name: 'Elektronikk', icon: '📱' },
        { id: 'mobler', name: 'Møbler', icon: '🛋️' },
        { id: 'klær', name: 'Klær', icon: '👕' },
        { id: 'bil', name: 'Bil & motor', icon: '🚗' },
        { id: 'sport', name: 'Sport', icon: '⚽' },
        { id: 'hjem', name: 'Hjem & hage', icon: '🏠' },
        { id: 'fritid', name: 'Fritid', icon: '🎮' }
    ];

    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'alle' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleSaveItem = (itemId: string) => {
        setSavedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );

        toast({
            title: savedItems.includes(itemId) ? "Fjernet fra lagrede" : "Lagret! 💾",
            description: savedItems.includes(itemId)
                ? "Varen er fjernet fra dine lagrede elementer"
                : "Varen er lagret for senere",
        });

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    };

    const handleContactSeller = (seller: MarketplaceItem['seller']) => {
        toast({
            title: "Kontakt selger 📞",
            description: `Starter chat med ${seller.name}`,
        });
        // In real app, this would open a chat with the seller
    };

    if (selectedItem) {
        return (
            <div className="mobile-chat-container bg-cyber-void">
                {/* Item Detail Header */}
                <div className="mobile-chat-header">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="mobile-button bg-white/10 flex items-center px-3 py-2 rounded-lg"
                        >
                            <ArrowLeft size={16} className="mr-2" />
                            <span className="text-sm">Tilbake</span>
                        </button>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handleSaveItem(selectedItem.id)}
                                className={`mobile-button p-2 rounded-lg ${savedItems.includes(selectedItem.id)
                                        ? 'bg-red-500/20 text-red-400'
                                        : 'bg-white/10'
                                    }`}
                            >
                                <Heart size={16} className={savedItems.includes(selectedItem.id) ? 'fill-current' : ''} />
                            </button>
                            <button className="mobile-button bg-white/10 p-2 rounded-lg">
                                <Share size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Item Detail Content */}
                <div className="mobile-chat-messages">
                    <div className="space-y-6">
                        {/* Images */}
                        <div className="text-center">
                            <div className="text-8xl mb-4">{selectedItem.images[0]}</div>
                            <div className="flex items-center justify-center space-x-4 text-xs text-white/50">
                                <div className="flex items-center">
                                    <Eye size={12} className="mr-1" />
                                    {selectedItem.views} visninger
                                </div>
                                <div className="flex items-center">
                                    <Bookmark size={12} className="mr-1" />
                                    {selectedItem.saves} lagret
                                </div>
                            </div>
                        </div>

                        {/* Price and title */}
                        <div className="mobile-card">
                            <h2 className="text-xl font-bold text-white mb-2">{selectedItem.title}</h2>
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-2xl font-bold text-aurora-cyan">
                                    {selectedItem.price.toLocaleString('no-NO')} {selectedItem.currency}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 rounded-full text-xs ${selectedItem.condition === 'new' ? 'bg-green-500/20 text-green-400' :
                                            selectedItem.condition === 'used' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {selectedItem.condition === 'new' ? 'Ny' :
                                            selectedItem.condition === 'used' ? 'Brukt' : 'Renovert'}
                                    </span>
                                </div>
                            </div>

                            <p className="text-white/70 text-sm leading-relaxed">
                                {selectedItem.description}
                            </p>
                        </div>

                        {/* Seller info */}
                        <div className="mobile-card">
                            <h3 className="text-white font-semibold mb-3">Selger</h3>
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-aurora-blue to-aurora-cyan flex items-center justify-center">
                                    <span className="text-white font-semibold">
                                        {selectedItem.seller.name.charAt(0)}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-white font-medium">{selectedItem.seller.name}</span>
                                        {selectedItem.seller.verified && (
                                            <Shield size={14} className="text-aurora-green" />
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-white/70">
                                        <div className="flex items-center">
                                            <Star size={12} className="text-yellow-400 mr-1" />
                                            {selectedItem.seller.rating}
                                        </div>
                                        <span>•</span>
                                        <div className="flex items-center">
                                            <MapPin size={12} className="mr-1" />
                                            {selectedItem.location}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery options */}
                        <div className="mobile-card">
                            <h3 className="text-white font-semibold mb-3">Levering</h3>
                            <div className="space-y-3">
                                {selectedItem.pickup && (
                                    <div className="flex items-center space-x-3">
                                        <MapPin size={16} className="text-aurora-cyan" />
                                        <div>
                                            <div className="text-white text-sm font-medium">Henting</div>
                                            <div className="text-white/60 text-xs">Hent hos selger i {selectedItem.location}</div>
                                        </div>
                                    </div>
                                )}
                                {selectedItem.delivery && (
                                    <div className="flex items-center space-x-3">
                                        <Truck size={16} className="text-aurora-green" />
                                        <div>
                                            <div className="text-white text-sm font-medium">Levering</div>
                                            <div className="text-white/60 text-xs">Selger kan sende varen</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact actions */}
                <div className="mobile-chat-input">
                    <div className="flex space-x-3">
                        <button
                            onClick={() => handleContactSeller(selectedItem.seller)}
                            className="flex-1 mobile-button bg-gradient-to-r from-aurora-blue to-aurora-cyan flex items-center justify-center"
                        >
                            <MessageCircle size={16} className="mr-2" />
                            Send melding
                        </button>
                        <button className="mobile-button bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 p-3 rounded-lg">
                            <Phone size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mobile-chat-container bg-cyber-void">
            {/* Marketplace Header */}
            <div className="mobile-chat-header">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="mobile-button bg-white/10 p-2 rounded-lg"
                            >
                                <ArrowLeft size={16} />
                            </button>
                        )}
                        <div>
                            <h1 className="text-white font-bold text-lg flex items-center">
                                <Store size={20} className="mr-2" />
                                SnakkaZ Marketplace
                            </h1>
                            <p className="text-white/70 text-sm">Trygg handel mellom nordmenn</p>
                        </div>
                    </div>
                    <button className="mobile-button bg-aurora-blue/20 p-2 rounded-lg">
                        <Plus size={16} />
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mobile-input pl-10 pr-12"
                        placeholder="Søk etter produkter..."
                    />
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
                    >
                        <Filter size={16} />
                    </button>
                </div>

                {/* Categories */}
                <div className="flex space-x-2 overflow-x-auto pb-2">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex-shrink-0 mobile-button px-3 py-2 rounded-lg flex items-center space-x-2 ${selectedCategory === category.id
                                    ? 'bg-aurora-blue/30 border border-aurora-blue/50'
                                    : 'bg-white/5 hover:bg-white/10'
                                }`}
                        >
                            <span className="text-sm">{category.icon}</span>
                            <span className="text-sm whitespace-nowrap">{category.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Items Grid */}
            <div className="mobile-chat-messages">
                <div className="mobile-marketplace-grid">
                    {filteredItems.map(item => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className="mobile-marketplace-item cursor-pointer hover:bg-white/10 transition-colors"
                        >
                            <div className="relative">
                                <div className="text-4xl mb-3 text-center">{item.images[0]}</div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSaveItem(item.id);
                                    }}
                                    className={`absolute top-0 right-0 p-1 rounded-full ${savedItems.includes(item.id)
                                            ? 'bg-red-500/20 text-red-400'
                                            : 'bg-white/10 text-white/50'
                                        }`}
                                >
                                    <Heart size={12} className={savedItems.includes(item.id) ? 'fill-current' : ''} />
                                </button>
                            </div>

                            <h3 className="text-white font-medium text-sm mb-2 line-clamp-2">
                                {item.title}
                            </h3>

                            <div className="text-aurora-cyan font-bold text-lg mb-2">
                                {item.price.toLocaleString('no-NO')} kr
                            </div>

                            <div className="flex items-center justify-between text-xs text-white/50">
                                <div className="flex items-center">
                                    <MapPin size={10} className="mr-1" />
                                    {item.location}
                                </div>
                                <div className="flex items-center">
                                    <Clock size={10} className="mr-1" />
                                    i dag
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center">
                                    <Star size={10} className="text-yellow-400 mr-1" />
                                    <span className="text-xs text-white/60">{item.seller.rating}</span>
                                </div>
                                {item.seller.verified && (
                                    <Shield size={10} className="text-aurora-green" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-12">
                        <Store size={48} className="mx-auto text-white/30 mb-4" />
                        <h3 className="text-white font-semibold mb-2">Ingen produkter funnet</h3>
                        <p className="text-white/60 text-sm">
                            Prøv å endre søkeord eller kategori
                        </p>
                    </div>
                )}
            </div>

            {/* Bottom info */}
            <div className="mobile-chat-input">
                <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center space-x-4 text-xs text-white/70">
                        <div className="flex items-center">
                            <Shield size={12} className="mr-1 text-aurora-green" />
                            Sikker handel
                        </div>
                        <div className="flex items-center">
                            <CreditCard size={12} className="mr-1 text-aurora-blue" />
                            Beskyttet betaling
                        </div>
                        <div className="flex items-center">
                            <Star size={12} className="mr-1 text-yellow-400" />
                            Vurderte selgere
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileMarketplace;
