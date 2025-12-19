/**
 * Product Dialog Component
 * 
 * Dialog for creating and editing products with variant support.
 */

'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { ProductFormData, ProductVariant } from '@/lib/types';

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productForm: ProductFormData;
  setProductForm: (form: ProductFormData) => void;
  variants: ProductVariant[];
  setVariants: (variants: ProductVariant[]) => void;
  uploadingImage: boolean;
  isEditing: boolean;
  onSave: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProductDialog({
  open,
  onOpenChange,
  productForm,
  setProductForm,
  variants,
  setVariants,
  uploadingImage,
  isEditing,
  onSave,
  onImageUpload
}: ProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier le produit' : 'Ajouter un produit'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Nom (Français) *</Label>
              <Input
                value={productForm.nameFr}
                onChange={(e) => setProductForm({ ...productForm, nameFr: e.target.value })}
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label>Nom (Arabe) *</Label>
              <Input
                value={productForm.nameAr}
                onChange={(e) => setProductForm({ ...productForm, nameAr: e.target.value })}
                className="mt-2"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Description (Français) *</Label>
              <Textarea
                value={productForm.descriptionFr}
                onChange={(e) =>
                  setProductForm({ ...productForm, descriptionFr: e.target.value })
                }
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label>Description (Arabe) *</Label>
              <Textarea
                value={productForm.descriptionAr}
                onChange={(e) =>
                  setProductForm({ ...productForm, descriptionAr: e.target.value })
                }
                className="mt-2"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Prix (DA) *</Label>
              <Input
                type="number"
                value={productForm.price}
                onChange={(e) =>
                  setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })
                }
                className="mt-2"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <Label>Type *</Label>
              <Select
                value={productForm.type}
                onValueChange={(value) => setProductForm({ ...productForm, type: value as 'FOOD' | 'PACKAGING' })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FOOD">Alimentaire</SelectItem>
                  <SelectItem value="PACKAGING">Emballage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Image du produit *</Label>
            <div className="mt-2 space-y-3">
              <div className="flex gap-2">
                <label htmlFor="image-upload" className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-[#F8A6B0] transition-colors">
                    {uploadingImage ? (
                      <p className="text-gray-600">Upload en cours...</p>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600">
                          Cliquez pour uploader une image
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG, WEBP (max 5MB)
                        </p>
                      </>
                    )}
                  </div>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={onImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </div>

              {productForm.image && (
                <div className="relative">
                  <img
                    src={productForm.image}
                    alt="Aperçu"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => setProductForm({ ...productForm, image: '' })}
                  >
                    Supprimer
                  </Button>
                </div>
              )}

              <div>
                <Label className="text-xs text-gray-600">Ou entrez une URL manuellement</Label>
                <Input
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={productForm.hasVariants}
                onChange={(e) => {
                  setProductForm({ ...productForm, hasVariants: e.target.checked });
                  if (!e.target.checked) {
                    setVariants([]);
                  }
                }}
              />
              A des variantes
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={productForm.isPopular}
                onChange={(e) =>
                  setProductForm({ ...productForm, isPopular: e.target.checked })
                }
              />
              Produit populaire
            </label>
          </div>

          {productForm.hasVariants && (
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <Label className="text-lg font-semibold">Variantes</Label>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setVariants([...variants, { nameFr: '', nameAr: '', priceAdjustment: 0 }])}
                  style={{ backgroundColor: '#F8A6B0' }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une variante
                </Button>
              </div>

              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div key={index} className="border p-4 rounded-lg relative">
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => setVariants(variants.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="grid md:grid-cols-3 gap-4 pr-12">
                      <div>
                        <Label>Nom (Français) *</Label>
                        <Input
                          value={variant.nameFr}
                          onChange={(e) => {
                            const newVariants = [...variants];
                            newVariants[index].nameFr = e.target.value;
                            setVariants(newVariants);
                          }}
                          placeholder="Ex: Petit, 250g"
                          className="mt-2"
                          required
                        />
                      </div>
                      <div>
                        <Label>Nom (Arabe) *</Label>
                        <Input
                          value={variant.nameAr}
                          onChange={(e) => {
                            const newVariants = [...variants];
                            newVariants[index].nameAr = e.target.value;
                            setVariants(newVariants);
                          }}
                          placeholder="مثال: صغير"
                          className="mt-2"
                          required
                        />
                      </div>
                      <div>
                        <Label>Prix (DA) *</Label>
                        <Input
                          type="number"
                          value={variant.priceAdjustment}
                          onChange={(e) => {
                            const newVariants = [...variants];
                            newVariants[index].priceAdjustment = parseFloat(e.target.value) || 0;
                            setVariants(newVariants);
                          }}
                          placeholder="Prix de cette variante"
                          className="mt-2"
                          step="0.01"
                          min="0"
                          required
                        />
                        {variant.priceAdjustment > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Prix: {variant.priceAdjustment.toFixed(2)} DA
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {variants.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    Aucune variante. Cliquez sur "Ajouter une variante" pour en créer.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onSave} style={{ backgroundColor: '#F8A6B0' }}>
            {isEditing ? 'Modifier' : 'Créer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
