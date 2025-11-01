// import { Footer } from "@/components/Footer";
// import { useTranslation } from "@/lib/i18n";

// export default function Forecast() {
//   const { t } = useTranslation();

//   return (
//     <div className="min-h-screen bg-white">
//       <section className="py-12 px-4 sm:px-6 lg:px-8 bg-ag-green-50 border-b border-border">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-4xl font-bold text-foreground mb-2">{t('forecast.title')}</h1>
//           <p className="text-muted-foreground">{t('forecast.subtitle')}</p>
//         </div>
//       </section>

//       <section className="py-16 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto text-center">
//           <p className="text-muted-foreground mb-4">
//             {t('forecast.expand_note')}
//           </p>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// }
// import { Footer } from "@/components/Footer";
// import { useTranslation } from "@/lib/i18n";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// export default function Forecast() {
//   const { t } = useTranslation();
//   const [weather, setWeather] = useState(null);
//   const [productData, setProductData] = useState([]);

//   // Dummy product dataset depending on weather
//   const generateData = (condition) => {
//     const base = [
//       { name: "Tomato", demand: 60, price: 30 },
//       { name: "Cucumber", demand: 70, price: 25 },
//       { name: "Spinach", demand: 80, price: 20 },
//       { name: "Potato", demand: 90, price: 15 },
//     ];

//     if (condition === "Rain" || condition === "Storm") {
//       return base.map((item) => ({
//         ...item,
//         price: item.price + 10, // bad weather → higher price
//         demand: item.demand - 20, // less demand
//       }));
//     } else if (condition === "Sunny") {
//       return base.map((item) => ({
//         ...item,
//         price: item.price - 5,
//         demand: item.demand + 15,
//       }));
//     } else {
//       return base;
//     }
//   };

//   useEffect(() => {
//     // Example: fetch weather from OpenWeatherMap (you can replace with real API key)
//     const fetchWeather = async () => {
//       try {
//         const res = await axios.get(
//           "https://api.open-meteo.com/v1/forecast?latitude=22.36&longitude=91.83&current_weather=true",
//         );
//         const condition =
//           res.data.current_weather.weathercode < 3 ? "Sunny" : "Rain";
//         setWeather(condition);
//         setProductData(generateData(condition));
//       } catch (error) {
//         console.error(error);
//         // fallback
//         setWeather("Sunny");
//         setProductData(generateData("Sunny"));
//       }
//     };
//     fetchWeather();
//   }, []);

//   return (
//     <div className="min-h-screen bg-white">
//       <section className="py-12 px-4 sm:px-6 lg:px-8 bg-ag-green-50 border-b border-border">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-4xl font-bold text-foreground mb-2">
//             {t("forecast.title")}
//           </h1>
//           <p className="text-muted-foreground">{t("forecast.subtitle")}</p>
//         </div>
//       </section>

//       <section className="py-16 px-4 sm:px-6 lg:px-8 text-center">
//         <div className="max-w-4xl mx-auto">
//           <h2 className="text-2xl font-semibold mb-4">
//             🌦 Current Weather:{" "}
//             <span className="text-blue-600 font-bold">
//               {weather || "Loading..."}
//             </span>
//           </h2>
//           <p className="text-muted-foreground mb-8">
//             {weather === "Rain"
//               ? "Bad weather increases vegetable prices due to transportation and harvest issues."
//               : "Good weather boosts production and reduces prices."}
//           </p>

//           <ResponsiveContainer width="100%" height={350}>
//             <LineChart data={productData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Line
//                 type="monotone"
//                 dataKey="price"
//                 stroke="#8884d8"
//                 name="Price"
//               />
//               <Line
//                 type="monotone"
//                 dataKey="demand"
//                 stroke="#82ca9d"
//                 name="Demand"
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// }
// --------
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/lib/i18n";
import { useState } from "react";
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

  const regenerateForecast = () => {
    // Dummy randomization for refresh effect
    const newData = forecastData.demandData.map((item) => ({
      ...item,
      demand: Math.floor(Math.random() * (9500 - 6000) + 6000),
    }));
    setForecastData({ ...forecastData, demandData: newData });
  };

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Header */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Demand Forecast
            </h1>
            <p className="text-muted-foreground">
              AI-powered insights into market trends
            </p>
          </div>
          <button
            onClick={regenerateForecast}
            className="mt-4 md:mt-0 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            🔄 Regenerate Forecast
          </button>
        </div>
      </section>

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
        <div className="max-w-5xl mx-auto bg-green-50 border border-green-200 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-left text-green-800">
            Key Insights
          </h2>
          <ul className="list-disc pl-6 text-green-700 space-y-2 text-left">
            {forecastData.insights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
}
