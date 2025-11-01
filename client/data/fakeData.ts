export interface Review {
  id: string;
  buyerId: string;
  buyerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  type: "farmer" | "buyer";
  level: "new" | "level_1" | "level_2" | "level_3";
  rating: number;
  reviews: number;
  verified: boolean;
  image: string;
  bio: string;
  joinDate: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  farmer: string;
  farmerId: string;
  price: number;
  available: number;
  location: string;
  image: string;
  images: string[];
  description: string;
  sold: number;
  rating: number;
  reviews: Review[];
  harvestDate?: string;
  certifications?: string[];
}

export interface Demand {
  id: string;
  cropName: string;
  quantity: number;
  preferredPrice: number;
  deliveryDate: string;
  buyerId: string;
  buyerName: string;
  notes: string;
  status: "Pending" | "Accepted" | "Delivered";
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  totalCost: number;
  farmer: string;
  buyerId: string;
  date: string;
  status: "Pending" | "In Transit" | "Delivered";
}

export interface ForecastData {
  crop: string;
  demand: number;
  supply: number;
}

export const users: UserProfile[] = [
  {
    id: "f1",
    name: "Rajesh Kumar",
    email: "rajesh@agrohub.com",
    phone: "+91 98765 43210",
    location: "Punjab",
    type: "farmer",
    level: "level_3",
    rating: 4.8,
    reviews: 324,
    verified: true,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    bio: "Award-winning organic farmer with 15+ years experience",
    joinDate: "2018-03-15",
  },
  {
    id: "f2",
    name: "Priya Sharma",
    email: "priya@agrohub.com",
    phone: "+91 98765 43211",
    location: "Haryana",
    type: "farmer",
    level: "level_2",
    rating: 4.6,
    reviews: 187,
    verified: true,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    bio: "Premium Basmati rice specialist",
    joinDate: "2019-07-20",
  },
  {
    id: "f3",
    name: "Amit Singh",
    email: "amit@agrohub.com",
    phone: "+91 98765 43212",
    location: "Madhya Pradesh",
    type: "farmer",
    level: "level_1",
    rating: 4.3,
    reviews: 98,
    verified: true,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    bio: "Fresh vegetable grower",
    joinDate: "2021-05-10",
  },
  {
    id: "f4",
    name: "Deepak Patel",
    email: "deepak@agrohub.com",
    phone: "+91 98765 43213",
    location: "Maharashtra",
    type: "farmer",
    level: "level_3",
    rating: 4.9,
    reviews: 456,
    verified: true,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    bio: "Renowned Alphonso mango producer",
    joinDate: "2017-01-25",
  },
  {
    id: "f5",
    name: "Suresh Verma",
    email: "suresh@agrohub.com",
    phone: "+91 98765 43214",
    location: "Uttar Pradesh",
    type: "farmer",
    level: "level_2",
    rating: 4.7,
    reviews: 267,
    verified: true,
    image: "https://images.unsplash.com/photo-1519764622345-23439dd1f59f?w=150&h=150&fit=crop",
    bio: "Bulk wheat supplier",
    joinDate: "2019-11-08",
  },
  {
    id: "f6",
    name: "Neha Gupta",
    email: "neha@agrohub.com",
    phone: "+91 98765 43215",
    location: "Karnataka",
    type: "farmer",
    level: "level_1",
    rating: 4.2,
    reviews: 67,
    verified: true,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    bio: "Fresh onion supplier",
    joinDate: "2022-02-14",
  },
  {
    id: "f7",
    name: "Vikram Singh",
    email: "vikram@agrohub.com",
    phone: "+91 98765 43216",
    location: "Himachal Pradesh",
    type: "farmer",
    level: "level_2",
    rating: 4.5,
    reviews: 145,
    verified: true,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    bio: "High altitude potato grower",
    joinDate: "2020-06-12",
  },
  {
    id: "f8",
    name: "Meera Desai",
    email: "meera@agrohub.com",
    phone: "+91 98765 43217",
    location: "West Bengal",
    type: "farmer",
    level: "new",
    rating: 4.0,
    reviews: 23,
    verified: false,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    bio: "New organic spinach producer",
    joinDate: "2023-09-01",
  },
  {
    id: "b1",
    name: "Fresh Foods Ltd",
    email: "contact@freshfoods.com",
    phone: "+91 99876 54321",
    location: "Delhi",
    type: "buyer",
    level: "level_3",
    rating: 4.7,
    reviews: 542,
    verified: true,
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=150&h=150&fit=crop",
    bio: "Leading organic food distributor",
    joinDate: "2016-08-20",
  },
  {
    id: "b2",
    name: "Grain Traders Inc",
    email: "sales@graintraders.com",
    phone: "+91 99876 54322",
    location: "Mumbai",
    type: "buyer",
    level: "level_2",
    rating: 4.4,
    reviews: 298,
    verified: true,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=150&h=150&fit=crop",
    bio: "Wholesale grain supplier",
    joinDate: "2018-12-10",
  },
];

export const products: Product[] = [
  {
    id: "p1",
    name: "Organic Tomatoes",
    category: "Vegetables",
    farmer: "Rajesh Kumar",
    farmerId: "f1",
    price: 45,
    available: 500,
    location: "Punjab",
    image: "https://images.unsplash.com/photo-1592841494900-efb7b6904d71?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1592841494900-efb7b6904d71?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1594929102351-789181c7d385?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop",
    ],
    description: "Fresh, organic tomatoes grown without pesticides. Hand-picked daily for maximum freshness.",
    sold: 1250,
    rating: 4.8,
    reviews: [
      {
        id: "r1",
        buyerId: "b1",
        buyerName: "Fresh Foods Ltd",
        rating: 5,
        comment: "Excellent quality and freshness. Great packaging!",
        date: "2024-02-05",
      },
      {
        id: "r2",
        buyerId: "b2",
        buyerName: "Grain Traders Inc",
        rating: 4,
        comment: "Good quality tomatoes, delivery was on time",
        date: "2024-01-28",
      },
    ],
    harvestDate: "2024-02-10",
    certifications: ["Organic Certified", "ISO 9001"],
  },
  {
    id: "p2",
    name: "Rice",
    category: "Grains",
    farmer: "Priya Sharma",
    farmerId: "f2",
    price: 60,
    available: 2000,
    location: "Haryana",
    image: "https://images.unsplash.com/photo-1586857619488-73f1fd3ae0ea?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1586857619488-73f1fd3ae0ea?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop",
    ],
    description: "Premium Basmati rice, best quality. Aged to perfection for superior aroma and taste.",
    sold: 3420,
    rating: 4.6,
    reviews: [
      {
        id: "r3",
        buyerId: "b1",
        buyerName: "Fresh Foods Ltd",
        rating: 5,
        comment: "Premium quality. Regular customer!",
        date: "2024-02-02",
      },
    ],
    harvestDate: "2023-10-15",
    certifications: ["GI Tagged", "Organic"],
  },
  {
    id: "p3",
    name: "Carrots",
    category: "Vegetables",
    farmer: "Amit Singh",
    farmerId: "f3",
    price: 35,
    available: 800,
    location: "Madhya Pradesh",
    image: "https://images.unsplash.com/photo-1599599810694-b3fb3e6be4f9?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599599810694-b3fb3e6be4f9?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop",
    ],
    description: "Sweet and crunchy carrots, perfect for salads and cooking.",
    sold: 567,
    rating: 4.3,
    reviews: [
      {
        id: "r4",
        buyerId: "b2",
        buyerName: "Grain Traders Inc",
        rating: 4,
        comment: "Good quality vegetables",
        date: "2024-01-30",
      },
    ],
    harvestDate: "2024-02-08",
    certifications: ["Fresh Pick"],
  },
  {
    id: "p4",
    name: "Mango",
    category: "Fruits",
    farmer: "Deepak Patel",
    farmerId: "f4",
    price: 80,
    available: 300,
    location: "Maharashtra",
    image: "https://images.unsplash.com/photo-1585599810694-b3fb3e6be4f9?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1585599810694-b3fb3e6be4f9?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1590003072023-b5ff4e2f1c03?w=600&h=400&fit=crop",
    ],
    description: "Ripe, sweet Alphonso mangoes. The king of mangoes with exceptional flavor.",
    sold: 892,
    rating: 4.9,
    reviews: [
      {
        id: "r5",
        buyerId: "b1",
        buyerName: "Fresh Foods Ltd",
        rating: 5,
        comment: "Best mangoes ever! Always buy from Deepak.",
        date: "2024-01-25",
      },
      {
        id: "r6",
        buyerId: "b2",
        buyerName: "Grain Traders Inc",
        rating: 5,
        comment: "Premium quality Alphonso.",
        date: "2024-01-20",
      },
    ],
    harvestDate: "2024-01-10",
    certifications: ["GI Tagged", "Organic Certified"],
  },
  {
    id: "p5",
    name: "Wheat",
    category: "Grains",
    farmer: "Suresh Verma",
    farmerId: "f5",
    price: 50,
    available: 3000,
    location: "Uttar Pradesh",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    ],
    description: "High-quality wheat grain, perfect for flour mills and bulk orders.",
    sold: 2105,
    rating: 4.7,
    reviews: [
      {
        id: "r7",
        buyerId: "b2",
        buyerName: "Grain Traders Inc",
        rating: 5,
        comment: "Consistent quality and timely delivery",
        date: "2024-02-01",
      },
    ],
    harvestDate: "2023-11-20",
    certifications: ["ISO 9001"],
  },
  {
    id: "p6",
    name: "Onions",
    category: "Vegetables",
    farmer: "Neha Gupta",
    farmerId: "f6",
    price: 40,
    available: 1200,
    location: "Karnataka",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=400&fit=crop",
    ],
    description: "Fresh red onions with excellent shelf life.",
    sold: 234,
    rating: 4.2,
    reviews: [
      {
        id: "r8",
        buyerId: "b1",
        buyerName: "Fresh Foods Ltd",
        rating: 4,
        comment: "Good quality onions",
        date: "2024-01-15",
      },
    ],
    harvestDate: "2024-02-05",
    certifications: [],
  },
  {
    id: "p7",
    name: "Potatoes",
    category: "Vegetables",
    farmer: "Vikram Singh",
    farmerId: "f7",
    price: 30,
    available: 1500,
    location: "Himachal Pradesh",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1599599810694-b3fb3e6be4f9?w=600&h=400&fit=crop",
    ],
    description: "Quality potatoes for cooking, sourced from high altitude farms.",
    sold: 1876,
    rating: 4.5,
    reviews: [
      {
        id: "r9",
        buyerId: "b1",
        buyerName: "Fresh Foods Ltd",
        rating: 5,
        comment: "Excellent quality and consistency",
        date: "2024-02-03",
      },
    ],
    harvestDate: "2024-01-30",
    certifications: ["High Altitude"],
  },
  {
    id: "p8",
    name: "Spinach",
    category: "Vegetables",
    farmer: "Meera Desai",
    farmerId: "f8",
    price: 25,
    available: 400,
    location: "West Bengal",
    image: "https://images.unsplash.com/photo-1599599810694-b3fb3e6be4f9?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599599810694-b3fb3e6be4f9?w=600&h=400&fit=crop",
    ],
    description: "Fresh green leafy spinach, recently harvested.",
    sold: 89,
    rating: 4.0,
    reviews: [
      {
        id: "r10",
        buyerId: "b1",
        buyerName: "Fresh Foods Ltd",
        rating: 4,
        comment: "Fresh and good quality",
        date: "2024-02-04",
      },
    ],
    harvestDate: "2024-02-09",
    certifications: [],
  },
];

export const demands: Demand[] = [
  {
    id: "d1",
    cropName: "Tomatoes",
    quantity: 100,
    preferredPrice: 40,
    deliveryDate: "2024-02-20",
    buyerId: "b1",
    buyerName: "Fresh Foods Ltd",
    notes: "Need high quality organic tomatoes",
    status: "Pending",
  },
  {
    id: "d2",
    cropName: "Wheat",
    quantity: 500,
    preferredPrice: 48,
    deliveryDate: "2024-03-05",
    buyerId: "b2",
    buyerName: "Grain Traders Inc",
    notes: "Bulk order for flour production",
    status: "Pending",
  },
  {
    id: "d3",
    cropName: "Mango",
    quantity: 50,
    preferredPrice: 75,
    deliveryDate: "2024-02-25",
    buyerId: "b3",
    buyerName: "Organic Exports",
    notes: "Premium quality only",
    status: "Accepted",
  },
];

export const orders: Order[] = [
  {
    id: "o1",
    productId: "p1",
    productName: "Organic Tomatoes",
    quantity: 25,
    totalCost: 1125,
    farmer: "Rajesh Kumar",
    buyerId: "b1",
    date: "2024-02-10",
    status: "In Transit",
  },
  {
    id: "o2",
    productId: "p2",
    productName: "Rice",
    quantity: 100,
    totalCost: 6000,
    farmer: "Priya Sharma",
    buyerId: "b2",
    date: "2024-02-08",
    status: "Delivered",
  },
];

export const forecastData: ForecastData[] = [
  { crop: "Tomatoes", demand: 450, supply: 380 },
  { crop: "Wheat", demand: 850, supply: 920 },
  { crop: "Rice", demand: 620, supply: 580 },
  { crop: "Mango", demand: 280, supply: 250 },
  { crop: "Onions", demand: 720, supply: 680 },
];

export const forecastTrend = [
  { week: "Week 1", demand: 400, supply: 350 },
  { week: "Week 2", demand: 450, supply: 420 },
  { week: "Week 3", demand: 480, supply: 500 },
  { week: "Week 4", demand: 520, supply: 480 },
  { week: "Week 5", demand: 580, supply: 550 },
  { week: "Week 6", demand: 620, supply: 610 },
];
