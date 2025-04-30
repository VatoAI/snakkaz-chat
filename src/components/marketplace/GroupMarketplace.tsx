// filepath: /workspaces/snakkaz-chat/src/components/marketplace/GroupMarketplace.tsx
import React, { useState, useEffect } from 'react';
import { Plus, PackageSearch, RefreshCcw, Loader2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductEntry, ProductData } from './ProductEntry';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { useIsAdmin } from '@/hooks/useIsAdmin';

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
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddingProduct, setIsAddingProduct] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('active');

  const { user } = useAuth();
  const { toast } = useToast();
  const { isUserAdmin } = useIsAdmin();

  // Filtrer produkter basert på søk og aktiv tab
  const filteredProducts = products
    .filter(product => 
      (activeTab === 'all' || (activeTab === 'active' && product.inStock) || 
       (activeTab === 'mine' && product.createdBy === user?.id))
    )
    .filter(product => 
      searchQuery ? 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    );

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
  }, [groupId]);

  // Funksjon for å hente produkter fra Supabase
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // I en virkelig implementasjon ville dette være et kall til Supabase
      // For demo-formål setter vi demo-produkter
      
      // Simuler henting av produkter 
      setTimeout(() => {
        const demoProducts: ProductData[] = [
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

  // Lagre nytt produkt
  const handleSaveProduct = async (productData: ProductData) => {
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

  return (
    <div className={`bg-background rounded-lg shadow-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Gruppemarkedsplass</h2>
        </div>
        
        <div className="flex gap-2">
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
          />
        </div>
      )}
      
      {/* Produktliste */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Laster inn produkter...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <ProductEntry
              key={product.id}
              product={product}
              onSave={handleSaveProduct}
              onDelete={
                // Kan slette hvis man er produkteier, gruppeadmin eller plattformadmin
                (product.createdBy === user?.id || isGroupAdmin || isUserAdmin) ? 
                  handleDeleteProduct : undefined
              }
              readOnly={product.createdBy !== user?.id}
            />
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