import { GoogleGenerativeAI } from "@google/generative-ai";

interface ForecastData {
  demandData: Array<{ crop: string; demand: number }>;
  supplyData: Array<{ month: string; demand: number; supply: number }>;
  insights: string[];
}

export class GeminiService {
  private static readonly API_KEY = 'AIzaSyCls_k1rY8vboba2DWDy8_mUIb-P_uuulI';
  private static genAI = new GoogleGenerativeAI(this.API_KEY);

  /**
   * Generate forecast data using Gemini AI
   */
  static async generateForecast(currentData: ForecastData): Promise<ForecastData> {
    try {
      console.log('🤖 Generating forecast with Gemini AI...');
      
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `
        You are an agricultural market analyst for Bangladesh. Based on the current farming data, generate realistic forecasts.
        
        Current market data:
        Crops: ${currentData.demandData.map(item => `${item.crop}: ${item.demand}kg demand`).join(', ')}
        
        Monthly trends: ${currentData.supplyData.map(item => `${item.month}: ${item.demand}kg demand, ${item.supply}kg supply`).join(', ')}
        
        Please provide a JSON response with the following structure:
        {
          "demandData": [
            {"crop": "Wheat", "demand": number},
            {"crop": "Rice", "demand": number},
            {"crop": "Tomatoes", "demand": number},
            {"crop": "Onions", "demand": number},
            {"crop": "Potatoes", "demand": number}
          ],
          "supplyData": [
            {"month": "Nov", "demand": number, "supply": number},
            {"month": "Dec", "demand": number, "supply": number},
            {"month": "Jan", "demand": number, "supply": number},
            {"month": "Feb", "demand": number, "supply": number},
            {"month": "Mar", "demand": number, "supply": number}
          ],
          "insights": [
            "3-5 actionable insights about market trends, pricing recommendations, and supply chain optimizations for Bangladesh farmers and buyers"
          ]
        }
        
        Consider factors like:
        - Seasonal variations in Bangladesh
        - Weather patterns affecting crop yields
        - Market demand fluctuations
        - Export/import trends
        - Local consumption patterns
        
        Make the numbers realistic for Bangladesh's agricultural market (in kg) and provide practical insights for farmers and buyers.
        Return only the JSON object, no additional text.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('🤖 Gemini response:', text);
      
      // Try to parse the JSON response
      try {
        // Clean the response text (remove markdown code blocks if present)
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const forecastData = JSON.parse(cleanedText);
        
        // Validate the structure
        if (forecastData.demandData && forecastData.supplyData && forecastData.insights) {
          console.log('✅ Successfully generated forecast with Gemini');
          return forecastData;
        } else {
          throw new Error('Invalid forecast data structure');
        }
      } catch (parseError) {
        console.error('❌ Failed to parse Gemini response:', parseError);
        return this.generateFallbackForecast();
      }
      
    } catch (error) {
      console.error('❌ Gemini API error:', error);
      return this.generateFallbackForecast();
    }
  }

  /**
   * Generate farming insights using Gemini AI
   */
  static async generateFarmingInsights(crops: string[]): Promise<string[]> {
    try {
      console.log('🌱 Generating farming insights with Gemini...');
      
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `
        As an agricultural expert for Bangladesh, provide 5 practical farming insights for these crops: ${crops.join(', ')}.
        
        Focus on:
        - Best planting seasons in Bangladesh climate
        - Market pricing strategies
        - Crop rotation recommendations
        - Pest and disease management
        - Weather-based cultivation tips
        
        Return as a JSON array of strings:
        ["insight 1", "insight 2", "insight 3", "insight 4", "insight 5"]
        
        Make insights specific to Bangladesh's agricultural conditions and market.
        Return only the JSON array, no additional text.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('🌱 Gemini insights response:', text);
      
      try {
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const insights = JSON.parse(cleanedText);
        
        if (Array.isArray(insights) && insights.length > 0) {
          return insights;
        } else {
          throw new Error('Invalid insights format');
        }
      } catch (parseError) {
        console.error('❌ Failed to parse insights:', parseError);
        return this.getFallbackInsights();
      }
      
    } catch (error) {
      console.error('❌ Gemini insights error:', error);
      return this.getFallbackInsights();
    }
  }

  /**
   * Generate weather-based farming recommendations
   */
  static async generateWeatherRecommendations(): Promise<string[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `
        Provide 3-4 current weather-based farming recommendations for Bangladesh (November 2025).
        Consider typical monsoon patterns, winter crop preparation, and seasonal farming activities.
        
        Return as JSON array: ["recommendation 1", "recommendation 2", "recommendation 3", "recommendation 4"]
        Make recommendations actionable and specific to current season.
        Return only the JSON array.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const recommendations = JSON.parse(cleanedText);
      
      return Array.isArray(recommendations) ? recommendations : this.getFallbackWeatherRecommendations();
      
    } catch (error) {
      console.error('❌ Weather recommendations error:', error);
      return this.getFallbackWeatherRecommendations();
    }
  }

  /**
   * Fallback forecast data when Gemini fails
   */
  private static generateFallbackForecast(): ForecastData {
    const variation = () => Math.floor(Math.random() * 2000) + 1000;
    
    return {
      demandData: [
        { crop: "Wheat", demand: 7500 + variation() },
        { crop: "Rice", demand: 8200 + variation() },
        { crop: "Tomatoes", demand: 6100 + variation() },
        { crop: "Onions", demand: 8800 + variation() },
        { crop: "Potatoes", demand: 7300 + variation() },
      ],
      supplyData: [
        { month: "Nov", demand: 10800, supply: 9200 },
        { month: "Dec", demand: 9700, supply: 9900 },
        { month: "Jan", demand: 8300, supply: 8600 },
        { month: "Feb", demand: 10200, supply: 9700 },
        { month: "Mar", demand: 8900, supply: 8800 },
      ],
      insights: [
        "Market analysis suggests increased demand for winter crops this season.",
        "Consider diversifying crop portfolio to minimize seasonal risks.",
        "Current supply levels indicate good market opportunities for farmers.",
      ]
    };
  }

  /**
   * Fallback insights when Gemini fails
   */
  private static getFallbackInsights(): string[] {
    return [
      "Focus on drought-resistant crop varieties for sustainable farming.",
      "Implement crop rotation to maintain soil health and productivity.",
      "Monitor market prices regularly for optimal selling opportunities.",
      "Consider organic farming practices to access premium markets.",
      "Use weather forecasts to plan irrigation and harvesting schedules.",
    ];
  }

  /**
   * Fallback weather recommendations
   */
  private static getFallbackWeatherRecommendations(): string[] {
    return [
      "Prepare winter crops for optimal November planting conditions.",
      "Monitor soil moisture levels as temperatures begin to drop.",
      "Consider protective measures for sensitive crops during cool nights.",
      "Plan irrigation schedules based on reduced rainfall patterns.",
    ];
  }
}

export default GeminiService;
