import React, { useState, useEffect } from "react";
import { MdTableBar, MdCategory } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import Metrics from "../components/dashboard/Metrics";
import RecentOrders from "../components/dashboard/RecentOrders";
import Payments from "../components/dashboard/Payments";
import Modal from "../components/dashboard/Modal";

const buttons = [];

const tabs = ["Metrics", "Orders", "Payments"];

const Dashboard = () => {

  useEffect(() => {
    document.title = "POS | Admin Dashboard"
  }, [])

  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Metrics");

  const handleOpenModal = (action) => {
    if (action === "table") setIsTableModalOpen(true);
    if (action === "category") setIsCategoryModalOpen(true);
    if (action === "dishes") setIsDishModalOpen(true);
  };

  return (
    <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)]">
      <div className="container mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between py-8 lg:py-14 px-4 sm:px-6 gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {buttons.map(({ label, icon, action }) => {
            return (
              <button
                key={action}
                onClick={() => handleOpenModal(action)}
                className="bg-[#1a1a1a] hover:bg-[#262626] px-4 sm:px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-sm sm:text-md flex items-center gap-2"
              >
                {label} {icon}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {tabs.map((tab) => {
            return (
              <button
                key={tab}
                className={`
                px-4 sm:px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-sm sm:text-md flex items-center gap-2 ${
                  activeTab === tab
                    ? "bg-[#262626]"
                    : "bg-[#1a1a1a] hover:bg-[#262626]"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "Metrics" && <Metrics />}
      {activeTab === "Orders" && <RecentOrders />}
      {activeTab === "Payments" && <Payments />}

      {isTableModalOpen && <Modal setIsTableModalOpen={setIsTableModalOpen} />}
      {isCategoryModalOpen && <Modal setIsTableModalOpen={setIsCategoryModalOpen} type="category" />}
      {isDishModalOpen && <Modal setIsTableModalOpen={setIsDishModalOpen} type="dish" />}
    </div>
  );
};

export default Dashboard;