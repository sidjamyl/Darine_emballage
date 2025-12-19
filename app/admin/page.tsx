'use client';

import { useLanguage } from '@/lib/language-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Package, Users, ShoppingBag, Plus, Edit, Trash2, LogOut } from 'lucide-react';
import { OrderCard } from './components/order-card';
import { Order } from '@/lib/types/order.types';

interface Product {
  id: string;
  nameFr: string;
  nameAr: string;
  descriptionFr: string;
  descriptionAr: string;
  price: number;
  type: string;
  image: string;
  hasVariants: boolean;
  isPopular: boolean;
}

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  createdAt: string;
}

type Tab = 'orders' | 'products' | 'users';

export default function AdminPage() {
  const { locale } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [isLoading, setIsLoading] = useState(true);
  
  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    nameFr: '',
    nameAr: '',
    descriptionFr: '',
    descriptionAr: '',
    price: 0,
    type: 'FOOD',
    image: '',
    hasVariants: false,
    isPopular: false,
  });
  const [variants, setVariants] = useState<Array<{
    id?: string;
    nameFr: string;
    nameAr: string;
    priceAdjustment: number;
  }>>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Users
  const [users, setUsers] = useState<User[]>([]);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [userForm, setUserForm] = useState({
    email: '',
    name: '',
    password: '',
    role: 'ADMIN',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  const checkAuth = async () => {
    try {
      const session = await authClient.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setIsLoading(false);
    } catch (error) {
      router.push('/login');
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/');
  };

  // Orders Functions
  const fetchOrders = async (status?: string) => {
    try {
      const url = status && status !== 'ALL' ? `/api/elogistia/orders?status=${status}` : '/api/elogistia/orders';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // S'assurer que data est un tableau
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.warn('API returned non-array data:', data);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      toast.error('Erreur lors du chargement des commandes');
    }
  };

  const handleConfirmOrder = async (order: Order) => {
    toast.info('Pour confirmer la commande, veuillez vous rendre sur elogistia.com');
    window.open('https://elogistia.com/app/client/', '_blank');
  };

  const handleCancelOrder = async (order: Order) => {
    toast.info('Pour annuler la commande, veuillez vous rendre sur elogistia.com');
    window.open('https://elogistia.com/app/client/', '_blank');
  };

  // Products Functions
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des produits');
    }
  };

  const openProductDialog = async (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        nameFr: product.nameFr,
        nameAr: product.nameAr,
        descriptionFr: product.descriptionFr,
        descriptionAr: product.descriptionAr,
        price: product.price,
        type: product.type,
        image: product.image,
        hasVariants: product.hasVariants,
        isPopular: product.isPopular,
      });
      
      // Charger les variantes si elles existent
      if (product.hasVariants) {
        try {
          const response = await fetch(`/api/products/${product.id}/variants`);
          if (response.ok) {
            const productVariants = await response.json();
            // Ne charger que si on a vraiment des variantes
            if (productVariants && productVariants.length > 0) {
              setVariants(productVariants);
            } else {
              // Ajouter la variante par défaut si aucune variante n'existe
              setVariants([{
                nameFr: 'Standard',
                nameAr: 'قياسي',
                priceAdjustment: product.price
              }]);
            }
          } else {
            // Ajouter la variante par défaut en cas d'erreur
            setVariants([{
              nameFr: 'Standard',
              nameAr: 'قياسي',
              priceAdjustment: product.price
            }]);
          }
        } catch (error) {
          console.error('Error loading variants:', error);
          // Ajouter la variante par défaut en cas d'erreur
          setVariants([{
            nameFr: 'Standard',
            nameAr: 'قياسي',
            priceAdjustment: product.price
          }]);
        }
      } else {
        // Ajouter la variante par défaut pour un produit sans variantes
        setVariants([{
          nameFr: 'Standard',
          nameAr: 'قياسي',
          priceAdjustment: product.price
        }]);
      }
    } else {
      // Nouveau produit - ajouter une variante vide
      setEditingProduct(null);
      setProductForm({
        nameFr: '',
        nameAr: '',
        descriptionFr: '',
        descriptionAr: '',
        price: 0,
        type: 'FOOD',
        image: '',
        hasVariants: false,
        isPopular: false,
      });
      setVariants([]);
    }
    setShowProductDialog(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProductForm({ ...productForm, image: data.url });
        toast.success('Image uploadée avec succès');
      } else {
        toast.error('Erreur lors de l\'upload');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'upload');
    } finally {
      setUploadingImage(false);
    }
  };

  const saveProduct = async () => {
    // Validation côté client
    if (!productForm.nameFr.trim()) {
      toast.error('Le nom en français est obligatoire');
      return;
    }
    if (!productForm.nameAr.trim()) {
      toast.error('Le nom en arabe est obligatoire');
      return;
    }
    if (!productForm.descriptionFr.trim()) {
      toast.error('La description en français est obligatoire');
      return;
    }
    if (!productForm.descriptionAr.trim()) {
      toast.error('La description en arabe est obligatoire');
      return;
    }
    if (!productForm.price || productForm.price <= 0) {
      toast.error('Le prix doit être supérieur à 0');
      return;
    }
    if (!productForm.image.trim()) {
      toast.error('L\'URL de l\'image est obligatoire');
      return;
    }

    // Validation des variantes si hasVariants est true
    if (productForm.hasVariants) {
      if (variants.length === 0) {
        toast.error('Ajoutez au moins une variante');
        return;
      }
      for (const variant of variants) {
        if (!variant.nameFr.trim() || !variant.nameAr.trim()) {
          toast.error('Tous les noms de variantes sont obligatoires');
          return;
        }
      }
    }

    try {
      const url = editingProduct ? `/api/products?id=${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productForm,
          variants: productForm.hasVariants ? variants : [],
        }),
      });

      if (response.ok) {
        toast.success(editingProduct ? 'Produit modifié' : 'Produit créé');
        fetchProducts();
        setShowProductDialog(false);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur');
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Produit supprimé');
        fetchProducts();
      } else {
        toast.error('Erreur');
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  // Users Functions
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des utilisateurs');
    }
  };

  const saveUser = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userForm.email,
          password: userForm.password,
          name: userForm.name,
        }),
      });

      if (response.ok) {
        toast.success('Administrateur créé');
        fetchUsers();
        setShowUserDialog(false);
        setUserForm({ email: '', name: '', password: '', role: 'ADMIN' });
      } else {
        const error = await response.json();
        toast.error(error.message || error.error || 'Erreur lors de la création');
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    try {
      const response = await fetch(`/api/admin/users?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Utilisateur supprimé');
        fetchUsers();
      } else {
        toast.error('Erreur');
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#383738' }}>
          Admin Panel
        </h1>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-6 md:border-b">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-2 px-4 flex items-center gap-2 rounded-lg md:rounded-none ${
            activeTab === 'orders'
              ? 'md:border-b-2 font-semibold'
              : 'text-gray-600'
          }`}
          style={activeTab === 'orders' ? { borderColor: '#F8A6B0', backgroundColor: activeTab === 'orders' ? '#FFF5F7' : 'transparent' } : { backgroundColor: 'transparent' }}
        >
          <ShoppingBag className="h-4 w-4" />
          Commandes
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-2 px-4 flex items-center gap-2 rounded-lg md:rounded-none ${
            activeTab === 'products'
              ? 'md:border-b-2 font-semibold'
              : 'text-gray-600'
          }`}
          style={activeTab === 'products' ? { borderColor: '#F8A6B0', backgroundColor: activeTab === 'products' ? '#FFF5F7' : 'transparent' } : { backgroundColor: 'transparent' }}
        >
          <Package className="h-4 w-4" />
          Produits
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-2 px-4 flex items-center gap-2 rounded-lg md:rounded-none ${
            activeTab === 'users'
              ? 'md:border-b-2 font-semibold'
              : 'text-gray-600'
          }`}
          style={activeTab === 'users' ? { borderColor: '#F8A6B0', backgroundColor: activeTab === 'users' ? '#FFF5F7' : 'transparent' } : { backgroundColor: 'transparent' }}
        >
          <Users className="h-4 w-4" />
          Utilisateurs
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <div className="mb-6">
            <Label className="mb-2 block">Filtrer par statut</Label>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                fetchOrders(value);
              }}
            >
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous</SelectItem>
                <SelectItem value="PENDING">En attente</SelectItem>
                <SelectItem value="CONFIRMED">Confirmées</SelectItem>
                <SelectItem value="CANCELLED">Annulées</SelectItem>
                <SelectItem value="DELIVERED">Livrées</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {!Array.isArray(orders) || orders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  Aucune commande
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onConfirm={handleConfirmOrder}
                  onCancel={handleCancelOrder}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div className="mb-6">
            <Button onClick={() => openProductDialog()} style={{ backgroundColor: '#F8A6B0' }}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <img
                    src={product.image}
                    alt={product.nameFr}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <h3 className="font-semibold mb-2">{product.nameFr}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.nameAr}</p>
                  <p className="font-bold mb-4" style={{ color: '#F8A6B0' }}>
                    {product.price.toFixed(2)} DA
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openProductDialog(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <div className="mb-6">
            <Button onClick={() => setShowUserDialog(true)} style={{ backgroundColor: '#F8A6B0' }}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un administrateur
            </Button>
          </div>

          <div className="space-y-4">
            {Array.isArray(users) && users.length > 0 ? users.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{user.name || user.email}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <span
                        className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  Aucun utilisateur
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
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
                  onValueChange={(value) => setProductForm({ ...productForm, type: value })}
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
                {/* Bouton d'upload */}
                <div className="flex gap-2">
                  <label
                    htmlFor="image-upload"
                    className="flex-1 cursor-pointer"
                  >
                    <div
                      className="border-2 border-dashed rounded-lg p-4 text-center hover:border-[#F8A6B0] transition-colors"
                    >
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
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </div>

                {/* Aperçu de l'image */}
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

                {/* Option manuelle */}
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

            {/* Gestion des variantes */}
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
            <Button variant="outline" onClick={() => setShowProductDialog(false)}>
              Annuler
            </Button>
            <Button onClick={saveProduct} style={{ backgroundColor: '#F8A6B0' }}>
              {editingProduct ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un administrateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Nom</Label>
              <Input
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Mot de passe</Label>
              <Input
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserDialog(false)}>
              Annuler
            </Button>
            <Button onClick={saveUser} style={{ backgroundColor: '#F8A6B0' }}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
