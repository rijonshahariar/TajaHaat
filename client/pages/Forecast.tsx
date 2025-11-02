import { Footer } from "@/components/Footer";
import { useTranslation } from "@/lib/i18n";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import GeminiService from "@/lib/geminiService";
import { RefreshCw, Brain, TrendingUp, Cloud, Lightbulb } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

export default function Forecast() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [farmingInsights, setFarmingInsights] = useState<string[]>([]);
  const [weatherRecommendations, setWeatherRecommendations] = useState<string[]>([]);
  const [forecastData, setForecastData] = useState({
    demandData: [
      { crop: "Wheat", demand: 8564 },
      { crop: "Rice", demand: 7521 },
      { crop: "Tomatoes", demand: 5890 },
      { crop: "Onions", demand: 9000 },
      { crop: "Potatoes", demand: 7100 },
    ],
    supplyData: [
      { month: "Nov", demand: 11000, supply: 9000 },
      { month: "Dec", demand: 9500, supply: 9700 },
      { month: "Jan", demand: 8500, supply: 8800 },
      { month: "Feb", demand: 10000, supply: 9500 },
      { month: "Mar", demand: 8700, supply: 8600 },
    ],
    insights: [
      "Wheat demand is expected to peak in January, consider increasing production by 15%.",
      "Tomato supply currently exceeds demand by 8%, optimal time for sellers to negotiate prices.",
      "Rice prices are stable with balanced supply-demand, good market conditions for trading.",
    ],
  });

  const regenerateForecast = async () => {
    setLoading(true);
    try {
      console.log('🚀 Regenerating forecast with Gemini AI...');
      
      toast({
        title: "Generating AI Forecast",
        description: "Using Gemini AI to analyze market trends...",
      });

      // Generate new forecast data using Gemini AI
      const newForecastData = await GeminiService.generateForecast(forecastData);
      
      // Get additional insights
      const crops = forecastData.demandData.map(item => item.crop);
      const newInsights = await GeminiService.generateFarmingInsights(crops);
      const weatherRecs = await GeminiService.generateWeatherRecommendations();
      
      // Update state with new data
      setForecastData(newForecastData);
      setFarmingInsights(newInsights);
      setWeatherRecommendations(weatherRecs);
      setLastUpdated(new Date());
      
      toast({
        title: "Forecast Updated!",
        description: "AI-powered insights have been generated successfully.",
      });
      
    } catch (error) {
      console.error('❌ Forecast generation failed:', error);
      
      toast({
        title: "Forecast Generation Failed",
        description: "Using fallback data. Please try again later.",
        variant: "destructive",
      });
      
      // Fallback to simple randomization
      const newData = forecastData.demandData.map((item) => ({
        ...item,
        demand: Math.floor(Math.random() * (9500 - 6000) + 6000),
      }));
      setForecastData({ ...forecastData, demandData: newData });
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Header */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">
                  AI-Powered Demand Forecast
                </h1>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Brain className="w-3 h-3 mr-1" />
                  Gemini AI
                </Badge>
              </div>
              <p className="text-muted-foreground mb-2">
                Advanced market predictions powered by Google Gemini AI
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Last updated: {lastUpdated.toLocaleString()}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Market Analysis
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                onClick={regenerateForecast}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Generating...' : 'Regenerate Forecast'}
              </Button>
            </div>
          </div>
          
          {/* AI Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">AI Analysis</h3>
              </div>
              <p className="text-sm text-blue-700">
                Advanced machine learning algorithms analyze market trends and seasonal patterns.
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Market Insights</h3>
              </div>
              <p className="text-sm text-green-700">
                Real-time market predictions and pricing strategies for optimal decision making.
              </p>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Cloud className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-orange-800">Weather Integration</h3>
              </div>
              <p className="text-sm text-orange-700">
                Weather-based recommendations and seasonal farming guidance for Bangladesh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Weather Recommendations */}
      {weatherRecommendations.length > 0 && (
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
              <div className="flex items-center gap-2 mb-4">
                <Cloud className="w-5 h-5 text-orange-600" />
                <h2 className="text-xl font-semibold text-orange-800">
                  Weather-Based Recommendations
                </h2>
              </div>
              <div className="grid gap-3">
                {weatherRecommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-orange-700">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Top 5 Demanded Crops */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-white border rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 text-left">
            Top 5 Demanded Crops This Week
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={forecastData.demandData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="crop" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="demand" fill="#22c55e" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Predicted Demand vs Supply */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-white border rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 text-left">
            Predicted Demand vs Available Supply
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecastData.supplyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="demand"
                stroke="#22c55e"
                strokeWidth={2}
                name="Demand (kg)"
              />
              <Line
                type="monotone"
                dataKey="supply"
                stroke="#16a34a"
                strokeWidth={2}
                name="Supply (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Key Insights */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-green-800">
                Market Insights
              </h2>
            </div>
            <ul className="space-y-3 text-green-700">
              {forecastData.insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Farming Insights */}
          {farmingInsights.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-blue-800">
                  AI Farming Insights
                </h2>
              </div>
              <ul className="space-y-3 text-blue-700">
                {farmingInsights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <Toaster />
    </div>
  );
}