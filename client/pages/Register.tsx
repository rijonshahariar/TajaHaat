import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, ArrowLeft } from "lucide-react";
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { PhoneInput } from "@/components/ui/phone-input";
import { OtpInput } from "@/components/ui/otp-input";
import { PinInput } from "@/components/ui/pin-input";

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, userData, loading, error, isOtpSent, startRegistration, completeRegistration, resetState } = useAuth();
  
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState<"farmer" | "buyer" | null>(null);
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && userData) {
      navigate('/');
    }
  }, [user, userData, navigate]);

  const handleStartRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register form - Phone validation:', {
      phoneNumber,
      phoneLength: phoneNumber?.length,
      isValid: phoneNumber && phoneNumber.length === 11
    });
    
    if (!phoneNumber || phoneNumber.length !== 11 || !name || !password || password.length < 6 || !role || !address.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await startRegistration(name, phoneNumber, password, role, address, profileImage || undefined);
    } catch (error) {
      console.error('Failed to start registration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      return;
    }

    setIsSubmitting(true);
    try {
      await completeRegistration(otp);
    } catch (error) {
      console.error('Failed to complete registration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    resetState();
    setOtp("");
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
<<<<<<< HEAD
            <span className="text-2xl font-bold text-ag-green-600">তাজা হাট</span>
=======
            <span className="text-2xl font-bold text-ag-green-600">Taja Haat</span>
>>>>>>> main
          </Link>

          {/* Form */}
          <div className="bg-white border border-border rounded-2xl p-8">
            {!isOtpSent ? (
              <>
                <h1 className="text-3xl font-bold text-foreground mb-2">{t('auth.create_account')}</h1>
                <p className="text-muted-foreground mb-8">{t('auth.join_তাজা হাট')}</p>

                <form onSubmit={handleStartRegistration} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t('auth.full_name')}</label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full"
                      disabled={isSubmitting || loading}
                    />
                  </div>

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
                      placeholder="Enter password (min 6 characters)"
                      disabled={isSubmitting || loading}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Address (ঠিকানা) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Your complete address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full"
                      disabled={isSubmitting || loading}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Profile Picture (প্রোফাইল ছবি - ঐচ্ছিক)
                    </label>
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setProfileImage(file);
                      }}
                      className="w-full"
                      disabled={isSubmitting || loading}
                    />
                    {profileImage && (
                      <div className="text-xs text-ag-green-600 mt-1">
                        ✓ Image selected: {profileImage.name} ({(profileImage.size / 1024 / 1024).toFixed(2)} MB)
                        {profileImage.size > 32 * 1024 * 1024 && (
                          <div className="text-red-500 mt-1">
                            ⚠️ File size too large. Maximum size is 32MB.
                          </div>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Supported formats: JPEG, PNG, GIF, WebP (max 32MB)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">{t('auth.i_am_a')}</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole("farmer")}
                        disabled={isSubmitting || loading}
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
                        disabled={isSubmitting || loading}
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

                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <Button
                    className="w-full bg-ag-green-600 hover:bg-ag-green-700 h-10"
                    type="submit"
                    disabled={isSubmitting || loading || !name || !role || phoneNumber.length < 10 || password.length < 6 || !address.trim()}
                  >
                    {isSubmitting || loading ? t('common.loading') : t('auth.send_otp')}
                  </Button>
                </form>
              </>
            ) : (
              <>
                <div className="flex items-center mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="p-2 hover:bg-gray-100"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <h1 className="text-3xl font-bold text-foreground ml-2">{t('auth.verify_otp')}</h1>
                </div>
                
                <p className="text-muted-foreground mb-8">
                  Enter OTP for verification: {phoneNumber}<br/>
                  <span className="text-ag-green-600 font-medium">Use: 123456 (Demo OTP)</span>
                </p>

                <form onSubmit={handleCompleteRegistration} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-4 text-center">
                      {t('auth.enter_otp')}
                    </label>
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      disabled={isSubmitting || loading}
                    />
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <Button 
                    className="w-full bg-ag-green-600 hover:bg-ag-green-700 h-10" 
                    type="submit"
                    disabled={isSubmitting || loading || otp.length !== 6}
                  >
                    {isSubmitting || loading ? t('common.loading') : t('btn.create_account')}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleStartRegistration({ preventDefault: () => {} } as any)}
                    disabled={isSubmitting || loading}
                    type="button"
                  >
                    {t('auth.resend_otp')}
                  </Button>
                </form>
              </>
            )}

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                {t('auth.already_have_account')}{" "}
                <Link to="/login" className="text-ag-green-600 hover:text-ag-green-700 font-medium">
                  {t('auth.sign_in')}
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
