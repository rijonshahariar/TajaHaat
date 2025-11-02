import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiService, Order } from '@/lib/apiService';
import { useAuth } from '@/hooks/useAuth';
import { MapPin, Phone, Clock, Package, User, CheckCircle, RefreshCw } from 'lucide-react';

const DriverDashboard: React.FC = () => {
  const [acceptedOrders, setAcceptedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchAcceptedOrders();
  }, []);

  const fetchAcceptedOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching orders for driver dashboard...');
      
      // Try to get orders with full user details first
      let allOrders = await apiService.getOrdersWithUserDetails();
      console.log('Orders with user details received:', allOrders.length, allOrders);
      
      // If that fails, fallback to regular orders
      if (!allOrders || allOrders.length === 0) {
        allOrders = await apiService.getOrders();
        console.log('Fallback to regular orders:', allOrders.length, allOrders);
      }
      
      const driverRelevantOrders = allOrders.filter(order => 
        order.status === 'accepted' || 
        order.status === 'driver-assigned' || 
        order.status === 'in-transit'
      );
      console.log('Driver-relevant orders filtered:', driverRelevantOrders.length, driverRelevantOrders);
      
      setAcceptedOrders(driverRelevantOrders);
    } catch (error) {
      console.error('Error fetching accepted orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch accepted orders. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      // Update order status to assign driver (we'll implement this API endpoint)
      await apiService.updateOrderStatus(orderId, 'driver-assigned');
      toast({
        title: 'Order Accepted',
        description: 'You have successfully accepted this delivery order.',
      });
      fetchAcceptedOrders();
    } catch (error) {
      console.error('Error accepting order:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleStartDelivery = async (orderId: string) => {
    try {
      await apiService.updateOrderStatus(orderId, 'in-transit');
      toast({
        title: 'Delivery Started',
        description: 'Order status updated to in-transit.',
      });
      fetchAcceptedOrders();
    } catch (error) {
      console.error('Error starting delivery:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'default';
      case 'driver-assigned':
        return 'secondary';
      case 'in-transit':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Ready for Pickup';
      case 'driver-assigned':
        return 'Assigned to You';
      case 'in-transit':
        return 'In Transit';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ag-green-600 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Driver Dashboard</h1>
          <p className="text-muted-foreground">Manage your delivery orders and track progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-ag-green-600" />
          <span className="font-medium">{acceptedOrders.length} Orders Available</span>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAcceptedOrders}
            disabled={loading}
            className="ml-4"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {acceptedOrders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Orders Available</h3>
            <p className="text-muted-foreground mb-4">
              No accepted orders are currently available for delivery. Check back later!
            </p>
            <Button 
              onClick={fetchAcceptedOrders}
              variant="outline"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Orders
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {acceptedOrders.map((order) => {
            // Debug log for each order
            console.log('Rendering order:', {
              id: order._id,
              sellerName: order.seller?.fullName || order.sellername,
              sellerAddress: order.pickupAddress || order.seller?.address,
              buyerName: order?.buyername,
              buyerAddress: order.deliveryAddress || order.buyer?.address,
              status: order.status
            });
            
            return (
            <Card key={order._id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-ag-green-50 to-blue-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Order #{order._id?.slice(-8)}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4" />
                      {new Date(order.orderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Pickup Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-lg font-semibold text-ag-green-700">
                      <MapPin className="h-5 w-5" />
                      Pickup Location
                    </div>
                    
                    <div className="bg-ag-green-50 p-4 rounded-lg space-y-3">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-ag-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">
                            {order.seller?.fullName || order.sellerName || 'Seller Name'}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Phone className="h-4 w-4" />
                            {order.seller?.phoneNumber || order.sellerNumber || 'Not available'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-ag-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Pickup Address</p>
                          <p className="text-sm text-muted-foreground">
                            {order.selleraddress || order.seller?.address || 'Address not provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-lg font-semibold text-blue-700">
                      <MapPin className="h-5 w-5" />
                      Delivery Location
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium">
                            {order.buyername || 'Buyer Name'}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Phone className="h-4 w-4" />
                            {order.buyer?.phoneNumber || order.buyerNumber || 'Not available'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Delivery Address</p>
                          <p className="text-sm text-muted-foreground">
                            {order.buyeraddress || order.buyer?.address || 'Address not provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Order Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Order Details</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Product</p>
                        <p className="font-medium">{order.product?.name || order.productName || 'Product Name'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Quantity</p>
                        <p className="font-medium">{order.quantity} {order.product?.unit || 'units'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Price per unit</p>
                        <p className="font-medium">৳{order.product?.price || order.price || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="font-medium text-ag-green-600">৳{order.totalAmount || (order.quantity * (order.product?.price || order.price || 0))}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end">
                  {order.status === 'accepted' && (
                    <Button
                      onClick={() => handleAcceptOrder(order._id!)}
                      className="bg-ag-green-600 hover:bg-ag-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept Delivery
                    </Button>
                  )}
                  
                  {(order.status === 'driver-assigned') && (
                    <Button
                      onClick={() => handleStartDelivery(order._id!)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Start Delivery
                    </Button>
                  )}
                  
                  {order.status === 'in-transit' && (
                    <Badge variant="destructive" className="px-4 py-2">
                      <Package className="h-4 w-4 mr-2" />
                      In Transit
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
