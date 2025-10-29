import React from "react";

const Payments = () => {
  return (
    <div className="container mx-auto py-2 px-6 md:px-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">
            Payment Overview
          </h2>
          <p className="text-sm text-[#ababab]">
            Track payment methods and transaction details.
          </p>
        </div>
        <button className="flex items-center gap-1 px-4 py-2 rounded-md text-[#f5f5f5] bg-[#1a1a1a]">
          Last 1 Month
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="4"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="shadow-sm rounded-lg p-4 bg-[#025cca]">
          <div className="flex justify-between items-center">
            <p className="font-medium text-xs text-[#f5f5f5]">Total Payments</p>
            <div className="flex items-center gap-1">
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                style={{ color: "#f5f5f5" }}
              >
                <path d="M5 15l7-7 7 7" />
              </svg>
              <p className="font-medium text-xs text-[#f5f5f5]">15%</p>
            </div>
          </div>
          <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">KSH1,25,000</p>
        </div>

        <div className="shadow-sm rounded-lg p-4 bg-[#02ca3a]">
          <div className="flex justify-between items-center">
            <p className="font-medium text-xs text-[#f5f5f5]">Cash Payments</p>
            <div className="flex items-center gap-1">
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                style={{ color: "#f5f5f5" }}
              >
                <path d="M5 15l7-7 7 7" />
              </svg>
              <p className="font-medium text-xs text-[#f5f5f5]">20%</p>
            </div>
          </div>
          <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">KSH75,000</p>
        </div>

        <div className="shadow-sm rounded-lg p-4 bg-[#f6b100]">
          <div className="flex justify-between items-center">
            <p className="font-medium text-xs text-[#f5f5f5]">Card Payments</p>
            <div className="flex items-center gap-1">
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                style={{ color: "#f5f5f5" }}
              >
                <path d="M5 15l7-7 7 7" />
              </svg>
              <p className="font-medium text-xs text-[#f5f5f5]">10%</p>
            </div>
          </div>
          <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">KSH40,000</p>
        </div>

        <div className="shadow-sm rounded-lg p-4 bg-[#be3e3f]">
          <div className="flex justify-between items-center">
            <p className="font-medium text-xs text-[#f5f5f5]">UPI Payments</p>
            <div className="flex items-center gap-1">
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                style={{ color: "#f5f5f5" }}
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
              <p className="font-medium text-xs text-[#f5f5f5]">5%</p>
            </div>
          </div>
          <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">KSH10,000</p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-semibold text-[#f5f5f5] text-xl mb-4">
          Recent Transactions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-f5f5f5">
            <thead className="bg-[#333] text-ababab">
              <tr>
                <th className="p-3">Transaction ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Method</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-600 hover:bg-[#333]">
                <td className="p-4">#TXN001</td>
                <td className="p-4">Amrit Raj</td>
                <td className="p-4">KSH250</td>
                <td className="p-4">Cash</td>
                <td className="p-4">Jan 18, 2025 08:32 PM</td>
                <td className="p-4 text-green-500">Completed</td>
              </tr>
              <tr className="border-b border-gray-600 hover:bg-[#333]">
                <td className="p-4">#TXN002</td>
                <td className="p-4">John Doe</td>
                <td className="p-4">KSH180</td>
                <td className="p-4">Card</td>
                <td className="p-4">Jan 18, 2025 08:45 PM</td>
                <td className="p-4 text-green-500">Completed</td>
              </tr>
              <tr className="border-b border-gray-600 hover:bg-[#333]">
                <td className="p-4">#TXN003</td>
                <td className="p-4">Emma Smith</td>
                <td className="p-4">KSH120</td>
                <td className="p-4">UPI</td>
                <td className="p-4">Jan 18, 2025 09:00 PM</td>
                <td className="p-4 text-green-500">Completed</td>
              </tr>
              <tr className="border-b border-gray-600 hover:bg-[#333]">
                <td className="p-4">#TXN004</td>
                <td className="p-4">Chris Brown</td>
                <td className="p-4">KSH220</td>
                <td className="p-4">Cash</td>
                <td className="p-4">Jan 18, 2025 09:15 PM</td>
                <td className="p-4 text-yellow-500">Pending</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
