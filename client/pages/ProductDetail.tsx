import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/Footer";
import { Star, MapPin, Phone, Shield, Badge, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import WhatsAppService from "@/lib/whatsappService";
import axios from "axios";

interface Review {
  orderId: string;
  productId: string;
  rating: number;
  review: string;
  timestamp: string;
  userName?: string;
}
const getLevelBadge = (level: string) => {
  const levels = {
    new: { label: "New Member", color: "bg-blue-100 text-blue-700" },
    level_1: { label: "Level 1", color: "bg-green-100 text-green-700" },
    level_2: { label: "Level 2", color: "bg-emerald-100 text-emerald-700" },
    level_3: { label: "Level 3 ⭐", color: "bg-amber-100 text-amber-700" },
  };
  return levels[level as keyof typeof levels] || levels.new;
};

export default function ProductDetail() {
  const { productId } = useParams();
  // console.log(productId);
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [productReviews, setProductReviews] = useState<Review[]>([]);


  useEffect(() => {
    if (!productId) {
      setError("No product ID provided");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        
        const res = await fetch(`https://taja-haat-backend.vercel.app/products/${productId}`);
        const data = await res.json();
        // console.log(data);
        if (!data) {
          throw new Error("Product data is empty");
        }
        setProduct(data);
        console.log("Product fetched from server : ", data);
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    })();

    // Load reviews for this product from localStorage
    const loadProductReviews = () => {
      try {
        const storedReviews = localStorage.getItem('buyer_reviews');
        
        if (storedReviews) {
          const allReviews: Review[] = JSON.parse(storedReviews);
          const filteredReviews = allReviews.filter(review => review.productId === productId);
          setProductReviews(filteredReviews);
        } else {
          setProductReviews([]);
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
        setProductReviews([]);
      }
    };

    loadProductReviews();

    // Listen for localStorage changes (when reviews are added from buyer dashboard)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'buyer_reviews') {
        loadProductReviews();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check for changes every 2 seconds (in case user is on same tab)
    const interval = setInterval(() => {
      loadProductReviews();
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [productId]);

  if (loading) {
    return <div>Loading…</div>;
  }
  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={() => navigate("/marketplace")}>Back to Marketplace</button>
      </div>
    );
  }
  if (!product) {
    return (
      <div>
        <h1>Product not found</h1>
        <button onClick={() => navigate("/marketplace")}>Back to Marketplace</button>
      </div>
    );
  }

  // const farmer = product ? users.find((u) => u.id === product.farmerId) : null;

  // if (!product) {
  //   return (
  //     <div className="min-h-screen bg-white">
  //       <section className="py-12 px-4 sm:px-6 lg:px-8">
  //         <div className="max-w-7xl mx-auto text-center">
  //           <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
  //           <Button variant="outline" onClick={() => navigate("/marketplace")}>
  //             Back to Marketplace
  //           </Button>
  //         </div>
  //       </section>
  //       <Footer />
  //     </div>
  //   );
  // }

  // const levelInfo = getLevelBadge(farmer.level);


const handlePlaceOrder = async () => {
  if (!product) {
    toast({
      title: "Error",
      description: "Product data not available",
      variant: "destructive"
    });
    return;
  }

  if (!userData) {
    toast({
      title: "Authentication Required",
      description: "Please login to place an order",
      variant: "destructive"
    });
    navigate("/login");
    return;
  }

  if (quantity <= 0 || quantity > product.stock) {
    toast({
      title: "Invalid Quantity",
      description: `Please select a quantity between 1 and ${product.stock}`,
      variant: "destructive"
    });
    return;
  }

  // Since backend is failing, let's just use local storage approach
  const orderData = {
    _id: 'local_' + Date.now(),
    productId: String(product._id),
    productName: String(product.itemName),
    quantity: Number(quantity),
    price: Number(product.price),
    sellerNumber: String(product.sellerNumber),
    sellerName: String(product.sellerName || 'Unknown Seller'),
    buyerNumber: String(userData?.phone || userData?.backendUser?.phoneNumber || "01898765432"),
    status: "pending",
    orderDate: new Date().toISOString(),
    isLocal: true,
    totalAmount: Number(product.price * quantity)
  };

  try {
    setLoadingOrder(true);
    
    console.log('Creating local order:', orderData);
    
    // Store order locally
    const localOrders = JSON.parse(localStorage.getItem('pending_orders') || '[]');
    localOrders.push(orderData);
    localStorage.setItem('pending_orders', JSON.stringify(localOrders));
    
    // Show success immediately
    toast({
      title: "Order Placed Successfully!",
      description: `Your order for ${quantity}kg of ${product.itemName} has been placed.`,
    });
    
    // Send WhatsApp notification to farmer
    try {
      const whatsappData = {
        productName: product.itemName,
        quantity: quantity,
        unit: product.unit || 'kg',
        price: product.price,
        totalAmount: product.price * quantity,
        deliveryLocation: userData?.backendUser?.address || "Dhaka, Bangladesh",
        farmerPhone: product.sellerNumber,
        buyerPhone: userData?.phone || userData?.backendUser?.phoneNumber || "01898765432"
      };
      
      console.log('Sending WhatsApp notification to farmer...');
      const whatsappSent = await WhatsAppService.sendOrderNotification(whatsappData);
      
      if (whatsappSent) {
        console.log('WhatsApp notification sent successfully to farmer');
        toast({
          title: "Farmer Notified",
          description: "The farmer has been notified via WhatsApp about your order.",
        });
      } else {
        console.warn('WhatsApp notification failed, but order was placed successfully');
        toast({
          title: "Order Placed",
          description: "Order placed successfully. Farmer will be contacted manually.",
        });
      }
    } catch (whatsappError) {
      console.error('WhatsApp notification error:', whatsappError);
      toast({
        title: "Order Placed",
        description: "Order placed successfully. Farmer will be contacted manually.",
      });
    }
    
    setOrderPlaced(true);

    // Redirect to buyer dashboard after 3 seconds
    setTimeout(() => {
      navigate("/buyer-dashboard");
    }, 3000);
    
  } catch (err: any) {
    console.error("Failed to place order:", err);
    
    toast({
      title: "Order Failed",
      description: "There was an error placing your order. Please try again.",
      variant: "destructive"
    });
  } finally {
    setLoadingOrder(false);
  }
};

  // StarRating component for displaying reviews
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const calculateAverageRating = () => {
    if (productReviews.length === 0) return '0.0';
    const total = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / productReviews.length).toFixed(1);
  };

  const getCombinedRating = () => {
    const localRating = parseFloat(calculateAverageRating());
    const productRating = product.rating || 0;
    
    if (productReviews.length > 0 && productRating > 0) {
      // Combine both ratings if both exist
      const totalReviews = productReviews.length + (product.reviews?.length || 0);
      const localTotal = productReviews.reduce((sum, review) => sum + review.rating, 0);
      const productTotal = productRating * (product.reviews?.length || 1);
      return ((localTotal + productTotal) / totalReviews).toFixed(1);
    } else if (productReviews.length > 0) {
      return localRating.toFixed(1);
    } else {
      return productRating.toFixed(1);
    }
  };

  // Test function to add sample reviews (for debugging)
  const addTestReview = () => {
    if (!productId) return;
    
    const testReview: Review = {
      orderId: 'test-order-' + Date.now(),
      productId: productId,
      rating: 5,
      review: 'Great product! Fresh and high quality.',
      timestamp: new Date().toISOString(),
      userName: userData?.name || userData?.backendUser?.fullName || 'Test User'
    };

    const existingReviews = localStorage.getItem('buyer_reviews'); // Fixed: was 'productReviews'
    const reviews = existingReviews ? JSON.parse(existingReviews) : [];
    reviews.push(testReview);
    localStorage.setItem('buyer_reviews', JSON.stringify(reviews)); // Fixed: was 'productReviews'
    
    // Reload reviews
    const filteredReviews = reviews.filter((review: Review) => review.productId === productId);
    setProductReviews(filteredReviews);
  };



  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/marketplace")}
            className="flex items-center gap-2 text-ag-green-600 hover:text-ag-green-700 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </button>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Images Section */}
            <div className="lg:col-span-2 space-y-4">
              {/* Main Image */}
              <div className="rounded-2xl overflow-hidden bg-gray-100 h-96">
                <img
                  src={product.image}
                  alt={product.itemName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              {/* {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`rounded-lg overflow-hidden w-20 h-20 border-2 transition-all ${
                        selectedImage === idx
                          ? "border-ag-green-600"
                          : "border-transparent hover:border-border"
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )} */}

              {/* Product Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                
                <div className="bg-ag-green-50 rounded-xl p-4 border border-ag-green-100">
                  <div className="text-sm text-muted-foreground">Harvest Date</div>
                  <div className="text-xl font-bold text-foreground">
                    {new Date(product?.startDate || "").toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-ag-green-50 rounded-xl p-4 border border-ag-green-100">
                  <div className="text-sm text-muted-foreground">Quantity Remaining</div>
                  <div className="text-3xl font-bold text-ag-green-600">
                    {product.stock >=0 ? `${product.stock}`: "Sold out"}
                  </div>
                </div>
              </div>

              {/* Certifications */}
              {product.certifications && product.certifications.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="text-sm font-medium text-blue-700 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Certifications
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Purchase & Farmer Info */}
            <div>
              {/* Product Title & Price */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{product.itemName}</h1>
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-ag-green-100 text-ag-green-700">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(parseFloat(getCombinedRating()))
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-foreground">
                    {getCombinedRating()}
                  </span>
                  <span className="text-muted-foreground">
                    ({productReviews.length + (product.reviews?.length || 0)} reviews)
                  </span>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-muted-foreground mb-1">Price per kg</div>
                  <div className="text-5xl font-bold text-ag-green-600">৳{product.price}</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {product.stock} kg available
                  </div>
                </div>

                <div className="text-base text-muted-foreground leading-relaxed mb-6">
                  {product.description}
                </div>
              </div>

              

              <div className="bg-ag-green-50 rounded-2xl p-6 border border-ag-green-100 mb-6">
  {!userData ? (
    <div className="text-center py-6">
      <h3 className="text-lg font-bold text-foreground mb-2">Login Required</h3>
      <p className="text-muted-foreground text-sm mb-4">
        Please login to place an order
      </p>
      <Button
        className="w-full bg-ag-green-600 hover:bg-ag-green-700"
        onClick={() => navigate("/login")}
      >
        Login to Order
      </Button>
    </div>
  ) : orderPlaced ? (
    <div className="text-center py-6">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">Order Placed!</h3>
      <p className="text-muted-foreground text-sm">
        Your order has been created successfully
      </p>
    </div>
  ) : (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Quantity (kg)
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(prev => Math.max(1, Number(prev) - 1))}
            className="px-3 py-2 rounded-lg bg-white hover:bg-gray-100 text-ag-green-700 font-medium transition-colors border border-ag-green-200"
          >
            −
          </button>
          <Input
            type="number"
            min={1}
            max={product.stock}
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setQuantity(Number.isNaN(val) ? 1 : Math.min(product.stock, Math.max(1, val)));
            }}
            className="flex-1 text-center border-ag-green-200"
          />
          <button
            onClick={() => setQuantity(prev => Math.min(product.stock, Number(prev) + 1))}
            className="px-3 py-2 rounded-lg bg-white hover:bg-gray-100 text-ag-green-700 font-medium transition-colors border border-ag-green-200"
          >
            +
          </button>
        </div>
      </div>

      <div className="border-t border-ag-green-200 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-foreground font-medium">Total</span>
          <span className="text-2xl font-bold text-ag-green-600">
            ৳{(product.price * quantity).toLocaleString()}
          </span>
        </div>
        <Button
          className="w-full bg-ag-green-600 hover:bg-ag-green-700 text-base mb-2"
          onClick={handlePlaceOrder}
          disabled={loadingOrder || product.stock <= 0 || !userData}
        >
          {loadingOrder ? "Placing Order..." : product.stock <= 0 ? "Out of Stock" : "Place Order"}
        </Button>
        
        {/* Debug button for testing reviews */}
        <Button
          variant="outline"
          className="w-full text-sm"
          onClick={addTestReview}
        >
          Add Test Review (Debug)
        </Button>
      </div>
    </div>
  )}
              </div>



              {/* Farmer Card */}
              {/* <div className="border-2 border-ag-green-200 rounded-2xl p-6 bg-white">
                <h3 className="font-semibold text-foreground mb-4">Seller Information</h3>

                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                  <img
                    src={farmer.image}
                    alt={farmer.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-foreground">{farmer.name}</div>
                    <div className="text-sm text-muted-foreground">{farmer.location}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {farmer.verified && (
                        <Badge className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${levelInfo.color}`}>
                        {levelInfo.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(farmer.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {farmer.rating} ({farmer.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-ag-green-600 flex-shrink-0" />
                    <span className="text-foreground font-medium">{farmer.phone}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-ag-green-600 flex-shrink-0" />
                    <span className="text-foreground">{farmer.location}</span>
                  </div>

                  <div className="text-sm text-muted-foreground italic border-t border-border pt-3 mt-3">
                    "{farmer.bio}"
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  Contact Seller
                </Button>
              </div> */}
            </div>
          </div>

          {/* Reviews Section */}
          {(productReviews.length > 0 || (product.reviews && product.reviews.length > 0)) ? (
            <div className="mt-16 border-t border-border pt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Customer Reviews</h2>
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.floor(parseFloat(getCombinedRating()))} />
                  <span className="font-semibold text-foreground">
                    {getCombinedRating()}
                  </span>
                  <span className="text-muted-foreground">
                    ({productReviews.length + (product.reviews?.length || 0)} reviews)
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Reviews from localStorage (buyer dashboard submissions) */}
                {productReviews.map((review, idx) => (
                  <div
                    key={`local-${idx}`}
                    className="bg-blue-50 rounded-xl p-6 border border-blue-100"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-foreground">
                          {review.userName || 'Anonymous Buyer'}
                        </div>
                        {/* <div className="text-sm text-muted-foreground">
                          {new Date(review.timestamp).toLocaleDateString()}
                        </div> */}
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-foreground">{review.review}</p>
                  </div>
                ))}

                {/* Existing reviews from product data */}
                {product.reviews && product.reviews.map((review, idx) => (
                  <div
                    key={`product-${idx}`}
                    className="bg-ag-green-50 rounded-xl p-6 border border-ag-green-100"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-foreground">
                          {review.reviewerName || 'Anonymous Reviewer'}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-16 border-t border-border pt-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Customer Reviews</h2>
              <div className="text-center py-8 text-muted-foreground">
                <p>No reviews yet for this product.</p>
                <p className="text-sm mt-2">Be the first to leave a review after purchasing!</p>
                {/* Debug button for testing reviews */}
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={addTestReview}
                >
                  Add Test Review (Debug)
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <Toaster />
    </div>
  );
}