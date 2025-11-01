import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/lib/i18n";

export default function Register() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"farmer" | "buyer" | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
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
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('auth.create_account')}</h1>
            <p className="text-muted-foreground mb-8">{t('auth.join_agrohub')}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t('auth.full_name')}</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                />
              </div>

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

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">{t('auth.i_am_a')}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("farmer")}
                    className={`p-4 rounded-xl border-2 transition-colors text-center font-medium ${
                      role === "farmer"
                        ? "border-ag-green-600 bg-ag-green-50 text-ag-green-700"
                        : "border-border hover:border-ag-green-200"
                    }`}
                  >
                    🌾 {t('auth.farmer')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("buyer")}
                    className={`p-4 rounded-xl border-2 transition-colors text-center font-medium ${
                      role === "buyer"
                        ? "border-ag-green-600 bg-ag-green-50 text-ag-green-700"
                        : "border-border hover:border-ag-green-200"
                    }`}
                  >
                    🏪 {t('auth.buyer')}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input type="checkbox" className="rounded mt-1" />
                <label className="text-sm text-muted-foreground">
                  {t('auth.agree_terms')}{" "}
                  <a href="#" className="text-ag-green-600 hover:text-ag-green-700">
                    {t('auth.terms_of_service')}
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-ag-green-600 hover:text-ag-green-700">
                    {t('auth.privacy_policy')}
                  </a>
                </label>
              </div>

              <Button
                className="w-full bg-ag-green-600 hover:bg-ag-green-700 h-10"
                type="submit"
                disabled={!role}
              >
                {t('btn.create_account')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                {t('auth.already_have_account')}{" "}
                <Link to="/login" className="text-ag-green-600 hover:text-ag-green-700 font-medium">
                  {t('auth.sign_in')}
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
