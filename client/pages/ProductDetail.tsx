import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/Footer";
import { Star, MapPin, Phone, Shield, Badge, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
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
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);

  useEffect(() => {
    if (!productId) {
      setError("No product ID provided");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(
          `https://taja-haat-backend.vercel.app/products/${productId}`,
        );
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
  }, [productId]);

  if (loading) {
    return <div>Loading…</div>;
  }
  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={() => navigate("/marketplace")}>
          Back to Marketplace
        </button>
      </div>
    );
  }
  if (!product) {
    return (
      <div>
        <h1>Product not found</h1>
        <button onClick={() => navigate("/marketplace")}>
          Back to Marketplace
        </button>
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
    if (!product) return;

    const orderData = {
      productId: product._id,
      productName: product.itemName,
      quantity: quantity,
      price: product.price,
      sellerNumber: product.sellerNumber,
      sellerName: product.sellerName,
      buyerNumber: userData.phone,
      buyerName: userData.name,
      status: "pending",
      orderDate: new Date().toISOString(),
    };

    try {
      const response = await axios.post(
        "https://taja-haat-backend.vercel.app/orders",
        orderData,
      );
      console.log("Order placed:", response.data);
      setOrderPlaced(true);
      setTimeout(() => {
        navigate("/marketplace");
      }, 2000);
    } catch (err){
      console.error("Failed to place order:", err);
    }
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
                  <div className="text-sm text-muted-foreground">
                    Harvest Date
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    {new Date(product?.startDate || "").toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-ag-green-50 rounded-xl p-4 border border-ag-green-100">
                  <div className="text-sm text-muted-foreground">
                    Quantity Remaining
                  </div>
                  <div className="text-3xl font-bold text-ag-green-600">
                    {product.stock >= 0 ? `${product.stock}` : "Sold out"}
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
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {product.name}
                    </h1>
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
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-foreground">
                    {product.rating}
                  </span>
                  <span className="text-muted-foreground">
                    ({product.reviews.length} reviews)
                  </span>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    Price per kg
                  </div>
                  <div className="text-5xl font-bold text-ag-green-600">
                    ৳{product.price}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {product.available} kg available
                  </div>
                </div>

                <div className="text-base text-muted-foreground leading-relaxed mb-6">
                  {product.description}
                </div>
              </div>

              <div className="bg-ag-green-50 rounded-2xl p-6 border border-ag-green-100 mb-6">
                {orderPlaced ? (
                  <div className="text-center py-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      Order Placed!
                    </h3>
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
                          onClick={() =>
                            setQuantity((prev) => Math.max(1, Number(prev) - 1))
                          }
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
                            setQuantity(
                              Number.isNaN(val)
                                ? 1
                                : Math.min(product.stock, Math.max(1, val)),
                            );
                          }}
                          className="flex-1 text-center border-ag-green-200"
                        />
                        <button
                          onClick={() =>
                            setQuantity((prev) =>
                              Math.min(product.stock, Number(prev) + 1),
                            )
                          }
                          className="px-3 py-2 rounded-lg bg-white hover:bg-gray-100 text-ag-green-700 font-medium transition-colors border border-ag-green-200"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-ag-green-200 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-foreground font-medium">
                          Total
                        </span>
                        <span className="text-2xl font-bold text-ag-green-600">
                          ₹{(product.price * quantity).toLocaleString()}
                        </span>
                      </div>
                      <Button
                        className="w-full bg-ag-green-600 hover:bg-ag-green-700 text-base"
                        onClick={handlePlaceOrder}
                      >
                        Place Order
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
          {product.reviews && product.reviews.length > 0 && (
            <div className="mt-16 border-t border-border pt-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Customer Reviews
              </h2>
              <div className="space-y-4">
                {product.reviews.map((review, idx) => (
                  <div
                    key={idx}
                    className="bg-ag-green-50 rounded-xl p-6 border border-ag-green-100"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-foreground">
                          {review.reviewerName}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
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
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
