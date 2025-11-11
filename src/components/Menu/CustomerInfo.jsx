import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { formatDate, getAvatarName } from "../../utils/index.js";
import { setCustomer } from "../../redux/slices/customerSlice";

const CustomerInfo = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const customerData = useSelector((state) => state.customer);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(customerData.customerName || "");
  const [phone, setPhone] = useState(customerData.customerPhone || "");
  const [guests, setGuests] = useState(customerData.guests || 0);

  const handleSave = () => {
    dispatch(setCustomer({ name, phone, guests: parseInt(guests) }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(customerData.customerName || "");
    setPhone(customerData.customerPhone || "");
    setGuests(customerData.guests || 0);
    setIsEditing(false);
  };

  return (
    <div className="px-4 py-3">
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#ababab] font-medium mb-1">Customer Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1f1f1f] text-[#f5f5f5] px-3 py-2 rounded-lg border border-[#383737] focus:border-[#f6b100] focus:outline-none"
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <label className="block text-xs text-[#ababab] font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#1f1f1f] text-[#f5f5f5] px-3 py-2 rounded-lg border border-[#383737] focus:border-[#f6b100] focus:outline-none"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-xs text-[#ababab] font-medium mb-1">Number of Guests</label>
            <input
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              min="1"
              className="w-full bg-[#1f1f1f] text-[#f5f5f5] px-3 py-2 rounded-lg border border-[#383737] focus:border-[#f6b100] focus:outline-none"
              placeholder="Enter number of guests"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-[#f6b100] text-[#1f1f1f] px-4 py-2 rounded-lg font-semibold flex-1"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-[#383737] text-[#f5f5f5] px-4 py-2 rounded-lg font-semibold flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start">
            <h1 className="text-md text-[#f5f5f5] font-semibold tracking-wide">
              {customerData.customerName || "Customer Name"}
            </h1>
            <p className="text-xs text-[#ababab] font-medium mt-1">
              #{customerData.orderId || "N/A"} / Dine in
            </p>
            <p className="text-xs text-[#ababab] font-medium mt-2">
              Phone: {customerData.customerPhone || "N/A"}
            </p>
            <p className="text-xs text-[#ababab] font-medium mt-2">
              Guests: {customerData.guests || "N/A"}
            </p>
            <p className="text-xs text-[#ababab] font-medium mt-2">
              {formatDate(dateTime)}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button className="bg-[#f6b100] p-3 text-xl font-bold rounded-lg">
              {getAvatarName(customerData.customerName) || "CN"}
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#383737] text-[#f5f5f5] px-3 py-1 rounded-lg text-sm font-medium"
            >
              Edit Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerInfo;
