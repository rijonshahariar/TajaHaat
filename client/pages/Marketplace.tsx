import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Star } from "lucide-react";
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/lib/i18n";

export default function Marketplace() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(t('marketplace.category.all'));
  const [products, setProducts] = useState([]);   
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);       
  const categories = [t('marketplace.category.all'), ...new Set(products.map((p) => p.category))];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://taja-haat-backend.vercel.app/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
        console.log(data)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

    return (
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-ag-green-50 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-2">{t('marketplace.title')}</h1>
            <p className="text-muted-foreground">{t('marketplace.subtitle')}</p>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="sticky top-16 z-40 py-6 px-4 sm:px-6 lg:px-8 bg-white border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('marketplace.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-2 rounded-lg"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="w-4 h-4" />
                <span>{t('marketplace.filter_by')}</span>
              </div>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-ag-green-600 text-white"
                      : "bg-ag-green-100 text-ag-green-700 hover:bg-ag-green-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden bg-gray-100 h-48">
                      <img
                        src={product.image}
                        alt={product.itemName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white text-ag-green-700 shadow-sm">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-1">{product.itemName}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-foreground">{product.rating}</span>
                        <span className="text-xs text-muted-foreground">({product.reviews?.length ?? 0})</span>
                      </div>

                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('auth.farmer')}</span>
                          <span className="font-medium text-foreground">{product.sellerName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('product.location')}</span>
                          <span className="font-medium text-foreground">{product.sellerLocation}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('marketplace.sold')}</span>
                          <span className="font-semibold">
                             ৳ {product?.price ? Number(product.price).toLocaleString() : "N/A"}
                          </span>
                        </div>
                        <div className="pt-3 border-t border-border flex justify-between items-center">
                          <span className="text-muted-foreground">Price</span>
                          <span className="text-2xl font-bold text-ag-green-600">৳{product.price}/kg</span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-ag-green-600 hover:bg-ag-green-700"
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </section>


        {/* Footer */}
        <Footer />
      </div>
    );
} 