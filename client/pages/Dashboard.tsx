import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user, userData, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user || !userData) {
        // Not authenticated, redirect to login
        navigate('/login');
        return;
      }

      // Route based on user role
      if (userData.role === 'farmer') {
        navigate('/farmer-dashboard');
      } else if (userData.role === 'buyer') {
        navigate('/buyer-dashboard');
      } else if (userData.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        // Default to buyer dashboard for unknown roles
        navigate('/buyer-dashboard');
      }
    }
  }, [user, userData, loading, navigate]);

  // Show loading while determining route
  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Dashboard</h3>
            <p className="text-gray-500">Redirecting to your personalized dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
