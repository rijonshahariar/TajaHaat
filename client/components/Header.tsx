import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Leaf, LogOut, User, Package, ShoppingCart, MessageSquare, Menu, X, Home, Store, BarChart3, Phone, Info } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export function Header() {
  const { t } = useTranslation();
  const { user, userData, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false); // Close mobile menu after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Navigation items for reuse in both desktop and mobile
  const navigationItems = [
    { to: "/", label: t('nav.home'), icon: Home },
    { to: "/marketplace", label: t('nav.marketplace'), icon: Store },
    { to: "/dashboard", label: t('nav.dashboard'), icon: Package },
    ...(userData?.role === 'farmer' ? [{ to: "/bids", label: t('nav.bids'), icon: MessageSquare }] : []),
    { to: "/forecast", label: t('nav.forecast'), icon: BarChart3 },
    { to: "/about", label: t('nav.about'), icon: Info },
    { to: "/contact", label: t('nav.contact'), icon: Phone },
  ];

  return (
    <header className="border-b border-border bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-8 h-8 bg-ag-green-600 rounded-lg">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-ag-green-600">Taja Haat</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigationItems.map((item) => (
              <Link 
                key={item.to} 
                to={item.to} 
                className="text-foreground hover:text-primary font-medium transition-colors flex items-center gap-1"
              >
                {item.icon && userData?.role === 'farmer' && item.to === '/bids' && (
                  <item.icon className="w-4 h-4" />
                )}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user && userData ? (
              <div className="flex items-center gap-3">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {userData.name}
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {userData.role}
                  </span>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t('btn.logout')}
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">{t('nav.login')}</Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link to="/register">{t('nav.register')}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile User Indicator */}
            {user && userData && (
              <div className="flex items-center gap-2 px-2">
                <div className="w-6 h-6 bg-ag-green-100 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-ag-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 max-w-20 truncate">
                  {userData.name}
                </span>
              </div>
            )}
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 relative"
                  aria-label="Toggle mobile menu"
                >
                  <Menu className="w-6 h-6" />
                  {user && userData && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-ag-green-500 rounded-full"></div>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[400px] p-0">
                <div className="h-full flex flex-col">
                  <SheetHeader className="px-6 py-4 border-b">
                    <SheetTitle className="flex items-center gap-2 text-left">
                      <div className="flex items-center justify-center w-8 h-8 bg-ag-green-600 rounded-lg">
                        <Leaf className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-ag-green-600">Taja Haat</span>
                    </SheetTitle>
                    <SheetDescription className="text-left">
                      Navigate through our fresh marketplace
                    </SheetDescription>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {/* User Info Section */}
                    {user && userData && (
                      <div className="p-4 bg-gradient-to-r from-ag-green-50 to-blue-50 rounded-lg border border-ag-green-100">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-12 h-12 bg-ag-green-100 rounded-full">
                            <User className="w-6 h-6 text-ag-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{userData.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs bg-ag-green-100 text-ag-green-800 px-2 py-1 rounded-full capitalize font-medium">
                                {userData.role}
                              </span>
                              {userData.phone && (
                                <span className="text-xs text-gray-500 truncate">
                                  {userData.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation Links */}
                    <nav className="space-y-1">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors group active:bg-gray-200"
                        >
                          <item.icon className="w-5 h-5 text-gray-500 group-hover:text-ag-green-600 transition-colors flex-shrink-0" />
                          <span className="font-medium text-gray-700 group-hover:text-gray-900">
                            {item.label}
                          </span>
                        </Link>
                      ))}
                    </nav>
                  </div>

                  {/* Fixed Bottom Section */}
                  <div className="px-6 py-4 border-t bg-gray-50">
                    {/* Auth Actions */}
                    <div className="space-y-3">
                      {user && userData ? (
                        <div className="space-y-2">
                          {/* Quick Actions for authenticated users */}
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              variant="outline" 
                              asChild
                              className="flex items-center gap-2 justify-center text-sm"
                              onClick={closeMobileMenu}
                            >
                              <Link to="/profile">
                                <User className="w-4 h-4" />
                                Profile
                              </Link>
                            </Button>
                            <Button 
                              variant="outline" 
                              asChild
                              className="flex items-center gap-2 justify-center text-sm"
                              onClick={closeMobileMenu}
                            >
                              <Link to="/dashboard">
                                <Package className="w-4 h-4" />
                                Dashboard
                              </Link>
                            </Button>
                          </div>
                          
                          {/* Logout Button */}
                          <Button 
                            variant="destructive" 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 justify-center"
                          >
                            <LogOut className="w-4 h-4" />
                            {t('btn.logout')}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Button 
                            variant="outline" 
                            asChild 
                            className="w-full"
                          >
                            <Link to="/login" onClick={closeMobileMenu} className="flex items-center gap-2 justify-center">
                              <User className="w-4 h-4" />
                              {t('nav.login')}
                            </Link>
                          </Button>
                          <Button 
                            variant="default" 
                            asChild 
                            className="w-full bg-ag-green-600 hover:bg-ag-green-700"
                          >
                            <Link to="/register" onClick={closeMobileMenu} className="flex items-center gap-2 justify-center">
                              <User className="w-4 h-4" />
                              {t('nav.register')}
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* App Info */}
                    <div className="pt-3 border-t border-gray-200 mt-3">
                      <div className="text-center text-sm text-gray-500">
                        <p>Fresh produce, delivered fresh</p>
                        <p className="text-xs mt-1">© 2024 Taja Haat</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
