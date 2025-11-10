import React, { useEffect } from "react";
import Greetings from "../components/Home/Greetings";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import MiniCard from "../components/Home/MiniCard";
import RecentOrdersHomeNew from "../components/Home/RecentOrdersHomeNew";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../https/Index.js";
import PopularDishes from "../components/Home/PopularDishes";

const Home = () => {
    // Fetch orders for stats calculation
    const { data: ordersData } = useQuery({
      queryKey: ["orders"],
      queryFn: async () => {
        return await getOrders();
      },
      placeholderData: [],
    });

    // Calculate stats from orders data
    const orders = ordersData?.data?.data || ordersData?.data?.orders || ordersData?.orders || ordersData?.data || [];
    const totalEarnings = orders.reduce((sum, order) => sum + (order.total_price || order.total || 0), 0);
    const inProgressOrders = orders.filter(order => (order.orderStatus || order.status) !== "Ready").length;
    const activeTables = [...new Set(orders.map(order => order.table?.tableNo || order.tableNo).filter(Boolean))].length;
    const todaysOrders = orders.length;

    useEffect(() => {
      document.title = "POS | Home"
    }, [])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Greetings />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">KSH{totalEarnings || 512}</p>
                <p className="text-green-600 text-sm">+1.6% from yesterday</p>
              </div>
              <BsCashCoin className="text-green-500 text-3xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{inProgressOrders || 16}</p>
                <p className="text-blue-600 text-sm">+3.6% from yesterday</p>
              </div>
              <GrInProgress className="text-blue-500 text-3xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Tables</p>
                <p className="text-2xl font-bold text-gray-900">{activeTables || 8}</p>
                <p className="text-yellow-600 text-sm">Currently occupied</p>
              </div>
              <GrInProgress className="text-yellow-500 text-3xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Today's Orders</p>
                <p className="text-2xl font-bold text-gray-900">{todaysOrders || 24}</p>
                <p className="text-purple-600 text-sm">+12% from yesterday</p>
              </div>
              <GrInProgress className="text-purple-500 text-3xl" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders - Takes 2 columns */}
          <div className="lg:col-span-2">
            <RecentOrdersHomeNew />
          </div>

          {/* Popular Dishes - Takes 1 column */}
          <div className="lg:col-span-1">
            <PopularDishes />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;