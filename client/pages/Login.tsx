import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { PhoneInput } from "@/components/ui/phone-input";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, userData, loading, error, login, resetState } = useAuth();
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && userData) {
      navigate('/');
    }
  }, [user, userData, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length !== 11 || !password || password.length < 6) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login(phoneNumber, password);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center justify-center w-10 h-10 bg-ag-green-600 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-ag-green-600">তাজা হাট</span>
          </Link>

          {/* Form */}
          <div className="bg-white border border-border rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('auth.welcome_back')}</h1>
            <p className="text-muted-foreground mb-8">{t('auth.sign_in_subtitle')}</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('auth.phone_number')}
                </label>
                <PhoneInput
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  placeholder={t('auth.phone_placeholder')}
                  disabled={isSubmitting || loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password (পাসওয়ার্ড)
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isSubmitting || loading}
                  className="w-full"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-foreground">Remember me</span>
                </label>
                <a href="#" className="text-ag-green-600 hover:text-ag-green-700">
                  {t('auth.forgot_password')}
                </a>
              </div>

              <Button 
                className="w-full bg-ag-green-600 hover:bg-ag-green-700 h-10" 
                type="submit"
                disabled={isSubmitting || loading || phoneNumber.length < 10 || password.length < 6}
              >
                {isSubmitting || loading ? t('common.loading') : t('btn.sign_in')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                {t('auth.dont_have_account')}{" "}
                <Link to="/register" className="text-ag-green-600 hover:text-ag-green-700 font-medium">
                  {t('auth.sign_up')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
