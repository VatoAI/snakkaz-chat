
import React, { useState, useEffect } from 'react';
import { Plus, PackageSearch, RefreshCcw, Loader2, ShoppingBag, MapPin, GiftIcon, PinIcon, Star, BadgeCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductEntry, ProductData } from './ProductEntry';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Utvidede interface for produktdata med nye funksjoner
export interface ExtendedProductData extends ProductData {
  location?: {
    address: string;
    latitude: number;
    longitude: number;
  };
  isPinned?: boolean;
  rating?: number;
  ratingCount?: number;
  gifUrl?: string;
  sellerVerified?: boolean;
  // Nye felt for Telegram Business-lignende funksjoner
  businessProfile?: BusinessProfile;
  openingHours?: OpeningHours[];
  quickReplies?: QuickReply[];
  paymentOptions?: PaymentOption[];
  analytics?: ProductAnalytics;
}

// Nye interfaces for Business-funksjoner
interface BusinessProfile {
  name: string;
  description: string;
  logoUrl: string;
  coverImageUrl?: string;
  isVerified: boolean;
  website?: string;
  contactEmail?: string;
  phoneNumber?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  categoriesIds: string[];
}

interface OpeningHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}

interface QuickReply {
  id: string;
  triggerText: string;
  responseText: string;
  isActive: boolean;
}

interface PaymentOption {
  id: string;
  provider: 'vipps' | 'stripe' | 'paypal' | 'bank' | 'cash' | 'other';
  isEnabled: boolean;
  accountDetails?: string;
  fees?: number; // i prosent
}

interface ProductAnalytics {
  views: number;
  inquiries: number;
  sales: number;
  conversionRate?: number;
  lastUpdated: string;
}

// Ny interface for abonnenter
interface GroupSubscriber {
  id: string;
  userId: string;
  groupId: string;
  username: string;
  avatarUrl?: string;
  isActive: boolean;
  subscribedSince: string;
  isVerified?: boolean;
}

interface GroupMarketplaceProps {
  groupId: string;
  isGroupAdmin?: boolean;
  isPremiumGroup: boolean;
  onClose?: () => void;
  className?: string;
}

const BusinessProfileSection = ({ product }: { product: ExtendedProductData }) => {
  if (!product.businessProfile) return null;
  
  const { name, description, logoUrl, coverImageUrl, isVerified, website, contactEmail, phoneNumber, socialLinks } = product.businessProfile;
  
  return (
    <div className="bg-card rounded-lg p-4 mb-4 shadow-sm">
      <div className="relative">
        {coverImageUrl && (
          <div className="h-32 overflow-hidden rounded-t-lg">
            <img src={coverImageUrl} alt={`${name} cover`} className="w-full object-cover" />
          </div>
        )}
        <div className="flex items-center mt-2">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
            <img src={logoUrl || '/placeholder.svg'} alt={name} className="w-full h-full object-cover" />
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center">
              <h3 className="text-lg font-bold">{name}</h3>
              {isVerified && (
                <span className="ml-1 text-blue-500" title="Verifisert bedrift">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
        {website && (
          <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-primary hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            {website.replace(/^https?:\/\//, '')}
          </a>
        )}
        {contactEmail && (
          <a href={`mailto:${contactEmail}`} className="flex items-center text-sm text-primary hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            {contactEmail}
          </a>
        )}
        {phoneNumber && (
          <a href={`tel:${phoneNumber}`} className="flex items-center text-sm text-primary hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            {phoneNumber}
          </a>
        )}
      </div>
      
      {socialLinks && Object.keys(socialLinks).length > 0 && (
        <div className="mt-3 flex space-x-4">
          {socialLinks.facebook && (
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
              </svg>
            </a>
          )}
          {socialLinks.instagram && (
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428.247-.67.657-1.28 1.153-1.772a4.887 4.887 0 011.772-1.153c.637-.247 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.8c-2.67 0-2.986.01-4.04.06-.976.045-1.505.207-1.858.344-.466.181-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.055-.06 1.37-.06 4.04 0 2.668.01 2.985.06 4.04.046.976.207 1.504.344 1.857.181.466.399.8.748 1.15.35.35.683.565 1.15.747.353.137.882.3 1.857.345 1.054.046 1.37.06 4.04.06 2.67 0 2.987-.01 4.04-.06.976-.046 1.505-.208 1.858-.345.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.352.3-.88.344-1.857.047-1.054.06-1.37.06-4.04 0-2.667-.01-2.984-.06-4.04-.045-.975-.207-1.503-.344-1.856a3.09 3.09 0 00-.748-1.15 3.09 3.09 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.345-1.054-.047-1.37-.06-4.04-.06zm0 3.064A5.139 5.139 0 0017.14 12 5.139 5.139 0 0012 17.14 5.139 5.139 0 006.86 12 5.139 5.139 0 0012 6.86zm0 8.476a3.335 3.335 0 110-6.67 3.335 3.335 0 010 6.67zm6.538-8.686a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" />
              </svg>
            </a>
          )}
          {socialLinks.twitter && (
            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M22.162 5.656a8.384 8.384 0 01-2.402.658A4.196 4.196 0 0021.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 00-7.126 3.814 11.874 11.874 0 01-8.62-4.37 4.168 4.168 0 00-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 01-1.894-.523v.052a4.185 4.185 0 003.355 4.101 4.21 4.21 0 01-1.89.072A4.185 4.185 0 007.97 16.65a8.394 8.394 0 01-6.191 1.732 11.83 11.83 0 006.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 002.087-2.165z" />
              </svg>
            </a>
          )}
          {socialLinks.linkedin && (
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export const GroupMarketplace: React.FC<GroupMarketplaceProps> = ({
  groupId,
  isGroupAdmin = false,
  isPremiumGroup,
  onClose,
  className = '',
}) => {
  const [products, setProducts] = useState<ExtendedProductData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddingProduct, setIsAddingProduct] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('active');
  const [subscribers, setSubscribers] = useState<GroupSubscriber[]>([]);
  const [showSubscribers, setShowSubscribers] = useState<boolean>(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ExtendedProductData | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();
  const { isUserAdmin } = useIsAdmin();

  // Filtrer produkter basert på søk og aktiv tab
  const filteredProducts = products
    .filter(product => 
      (activeTab === 'all' || 
       (activeTab === 'active' && product.inStock) || 
       (activeTab === 'mine' && product.createdBy === user?.id) ||
       (activeTab === 'pinned' && product.isPinned))
    )
    .filter(product => 
      searchQuery ? 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    );

  // Sorter slik at pinnede produkter vises øverst
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  useEffect(() => {
    // Sjekk om brukeren har premium eller gruppen er premium
    if (!isPremiumGroup) {
      // Hvis dette ikke er en premium-gruppe, vis en melding om at markedsplassen krever premium
      toast({
        title: "Premium-funksjon",
        description: "Markedsplassen er kun tilgjengelig i premium-grupper.",
        variant: "destructive"
      });
      if (onClose) onClose();
      return;
    }
    
    fetchProducts();
    fetchSubscribers();
  }, [groupId]);

  // Funksjon for å hente produkter fra Supabase
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // I en virkelig implementasjon ville dette være et kall til Supabase
      // For demo-formål setter vi demo-produkter
      
      // Simuler henting av produkter 
      setTimeout(() => {
        const demoProducts: ExtendedProductData[] = [
          {
            id: '1',
            title: 'Norsk håndlaget genser',
            description: 'Varm, myk genser laget av 100% norsk ull. Perfekt for kalde vinterdager.',
            price: 1200,
            currency: 'NOK',
            imageUrl: 'https://picsum.photos/seed/product1/300/200',
            inStock: true,
            quantity: 5,
            contactInfo: 'Ring 98765432',
            createdBy: user?.id,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            isPinned: true,
            rating: 4.8,
            ratingCount: 12,
            sellerVerified: true,
            location: {
              address: "Karl Johans gate 1, Oslo",
              latitude: 59.9139,
              longitude: 10.7522
            }
          },
          {
            id: '2',
            title: 'Vintage kamera',
            description: 'Pentax kamera fra 70-tallet i god stand. Selges som samleobjekt.',
            price: 800,
            currency: 'NOK',
            imageUrl: 'https://picsum.photos/seed/product2/300/200', 
            inStock: true,
            quantity: 1, 
            createdBy: 'other-user-id',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            rating: 4.2,
            ratingCount: 8,
            gifUrl: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif'
          },
          {
            id: '3',
            title: 'Gaming PC',
            description: 'Kraftig gaming PC med RTX 4070, 32GB RAM og rask SSD. Perfekt for moderne spill.',
            price: 15000,
            currency: 'NOK',
            imageUrl: 'https://picsum.photos/seed/product3/300/200',
            inStock: false,
            contactInfo: 'Send melding for detaljer',
            createdBy: user?.id,
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            location: {
              address: "Storgata 32, Bergen",
              latitude: 60.3913,
              longitude: 5.3221
            }
          }
        ];
        
        setProducts(demoProducts);
        setLoading(false);
      }, 800);
      
      // Virkelig implementasjon ville være:
      // const { data, error } = await supabase
      //   .from('group_products')
      //   .select('*')
      //   .eq('group_id', groupId);
      // 
      // if (error) throw error;
      // setProducts(data || []);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Feil ved henting av produkter",
        description: "Kunne ikke laste inn produktene. Vennligst prøv igjen senere.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Funksjon for å hente abonnenter
  const fetchSubscribers = async () => {
    try {
      // Demo-data for abonnenter
      const demoSubscribers: GroupSubscriber[] = [
        {
          id: '1',
          userId: 'user-1',
          groupId,
          username: 'JohnDoe',
          avatarUrl: 'https://i.pravatar.cc/150?img=1',
          isActive: true,
          subscribedSince: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          isVerified: true
        },
        {
          id: '2',
          userId: 'user-2',
          groupId,
          username: 'JaneSmith',
          avatarUrl: 'https://i.pravatar.cc/150?img=2',
          isActive: true,
          subscribedSince: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          userId: 'user-3',
          groupId,
          username: 'RobertJohnson',
          avatarUrl: 'https://i.pravatar.cc/150?img=3',
          isActive: false,
          subscribedSince: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          isVerified: true
        }
      ];
      
      setSubscribers(demoSubscribers);
      
      // Virkelig implementasjon ville være:
      // const { data, error } = await supabase
      //   .from('group_subscribers')
      //   .select('*')
      //   .eq('group_id', groupId);
      // 
      // if (error) throw error;
      // setSubscribers(data || []);
      
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    }
  };

  // Lagre nytt produkt
  const handleSaveProduct = async (productData: ExtendedProductData) => {
    try {
      // Verifiser at gruppen er premium
      if (!isPremiumGroup) {
        toast({
          title: "Premium-funksjon",
          description: "Kun premium-grupper kan bruke markedsplassen.",
          variant: "destructive"
        });
        return;
      }
      
      // Legg til bruker-ID og dato
      const now = new Date().toISOString();
      const newProduct = {
        ...productData,
        createdBy: user?.id,
        createdAt: now,
        updatedAt: now,
        groupId: groupId
      };
      
      if (productData.id) {
        // Oppdater eksisterende produkt
        // Simuler lagring
        const updatedProducts = products.map(p => 
          p.id === productData.id ? { ...newProduct, id: p.id } : p
        );
        setProducts(updatedProducts);
        
        // Virkelig implementasjon:
        // const { error } = await supabase
        //   .from('group_products')
        //   .update(newProduct)
        //   .eq('id', productData.id);
        // if (error) throw error;
        
        toast({
          title: "Produkt oppdatert",
          description: "Produktet ditt er oppdatert i markedsplassen.",
          variant: "default"
        });
      } else {
        // Opprett nytt produkt
        // Simuler lagring
        const newId = `tmp-${Date.now()}`;
        setProducts([...products, { ...newProduct, id: newId }]);
        
        // Virkelig implementasjon:
        // const { data, error } = await supabase
        //   .from('group_products')
        //   .insert(newProduct)
        //   .select();
        // if (error) throw error;
        
        toast({
          title: "Produkt opprettet",
          description: "Ditt produkt er lagt til i markedsplassen.",
          variant: "default"
        });
      }
      
      setIsAddingProduct(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Feil ved lagring",
        description: "Kunne ikke lagre produktet. Vennligst prøv igjen senere.",
        variant: "destructive"
      });
    }
  };

  // Marker produkt som pinned/fremhevet
  const toggleProductPin = (productId: string) => {
    const updatedProducts = products.map(product => 
      product.id === productId 
        ? { ...product, isPinned: !product.isPinned } 
        : product
    );
    setProducts(updatedProducts);
    
    // Vis melding
    const product = products.find(p => p.id === productId);
    toast({
      title: product?.isPinned ? "Produkt fjernet fra fremhevet" : "Produkt markert som fremhevet",
      description: product?.isPinned 
        ? "Produktet vises ikke lenger øverst i listen."
        : "Produktet vises nå øverst i markedsplassen.",
      variant: "default"
    });
  };

  // Marker bruker som verifisert
  const toggleUserVerified = (userId: string) => {
    const updatedSubscribers = subscribers.map(sub => 
      sub.userId === userId 
        ? { ...sub, isVerified: !sub.isVerified } 
        : sub
    );
    setSubscribers(updatedSubscribers);
    
    toast({
      title: "Brukerstatus oppdatert",
      description: "Brukerens verifikasjonsstatus har blitt oppdatert.",
      variant: "default"
    });
  };

  // Slett produkt
  const handleDeleteProduct = async (productId: string) => {
    try {
      // Fjern produktet fra listen lokalt
      setProducts(products.filter(p => p.id !== productId));
      
      // Virkelig implementasjon:
      // const { error } = await supabase
      //   .from('group_products')
      //   .delete()
      //   .eq('id', productId);
      // if (error) throw error;
      
      toast({
        title: "Produkt slettet",
        description: "Produktet er fjernet fra markedsplassen.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Feil ved sletting",
        description: "Kunne ikke slette produktet. Vennligst prøv igjen senere.",
        variant: "destructive"
      });
    }
  };

  // Vurder et produkt
  const rateProduct = (productId: string, rating: number) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        const currentTotal = (product.rating || 0) * (product.ratingCount || 0);
        const newCount = (product.ratingCount || 0) + 1;
        const newRating = (currentTotal + rating) / newCount;
        
        return { 
          ...product, 
          rating: parseFloat(newRating.toFixed(1)), 
          ratingCount: newCount 
        };
      }
      return product;
    });
    
    setProducts(updatedProducts);
    
    toast({
      title: "Takk for din vurdering!",
      description: `Du ga dette produktet ${rating}/5 stjerner.`,
      variant: "default"
    });
  };

  // Oppdater lokasjon for et produkt
  const updateProductLocation = (productId: string, location: { address: string; latitude: number; longitude: number }) => {
    const updatedProducts = products.map(product => 
      product.id === productId 
        ? { ...product, location } 
        : product
    );
    
    setProducts(updatedProducts);
    setIsLocationPickerOpen(false);
    setSelectedProduct(null);
    
    toast({
      title: "Lokasjon oppdatert",
      description: "Produktets lokasjon har blitt oppdatert.",
      variant: "default"
    });
  };

  // Render stjerner for vurdering
  const renderRatingStars = (rating: number | undefined, count: number | undefined) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center gap-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              className={`h-3.5 w-3.5 ${
                star <= Math.round(rating) 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-muted-foreground/30'
              }`} 
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          ({rating.toFixed(1)}) {count && `(${count})`}
        </span>
      </div>
    );
  };

  return (
    <div className={`bg-background rounded-lg shadow-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Gruppemarkedsplass</h2>
        </div>
        
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSubscribers(!showSubscribers)}
                >
                  <Users className="h-4 w-4" />
                  <span className="ml-1">{subscribers.length}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Vis abonnenter</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProducts}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
          </Button>
          
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              Lukk
            </Button>
          )}
        </div>
      </div>
      
      {/* Abonnent liste dialog */}
      {showSubscribers && (
        <div className="mb-4 border rounded-lg p-4 bg-muted/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Abonnenter ({subscribers.length})</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSubscribers(false)}
            >
              Lukk
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {subscribers.map(subscriber => (
              <div key={subscriber.id} className="flex items-center gap-2 p-2 border rounded-md">
                <Avatar>
                  <AvatarImage src={subscriber.avatarUrl} />
                  <AvatarFallback>{subscriber.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-sm truncate max-w-[100px]">{subscriber.username}</span>
                    {subscriber.isVerified && <BadgeCheck className="h-3 w-3 text-blue-500" />}
                  </div>
                  <span className="text-xs text-muted-foreground truncate">
                    {new Date(subscriber.subscribedSince).toLocaleDateString()}
                  </span>
                </div>
                {(isGroupAdmin || isUserAdmin) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-auto h-6" 
                    onClick={() => toggleUserVerified(subscriber.userId)}
                  >
                    {subscriber.isVerified ? "Fjern verifisering" : "Verifiser"}
                  </Button>
                )}
              </div>
            ))}
          </div>
          {(isGroupAdmin || isUserAdmin) && (
            <div className="flex gap-2 mt-3 justify-end">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Inviter abonnent
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Søk og filtrer */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-sm">
          <PackageSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Søk etter produkter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Button 
          onClick={() => setIsAddingProduct(true)}
          disabled={!user}
        >
          <Plus className="h-4 w-4 mr-1" />
          Legg ut produkt
        </Button>
      </div>
      
      {/* Tabs for filtering */}
      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="active">Tilgjengelige</TabsTrigger>
          <TabsTrigger value="all">Alle produkter</TabsTrigger>
          <TabsTrigger value="pinned">
            <PinIcon className="h-4 w-4 mr-1" />
            Fremhevet
          </TabsTrigger>
          {user && <TabsTrigger value="mine">Mine produkter</TabsTrigger>}
        </TabsList>
      </Tabs>
      
      {/* Legg til nytt produkt */}
      {isAddingProduct && (
        <div className="mb-6 border rounded-lg p-4 bg-muted/30">
          <h3 className="text-lg font-medium mb-4">Legg ut nytt produkt</h3>
          <ProductEntry
            isEditing={true}
            onSave={handleSaveProduct}
            onCancel={() => setIsAddingProduct(false)}
            product={{
              title: '',
              description: '',
              price: 0,
              currency: 'NOK',
              inStock: true,
              quantity: 1,
              contactInfo: '',
            }}
          />
        </div>
      )}
      
      {/* Lokasjonpicker modalt vindu */}
      <Dialog open={isLocationPickerOpen} onOpenChange={setIsLocationPickerOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Velg lokasjon for produktet</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="h-[300px] mb-4 bg-muted rounded flex items-center justify-center">
              <MapPin className="h-8 w-8 text-muted-foreground/50" />
              <span className="ml-2">Kartvisning kommer her</span>
            </div>
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Adresse</label>
                <Input placeholder="Skriv inn adresse" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsLocationPickerOpen(false)}>
                  Avbryt
                </Button>
                <Button onClick={() => {
                  if (selectedProduct) {
                    updateProductLocation(selectedProduct.id!, {
                      address: "Ny testadressen 123, Oslo",
                      latitude: 59.9139,
                      longitude: 10.7522
                    });
                  }
                }}>Lagre lokasjon</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Produktliste */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Laster inn produkter...</p>
        </div>
      ) : sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProducts.map(product => (
            <div key={product.id} className="relative">
              {product.isPinned && (
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge variant="default" className="bg-orange-500 hover:bg-orange-600">
                    <PinIcon className="h-3 w-3 mr-1" /> Fremhevet
                  </Badge>
                </div>
              )}
              
              {product.sellerVerified && (
                <div className="absolute top-2 left-2 z-10">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-600">
                    <BadgeCheck className="h-3 w-3 mr-1" /> Verifisert selger
                  </Badge>
                </div>
              )}
              
              {/* Produktkort */}
              <ProductEntry
                product={product}
                onSave={handleSaveProduct}
                onDelete={
                  // Kan slette hvis man er produkteier, gruppeadmin eller plattformadmin
                  (product.createdBy === user?.id || isGroupAdmin || isUserAdmin) ? 
                    handleDeleteProduct : undefined
                }
                readOnly={product.createdBy !== user?.id}
              />
              
              {/* Business Profile Section */}
              <BusinessProfileSection product={product} />
              
              {/* Ekstra funksjoner for produktet */}
              <div className="mt-2 flex justify-between items-center">
                <div className="flex items-center gap-1">
                  {renderRatingStars(product.rating, product.ratingCount)}
                </div>
                
                <div className="flex gap-1">
                  {/* GIF-knapp */}
                  {product.gifUrl && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 px-2">
                            <GiftIcon className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="w-[180px] h-[120px] overflow-hidden rounded-md">
                            <img src={product.gifUrl} alt="Product GIF" className="w-full h-full object-cover" />
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  {/* Lokasjon-knapp */}
                  {product.location && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-2"
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsLocationPickerOpen(true);
                            }}
                          >
                            <MapPin className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{product.location.address}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  {/* Pin/fremhev-knapp */}
                  {(isGroupAdmin || isUserAdmin) && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant={product.isPinned ? "default" : "outline"}
                            size="sm" 
                            className={`h-7 px-2 ${product.isPinned ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                            onClick={() => toggleProductPin(product.id!)}
                          >
                            <PinIcon className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {product.isPinned ? 'Fjern fremheving' : 'Fremhev produkt'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  {/* Stjernevurdering */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7 px-2">
                        <Star className="h-3.5 w-3.5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Vurder produktet</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-center mb-4">Hvor mange stjerner vil du gi til "{product.title}"?</p>
                        <div className="flex justify-center gap-2 mb-6">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => rateProduct(product.id!, star)}
                              className="p-2 hover:bg-muted rounded-full transition"
                            >
                              <Star className="h-8 w-8 text-yellow-400" />
                              <span className="sr-only">{star} stjerner</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground opacity-30" />
          <h3 className="mt-2 text-lg font-medium">Ingen produkter ennå</h3>
          <p className="text-muted-foreground">
            {searchQuery ? 
              'Ingen produkter matcher søket ditt' : 
              'Bli den første som legger ut et produkt!'
            }
          </p>
        </div>
      )}
    </div>
  );
};
