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
import axios from "axios";

interface Order {
  _id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  sellerNumber: string;
  sellerName: string;
  buyerNumber: string;
  status: 'pending' | 'accepted' | 'rejected' | 'in_transit' | 'delivered' | 'cancelled' | 'shipped';
  orderDate: string;
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

  // Load data from API and localStorage
  useEffect(() => {
    const fetchOrders = async () => {
      if (!userData?.phone) return;
      
      try {
        const response = await axios.get('https://taja-haat-backend.vercel.app/orders');
        // Filter orders for current buyer
        const buyerOrders = response.data.filter((order: Order) => 
          order.buyerNumber === userData.phone
        );
        setOrders(buyerOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        // Fallback to localStorage if API fails
        const savedOrders = localStorage.getItem('buyer_orders');
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
      }
    };

    fetchOrders();
    
    // Load demand posts from localStorage (these are local to the user)
    const savedDemands = localStorage.getItem('buyer_demands');
    if (savedDemands) {
      setDemandPosts(JSON.parse(savedDemands));
    }
  }, [userData]);

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

  const handleCancelOrder = async (orderId: string) => {
    try {
      // Update order status to cancelled on the backend
      await axios.put(`https://taja-haat-backend.vercel.app/orders/${orderId}`, {
        status: 'cancelled'
      });
      
      // Update local state
      const updatedOrders = orders.map(order => 
        order._id === orderId 
          ? { ...order, status: 'cancelled' as const }
          : order
      );
      setOrders(updatedOrders);
      
      toast({
        title: "Success",
        description: "Order cancelled successfully"
      });
    } catch (error) {
      console.error('Failed to cancel order:', error);
      toast({
        title: "Error",
        description: "Failed to cancel order. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Professional shipping status tracker component
  const OrderStatusTracker = ({ status }: { status: string }) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: <Package className="w-4 h-4" /> },
      { key: 'accepted', label: 'Confirmed', icon: <CheckCircle className="w-4 h-4" /> },
      { key: 'in_transit', label: 'In Transit', icon: <Truck className="w-4 h-4" /> },
      { key: 'delivered', label: 'Delivered', icon: <CheckCircle className="w-4 h-4" /> }
    ];

    const getStepIndex = (currentStatus: string) => {
      switch (currentStatus) {
        case 'pending': return 0;
        case 'accepted': return 1;
        case 'in_transit': return 2;
        case 'shipped': return 2; // Same as in_transit
        case 'delivered': return 3;
        case 'rejected': return -1; // Special case
        case 'cancelled': return -1; // Special case
        default: return 0;
      }
    };

    const currentStepIndex = getStepIndex(status);
    const isRejectedOrCancelled = status === 'rejected' || status === 'cancelled';

    if (isRejectedOrCancelled) {
      return (
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
          <X className="w-5 h-5 text-red-600" />
          <span className="font-medium text-red-800 capitalize">{status}</span>
        </div>
      );
    }

    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              {/* Step Circle */}
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all
                ${index <= currentStepIndex 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : 'bg-white border-gray-300 text-gray-400'
                }
              `}>
                {index <= currentStepIndex ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  step.icon
                )}
              </div>
              
              {/* Step Label */}
              <div className="ml-2 min-w-0">
                <p className={`text-sm font-medium ${
                  index <= currentStepIndex ? 'text-green-700' : 'text-gray-500'
                }`}>
                  {step.label}
                </p>
              </div>
              
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className={`
                  flex-1 h-0.5 mx-4 transition-all
                  ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-300'}
                `} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
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
    totalSpent: orders.filter(o => o.status === 'delivered' || o.status === 'shipped')
      .reduce((sum, o) => sum + (o.quantity * o.price), 0)
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('dashboard.buyer.title')}
          </h1>
          <p className="text-gray-600 mb-2">
            Welcome back, {userData?.name}! {t('dashboard.buyer.subtitle')}
          </p>
          {userData?.backendUser?.address && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>Delivery Address: {userData.backendUser.address}</span>
            </div>
          )}
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
          <TabsContent value="orders" className="space-y-6 pb-8">
            <h2 className="text-2xl font-bold">My Orders</h2>
            
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order._id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-bold text-lg">{order.productName}</h3>
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-gray-500" />
                              <span>Order ID: {order._id.slice(-8)}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <span>{order.sellerName} - {order.sellerNumber}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-gray-500" />
                              <span>{order.quantity} units @ ৳{order.price} each</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-gray-500" />
                              <span>Total: ৳{order.quantity * order.price}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span>Delivery: {userData?.backendUser?.address || 'Address not provided'}</span>
                            </div>
                            
                          </div>
                        </div>
                        
                        {(order.status === 'pending' || order.status === 'accepted') && (
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCancelOrder(order._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel Order
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {/* Professional Status Tracker */}
                      <OrderStatusTracker status={order.status} />
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
          <TabsContent value="demands" className="space-y-6 pb-8">
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
          <TabsContent value="analytics" className="space-y-6 pb-8">
            <h2 className="text-2xl font-bold">Purchase Analytics</h2>
            
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Spent</p>
                      <p className="text-2xl font-bold text-gray-900">৳{stats.totalSpent}</p>
                      <p className="text-xs text-green-600">+12% from last month</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ৳{orders.length > 0 ? Math.round(stats.totalSpent / orders.length) : 0}
                      </p>
                      <p className="text-xs text-blue-600">+5% from last month</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {orders.length > 0 ? Math.round(((orders.filter(o => o.status === 'delivered').length) / orders.length) * 100) : 0}%
                      </p>
                      <p className="text-xs text-green-600">+8% from last month</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Favourite Seller</p>
                      <p className="text-lg font-bold text-gray-900">
                        {(() => {
                          const sellerCounts = orders.reduce((acc, order) => {
                            acc[order.sellerName] = (acc[order.sellerName] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>);
                          const topSeller = Object.entries(sellerCounts).sort(([,a], [,b]) => b - a)[0];
                          return topSeller ? topSeller[0] : 'None';
                        })()}
                      </p>
                      <p className="text-xs text-purple-600">Most ordered from</p>
                    </div>
                    <Phone className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Order Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const statusCounts = orders.reduce((acc, order) => {
                        acc[order.status] = (acc[order.status] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>);
                      
                      const statusColors = {
                        pending: 'bg-yellow-500',
                        accepted: 'bg-blue-500',
                        in_transit: 'bg-purple-500',
                        shipped: 'bg-purple-500',
                        delivered: 'bg-green-500',
                        cancelled: 'bg-red-500',
                        rejected: 'bg-red-500'
                      };

                      return Object.entries(statusCounts).map(([status, count]) => (
                        <div key={status} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${statusColors[status as keyof typeof statusColors]}`}></div>
                            <span className="text-sm font-medium capitalize">{status.replace('_', ' ')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{count}</span>
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${statusColors[status as keyof typeof statusColors]}`}
                                style={{ width: `${(count / orders.length) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Spending Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Monthly Spending Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const monthlyData = orders.reduce((acc, order) => {
                        const month = new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                        acc[month] = (acc[month] || 0) + (order.quantity * order.price);
                        return acc;
                      }, {} as Record<string, number>);

                      const maxSpending = Math.max(...Object.values(monthlyData));
                      
                      return Object.entries(monthlyData).slice(-6).map(([month, amount]) => (
                        <div key={month} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{month}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">৳{amount}</span>
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 bg-green-500 rounded-full"
                                style={{ width: `${(amount / maxSpending) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Sellers & Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Top Sellers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Top Sellers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const sellerStats = orders.reduce((acc, order) => {
                        const seller = order.sellerName;
                        if (!acc[seller]) {
                          acc[seller] = { orders: 0, total: 0, phone: order.sellerNumber };
                        }
                        acc[seller].orders += 1;
                        acc[seller].total += order.quantity * order.price;
                        return acc;
                      }, {} as Record<string, { orders: number; total: number; phone: string }>);

                      return Object.entries(sellerStats)
                        .sort(([,a], [,b]) => b.total - a.total)
                        .slice(0, 5)
                        .map(([seller, stats]) => (
                          <div key={seller} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{seller}</p>
                              <p className="text-sm text-gray-600">{stats.phone}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">৳{stats.total}</p>
                              <p className="text-sm text-gray-600">{stats.orders} orders</p>
                            </div>
                          </div>
                        ));
                    })()}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders
                      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
                      .slice(0, 5)
                      .map((order) => (
                        <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{order.productName}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge 
                              className={`text-xs ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {order.status}
                            </Badge>
                            <p className="text-sm text-gray-600 mt-1">৳{order.quantity * order.price}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Insights & Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Insights & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Spending Pattern</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      You spend most on {(() => {
                        const sellerStats = orders.reduce((acc, order) => {
                          acc[order.sellerName] = (acc[order.sellerName] || 0) + (order.quantity * order.price);
                          return acc;
                        }, {} as Record<string, number>);
                        const topSeller = Object.entries(sellerStats).sort(([,a], [,b]) => b - a)[0];
                        return topSeller ? topSeller[0] : 'various sellers';
                      })()} orders. Consider building a long-term relationship for better deals.
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800">Success Rate</span>
                    </div>
                    <p className="text-sm text-green-700">
                      {orders.filter(o => o.status === 'delivered').length} out of {orders.length} orders completed successfully. 
                      Great track record! Keep choosing reliable sellers.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-purple-800">Demand Posts</span>
                    </div>
                    <p className="text-sm text-purple-700">
                      You have {demandPosts.filter(d => d.status === 'active').length} active demand posts. 
                      Post more specific demands to get competitive offers from farmers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
