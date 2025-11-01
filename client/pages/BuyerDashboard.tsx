import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ShoppingCart, 
  Plus, 
  MessageSquare, 
  TrendingUp, 
  Eye, 
  X,
  DollarSign,
  Calendar,
  MapPin,
  Phone,
  Package,
  Clock,
  Truck,
  CheckCircle
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Order {
  id: string;
  productId: string;
  productName: string;
  farmerName: string;
  farmerPhone: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'pending' | 'accepted' | 'rejected' | 'in_transit' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryAddress: string;
  estimatedDelivery?: string;
}

interface DemandPost {
  id: string;
  title: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  maxPrice: number;
  location: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'active' | 'fulfilled' | 'expired';
  createdAt: string;
  expiresAt: string;
}

export default function BuyerDashboard() {
  const { t } = useTranslation();
  const { userData } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [demandPosts, setDemandPosts] = useState<DemandPost[]>([]);
  const [isCreatingDemand, setIsCreatingDemand] = useState(false);
  const [newDemand, setNewDemand] = useState({
    title: '',
    category: '',
    description: '',
    quantity: '',
    unit: 'kg',
    maxPrice: '',
    location: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
    validityDays: '7'
  });

  // Load data from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('buyer_orders');
    const savedDemands = localStorage.getItem('buyer_demands');
    
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
    
    if (savedDemands) {
      setDemandPosts(JSON.parse(savedDemands));
    }
  }, []);

  // Save orders to localStorage
  const saveOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem('buyer_orders', JSON.stringify(updatedOrders));
  };

  // Save demand posts to localStorage
  const saveDemands = (updatedDemands: DemandPost[]) => {
    setDemandPosts(updatedDemands);
    localStorage.setItem('buyer_demands', JSON.stringify(updatedDemands));
  };

  const handleCreateDemand = () => {
    if (!newDemand.title || !newDemand.category || !newDemand.quantity || !newDemand.maxPrice) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const demandPost: DemandPost = {
      id: Date.now().toString(),
      title: newDemand.title,
      category: newDemand.category,
      description: newDemand.description,
      quantity: parseInt(newDemand.quantity),
      unit: newDemand.unit,
      maxPrice: parseFloat(newDemand.maxPrice),
      location: newDemand.location || userData?.name || 'Unknown',
      urgency: newDemand.urgency,
      status: 'active',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + parseInt(newDemand.validityDays) * 24 * 60 * 60 * 1000).toISOString()
    };

    const updatedDemands = [...demandPosts, demandPost];
    saveDemands(updatedDemands);
    
    setNewDemand({
      title: '',
      category: '',
      description: '',
      quantity: '',
      unit: 'kg',
      maxPrice: '',
      location: '',
      urgency: 'medium',
      validityDays: '7'
    });
    setIsCreatingDemand(false);
    
    toast({
      title: "Success",
      description: "Demand post created successfully"
    });
  };

  const handleCancelOrder = (orderId: string) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'cancelled' as const }
        : order
    );
    saveOrders(updatedOrders);
    
    toast({
      title: "Success",
      description: "Order cancelled successfully"
    });
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'in_transit': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    activeDemands: demandPosts.filter(d => d.status === 'active').length,
    totalSpent: orders.filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.totalPrice, 0)
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('dashboard.buyer.title')}
          </h1>
          <p className="text-gray-600">
            Welcome back, {userData?.name}! {t('dashboard.buyer.subtitle')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-600" />
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
                  <p className="text-sm font-medium text-gray-600">Active Demands</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeDemands}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">৳{stats.totalSpent}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="demands">Demand Posts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold">My Orders</h2>
            
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{order.productName}</h3>
                          <Badge className={getOrderStatusColor(order.status)}>
                            <div className="flex items-center gap-1">
                              {getOrderStatusIcon(order.status)}
                              {order.status}
                            </div>
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span>{order.farmerName} - {order.farmerPhone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-500" />
                            <span>{order.quantity} units @ ৳{order.unitPrice} each</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span>Total: ৳{order.totalPrice}</span>
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
                      
                      {(order.status === 'pending' || order.status === 'accepted') && (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel Order
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
                <p className="text-gray-500">Start shopping in the marketplace to see your orders here</p>
              </Card>
            )}
          </TabsContent>

          {/* Demands Tab */}
          <TabsContent value="demands" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Demand Posts</h2>
              <Dialog open={isCreatingDemand} onOpenChange={setIsCreatingDemand}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Post Demand
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Post New Demand</DialogTitle>
                    <DialogDescription>
                      Tell farmers what you need and get offers from multiple suppliers.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="title">Demand Title *</Label>
                      <Input
                        id="title"
                        value={newDemand.title}
                        onChange={(e) => setNewDemand({...newDemand, title: e.target.value})}
                        placeholder="e.g., Need Fresh Tomatoes for Restaurant"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select value={newDemand.category} onValueChange={(value) => setNewDemand({...newDemand, category: value})}>
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
                        <Label htmlFor="urgency">Urgency</Label>
                        <Select value={newDemand.urgency} onValueChange={(value: 'low' | 'medium' | 'high') => setNewDemand({...newDemand, urgency: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="quantity">Quantity *</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={newDemand.quantity}
                          onChange={(e) => setNewDemand({...newDemand, quantity: e.target.value})}
                          placeholder="100"
                        />
                      </div>
                      <div>
                        <Label htmlFor="unit">Unit</Label>
                        <Select value={newDemand.unit} onValueChange={(value) => setNewDemand({...newDemand, unit: value})}>
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
                      <div>
                        <Label htmlFor="maxPrice">Max Price per unit *</Label>
                        <Input
                          id="maxPrice"
                          type="number"
                          value={newDemand.maxPrice}
                          onChange={(e) => setNewDemand({...newDemand, maxPrice: e.target.value})}
                          placeholder="120"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newDemand.description}
                        onChange={(e) => setNewDemand({...newDemand, description: e.target.value})}
                        placeholder="Specify quality requirements, preferred delivery time, etc."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Delivery Location</Label>
                        <Input
                          id="location"
                          value={newDemand.location}
                          onChange={(e) => setNewDemand({...newDemand, location: e.target.value})}
                          placeholder="Your location"
                        />
                      </div>
                      <div>
                        <Label htmlFor="validityDays">Valid for (days)</Label>
                        <Select value={newDemand.validityDays} onValueChange={(value) => setNewDemand({...newDemand, validityDays: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 day</SelectItem>
                            <SelectItem value="3">3 days</SelectItem>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="14">14 days</SelectItem>
                            <SelectItem value="30">30 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsCreatingDemand(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateDemand}>
                      Post Demand
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {demandPosts.map((demand) => (
                <Card key={demand.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg">{demand.title}</h3>
                      <div className="flex gap-2">
                        <Badge className={getUrgencyColor(demand.urgency)}>
                          {demand.urgency}
                        </Badge>
                        <Badge variant={demand.status === 'active' ? 'default' : 'secondary'}>
                          {demand.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2">{demand.category}</p>
                    <p className="text-2xl font-bold text-green-600 mb-2">
                      Max ৳{demand.maxPrice}/{demand.unit}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      Quantity: {demand.quantity} {demand.unit}
                    </p>
                    
                    {demand.description && (
                      <p className="text-sm text-gray-600 mb-3">{demand.description}</p>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Calendar className="w-3 h-3" />
                      <span>Expires: {new Date(demand.expiresAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{demand.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium">Category:</p>
                                <p className="text-gray-600">{demand.category}</p>
                              </div>
                              <div>
                                <p className="font-medium">Quantity:</p>
                                <p className="text-gray-600">{demand.quantity} {demand.unit}</p>
                              </div>
                              <div>
                                <p className="font-medium">Max Price:</p>
                                <p className="text-gray-600">৳{demand.maxPrice}/{demand.unit}</p>
                              </div>
                              <div>
                                <p className="font-medium">Urgency:</p>
                                <p className="text-gray-600">{demand.urgency}</p>
                              </div>
                              <div>
                                <p className="font-medium">Location:</p>
                                <p className="text-gray-600">{demand.location}</p>
                              </div>
                              <div>
                                <p className="font-medium">Valid Until:</p>
                                <p className="text-gray-600">{new Date(demand.expiresAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            {demand.description && (
                              <div>
                                <p className="font-medium">Description:</p>
                                <p className="text-gray-600">{demand.description}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {demandPosts.length === 0 && (
              <Card className="p-12 text-center">
                <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No demand posts yet</h3>
                <p className="text-gray-500 mb-4">Post your first demand to get offers from farmers</p>
                <Button onClick={() => setIsCreatingDemand(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Post Your First Demand
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics</h2>
            <Card className="p-8 text-center">
              <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Analytics Coming Soon</h3>
              <p className="text-gray-500">Detailed purchase analytics and insights will be available here</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
