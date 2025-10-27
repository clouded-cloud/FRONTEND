import React from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarName, getBgColor } from "../../utils"
import { useDispatch } from "react-redux";
import { updateTable } from "../../redux/slices/customerSlice";
import { FaLongArrowAltRight } from "react-icons/fa";

const TableCard = ({id, name, status, initials, seats}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClick = (name) => {
    if(status === "Booked") return;

    const table = { tableId: id, tableNo: name }
    dispatch(updateTable({table}))
    navigate(`/menu`);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "booked":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div
      onClick={() => handleClick(name)}
      className={`bg-white hover:bg-gray-50 border border-gray-200 p-6 rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
        status === "Booked" ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-gray-900 text-xl font-semibold flex items-center">
          Table {name}
          {status !== "Booked" && <FaLongArrowAltRight className="text-blue-500 ml-2" />}
        </h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      <div className="flex items-center justify-center mb-4">
        <div
          className="text-white rounded-full p-6 text-xl font-semibold flex items-center justify-center"
          style={{backgroundColor: initials ? getBgColor() : "#9CA3AF"}}
        >
          {getAvatarName(initials) || "N/A"}
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Seats: <span className="text-gray-900 font-medium">{seats}</span>
        </p>
      </div>
    </div>
  );
};

export default TableCard;