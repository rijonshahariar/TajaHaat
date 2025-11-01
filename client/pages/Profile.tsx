import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/lib/i18n";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Star,
  Award,
  ArrowLeft,
  Edit
} from "lucide-react";
import { Footer } from "@/components/Footer";

export default function Profile() {
  const { t } = useTranslation();
  const { user, userData, loading } = useAuth();
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState<string>('');

  useEffect(() => {
    if (!loading && (!user || !userData)) {
      navigate('/login');
      return;
    }

    // Set user image from backend data or create placeholder
    if (userData?.backendUser?.image) {
      setUserImage(userData.backendUser.image);
    } else if (userData?.name) {
      setUserImage(`https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&size=400&background=10b981&color=fff`);
    }
  }, [user, userData, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-ag-green-600"></div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Not available';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    return role === 'farmer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <img
                    src={userImage}
                    alt={userData.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&size=400&background=10b981&color=fff`;
                    }}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {userData.name}
                </h2>
                
                <Badge className={`mb-4 ${getRoleBadgeColor(userData.role)}`}>
                  {userData.role === 'farmer' ? '🌾 Farmer' : '🛒 Buyer'}
                </Badge>

                {userData.backendUser && (
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>Rating: {userData.backendUser.rating}/5</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Award className="w-4 h-4 text-purple-500" />
                      <span>Level {userData.backendUser.level}</span>
                    </div>
                    <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {userData.backendUser.subscriptionStatus}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Details Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-mono text-sm">{userData.phone}</p>
                    </div>
                  </div>

                  {/* Email */}
                  {/* <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">{userData.backendUser?.email || user?.email || 'Not provided'}</p>
                    </div>
                  </div> */}

                  {/* Address */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">{userData.backendUser?.address || 'Not provided'}</p>
                    </div>
                  </div>

                  {/* Join Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Member Since
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">{formatDate(userData.createdAt)}</p>
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Verification Status
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <Badge variant={userData.isPhoneVerified ? "default" : "secondary"}>
                        {userData.isPhoneVerified ? "✓ Verified" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/dashboard')}>
                    Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
