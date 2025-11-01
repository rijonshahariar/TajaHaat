import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="border-b border-border bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-8 h-8 bg-ag-green-600 rounded-lg">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-ag-green-600">TajaHaat</span>
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
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">{t('nav.login')}</Link>
            </Button>
            <Button variant="default" size="sm" asChild>
              <Link to="/register">{t('nav.register')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
