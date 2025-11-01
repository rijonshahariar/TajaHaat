import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Phone
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  description: string;
  image: string;
  harvestDate: string;
  location: string;
  certifications: string[];
  createdAt: string;
}

interface Order {
  id: string;
  productId: string;
  productName: string;
  buyerName: string;
  buyerPhone: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  orderDate: string;
  deliveryAddress: string;
}

export default function FarmerDashboard() {
  const { t } = useTranslation();
  const { userData } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    unit: 'kg',
    description: '',
    harvestDate: '',
    location: '',
    certifications: [] as string[]
  });

  // Load data from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('farmer_products');
    const savedOrders = localStorage.getItem('farmer_orders');
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Save products to localStorage
  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('farmer_products', JSON.stringify(updatedProducts));
  };

  // Save orders to localStorage
  const saveOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem('farmer_orders', JSON.stringify(updatedOrders));
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.quantity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      quantity: parseInt(newProduct.quantity),
      unit: newProduct.unit,
      description: newProduct.description,
      image: '/placeholder.svg',
      harvestDate: newProduct.harvestDate,
      location: newProduct.location || userData?.name || 'Unknown',
      certifications: newProduct.certifications,
      createdAt: new Date().toISOString()
    };

    const updatedProducts = [...products, product];
    saveProducts(updatedProducts);
    
    setNewProduct({
      name: '',
      category: '',
      price: '',
      quantity: '',
      unit: 'kg',
      description: '',
      harvestDate: '',
      location: '',
      certifications: []
    });
    setIsAddingProduct(false);
    
    toast({
      title: "Success",
      description: "Product added successfully"
    });
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    const updatedProducts = products.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    );
    saveProducts(updatedProducts);
    setEditingProduct(null);
    
    toast({
      title: "Success",
      description: "Product updated successfully"
    });
  };

  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    saveProducts(updatedProducts);
    
    toast({
      title: "Success",
      description: "Product deleted successfully"
    });
  };

  const handleOrderAction = (orderId: string, action: 'accept' | 'reject') => {
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status: action === 'accept' ? 'accepted' as const : 'rejected' as const }
        : order
    );
    saveOrders(updatedOrders);
    
    toast({
      title: "Success",
      description: `Order ${action}ed successfully`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    totalProducts: products.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalRevenue: orders.filter(o => o.status === 'accepted' || o.status === 'completed')
      .reduce((sum, o) => sum + o.totalPrice, 0),
    completedOrders: orders.filter(o => o.status === 'completed').length
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('dashboard.farmer.title')}
          </h1>
          <p className="text-gray-600">
            Welcome back, {userData?.name}! {t('dashboard.farmer.subtitle')}
          </p>
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
                <Package className="w-8 h-8 text-green-600" />
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
                <ShoppingCart className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">৳{stats.totalRevenue}</p>
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
              <h2 className="text-2xl font-bold">My Products</h2>
              <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                      Fill in the details to add a new product to your inventory.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                          id="name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
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
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="price">Price per unit *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                          placeholder="100"
                        />
                      </div>
                      <div>
                        <Label htmlFor="quantity">Quantity *</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={newProduct.quantity}
                          onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                          placeholder="50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="unit">Unit</Label>
                        <Select value={newProduct.unit} onValueChange={(value) => setNewProduct({...newProduct, unit: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">Kilogram (kg)</SelectItem>
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
                        <Label htmlFor="harvestDate">Harvest Date</Label>
                        <Input
                          id="harvestDate"
                          type="date"
                          value={newProduct.harvestDate}
                          onChange={(e) => setNewProduct({...newProduct, harvestDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={newProduct.location}
                          onChange={(e) => setNewProduct({...newProduct, location: e.target.value})}
                          placeholder="Farm location"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsAddingProduct(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddProduct}>
                      Add Product
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-200 relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant={product.quantity > 0 ? "default" : "destructive"}>
                        {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                    <p className="text-2xl font-bold text-green-600 mb-2">
                      ৳{product.price}/{product.unit}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Stock: {product.quantity} {product.unit}
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
                            <DialogTitle>{product.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded" />
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
                                <p className="text-gray-600">{product.quantity} {product.unit}</p>
                              </div>
                              <div>
                                <p className="font-medium">Harvest Date:</p>
                                <p className="text-gray-600">{product.harvestDate || 'Not specified'}</p>
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
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                          </DialogHeader>
                          {editingProduct && (
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Product Name</Label>
                                  <Input
                                    value={editingProduct.name}
                                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
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
                              </div>
                              <div>
                                <Label>Quantity</Label>
                                <Input
                                  type="number"
                                  value={editingProduct.quantity}
                                  onChange={(e) => setEditingProduct({...editingProduct, quantity: parseInt(e.target.value)})}
                                />
                              </div>
                              <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setEditingProduct(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleUpdateProduct}>
                                  Update Product
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {products.length === 0 && (
              <Card className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products yet</h3>
                <p className="text-gray-500 mb-4">Start by adding your first product to the marketplace</p>
                <Button onClick={() => setIsAddingProduct(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold">Orders</h2>
            
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{order.productName}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span>{order.buyerName} - {order.buyerPhone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-500" />
                            <span>{order.quantity} units</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span>৳{order.totalPrice}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 md:col-span-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span>{order.deliveryAddress}</span>
                          </div>
                        </div>
                      </div>
                      
                      {order.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOrderAction(order.id, 'reject')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleOrderAction(order.id, 'accept')}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {orders.length === 0 && (
              <Card className="p-12 text-center">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
                <p className="text-gray-500">Orders will appear here when buyers place them</p>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics</h2>
            <Card className="p-8 text-center">
              <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Analytics Coming Soon</h3>
              <p className="text-gray-500">Detailed analytics and insights will be available here</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
