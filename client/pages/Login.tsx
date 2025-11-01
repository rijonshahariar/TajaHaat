import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/lib/i18n";

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            <span className="text-2xl font-bold text-ag-green-600">AgroHub</span>
          </Link>

          {/* Form */}
          <div className="bg-white border border-border rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('auth.welcome_back')}</h1>
            <p className="text-muted-foreground mb-8">{t('auth.sign_in_subtitle')}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t('auth.email')}</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t('auth.password')}</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-foreground">Remember me</span>
                </label>
                <a href="#" className="text-ag-green-600 hover:text-ag-green-700">
                  {t('auth.forgot_password')}
                </a>
              </div>

              <Button className="w-full bg-ag-green-600 hover:bg-ag-green-700 h-10" type="submit">
                {t('btn.sign_in')}
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

          <p className="text-center text-xs text-muted-foreground mt-4">
            {t('auth.demo_note')}
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
