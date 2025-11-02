import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Star, Package, Truck, Clock } from "lucide-react";
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";

export default function Pricing() {
  const { t } = useTranslation();
  const { userData } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const pricingPlans = [
    {
      id: 'free',
      name: 'Free',
      icon: Package,
      description: 'Perfect for getting started',
      monthlyPrice: 0,
      yearlyPrice: 0,
      popular: false,
      features: [
        '1 transaction per day',
        'Up to 10 kg per order',
        'Standard delivery (3-5 days)',
        'Basic customer support',
        'Product listing',
        'Order tracking'
      ],
      limitations: [
        'No fast delivery',
        'Limited order quantity',
        'Basic analytics'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Zap,
      description: 'Best for growing businesses',
      monthlyPrice: 100,
      yearlyPrice: 1000,
      popular: true,
      features: [
        '5 orders per day',
        'Up to 100 kg per day',
        'Fast delivery (1-2 days)',
        'Priority customer support',
        'Advanced analytics',
        'Bulk order discounts',
        'Product promotion',
        'Multiple payment options'
      ],
      limitations: []
    },
    {
      id: 'master',
      name: 'Master',
      icon: Crown,
      description: 'For large-scale operations',
      monthlyPrice: 500,
      yearlyPrice: 5000,
      popular: false,
      features: [
        '10 orders per day',
        'Up to 500 kg per day',
        'Express delivery (same day)',
        '24/7 dedicated support',
        'Premium analytics dashboard',
        'API access',
        'Custom integrations',
        'Dedicated account manager',
        'Priority marketplace placement',
        'Advanced reporting'
      ],
      limitations: []
    }
  ];

  const getPrice = (plan: typeof pricingPlans[0]) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan: typeof pricingPlans[0]) => {
    if (plan.monthlyPrice === 0) return 0;
    const monthlyTotal = plan.monthlyPrice * 12;
    const savings = monthlyTotal - plan.yearlyPrice;
    return Math.round((savings / monthlyTotal) * 100);
  };

  const handleSubscribe = (planId: string) => {
    // This would integrate with a payment processor
    console.log(`Subscribing to ${planId} plan with ${billingCycle} billing`);
    // You would implement Stripe, PayPal, or local payment gateway here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan for your farming or buying needs. Upgrade or downgrade at any time.
            </p>
            
            {/* Billing Toggle */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  billingCycle === 'yearly' ? 'bg-ag-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                  Save up to 17%
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => {
            const IconComponent = plan.icon;
            const savings = getSavings(plan);
            
            return (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden ${
                  plan.popular 
                    ? 'border-ag-green-500 shadow-lg scale-105' 
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-ag-green-500 to-ag-green-600 text-white text-center py-2 text-sm font-semibold">
                    <Star className="w-4 h-4 inline mr-1" />
                    Most Popular
                  </div>
                )}
                
                <CardHeader className={plan.popular ? 'pt-12' : ''}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      plan.id === 'free' ? 'bg-gray-100' :
                      plan.id === 'premium' ? 'bg-blue-100' :
                      'bg-purple-100'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        plan.id === 'free' ? 'text-gray-600' :
                        plan.id === 'premium' ? 'text-blue-600' :
                        'text-purple-600'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">
                        ৳{getPrice(plan).toLocaleString()}
                      </span>
                      {plan.monthlyPrice > 0 && (
                        <span className="text-gray-600">
                          /{billingCycle === 'monthly' ? 'month' : 'year'}
                        </span>
                      )}
                    </div>
                    {billingCycle === 'yearly' && savings > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        Save {savings}% with yearly billing
                      </p>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {plan.limitations.length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm font-medium text-gray-500 mb-2">Limitations:</p>
                      <div className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-5 h-5 mt-0.5 flex-shrink-0 flex items-center justify-center">
                              <div className="w-1 h-1 bg-gray-400 rounded-full" />
                            </div>
                            <span className="text-sm text-gray-500">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full ${
                      plan.popular
                        ? 'bg-ag-green-600 hover:bg-ag-green-700'
                        : plan.id === 'free'
                        ? 'bg-gray-600 hover:bg-gray-700'
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                    disabled={plan.id === 'free' && !userData}
                  >
                    {plan.id === 'free' 
                      ? (userData ? 'Current Plan' : 'Get Started Free')
                      : `Subscribe to ${plan.name}`
                    }
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Features Comparison */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Compare All Features
          </h2>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Features
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      Free
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      Premium
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      Master
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Daily Transactions</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">1</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">5</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">10</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">Daily Order Limit</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">10 kg</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">100 kg</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">500 kg</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Delivery Speed</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        3-5 days
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      <div className="flex items-center justify-center gap-1">
                        <Truck className="w-4 h-4 text-blue-500" />
                        1-2 days
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      <div className="flex items-center justify-center gap-1">
                        <Zap className="w-4 h-4 text-purple-500" />
                        Same day
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">Customer Support</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Basic</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Priority</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">24/7 Dedicated</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Analytics Dashboard</td>
                    <td className="px-6 py-4 text-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">API Access</td>
                    <td className="px-6 py-4 text-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I upgrade or downgrade my plan?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, bank transfers, and mobile payment methods like bKash and Nagad.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial for premium plans?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 7-day free trial for all premium plans. No credit card required to start.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I exceed my daily limits?
              </h3>
              <p className="text-gray-600">
                You'll receive a notification when approaching limits. Exceeding limits may require upgrading your plan or waiting until the next day.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
