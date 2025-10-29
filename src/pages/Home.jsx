import React, { useEffect } from "react";
import Greetings from "../components/Home/Greetings";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import MiniCard from "../components/Home/MiniCard";
import RecentOrders from "../components/Home/RecentOrders";
import PopularDishes from "../components/Home/PopularDishes";

const Home = () => {

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
                <p className="text-2xl font-bold text-gray-900">KSH512</p>
                <p className="text-green-600 text-sm">+1.6% from yesterday</p>
              </div>
              <BsCashCoin className="text-green-500 text-3xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">16</p>
                <p className="text-blue-600 text-sm">+3.6% from yesterday</p>
              </div>
              <GrInProgress className="text-blue-500 text-3xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Tables</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-yellow-600 text-sm">Currently occupied</p>
              </div>
              <GrInProgress className="text-yellow-500 text-3xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Today's Orders</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
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
            <RecentOrders />
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