import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingCart, TrendingUp, Truck, MessageSquare, ArrowRight, Leaf, Star, Badge } from "lucide-react";
import { products, users } from "@/data/fakeData";
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/lib/i18n";

export default function Home() {
  const { t } = useTranslation();
  
  const features = [
    {
      title: t('feature.post_demand.title'),
      description: t('feature.post_demand.description'),
      icon: MessageSquare,
    },
    {
      title: t('feature.list_products.title'),
      description: t('feature.list_products.description'),
      icon: ShoppingCart,
    },
    {
      title: t('feature.predict_demand.title'),
      description: t('feature.predict_demand.description'),
      icon: TrendingUp,
    },
    {
      title: t('feature.track_deliveries.title'),
      description: t('feature.track_deliveries.description'),
      icon: Truck,
    },
  ];

  const featuredProducts = products.slice(0, 6);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-ag-green-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-ag-green-100 rounded-full">
                  <Leaf className="w-4 h-4 text-ag-green-600" />
                  <span className="text-sm font-medium text-ag-green-700">{t('home.hero.badge')}</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                  {t('home.hero.title')}
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  {t('home.hero.subtitle')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-ag-green-600 hover:bg-ag-green-700" asChild>
                  <Link to="/marketplace" className="flex items-center gap-2">
                    {t('btn.explore_marketplace')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/register">{t('btn.post_demand')}</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div>
                  <div className="text-3xl font-bold text-ag-green-600">500+</div>
                  <p className="text-sm text-muted-foreground">{t('home.stats.active_farmers')}</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-ag-green-600">2K+</div>
                  <p className="text-sm text-muted-foreground">{t('home.stats.products_listed')}</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-ag-green-600">1M+</div>
                  <p className="text-sm text-muted-foreground">{t('home.stats.orders_delivered')}</p>
                </div>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-ag-green-200 to-ag-green-100 rounded-3xl opacity-50 blur-3xl"></div>
                <img
                  src="https://www.researchgate.net/publication/354492168/figure/fig5/AS:1066309089492994@1631239306961/Bangladeshi-farmer-Md-Khalilur-Rahman-with-a-fresh-harvest-of-Bt-brinjal-in-Hijulii-of.ppm"
                  alt="Smart Agriculture"
                  className="relative rounded-3xl shadow-xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-2">Trusted by Farmers & Buyers</h2>
            <p className="text-muted-foreground">Join thousands of verified sellers and buyers on তাজা হাট</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Top Sellers */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-ag-green-600" />
                Top Rated Farmers
              </h3>
              <div className="space-y-4">
                {users
                  .filter((u) => u.type === "farmer")
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 3)
                  .map((farmer) => (
                    <div
                      key={farmer.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-ag-green-50 border border-ag-green-100 hover:shadow-md transition-shadow"
                    >
                      <img
                        src={farmer.image}
                        alt={farmer.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground truncate">{farmer.name}</h4>
                          {farmer.verified && <Badge className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{farmer.location}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(farmer.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-medium text-foreground">{farmer.rating}</span>
                          <span className="text-xs text-muted-foreground">({farmer.reviews})</span>
                        </div>
                      </div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 flex-shrink-0">
                        {farmer.level === "level_3"
                          ? "Level 3 ⭐"
                          : farmer.level === "level_2"
                            ? "Level 2"
                            : farmer.level === "level_1"
                              ? "Level 1"
                              : "New"}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Top Buyers */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-ag-green-600" />
                Verified Buyers
              </h3>
              <div className="space-y-4">
                {users
                  .filter((u) => u.type === "buyer")
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 3)
                  .map((buyer) => (
                    <div
                      key={buyer.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100 hover:shadow-md transition-shadow"
                    >
                      <img
                        src={buyer.image}
                        alt={buyer.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground truncate">{buyer.name}</h4>
                          {buyer.verified && <Badge className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{buyer.location}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(buyer.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-medium text-foreground">{buyer.rating}</span>
                          <span className="text-xs text-muted-foreground">({buyer.reviews})</span>
                        </div>
                      </div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 flex-shrink-0">
                        {buyer.level === "level_3"
                          ? t('level.level_3')
                          : buyer.level === "level_2"
                            ? t('level.level_2')
                            : buyer.level === "level_1"
                              ? t('level.level_1')
                              : t('level.new')}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 bg-ag-green-50 rounded-2xl p-8 border border-ag-green-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-ag-green-600 mb-2">
                {users.filter((u) => u.type === "farmer").length}0+
              </div>
              <p className="text-sm text-muted-foreground">{t('home.stats.verified_farmers')}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-ag-green-600 mb-2">
                {users.filter((u) => u.type === "buyer").length}0+
              </div>
              <p className="text-sm text-muted-foreground">{t('home.stats.happy_buyers')}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-ag-green-600 mb-2">
                {products.reduce((sum, p) => sum + p.sold, 0).toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">{t('home.stats.delivered_on_time')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform simplifies agricultural commerce with smart tools for buyers and sellers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-ag-green-50 border border-ag-green-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-ag-green-600 mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-ag-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Fresh produce from verified farmers across the country</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/marketplace">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative overflow-hidden bg-gray-100 h-48">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-ag-green-100 text-ag-green-700">
                      {product.category}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
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
                    <span className="text-xs text-muted-foreground">({product.reviews.length})</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Farmer</span>
                      <span className="font-medium text-foreground">{product.farmer}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-medium text-foreground">{product.location}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sold</span>
                      <span className="font-medium text-foreground">{product.sold.toLocaleString()} kg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price/kg</span>
                      <span className="font-bold text-ag-green-600 text-lg">₹{product.price}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-ag-green-600 hover:bg-ag-green-700" asChild>
                    <Link to={`/product/${product.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-ag-green-600 to-ag-green-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-lg mb-8 text-ag-green-100">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">{t('btn.get_started_farmer')}</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">{t('btn.get_started_buyer')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
