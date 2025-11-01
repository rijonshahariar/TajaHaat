import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import ProductDetail from "./pages/ProductDetail";
import BuyerDashboard from "./pages/BuyerDashboard";
import FarmerDashboard from "./pages/FarmerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Bids from "./pages/Bids";
import Forecast from "./pages/Forecast";
import DeliveryTracking from "./pages/DeliveryTracking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

// Debug environment variables in development
if (import.meta.env.DEV) {
  console.log('Environment check:', {
    hasFirebaseApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
    hasFirebaseAuthDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    hasFirebaseProjectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
    mode: import.meta.env.MODE
  });
}

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1">{children}</main>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/marketplace"
            element={
              <Layout>
                <Marketplace />
              </Layout>
            }
          />
          <Route
            path="/product/:productId"
            element={
              <Layout>
                <ProductDetail />
              </Layout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/buyer-dashboard"
            element={
              <Layout>
                <BuyerDashboard />
              </Layout>
            }
          />
          <Route
            path="/farmer-dashboard"
            element={
              <Layout>
                <FarmerDashboard />
              </Layout>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <Layout>
                <AdminDashboard />
              </Layout>
            }
          />
          <Route
            path="/bids"
            element={
              <Layout>
                <Bids />
              </Layout>
            }
          />
          <Route
            path="/forecast"
            element={
              <Layout>
                <Forecast />
              </Layout>
            }
          />
          <Route
            path="/delivery"
            element={
              <Layout>
                <DeliveryTracking />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout>
                <About />
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <Layout>
                <Contact />
              </Layout>
            }
          />
          <Route
            path="*"
            element={
              <Layout>
                <NotFound />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

createRoot(document.getElementById("root")!).render(<App />);
