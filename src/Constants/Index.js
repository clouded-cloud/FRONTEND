import butterChicken from '../assets/images/butter-chicken-4.jpg';
import palakPaneer from '../assets/images/Saag-Paneer-1.jpg';
import biryani from '../assets/images/hyderabadibiryani.jpg';
import masalaDosa from '../assets/images/masala-dosa.jpg';
import choleBhature from '../assets/images/chole-bhature.jpg';
import rajmaChawal from '../assets/images/rajma-chawal-1.jpg';
import paneerTikka from '../assets/images/paneer-tika.webp';
import gulabJamun from '../assets/images/gulab-jamun.webp';
import pooriSabji from '../assets/images/poori-sabji.webp';
import roganJosh from '../assets/images/rogan-josh.jpg';

export const popularDishes = [
    {
      id: 1,
      image: butterChicken,
      name: 'Ugali na Nyama',
      numberOfOrders: 250,
    },
    {
      id: 2,
      image: palakPaneer,
      name: 'Pilau',
      numberOfOrders: 190,
    },
    {
      id: 3,
      image: biryani,
      name: 'Kachumbari',
      numberOfOrders: 300,
    },
    {
      id: 4,
      image: masalaDosa,
      name: 'Mandazi',
      numberOfOrders: 220,
    },
    {
      id: 5,
      image: choleBhature,
      name: 'Sukuma Wiki',
      numberOfOrders: 270,
    },
    {
      id: 6,
      image: rajmaChawal,
      name: 'Chapati',
      numberOfOrders: 180,
    },
    {
      id: 7,
      image: paneerTikka,
      name: 'Samusa',
      numberOfOrders: 210,
    },
    {
      id: 8,
      image: gulabJamun,
      name: 'Halva',
      numberOfOrders: 310,
    },
    {
      id: 9,
      image: pooriSabji,
      name: 'Mshikaki',
      numberOfOrders: 140,
    },
    {
      id: 10,
      image: roganJosh,
      name: 'Biriani',
      numberOfOrders: 160,
    },
  ];


export const tables = [
    { id: 1, name: "Table 1", status: "Booked", initial: "AM", seats: 4 },
    { id: 2, name: "Table 2", status: "Available", initial: "MB", seats: 6 },
    { id: 3, name: "Table 3", status: "Booked", initial: "JS", seats: 2 },
    { id: 4, name: "Table 4", status: "Available", initial: "HR", seats: 4 },
    { id: 5, name: "Table 5", status: "Booked", initial: "PL", seats: 3 },
    { id: 6, name: "Table 6", status: "Available", initial: "RT", seats: 4 },
    { id: 7, name: "Table 7", status: "Booked", initial: "LC", seats: 5 },
    { id: 8, name: "Table 8", status: "Available", initial: "DP", seats: 5 },
    { id: 9, name: "Table 9", status: "Booked", initial: "NK", seats: 6 },
    { id: 10, name: "Table 10", status: "Available", initial: "SB", seats: 6 },
    { id: 11, name: "Table 11", status: "Booked", initial: "GT", seats: 4 },
    { id: 12, name: "Table 12", status: "Available", initial: "JS", seats: 6 },
    { id: 13, name: "Table 13", status: "Booked", initial: "EK", seats: 2 },
    { id: 14, name: "Table 14", status: "Available", initial: "QN", seats: 6 },
    { id: 15, name: "Table 15", status: "Booked", initial: "TW", seats: 3 }
  ];
  
export const startersItem = [
    {
      id: 1,
      name: "Samusa",
      price: 375,
      category: "Vegetarian"
    },
    {
      id: 2,
      name: "Mshikaki",
      price: 450,
      category: "Non-Vegetarian"
    },
    {
      id: 3,
      name: "Kachumbari",
      price: 525,
      category: "Vegetarian"
    },
    {
      id: 4,
      name: "Ndizi Mbichi",
      price: 150,
      category: "Vegetarian"
    },
    {
      id: 5,
      name: "Chipsi Mayai",
      price: 180,
      category: "Vegetarian"
    },
    {
      id: 6,
      name: "Mishkaki ya Kuku",
      price: 330,
      category: "Non-Vegetarian"
    }
  ];
  
export const mainCourse = [
  {
    id: 1,
    name: "Nyama Choma",
    price: 600,
    category: "Non-Vegetarian"
  },
  {
    id: 2,
    name: "Ugali na Sukuma Wiki",
    price: 525,
    category: "Vegetarian"
  },
  {
    id: 3,
    name: "Pilau ya Kuku",
    price: 675,
    category: "Non-Vegetarian"
  },
  {
    id: 4,
    name: "Maharagwe",
    price: 270,
    category: "Vegetarian"
  },
  {
    id: 5,
    name: "Mchuzi wa Samaki",
    price: 450,
    category: "Non-Vegetarian"
  },
  {
    id: 6,
    name: "Biriani ya Ng'ombe",
    price: 750,
    category: "Non-Vegetarian"
  }
];

export const beverages = [
  {
    id: 1,
    name: "Chai",
    price: 75,
    category: "Hot"
  },
  {
    id: 2,
    name: "Lemon Soda",
    price: 120,
    category: "Cold"
  },
  {
    id: 3,
    name: "Mango Juice",
    price: 180,
    category: "Cold"
  },
  {
    id: 4,
    name: "Cold Coffee",
    price: 225,
    category: "Cold"
  },
  {
    id: 5,
    name: "Fresh Lime Water",
    price: 90,
    category: "Cold"
  },
  {
    id: 6,
    name: "Iced Tea",
    price: 150,
    category: "Cold"
  }
];

export const soups = [
  {
    id: 1,
    name: "Vegetable Soup",
    price: 180,
    category: "Vegetarian"
  },
  {
    id: 2,
    name: "Sweet Corn Soup",
    price: 195,
    category: "Vegetarian"
  },
  {
    id: 3,
    name: "Hot & Sour Soup",
    price: 210,
    category: "Vegetarian"
  },
  {
    id: 4,
    name: "Chicken Soup",
    price: 240,
    category: "Non-Vegetarian"
  },
  {
    id: 5,
    name: "Mushroom Soup",
    price: 225,
    category: "Vegetarian"
  },
  {
    id: 6,
    name: "Lemon Coriander Soup",
    price: 165,
    category: "Vegetarian"
  }
];

export const desserts = [
  {
    id: 1,
    name: "Mihogo ya Sukari",
    price: 150,
    category: "Vegetarian"
  },
  {
    id: 2,
    name: "Mkate wa Sinia",
    price: 225,
    category: "Vegetarian"
  },
  {
    id: 3,
    name: "Keki ya Chokoleti",
    price: 375,
    category: "Vegetarian"
  },
  {
    id: 4,
    name: "Uji wa Mkate",
    price: 270,
    category: "Vegetarian"
  }
];

export const pizzas = [
  {
    id: 1,
    name: "Chapati",
    price: 525,
    category: "Vegetarian"
  },
  {
    id: 2,
    name: "Mandazi",
    price: 600,
    category: "Vegetarian"
  },
  {
    id: 3,
    name: "Samosa",
    price: 675,
    category: "Vegetarian"
  }
];

export const alcoholicDrinks = [
  {
    id: 1,
    name: "Beer",
    price: 300,
    category: "Alcoholic"
  },
  {
    id: 2,
    name: "Whiskey",
    price: 750,
    category: "Alcoholic"
  },
  {
    id: 3,
    name: "Vodka",
    price: 675,
    category: "Alcoholic"
  },
  {
    id: 4,
    name: "Rum",
    price: 525,
    category: "Alcoholic"
  },
  {
    id: 5,
    name: "Tequila",
    price: 900,
    category: "Alcoholic"
  },
  {
    id: 6,
    name: "Cocktail",
    price: 600,
    category: "Alcoholic"
  }
];

export const salads = [
  {
    id: 1,
    name: "Kachumbari",
    price: 300,
    category: "Vegetarian"
  },
  {
    id: 2,
    name: "Greek Salad",
    price: 375,
    category: "Vegetarian"
  },
  {
    id: 3,
    name: "Fruit Salad",
    price: 225,
    category: "Vegetarian"
  },
  {
    id: 4,
    name: "Chicken Salad",
    price: 450,
    category: "Non-Vegetarian"
  },
  {
    id: 5,
    name: "Tuna Salad",
    price: 525,
    category: "Non-Vegetarian"
  }
];


export const menus = [
  { id: 1, name: "Starters", bgColor: "#b73e3e" ,icon: "🍲", items: startersItem },
  { id: 2, name: "Main Course", bgColor: "#5b45b0" ,icon: "🍛", items: mainCourse },
  { id: 3, name: "Beverages", bgColor: "#7f167f" ,icon: "🍹", items: beverages },
  { id: 4, name: "Soups", bgColor: "#735f32" ,icon: "🍜", items: soups },
  { id: 5, name: "Desserts", bgColor: "#1d2569" ,icon: "🍰", items: desserts },
  { id: 6, name: "Pizzas", bgColor: "#285430" ,icon: "🍕", items: pizzas },
  { id: 7, name: "Alcoholic Drinks", bgColor: "#b73e3e" ,icon: "🍺", items: alcoholicDrinks },
  { id: 8, name: "Salads", bgColor: "#5b45b0" ,icon: "🥗", items: salads }
]

export const metricsData = [
  { title: "Revenue", value: "₹50,846.90", percentage: "12%", color: "#025cca", isIncrease: false },
  { title: "Outbound Clicks", value: "10,342", percentage: "16%", color: "#02ca3a", isIncrease: true },
  { title: "Total Customer", value: "19,720", percentage: "10%", color: "#f6b100", isIncrease: true },
  { title: "Event Count", value: "20,000", percentage: "10%", color: "#be3e3f", isIncrease: false },
];

export const itemsData = [
  { title: "Total Categories", value: "8", percentage: "12%", color: "#5b45b0", isIncrease: false },
  { title: "Total Dishes", value: "50", percentage: "12%", color: "#285430", isIncrease: true },
  { title: "Active Orders", value: "12", percentage: "12%", color: "#735f32", isIncrease: true },
  { title: "Total Tables", value: "10", percentage: "8%", color: "#7f167f", isIncrease: true }
];

export const orders = [
  {
    id: "101",
    customer: "Amrit Raj",
    status: "Ready",
    dateTime: "January 18, 2025 08:32 PM",
    items: 8,
    tableNo: 3,
    total: 250.0,
  },
  {
    id: "102",
    customer: "John Doe",
    status: "In Progress",
    dateTime: "January 18, 2025 08:45 PM",
    items: 5,
    tableNo: 4,
    total: 180.0,
  },
  {
    id: "103",
    customer: "Emma Smith",
    status: "Ready",
    dateTime: "January 18, 2025 09:00 PM",
    items: 3,
    tableNo: 5,
    total: 120.0,
  },
  {
    id: "104",
    customer: "Chris Brown",
    status: "In Progress",
    dateTime: "January 18, 2025 09:15 PM",
    items: 6,
    tableNo: 6,
    total: 220.0,
  },
];

