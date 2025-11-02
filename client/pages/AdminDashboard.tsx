import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  Package,
  Truck,
  CheckCircle,
  X,
  Eye,
  Edit,
  Trash2,
  ArrowUp,
  Clock,
  AlertTriangle,
  Calendar,
  Phone,
  MapPin,
  Star,
  Award,
  CreditCard,
  BarChart3
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { apiService, BackendUser } from "@/lib/apiService";
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
  status: 'pending' | 'accepted' | 'rejected' | 'in_transit' | 'delivered' | 'cancelled' | 'shipped' | 'completed';
  orderDate: string;
}

interface SystemStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  farmers: number;
  buyers: number;
  admins: number;
}

export default function AdminDashboard() {
  const { userData } = useAuth();
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    farmers: 0,
    buyers: 0,
    admins: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserRole, setSelectedUserRole] = useState<string>("all");
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>("all");
  const [editingUser, setEditingUser] = useState<BackendUser | null>(null);

  // Load data on component mount
  useEffect(() => {
    fetchUsers();
    fetchOrders();
  }, []);

  // Calculate system stats whenever data changes
  useEffect(() => {
    calculateSystemStats();
  }, [users, orders]);

  const fetchUsers = async () => {
    try {
      const allUsers = await apiService.getAllUsers();
      // Filter out any null/undefined users and ensure required fields exist
      const validUsers = allUsers.filter(user => 
        user && 
        user._id && 
        user.fullName && 
        user.phoneNumber && 
        user.role
      );
      setUsers(validUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('https://taja-haat-backend-muntakim.vercel.app/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      });
    }
  };

  const calculateSystemStats = () => {
    const stats: SystemStats = {
      totalUsers: users.length,
      totalOrders: orders.length,
      totalRevenue: orders
        .filter(order => order.status === 'completed' || order.status === 'delivered')
        .reduce((sum, order) => sum + (order.quantity * order.price), 0),
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      completedOrders: orders.filter(order => order.status === 'completed' || order.status === 'delivered').length,
      farmers: users.filter(user => user.role === 'farmer').length,
      buyers: users.filter(user => user.role === 'buyer').length,
      admins: users.filter(user => user.role === 'admin').length
    };
    setSystemStats(stats);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await apiService.deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
      toast({
        title: "Success",
        description: "User deleted successfully"
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  const handleUpgradeUser = async (userId: string, newLevel: number) => {
    try {
      const updatedUser = await apiService.updateUser(userId, { level: newLevel });
      setUsers(users.map(user => user._id === userId ? updatedUser : user));
      toast({
        title: "Success",
        description: `User upgraded to level ${newLevel}`
      });
    } catch (error) {
      console.error('Failed to upgrade user:', error);
      toast({
        title: "Error",
        description: "Failed to upgrade user",
        variant: "destructive"
      });
    }
  };

  const handleShipOrder = async (orderId: string) => {
    try {
      // Find the order to get its current data
      const orderToUpdate = orders.find(order => order._id === orderId);
      if (!orderToUpdate) {
        throw new Error('Order not found');
      }

      // Send the complete order data with updated status (excluding _id from body)
      const { _id, ...orderData } = orderToUpdate;
      await axios.put(`https://taja-haat-backend-muntakim.vercel.app/orders/${orderId}`, {
        ...orderData,
        status: 'delivered'
      });
      
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: 'shipped' as const }
          : order
      ));
      
      toast({
        title: "Success",
        description: "Order shipped successfully."
      });
    } catch (error) {
      console.error('Failed to ship order:', error);
      toast({
        title: "Error",
        description: "Failed to ship order",
        variant: "destructive"
      });
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      // Find the order to get required fields
      const orderToUpdate = orders.find(order => order._id === orderId);
      if (!orderToUpdate) {
        throw new Error('Order not found');
      }

      // Send required fields along with status update
      await axios.put(`https://taja-haat-backend-muntakim.vercel.app/orders/${orderId}`, {
        productId: orderToUpdate.productId,
        productName: orderToUpdate.productName,
        quantity: orderToUpdate.quantity,
        price: orderToUpdate.price,
        sellerNumber: orderToUpdate.sellerNumber,
        sellerName: orderToUpdate.sellerName,
        buyerNumber: orderToUpdate.buyerNumber,
        orderDate: orderToUpdate.orderDate,
        status: 'cancelled'
      });
      
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: 'cancelled' as const }
          : order
      ));
      
      toast({
        title: "Success",
        description: "Order cancelled successfully."
      });
    } catch (error: any) {
      console.error('Failed to cancel order:', error);
      console.log('Error details:', error.response?.data);
      toast({
        title: "Error",
        description: `Failed to cancel order: ${error.response?.data?.message || error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleReleasePayment = async (orderId: string) => {
    try {
      // Find the order to get required fields
      const orderToUpdate = orders.find(order => order._id === orderId);
      if (!orderToUpdate) {
        throw new Error('Order not found');
      }

      // Send required fields along with status update
      await axios.put(`https://taja-haat-backend-muntakim.vercel.app/orders/${orderId}`, {
        productId: orderToUpdate.productId,
        productName: orderToUpdate.productName,
        quantity: orderToUpdate.quantity,
        price: orderToUpdate.price,
        sellerNumber: orderToUpdate.sellerNumber,
        sellerName: orderToUpdate.sellerName,
        buyerNumber: orderToUpdate.buyerNumber,
        orderDate: orderToUpdate.orderDate,
        status: 'completed'
      });
      
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: 'completed' as const }
          : order
      ));
      
      toast({
        title: "Success",
        description: "Payment released successfully. Order completed."
      });
    } catch (error: any) {
      console.error('Failed to release payment:', error);
      console.log('Error details:', error.response?.data);
      toast({
        title: "Error",
        description: `Failed to release payment: ${error.response?.data?.message || error.message}`,
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'farmer': return 'bg-green-100 text-green-800';
      case 'buyer': return 'bg-blue-100 text-blue-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.phoneNumber || '').includes(searchTerm) ||
                         (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedUserRole === 'all' || user.role === selectedUserRole;
    return matchesSearch && matchesRole;
  });

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedOrderStatus === 'all' || order.status === selectedOrderStatus;
    return matchesStatus;
  });

  // Redirect if not admin
  if (userData?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            👑 Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {userData?.name}! Monitor and manage the entire system.
          </p>
        </div>

        {/* System Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card key="total-users">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers}</p>
                  <p className="text-xs text-blue-600">F: {systemStats.farmers} | B: {systemStats.buyers} | A: {systemStats.admins}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card key="total-orders">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalOrders}</p>
                  <p className="text-xs text-green-600">Completed: {systemStats.completedOrders}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card key="total-revenue">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">৳{systemStats.totalRevenue}</p>
                  <p className="text-xs text-purple-600">From completed orders</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card key="pending-orders">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.pendingOrders}</p>
                  <p className="text-xs text-yellow-600">Needs attention</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="orders">Order Management</TabsTrigger>
            <TabsTrigger value="payments">Payment Management</TabsTrigger>
            <TabsTrigger value="analytics">System Analytics</TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6 pb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search users by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedUserRole} onValueChange={setSelectedUserRole}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="farmer">Farmers</SelectItem>
                  <SelectItem value="buyer">Buyers</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <Card key={user._id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.image}
                          alt={user.fullName}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&size=48&background=10b981&color=fff`;
                          }}
                        />
                        <div>
                          <h3 className="font-bold">{user.fullName}</h3>
                          <Badge className={getRoleColor(user.role)}>
                            {user.role === 'farmer' ? '🌾' : user.role === 'buyer' ? '🛒' : '👑'} {user.role}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{user.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="truncate">{user.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>Rating: {user.rating}/5</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-purple-500" />
                        <span>Level {user.level}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <ArrowUp className="w-4 h-4 mr-1" />
                            Upgrade
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Upgrade User Level</DialogTitle>
                            <DialogDescription>
                              Upgrade {user.fullName} to a higher level
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Current Level: {user.level}</Label>
                              <Select onValueChange={(value) => handleUpgradeUser(user._id!, parseInt(value))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select new level" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5].map(level => (
                                    <SelectItem key={level} value={level.toString()} disabled={level <= user.level}>
                                      Level {level}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {user.fullName}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteUser(user._id!)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Order Management Tab */}
          <TabsContent value="orders" className="space-y-6 pb-8">
            <div className="flex gap-4 mb-6">
              <Select value={selectedOrderStatus} onValueChange={setSelectedOrderStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order._id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-bold text-lg">{order.productName}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span>Seller: {order.sellerName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span>Buyer: {order.buyerNumber}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-500" />
                            <span>{order.quantity} units @ ৳{order.price}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span>Total: ৳{order.quantity * order.price}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {order.status === 'accepted' && (
                          <Button 
                            size="sm"
                            onClick={() => handleShipOrder(order._id)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Truck className="w-4 h-4 mr-1" />
                            Ship Order
                          </Button>
                        )}
                        
                        {order.status === 'pending' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCancelOrder(order._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Payment Management Tab */}
          <TabsContent value="payments" className="space-y-6 pb-8">
            <h2 className="text-2xl font-bold">Payment Management</h2>
            
            <div className="space-y-4">
              {orders
                .filter(order => order.status === 'delivered')
                .map((order) => (
                  <Card key={order._id} className="border-orange-200 bg-orange-50">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-bold text-lg">{order.productName}</h3>
                            <Badge className="bg-orange-100 text-orange-800">
                              Payment Hold
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <span>Farmer: {order.sellerName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span>Shipped: {new Date(order.orderDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-gray-500" />
                              <span>Amount: ৳{order.quantity * order.price}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleReleasePayment(order._id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CreditCard className="w-4 h-4 mr-1" />
                            Release Payment
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              
              {orders.filter(order => order.status === 'delivered').length === 0 && (
                <Card className="p-12 text-center">
                  <CreditCard className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No payments pending</h3>
                  <p className="text-gray-500">No delivered orders awaiting payment release</p>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6 pb-8">
            <h2 className="text-2xl font-bold">System Analytics</h2>
            
            {/* Revenue Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card key="order-status-distribution">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Order Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(
                      orders.reduce((acc, order) => {
                        acc[order.status] = (acc[order.status] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(status).replace('text-', 'bg-').replace('100', '500')}`}></div>
                          <span className="text-sm font-medium capitalize">{status.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{count}</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getStatusColor(status).replace('text-', 'bg-').replace('100', '500')}`}
                              style={{ width: `${(count / orders.length) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card key="user-role-distribution">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    User Role Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { role: 'farmer', count: systemStats.farmers, icon: '🌾' },
                      { role: 'buyer', count: systemStats.buyers, icon: '🛒' },
                      { role: 'admin', count: systemStats.admins, icon: '👑' }
                    ].map(({ role, count, icon }) => (
                      <div key={role} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{icon}</span>
                          <span className="text-sm font-medium capitalize">{role}s</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{count}</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getRoleColor(role).replace('text-', 'bg-').replace('100', '500')}`}
                              style={{ width: `${(count / systemStats.totalUsers) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card key="recent-activity">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent System Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders
                    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
                    .slice(0, 10)
                    .map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{order.productName}</p>
                          <p className="text-sm text-gray-600">
                            {order.sellerName} → {order.buyerNumber}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
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
