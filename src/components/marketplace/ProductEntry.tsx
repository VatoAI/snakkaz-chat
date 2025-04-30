// filepath: /workspaces/snakkaz-chat/src/components/marketplace/ProductEntry.tsx
import React, { useState } from 'react';
import { X, ShoppingBag, Edit, Check, Trash2, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

// Produktdata-grensesnitt
export interface ProductData {
  id?: string;
  title: string;
  description: string;
  price: number;
  currency?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  inStock?: boolean;
  quantity?: number;
  contactInfo?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductEntryProps {
  product?: ProductData;
  isEditing?: boolean;
  onSave?: (productData: ProductData) => Promise<void>;
  onDelete?: (productId: string) => Promise<void>;
  onCancel?: () => void;
  onEdit?: () => void;
  readOnly?: boolean;
  className?: string;
}

// Standard valutaer
const CURRENCIES = ['NOK', 'USD', 'EUR', 'GBP'];

export const ProductEntry: React.FC<ProductEntryProps> = ({
  product,
  isEditing = false,
  onSave,
  onDelete,
  onCancel,
  onEdit,
  readOnly = false,
  className = '',
}) => {
  // Standardprodukt om ikke annet er spesifisert
  const defaultProduct: ProductData = {
    title: '',
    description: '',
    price: 0,
    currency: 'NOK',
    inStock: true,
    quantity: 1,
    contactInfo: '',
  };

  const [editMode, setEditMode] = useState<boolean>(isEditing);
  const [productData, setProductData] = useState<ProductData>(product || defaultProduct);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(product?.imageUrl || null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Håndter bildevalg
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Opprett forhåndsvisning
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // OBS: Vi oppdaterer ikke imageUrl i produktdata her
      // Det vil bli gjort når produktet lagres
    }
  };

  // Håndter input-endringer
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Håndter sjekkbokser spesielt
    if ((e.target as HTMLInputElement).type === 'checkbox') {
      setProductData({
        ...productData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } 
    // Håndter numeriske verdier
    else if (type === 'number') {
      setProductData({
        ...productData, 
        [name]: parseFloat(value) || 0
      });
    } 
    // Alle andre felt
    else {
      setProductData({
        ...productData,
        [name]: value
      });
    }
  };

  // Start redigering
  const startEditing = () => {
    setEditMode(true);
    if (onEdit) onEdit();
  };

  // Avbryt redigering
  const cancelEditing = () => {
    setEditMode(false);
    setProductData(product || defaultProduct);
    
    // Rengjør bildeforhåndsvisning hvis vi ikke hadde et bilde fra før
    if (!product?.imageUrl && previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    
    setSelectedImage(null);
    if (onCancel) onCancel();
  };

  // Lagre produkt
  const saveProduct = async () => {
    if (!onSave) return;
    
    try {
      setIsSaving(true);
      
      // Her ville vi vanligvis laste opp bildet først
      // For nå late som om vi har lastet opp og fått en URL
      let updatedProductData = { ...productData };
      
      if (selectedImage) {
        // Her ville vi vanligvis kalle en uploadImage-funksjon
        // For demoen bruker vi bare previewUrl som en placeholder
        updatedProductData.imageUrl = previewUrl || undefined;
      }
      
      await onSave(updatedProductData);
      setEditMode(false);
    } catch (error) {
      console.error('Feil ved lagring av produkt:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Slett produkt
  const handleDelete = async () => {
    if (!product?.id || !onDelete) return;
    
    try {
      await onDelete(product.id);
    } catch (error) {
      console.error('Feil ved sletting av produkt:', error);
    }
  };

  // Visningsmodus (read-only)
  if (!editMode) {
    return (
      <div className={`border rounded-lg overflow-hidden shadow-sm bg-card ${className}`}>
        {/* Produktbilde */}
        {previewUrl ? (
          <div className="relative h-40 bg-muted">
            <img 
              src={previewUrl} 
              alt={productData.title} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-40 bg-muted flex items-center justify-center text-muted-foreground">
            <ShoppingBag className="h-12 w-12 opacity-30" />
          </div>
        )}
        
        {/* Produktinfo */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-lg">{productData.title}</h3>
            <div className="font-semibold text-lg">
              {productData.price.toLocaleString()} {productData.currency || 'NOK'}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mt-1 mb-2">
            {productData.description}
          </p>
          
          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="flex items-center">
              {productData.inStock ? (
                <span className="text-green-600">På lager</span>
              ) : (
                <span className="text-amber-600">Ikke på lager</span>
              )}
              {typeof productData.quantity === 'number' && productData.quantity > 0 && (
                <span className="ml-2 text-muted-foreground">
                  {productData.quantity} tilgjengelig
                </span>
              )}
            </div>
            
            {!readOnly && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={startEditing}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Rediger
                </Button>
                
                {onDelete && product?.id && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {productData.contactInfo && (
            <div className="mt-2 text-sm text-muted-foreground">
              <strong>Kontakt:</strong> {productData.contactInfo}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Redigeringsmodus
  return (
    <div className={`border rounded-lg overflow-hidden shadow-sm bg-card ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">
            {product?.id ? 'Rediger produkt' : 'Nytt produkt'}
          </h3>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={cancelEditing}
            >
              <X className="h-4 w-4 mr-1" />
              Avbryt
            </Button>
            
            <Button 
              variant="default" 
              size="sm"
              onClick={saveProduct}
              disabled={!productData.title || isSaving}
            >
              <Check className="h-4 w-4 mr-1" />
              {isSaving ? 'Lagrer...' : 'Lagre'}
            </Button>
          </div>
        </div>
        
        {/* Bilderedigering */}
        <div className="mb-4">
          {previewUrl ? (
            <div className="relative">
              <img 
                src={previewUrl} 
                alt="Produktbilde" 
                className="w-full h-40 object-cover rounded-md"
              />
              
              <button
                onClick={() => {
                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                  setSelectedImage(null);
                }}
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                aria-label="Fjern bilde"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 bg-muted rounded-md border-2 border-dashed border-border cursor-pointer"
                 onClick={() => document.getElementById('product-image')?.click()}>
              <div className="flex flex-col items-center text-muted-foreground">
                <ImageIcon className="h-8 w-8 mb-2" />
                <span className="text-sm">Klikk for å legge til bilde</span>
              </div>
            </div>
          )}
          
          <input
            type="file"
            id="product-image"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        
        {/* Produktskjema */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="title">Produktnavn *</Label>
            <Input
              id="title"
              name="title"
              value={productData.title}
              onChange={handleInputChange}
              placeholder="Produktnavn"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Beskrivelse</Label>
            <Textarea
              id="description"
              name="description"
              value={productData.description}
              onChange={handleInputChange}
              placeholder="Produktbeskrivelse"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="price">Pris *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="1"
                value={productData.price}
                onChange={handleInputChange}
                placeholder="0"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="currency">Valuta</Label>
              <select
                id="currency"
                name="currency"
                value={productData.currency || 'NOK'}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {CURRENCIES.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="inStock"
                name="inStock"
                checked={productData.inStock}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="inStock">På lager</Label>
            </div>
            
            <div>
              <Label htmlFor="quantity">Antall tilgjengelig</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                step="1"
                value={productData.quantity}
                onChange={handleInputChange}
                placeholder="1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="contactInfo">Kontaktinformasjon</Label>
            <Input
              id="contactInfo"
              name="contactInfo"
              value={productData.contactInfo}
              onChange={handleInputChange}
              placeholder="Telefon, e-post eller annen kontaktinfo"
            />
          </div>
        </div>
      </div>
    </div>
  );
};