import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, LogOut, User, Package, ShoppingCart, MessageSquare } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { t } = useTranslation();
  const { user, userData, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="border-b border-border bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-8 h-8 bg-ag-green-600 rounded-lg">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-ag-green-600">তাজা হাট</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary font-medium transition-colors">
              {t('nav.home')}
            </Link>
            <Link to="/marketplace" className="text-foreground hover:text-primary font-medium transition-colors">
              {t('nav.marketplace')}
            </Link>
            <Link to="/dashboard" className="text-foreground hover:text-primary font-medium transition-colors">
              {t('nav.dashboard')}
            </Link>
            {userData?.role === 'farmer' && (
              <Link to="/bids" className="text-foreground hover:text-primary font-medium transition-colors flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {t('nav.bids')}
              </Link>
            )}
            <Link to="/forecast" className="text-foreground hover:text-primary font-medium transition-colors">
              {t('nav.forecast')}
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary font-medium transition-colors">
              {t('nav.about')}
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary font-medium transition-colors">
              {t('nav.contact')}
            </Link>
          </nav>

          {/* Auth Buttons and Language Switcher */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {user && userData ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {userData.name}
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {userData.role}
                  </span>
                </div>
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
        </div>
      </div>
    </header>
  );
}
