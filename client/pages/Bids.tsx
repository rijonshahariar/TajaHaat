import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  MessageSquare, 
  DollarSign,
  Calendar,
  MapPin,
  Package,
  Send,
  Eye,
  Clock,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

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
  buyerName: string;
  buyerPhone: string;
}

interface Bid {
  id: string;
  demandId: string;
  demandTitle: string;
  farmerName: string;
  farmerPhone: string;
  bidPrice: number;
  quantity: number;
  unit: string;
  message: string;
  estimatedDelivery: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export default function Bids() {
  const { t } = useTranslation();
  const { userData } = useAuth();
  const [demandPosts, setDemandPosts] = useState<DemandPost[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);
  const [selectedDemand, setSelectedDemand] = useState<DemandPost | null>(null);
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [newBid, setNewBid] = useState({
    bidPrice: '',
    quantity: '',
    message: '',
    estimatedDelivery: ''
  });

  // Load data from localStorage
  useEffect(() => {
    const savedDemands = localStorage.getItem('buyer_demands');
    const savedBids = localStorage.getItem('farmer_bids');
    
    if (savedDemands) {
      // Load all demand posts from all buyers
      const demands = JSON.parse(savedDemands);
      setDemandPosts(demands.filter((d: DemandPost) => d.status === 'active'));
    }
    
    if (savedBids) {
      // Load bids made by this farmer
      const bids = JSON.parse(savedBids);
      setMyBids(bids.filter((b: Bid) => b.farmerName === userData?.name));
    }
  }, [userData?.name]);

  // Save bids to localStorage
  const saveBids = (updatedBids: Bid[]) => {
    setMyBids(updatedBids.filter(b => b.farmerName === userData?.name));
    localStorage.setItem('farmer_bids', JSON.stringify(updatedBids));
  };

  const handlePlaceBid = () => {
    if (!selectedDemand || !newBid.bidPrice || !newBid.quantity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(newBid.bidPrice) > selectedDemand.maxPrice) {
      toast({
        title: "Error",
        description: `Bid price cannot exceed maximum price of ৳${selectedDemand.maxPrice}`,
        variant: "destructive"
      });
      return;
    }

    const bid: Bid = {
      id: Date.now().toString(),
      demandId: selectedDemand.id,
      demandTitle: selectedDemand.title,
      farmerName: userData?.name || 'Unknown Farmer',
      farmerPhone: userData?.phone || 'Unknown',
      bidPrice: parseFloat(newBid.bidPrice),
      quantity: parseInt(newBid.quantity),
      unit: selectedDemand.unit,
      message: newBid.message,
      estimatedDelivery: newBid.estimatedDelivery,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Load existing bids from localStorage
    const existingBids = localStorage.getItem('farmer_bids');
    const allBids = existingBids ? JSON.parse(existingBids) : [];
    const updatedBids = [...allBids, bid];
    
    saveBids(updatedBids);
    
    setNewBid({
      bidPrice: '',
      quantity: '',
      message: '',
      estimatedDelivery: ''
    });
    setSelectedDemand(null);
    setIsPlacingBid(false);
    
    toast({
      title: "Success",
      description: "Bid placed successfully"
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBidStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    availableDemands: demandPosts.length,
    myBids: myBids.length,
    acceptedBids: myBids.filter(b => b.status === 'accepted').length,
    pendingBids: myBids.filter(b => b.status === 'pending').length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Buyer Demands & Bids
          </h1>
          <p className="text-gray-600">
            Browse buyer demands and place competitive bids for your products
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Demands</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.availableDemands}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">My Bids</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.myBids}</p>
                </div>
                <Send className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Accepted Bids</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.acceptedBids}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Bids</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingBids}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Demands */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold">Available Buyer Demands</h2>
            
            <div className="space-y-4">
              {demandPosts.map((demand) => (
                <Card key={demand.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-lg">{demand.title}</h3>
                          <div className="flex gap-2">
                            <Badge className={getUrgencyColor(demand.urgency)}>
                              {demand.urgency} priority
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-2">{demand.category}</p>
                        <p className="text-2xl font-bold text-green-600 mb-2">
                          Max ৳{demand.maxPrice}/{demand.unit}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                          Quantity needed: {demand.quantity} {demand.unit}
                        </p>
                        
                        {demand.description && (
                          <p className="text-sm text-gray-600 mb-3">{demand.description}</p>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{demand.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Expires: {new Date(demand.expiresAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
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
                                    <p className="font-medium">Priority:</p>
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
                                    <p className="font-medium">Requirements:</p>
                                    <p className="text-gray-600">{demand.description}</p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            size="sm"
                            onClick={() => {
                              setSelectedDemand(demand);
                              setNewBid({
                                bidPrice: '',
                                quantity: demand.quantity.toString(),
                                message: '',
                                estimatedDelivery: ''
                              });
                              setIsPlacingBid(true);
                            }}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Place Bid
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {demandPosts.length === 0 && (
              <Card className="p-12 text-center">
                <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No active demands</h3>
                <p className="text-gray-500">No buyer demands are currently available</p>
              </Card>
            )}
          </div>

          {/* My Bids */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Bids</h2>
            
            <div className="space-y-4">
              {myBids.map((bid) => (
                <Card key={bid.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{bid.demandTitle}</h4>
                      <Badge className={getBidStatusColor(bid.status)}>
                        {bid.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-3 h-3 text-gray-500" />
                        <span>৳{bid.bidPrice}/{bid.unit} × {bid.quantity}</span>
                      </div>
                      {bid.estimatedDelivery && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          <span>{new Date(bid.estimatedDelivery).toLocaleDateString()}</span>
                        </div>
                      )}
                      {bid.message && (
                        <p className="text-gray-600 text-xs">{bid.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {myBids.length === 0 && (
              <Card className="p-8 text-center">
                <Send className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <h4 className="font-semibold text-gray-600 mb-2">No bids placed</h4>
                <p className="text-gray-500 text-sm">Start bidding on buyer demands</p>
              </Card>
            )}
          </div>
        </div>

        {/* Place Bid Dialog */}
        <Dialog open={isPlacingBid} onOpenChange={setIsPlacingBid}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Place Bid</DialogTitle>
              <DialogDescription>
                Submit your competitive bid for "{selectedDemand?.title}"
              </DialogDescription>
            </DialogHeader>
            {selectedDemand && (
              <div className="grid gap-4 py-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">{selectedDemand.title}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span>Quantity: {selectedDemand.quantity} {selectedDemand.unit}</span>
                    <span>Max Price: ৳{selectedDemand.maxPrice}/{selectedDemand.unit}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bidPrice">Your Bid Price (per {selectedDemand.unit}) *</Label>
                    <Input
                      id="bidPrice"
                      type="number"
                      value={newBid.bidPrice}
                      onChange={(e) => setNewBid({...newBid, bidPrice: e.target.value})}
                      placeholder={`Max: ${selectedDemand.maxPrice}`}
                      max={selectedDemand.maxPrice}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity you can supply *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newBid.quantity}
                      onChange={(e) => setNewBid({...newBid, quantity: e.target.value})}
                      placeholder="100"
                      max={selectedDemand.quantity}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="estimatedDelivery">Estimated Delivery Date</Label>
                  <Input
                    id="estimatedDelivery"
                    type="date"
                    value={newBid.estimatedDelivery}
                    onChange={(e) => setNewBid({...newBid, estimatedDelivery: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message to Buyer</Label>
                  <Textarea
                    id="message"
                    value={newBid.message}
                    onChange={(e) => setNewBid({...newBid, message: e.target.value})}
                    placeholder="Tell the buyer about your product quality, organic certification, etc."
                    rows={3}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Total Value:</strong> ৳{(parseFloat(newBid.bidPrice) || 0) * (parseInt(newBid.quantity) || 0)}
                  </p>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsPlacingBid(false)}>
                Cancel
              </Button>
              <Button onClick={handlePlaceBid}>
                <Send className="w-4 h-4 mr-2" />
                Submit Bid
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Footer />
    </div>
  );
}
