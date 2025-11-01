import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

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
  status: "pending" | "accepted" | "rejected" | "completed";
  orderDate: string;
  deliveryAddress: string;
}

export default function FarmerDashboard() {
  const { t } = useTranslation();
  const { userData } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<{
    itemName: string;
    category: string;
    description: string;
    price: string;
    stock: string;
    unit: string;
    image: string;
    sellerName: string;
    sellerLocation: string;
    sellerNumber: string;
    rating: number;
    reviews: {
      reviewerName: string;
      comment: string;
      rating?: number;
    }[];
    startDate: string;
    expiryDate: string[];
  }>({
    itemName: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    unit: "kg",
    image: "",
    sellerName: "",
    sellerLocation: "",
    sellerNumber: "",
    rating: 0,
    reviews: [],
    startDate: new Date().toISOString(),
    expiryDate: [],
  });

  console.log(userData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sellerNumberFormatted = userData?.phone.startsWith("+88")
          ? userData.phone
          : `+88${userData?.phone}`;

        // Fetch all products and filter by sellerNumber
        const productRes = await axios.get(
          `https://taja-haat-backend.vercel.app/products/seller/${sellerNumberFormatted}`,
        );
        console.log("Product-res : ", productRes.data);

        // setProducts(farmerProducts);
        setProducts(productRes.data);

        // Fetch all orders and filter by sellerNumber
        const orderRes = await axios.get(
          `https://taja-haat-backend.vercel.app/orders/seller/${sellerNumberFormatted}`,
        );
        console.log("OrderRes : ", orderRes);
        setOrders(orderRes.data);
      } catch (err: any) {
        console.error("Error fetching farmer data:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData?.phone]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
  };
  const saveOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
  };
  const handleAddProduct = async () => {
    if (
      !newProduct.itemName ||
      !newProduct.category ||
      !newProduct.price ||
      !newProduct.stock
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Ensure expiryDate is a string (or undefined)
      const expiryDate = Array.isArray(newProduct.expiryDate)
        ? newProduct.expiryDate[0] || undefined
        : newProduct.expiryDate;

      // Ensure image is a full URL, fallback to placeholder
      const imageUrl = newProduct.image
        ? newProduct.image.startsWith("http")
          ? newProduct.image
          : `https://example.com/${newProduct.image.replace(/^\/+/, "")}`
        : "https://example.com/placeholder.svg";

      const sellerNumber = newProduct.sellerNumber?.startsWith("+88")
        ? newProduct.sellerNumber
        : `+88${newProduct.sellerNumber}`;

      const productToPost = {
        itemName: newProduct.itemName,
        category: newProduct.category,
        description: newProduct.description || "No description",
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        unit: newProduct.unit || "kg",
        image: imageUrl,
        sellerName: newProduct.sellerName || userData?.name || "Unknown",
        sellerLocation: newProduct.sellerLocation || "Unknown",
        sellerNumber: userData?.phone.startsWith("+88")
          ? userData.phone
          : `+88${userData?.phone}`,
        rating: newProduct.rating || 0,
        reviews: newProduct.reviews || [],
        startDate: newProduct.startDate || new Date().toISOString(),
        expiryDate: expiryDate || undefined,
      };

      console.log("Product to post:", productToPost);

      const res = await axios.post(
        "https://taja-haat-backend.vercel.app/products",
        productToPost,
      );

      setProducts((prev) => [...prev, res.data]);

      // Reset newProduct
      setNewProduct({
        itemName: "",
        category: "",
        description: "",
        price: "",
        stock: "",
        unit: "kg",
        image: "",
        sellerName: userData?.name || "",
        sellerLocation: userData?.name || "Unknown",
        sellerNumber: userData?.phone || "",
        rating: 0,
        reviews: [],
        startDate: new Date().toISOString(),
        expiryDate: [],
      });

      setIsAddingProduct(false);

      toast({
        title: "Success",
        description: `${res.data.itemName} added successfully`,
      });
    } catch (err: any) {
      console.error("Error adding product:", err);
      toast({
        title: "Error",
        description:
          err.response?.data?.error?.[0]?.message ||
          err.message ||
          "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      const res = await axios.put(
        `https://taja-haat-backend.vercel.app/products/${editingProduct._id}`,
        {
          itemName: editingProduct.name,
          price: editingProduct.price,
          stock: editingProduct.quantity,
          unit: editingProduct.unit,
          description: editingProduct.description,
          image: editingProduct.image,
          startDate: editingProduct.harvestDate,
          // Add any other fields you want to update
        },
      );

      const updatedProducts = products.map((p) =>
        p.id === editingProduct.id ? { ...p, ...res.data } : p,
      );
      saveProducts(updatedProducts);
      setEditingProduct(null);

      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    } catch (err: any) {
      console.error("Error updating product:", err);
      toast({
        title: "Error",
        description:
          err.response?.data?.error ||
          err.message ||
          "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await axios.delete(
        `https://taja-haat-backend.vercel.app/products/${productId}`,
      );

      const updatedProducts = products.filter((p) => p.id !== productId);
      saveProducts(updatedProducts);

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (err: any) {
      console.error("Error deleting product:", err);
      toast({
        title: "Error",
        description:
          err.response?.data?.error ||
          err.message ||
          "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleOrderAction = (orderId: string, action: "accept" | "reject") => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            status:
              action === "accept"
                ? ("accepted" as const)
                : ("rejected" as const),
          }
        : order,
    );
    saveOrders(updatedOrders);

    toast({
      title: "Success",
      description: `Order ${action}ed successfully`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  console.log("Products fetched due to user id : ", products);
  const safeOrders = Array.isArray(orders) ? orders : [];

  const stats = {
    totalProducts: products.length,
    pendingOrders: safeOrders.filter((o) => o.status === "pending").length,
    totalRevenue: safeOrders
      .filter((o) => o.status === "accepted" || o.status === "completed")
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0),
    completedOrders: safeOrders.filter((o) => o.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("dashboard.farmer.title")}
          </h1>
          <p className="text-gray-600">
            Welcome back, {userData?.name}! {t("dashboard.farmer.subtitle")}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalProducts}
                  </p>
                </div>
                <Package className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.pendingOrders}
                  </p>
                </div>
                <ShoppingCart className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ৳{stats.totalRevenue}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Completed Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.completedOrders}
                  </p>
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
                      Fill in all required fields to add a new product.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    {/* Row 1: Name & Category */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="itemName">Product Name *</Label>
                        <Input
                          id="itemName"
                          value={newProduct.itemName}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              itemName: e.target.value,
                            })
                          }
                          placeholder="e.g., Fresh Tomatoes"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={newProduct.category}
                          onValueChange={(value) =>
                            setNewProduct({ ...newProduct, category: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vegetables">
                              Vegetables
                            </SelectItem>
                            <SelectItem value="fruits">Fruits</SelectItem>
                            <SelectItem value="grains">Grains</SelectItem>
                            <SelectItem value="spices">Spices</SelectItem>
                            <SelectItem value="dairy">Dairy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Row 2: Price, Stock, Unit */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="price">Price per unit *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newProduct.price}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              price: e.target.value,
                            })
                          }
                          placeholder="100"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stock">Stock *</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              stock: e.target.value,
                            })
                          }
                          placeholder="50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="unit">Unit</Label>
                        <Select
                          value={newProduct.unit}
                          onValueChange={(value) =>
                            setNewProduct({ ...newProduct, unit: value })
                          }
                        >
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

                    {/* Row 3: Description */}
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe your product..."
                        rows={3}
                      />
                    </div>

                    {/* Row 4: Harvest Date, Seller Location */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Start Date */}
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={
                            newProduct.startDate
                              ? newProduct.startDate.split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              startDate: new Date(e.target.value).toISOString(),
                            })
                          }
                        />
                      </div>

                      {/* Expiry Date */}
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          type="date"
                          value={
                            newProduct.expiryDate?.[0]
                              ? newProduct.expiryDate[0].split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              expiryDate: e.target.value
                                ? [new Date(e.target.value).toISOString()]
                                : [],
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Row 5: Seller Info */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="sellerName">Seller Name</Label>
                        <Input
                          id="sellerName"
                          value={newProduct.sellerName}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              sellerName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="sellerLocation">Seller Location</Label>
                        <Input
                          id="sellerLocation"
                          value={newProduct.sellerLocation}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              sellerLocation: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="sellerNumber">Seller Phone</Label>
                        <Input
                          id="sellerNumber"
                          value={newProduct.sellerNumber}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              sellerNumber: e.target.value,
                            })
                          }
                          placeholder="+8801XXXXXXXXX"
                        />
                      </div>
                    </div>

                    {/* Row 6: Rating (optional) */}
                    <div>
                      <Label htmlFor="rating">Rating</Label>
                      <Input
                        id="rating"
                        type="number"
                        step="0.1"
                        min={0}
                        max={5}
                        value={newProduct.rating}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            rating: parseFloat(e.target.value),
                          })
                        }
                        placeholder="0-5"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingProduct(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddProduct}>Add Product</Button>
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
                      <Badge
                        variant={
                          product.quantity > 0 ? "default" : "destructive"
                        }
                      >
                        {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {product.category}
                    </p>
                    <p className="text-2xl font-bold text-green-600 mb-2">
                      ৳{product.price}/{product.unit}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Stock: {product.quantity} {product.unit}
                    </p>

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{product.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-48 object-cover rounded"
                            />
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium">Category:</p>
                                <p className="text-gray-600">
                                  {product.category}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium">Price:</p>
                                <p className="text-gray-600">
                                  ৳{product.price}/{product.unit}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium">Stock:</p>
                                <p className="text-gray-600">
                                  {product.quantity} {product.unit}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium">Harvest Date:</p>
                                <p className="text-gray-600">
                                  {product.harvestDate || "Not specified"}
                                </p>
                              </div>
                            </div>
                            {product.description && (
                              <div>
                                <p className="font-medium">Description:</p>
                                <p className="text-gray-600">
                                  {product.description}
                                </p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingProduct(product)}
                          >
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
                                    onChange={(e) =>
                                      setEditingProduct({
                                        ...editingProduct,
                                        name: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <Label>Price</Label>
                                  <Input
                                    type="number"
                                    value={editingProduct.price}
                                    onChange={(e) =>
                                      setEditingProduct({
                                        ...editingProduct,
                                        price: parseFloat(e.target.value),
                                      })
                                    }
                                  />
                                </div>
                              </div>
                              <div>
                                <Label>Quantity</Label>
                                <Input
                                  type="number"
                                  value={editingProduct.quantity}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      quantity: parseInt(e.target.value),
                                    })
                                  }
                                />
                              </div>
                              <div className="flex justify-end gap-3">
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingProduct(null)}
                                >
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
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No products yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Start by adding your first product to the marketplace
                </p>
                <Button onClick={() => setIsAddingProduct(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics</h2>
            <Card className="p-8 text-center">
              <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Analytics Coming Soon
              </h3>
              <p className="text-gray-500">
                Detailed analytics and insights will be available here
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
