// filepath: /workspaces/snakkaz-chat/src/components/marketplace/GroupMarketplace.tsx
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
                ></Button>
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
      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="mb-4"></Tabs>
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
      <Dialog open={isLocationPickerOpen} onOpenChange={setIsLocationPickerOpen}></Dialog>
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
        <div className="flex flex-col items-center justify-center py-12"></div>
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
                <div className="absolute top-2 left-2 z-10"></div>
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
        <div className="text-center py-12 border-2 border-dashed rounded-lg"></div>
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