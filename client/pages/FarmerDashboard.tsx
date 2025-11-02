import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Package, 
  Plus,
  ShoppingCart, 
  TrendingUp, 
  Eye, 
  Edit, 
  Trash2, 
  Check, 
  X,
  DollarSign,
  Calendar,
  MapPin,
  Phone,
  Upload,
  Star,
  BarChart3,
  Users,
  Clock,
  AlertTriangle
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/apiService";
import WhatsAppService from "@/lib/whatsappService";
import axios from 'axios';

// Product interface matching backend schema
interface Product {
  _id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  unit: string;
  image: string;
  sellerName: string;
  sellerLocation: string;
  sellerNumber: string;
  rating: number;
  reviews: number;
  startDate: string;
  expiryDate: string;
}

// Order interface matching backend schema
interface Order {
  _id: string;
  buyerNumber: string;
  sellerNumber: string;
  products: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'in_transit' | 'delivered' | 'cancelled' | 'shipped';
  orderDate: string;
  deliveryAddress: string;
  paymentMethod: string;
}

export default function FarmerDashboard() {
  const { t } = useTranslation();
  const { userData } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [newProduct, setNewProduct] = useState({
    itemName: '',
    category: '',
    price: '',
    stock: '',
    unit: 'kg',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    image: ''
  });

  // Load data from API
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [userData]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://taja-haat-backend-muntakim.vercel.app/products');
      // Filter products for current farmer
      const farmerProducts = response.data.filter((product: Product) => 
        product.sellerNumber === userData?.phone
      );
      setProducts(farmerProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('https://taja-haat-backend-muntakim.vercel.app/orders');
      // Filter orders for current farmer
      const farmerOrders = response.data.filter((order: Order) => 
        order.sellerNumber === userData?.phone
      );
      setOrders(farmerOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      });
    }
  };

  // Image upload using apiService (same as Register.tsx)
  const uploadImageToImgBB = async (file: File): Promise<string> => {
    try {
      console.log('Uploading image using apiService...', file.name);
      // Use the same apiService that Register.tsx uses
      const imageUrl = await (apiService as any).uploadImage(file);
      console.log('Image uploaded successfully:', imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.itemName || !newProduct.category || !newProduct.price || !newProduct.stock) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      let imageUrl = '/placeholder.svg'; // Default fallback image
      
      // Try to upload image if one is selected
      if (imageFile) {
        try {
          imageUrl = await uploadImageToImgBB(imageFile);
          console.log('Image uploaded successfully:', imageUrl);
        } catch (imageError: any) {
          console.warn('Image upload failed, using placeholder:', imageError.message);
          
          // Show warning but don't stop the product creation
          toast({
            title: "Image Upload Warning",
            description: `${imageError.message}. Product will be created with placeholder image.`,
            variant: "destructive"
          });
          
          // Use placeholder image and continue
          imageUrl = '/placeholder.svg';
        }
      }

      const productToAdd = {
        itemName: newProduct.itemName,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        unit: newProduct.unit,
        description: newProduct.description,
        startDate: newProduct.startDate,
        expiryDate: newProduct.expiryDate,
        image: imageUrl,
        sellerName: userData?.name || 'Unknown Farmer',
        sellerLocation: userData?.phone || 'Unknown Location',
        sellerNumber: userData?.phone || '',
        rating: 0,
        reviews: 0
      };

      console.log('Creating product:', productToAdd);
      const response = await axios.post('https://taja-haat-backend-muntakim.vercel.app/products', productToAdd);
      
      if (response.status === 201) {
        await fetchProducts(); // Refresh products list
        
        setNewProduct({
          itemName: '',
          category: '',
          price: '',
          stock: '',
          unit: 'kg',
          description: '',
          startDate: new Date().toISOString().split('T')[0],
          expiryDate: '',
          image: ''
        });
        setImageFile(null);
        setImagePreview('');
        setIsAddingProduct(false);
        
        toast({
          title: "Success",
          description: "Product added successfully",
        });
      }
    } catch (error: any) {
      console.error('Failed to add product:', error);
      
      let errorMessage = "Failed to add product";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      setIsUploading(true);
      let imageUrl = editingProduct.image;
      
      // Try to upload new image if one is selected
      if (imageFile) {
        try {
          imageUrl = await uploadImageToImgBB(imageFile);
          console.log('New image uploaded successfully:', imageUrl);
        } catch (imageError: any) {
          console.warn('Image upload failed, keeping existing image:', imageError.message);
          
          toast({
            title: "Image Upload Warning",
            description: `${imageError.message}. Product will be updated with existing image.`,
            variant: "destructive"
          });
          
          // Keep existing image
          imageUrl = editingProduct.image;
        }
      }

      const updatedProduct = {
        ...editingProduct,
        image: imageUrl
      };

      console.log('Updating product:', updatedProduct);
      const response = await axios.put(
        `https://taja-haat-backend-muntakim.vercel.app/products/${editingProduct._id}`,
        updatedProduct
      );
      
      if (response.status === 200) {
        await fetchProducts(); // Refresh products list
        setEditingProduct(null);
        setImageFile(null);
        setImagePreview('');
        
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      }
    } catch (error: any) {
      console.error('Failed to update product:', error);
      
      let errorMessage = "Failed to update product";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await axios.delete(
        `https://taja-haat-backend-muntakim.vercel.app/products/${productId}`
      );
      
      if (response.status === 200) {
        await fetchProducts(); // Refresh products list
        
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  const handleOrderAction = async (orderId: string, action: 'accept' | 'reject') => {
    try {
      const newStatus = action === 'accept' ? 'shipped' : 'rejected';
      
      const response = await axios.put(
        `https://taja-haat-backend-muntakim.vercel.app/orders/${orderId}`,
        { status: newStatus }
      );
      
      if (response.status === 200) {
        await fetchOrders(); // Refresh orders list
        
        toast({
          title: "Success",
          description: `Order ${action}ed successfully`,
        });
      }
    } catch (error) {
      console.error(`Failed to ${action} order:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} order`,
        variant: "destructive"
      });
    }
  };

  const getOrderStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Test WhatsApp notification function
  const handleTestWhatsApp = async () => {
    try {
      toast({
        title: "Sending Test WhatsApp",
        description: "Testing WhatsApp notification...",
      });

      const success = await WhatsAppService.sendTestMessage();
      
      if (success) {
        toast({
          title: "Success",
          description: "Test WhatsApp message sent successfully!",
        });
      } else {
        toast({
          title: "Warning",
          description: "WhatsApp message failed to send. Check console for details.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Test WhatsApp error:', error);
      toast({
        title: "Error",
        description: "Failed to send test WhatsApp message",
        variant: "destructive"
      });
    }
  };

  const stats = {
    totalProducts: products.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalRevenue: orders.filter(o => o.status === 'shipped' || o.status === 'delivered')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    completedOrders: orders.filter(o => o.status === 'delivered').length
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {userData?.name || 'Farmer'}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">৳{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Products</h2>
              <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                      Fill in the details below to add a new product to your farm.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="itemName">Product Name *</Label>
                        <Input
                          id="itemName"
                          value={newProduct.itemName}
                          onChange={(e) => setNewProduct({...newProduct, itemName: e.target.value})}
                          placeholder="e.g., Fresh Tomatoes"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vegetables">Vegetables</SelectItem>
                            <SelectItem value="fruits">Fruits</SelectItem>
                            <SelectItem value="grains">Grains</SelectItem>
                            <SelectItem value="spices">Spices</SelectItem>
                            <SelectItem value="dairy">Dairy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="price">Price (per unit) *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                          placeholder="100"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stock">Stock *</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                          placeholder="50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="unit">Unit</Label>
                        <Select value={newProduct.unit} onValueChange={(value) => setNewProduct({...newProduct, unit: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">Kilograms</SelectItem>
                            <SelectItem value="pieces">Pieces</SelectItem>
                            <SelectItem value="liters">Liters</SelectItem>
                            <SelectItem value="bags">Bags</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        placeholder="Describe your product..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={newProduct.startDate}
                          onChange={(e) => setNewProduct({...newProduct, startDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          type="date"
                          value={newProduct.expiryDate}
                          onChange={(e) => setNewProduct({...newProduct, expiryDate: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Image Upload Section */}
                    <div>
                      <Label htmlFor="image">Product Image (Optional)</Label>
                      <p className="text-sm text-gray-600 mb-2">Upload an image to showcase your product. If upload fails, a placeholder will be used.</p>
                      <div className="mt-2 space-y-4">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="cursor-pointer"
                        />
                        {imagePreview && (
                          <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsAddingProduct(false);
                          setImageFile(null);
                          setImagePreview('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleAddProduct}
                        disabled={isUploading}
                        className="flex items-center gap-2"
                      >
                        {isUploading ? (
                          <>
                            <Clock className="w-4 h-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Add Product
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product._id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-200 relative">
                    <img 
                      src={product.image} 
                      alt={product.itemName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{product.itemName}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                    <p className="text-2xl font-bold text-green-600 mb-2">
                      ৳{product.price}/{product.unit}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Stock: {product.stock} {product.unit}
                    </p>
                    
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{product.itemName}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <img src={product.image} alt={product.itemName} className="w-full h-48 object-cover rounded" />
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium">Category:</p>
                                <p className="text-gray-600">{product.category}</p>
                              </div>
                              <div>
                                <p className="font-medium">Price:</p>
                                <p className="text-gray-600">৳{product.price}/{product.unit}</p>
                              </div>
                              <div>
                                <p className="font-medium">Stock:</p>
                                <p className="text-gray-600">{product.stock} {product.unit}</p>
                              </div>
                              <div>
                                <p className="font-medium">Start Date:</p>
                                <p className="text-gray-600">{product.startDate || 'Not specified'}</p>
                              </div>
                              <div>
                                <p className="font-medium">Expiry Date:</p>
                                <p className="text-gray-600">{product.expiryDate || 'Not specified'}</p>
                              </div>
                              <div>
                                <p className="font-medium">Rating:</p>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-gray-600">{product.rating}/5 ({product.reviews} reviews)</span>
                                </div>
                              </div>
                            </div>
                            {product.description && (
                              <div>
                                <p className="font-medium">Description:</p>
                                <p className="text-gray-600">{product.description}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Edit Product Dialog */}
            {editingProduct && (
              <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Product Name</Label>
                        <Input
                          value={editingProduct.itemName}
                          onChange={(e) => setEditingProduct({...editingProduct, itemName: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Input
                          value={editingProduct.category}
                          onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Price</Label>
                        <Input
                          type="number"
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label>Stock</Label>
                        <Input
                          type="number"
                          value={editingProduct.stock}
                          onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={editingProduct.description}
                        onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                        rows={3}
                      />
                    </div>

                    {/* Image Upload for Edit */}
                    <div>
                      <Label>Product Image</Label>
                      <div className="mt-2 space-y-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="cursor-pointer"
                        />
                        {(imagePreview || editingProduct.image) && (
                          <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                            <img
                              src={imagePreview || editingProduct.image}
                              alt="Product"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingProduct(null);
                          setImageFile(null);
                          setImagePreview('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUpdateProduct}
                        disabled={isUploading}
                        className="flex items-center gap-2"
                      >
                        {isUploading ? (
                          <>
                            <Clock className="w-4 h-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Edit className="w-4 h-4" />
                            Update
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {products.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
                <p className="text-gray-600 mb-6">Add your first product to start selling on our platform.</p>
                <Button onClick={() => setIsAddingProduct(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
            
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order._id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">Order #{order._id.slice(-6)}</h3>
                        <p className="text-sm text-gray-600">
                          Ordered on {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getOrderStatusBadge(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium">Products:</p>
                        <div className="text-sm text-gray-600">
                          {order.products.map((product, index) => (
                            <div key={index}>
                              {product.productName} x{product.quantity} = ৳{product.price * product.quantity}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Total Amount:</p>
                        <p className="text-lg font-bold text-green-600">৳{order.totalAmount}</p>
                      </div>
                    </div>
                    
                    {order.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleOrderAction(order._id, 'reject')}
                          className="flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleOrderAction(order._id, 'accept')}
                          className="flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Accept & Ship
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {orders.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600">Your orders will appear here once customers start buying your products.</p>
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
            
            {/* WhatsApp Test Section */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Phone className="w-5 h-5" />
                  WhatsApp Notifications (Demo)
                </CardTitle>
                <CardDescription className="text-blue-600">
                  Test the WhatsApp notification system that sends alerts to farmers when buyers place orders.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Sample Message:</strong>
                    </p>
                    <div className="bg-green-50 p-3 rounded border-l-4 border-green-400 text-sm">
                      🚨 <strong>New Order Alert!</strong><br/>
                      📦 <strong>Product:</strong> Fresh Tomatoes (10 kg)<br/>
                      💰 <strong>Price:</strong> ৳50 per kg<br/>
                      💵 <strong>Total Amount:</strong> ৳500<br/>
                      📍 <strong>Delivery Location:</strong> Dhaka, Mirpur-1<br/>
                      🔗 <strong>Manage Order:</strong> https://taja-haat.vercel.app/farmer-dashboard
                    </div>
                  </div>
                  <Button 
                    onClick={handleTestWhatsApp}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Send Test WhatsApp Message
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    This will send a test message to the demo number. Check console for API response.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Sales Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Revenue:</span>
                      <span className="font-bold">৳{stats.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Orders Completed:</span>
                      <span className="font-bold">{stats.completedOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Orders:</span>
                      <span className="font-bold">{stats.pendingOrders}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Product Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Products:</span>
                      <span className="font-bold">{stats.totalProducts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>In Stock:</span>
                      <span className="font-bold">{products.filter(p => p.stock > 0).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Out of Stock:</span>
                      <span className="font-bold">{products.filter(p => p.stock === 0).length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Average Rating:</span>
                      <span className="font-bold">
                        {products.length > 0 
                          ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)
                          : '0.0'
                        }/5
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Reviews:</span>
                      <span className="font-bold">{products.reduce((sum, p) => sum + p.reviews, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate:</span>
                      <span className="font-bold">
                        {orders.length > 0 
                          ? ((orders.filter(o => o.status === 'delivered').length / orders.length) * 100).toFixed(1)
                          : '0'
                        }%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
