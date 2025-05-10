// filepath: /workspaces/snakkaz-chat/src/components/marketplace/ProductEntry.tsx
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Edit,
  Trash2,
  Save,
  X,
  ShoppingBag,
  ImagePlus,
  DollarSign,
  Eye
} from 'lucide-react';
import EnhancedMediaUploader from '../media/EnhancedMediaUploader';

export interface ProductData {
  id?: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string;
  inStock: boolean;
  quantity?: number;
  contactInfo?: string;
  createdBy?: string;
  createdAt?: string;
  groupId?: string;
}

interface ProductEntryProps {
  product?: ProductData;
  isEditing?: boolean;
  readOnly?: boolean;
  onSave?: (productData: ProductData) => void;
  onDelete?: (productId: string) => void;
  onCancel?: () => void;
}

export const ProductEntry: React.FC<ProductEntryProps> = ({
  product,
  isEditing: initialIsEditing = false,
  readOnly = false,
  onSave,
  onDelete,
  onCancel
}) => {
  const [isEditing, setIsEditing] = useState(initialIsEditing);
  const [formData, setFormData] = useState<ProductData>(product || {
    title: '',
    description: '',
    price: 0,
    currency: 'NOK',
    inStock: true,
    quantity: 1,
    contactInfo: '',
  });
  
  // Bildebehandling
  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  // Form input handling
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Toggle produkttilgjengelighet
  const handleInStockChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, inStock: checked }));
  };

  // Lagre produktdata
  const handleSave = () => {
    if (onSave) {
      onSave(formData);
      setIsEditing(false);
    }
  };
  
  // Slett produkt
  const handleDelete = () => {
    if (product?.id && onDelete) {
      onDelete(product.id);
    }
  };

  // Avbryt redigering
  const handleCancel = () => {
    if (product) {
      setFormData(product);
    }
    setIsEditing(false);
    if (onCancel) onCancel();
  };

  return (
    <Card className="overflow-hidden">
      {/* Produktbilde */}
      {isEditing ? (
        <div className="relative h-48 bg-muted flex items-center justify-center">
          {formData.imageUrl ? (
            <div className="relative w-full h-full">
              <img 
                src={formData.imageUrl} 
                alt={formData.title} 
                className="w-full h-full object-cover"
              />
              <Button
                variant="secondary"
                size="sm" 
                className="absolute bottom-2 right-2"
                onClick={() => setFormData(prev => ({ ...prev, imageUrl: undefined }))}
              >
                <X className="h-4 w-4 mr-1" />
                Fjern
              </Button>
            </div>
          ) : (
            <EnhancedMediaUploader
              onUploadComplete={handleImageUpload}
              buttonLabel={
                <div className="flex flex-col items-center">
                  <ImagePlus className="h-6 w-6 mb-1" />
                  <span>Last opp produktbilde</span>
                </div>
              }
              allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
              maxSizeMB={5}
            />
          )}
        </div>
      ) : (
        formData.imageUrl && (
          <div className="h-48 overflow-hidden">
            <img 
              src={formData.imageUrl} 
              alt={formData.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )
      )}

      <CardHeader className={isEditing ? 'pb-2' : ''}>
        {isEditing ? (
          <div className="space-y-2">
            <Label htmlFor="title">Produktnavn</Label>
            <Input
              id="title"
              name="title"
              placeholder="Skriv navnet på produktet"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{formData.title || 'Ukjent produkt'}</h3>
            <div className="flex items-center">
              {formData.inStock ? (
                <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
                  Tilgjengelig
                </span>
              ) : (
                <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full">
                  Ikke tilgjengelig
                </span>
              )}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Beskrivelse */}
        {isEditing ? (
          <div className="space-y-2">
            <Label htmlFor="description">Beskrivelse</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Beskriv produktet du selger"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {formData.description || 'Ingen beskrivelse tilgjengelig'}
          </p>
        )}

        {/* Pris */}
        <div className="flex items-center justify-between">
          {isEditing ? (
            <div className="grid grid-cols-3 gap-2 w-full">
              <div className="col-span-2 space-y-1">
                <Label htmlFor="price">Pris</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={formData.price}
                    onChange={handleChange}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="currency">Valuta</Label>
                <Input
                  id="currency"
                  name="currency"
                  placeholder="NOK"
                  value={formData.currency}
                  onChange={handleChange}
                />
              </div>
            </div>
          ) : (
            <div className="font-semibold text-lg">
              {formData.price} {formData.currency}
            </div>
          )}
        </div>

        {/* Available/Quantity */}
        {isEditing && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="inStock" className="cursor-pointer flex items-center gap-2">
                <span>Produktet er tilgjengelig</span>
              </Label>
              <Switch
                id="inStock"
                checked={formData.inStock}
                onCheckedChange={handleInStockChange}
              />
            </div>
            
            {formData.inStock && (
              <div className="space-y-1">
                <Label htmlFor="quantity">Antall tilgjengelig (valgfritt)</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={formData.quantity || ''}
                  onChange={handleChange}
                />
              </div>
            )}
            
            <div className="space-y-1">
              <Label htmlFor="contactInfo">Kontaktinformasjon (valgfritt)</Label>
              <Input
                id="contactInfo"
                name="contactInfo"
                placeholder="F.eks. telefonnummer eller foretrukken kontaktmetode"
                value={formData.contactInfo || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {/* Kontaktinfo (kun visning) */}
        {!isEditing && formData.contactInfo && (
          <div className="mt-2 text-sm">
            <span className="font-medium">Kontakt: </span>
            {formData.contactInfo}
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-muted/20 flex justify-between">
        {isEditing ? (
          <div className="w-full flex gap-2">
            <Button 
              variant="default" 
              className="flex-1"
              onClick={handleSave}
            >
              <Save className="h-4 w-4 mr-1" />
              Lagre
            </Button>
            <Button 
              variant="ghost"
              className="flex-1"
              onClick={handleCancel}
            >
              <X className="h-4 w-4 mr-1" />
              Avbryt
            </Button>
          </div>
        ) : (
          <div className="w-full flex justify-between items-center">
            {!readOnly ? (
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Rediger
                </Button>
                {onDelete && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleDelete}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Slett
                  </Button>
                )}
              </div>
            ) : (
              <div>
                {formData.quantity && formData.inStock && (
                  <span className="text-xs text-muted-foreground">
                    {formData.quantity} tilgjengelig
                  </span>
                )}
              </div>
            )}
            
            <Button 
              variant="outline" 
              size="sm"
            >
              <ShoppingBag className="h-4 w-4 mr-1" />
              Kontakt selger
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
