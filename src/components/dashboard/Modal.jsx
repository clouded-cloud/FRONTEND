import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import { addTable } from "../../https/Index.js";
import { enqueueSnackbar } from "notistack"

const Modal = ({ setIsTableModalOpen, type = "table" }) => {
  const [formData, setFormData] = useState(
    type === "table" ? { tableNo: "", seats: "" } :
    type === "category" ? { name: "", bgColor: "", icon: "" } :
    { name: "", price: "", category: "", categoryId: "" }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // For now, just close the modal. Add API calls later if needed.
    setIsTableModalOpen(false);
    enqueueSnackbar(`${type.charAt(0).toUpperCase() + type.slice(1)} added successfully`, { variant: "success" });
  };

  const handleCloseModal = () => {
    setIsTableModalOpen(false);
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-262626 p-6 rounded-lg shadow-lg w-96"
      >
        {/* Modal Header */}

        <div className="flex justify-between item-center mb-4">
          <h2 className="text-f5f5f5 text-xl font-semibold">
            Add {type.charAt(0).toUpperCase() + type.slice(1)}
          </h2>
          <button
            onClick={handleCloseModal}
            className="text-f5f5f5 hover:text-red-500"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Modal Body */}

        <form onSubmit={handleSubmit} className="space-y-4 mt-10">
          {type === "table" && (
            <>
              <div>
                <label className="block text-ababab mb-2 mt-3 text-sm font-medium">
                  Table Number
                </label>
                <div className="flex item-center rounded-lg p-5 px-4 bg-1f1f1f">
                  <input
                    type="number"
                    name="tableNo"
                    value={formData.tableNo}
                    onChange={handleInputChange}
                    className="bg-transparent flex-1 text-white focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-ababab mb-2 mt-3 text-sm font-medium">
                  Number of Seats
                </label>
                <div className="flex item-center rounded-lg p-5 px-4 bg-1f1f1f">
                  <input
                    type="number"
                    name="seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    className="bg-transparent flex-1 text-white focus:outline-none"
                    required
                  />
                </div>
              </div>
            </>
          )}
          {type === "category" && (
            <>
              <div>
                <label className="block text-ababab mb-2 mt-3 text-sm font-medium">
                  Category Name
                </label>
                <div className="flex item-center rounded-lg p-5 px-4 bg-1f1f1f">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-transparent flex-1 text-white focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-ababab mb-2 mt-3 text-sm font-medium">
                  Background Color
                </label>
                <div className="flex item-center rounded-lg p-5 px-4 bg-1f1f1f">
                  <input
                    type="text"
                    name="bgColor"
                    value={formData.bgColor}
                    onChange={handleInputChange}
                    className="bg-transparent flex-1 text-white focus:outline-none"
                    placeholder="#b73e3e"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-ababab mb-2 mt-3 text-sm font-medium">
                  Icon (emoji)
                </label>
                <div className="flex item-center rounded-lg p-5 px-4 bg-1f1f1f">
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="bg-transparent flex-1 text-white focus:outline-none"
                    placeholder="🍲"
                    required
                  />
                </div>
              </div>
            </>
          )}
          {type === "dish" && (
            <>
              <div>
                <label className="block text-ababab mb-2 mt-3 text-sm font-medium">
                  Dish Name
                </label>
                <div className="flex item-center rounded-lg p-5 px-4 bg-1f1f1f">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-transparent flex-1 text-white focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-ababab mb-2 mt-3 text-sm font-medium">
                  Price
                </label>
                <div className="flex item-center rounded-lg p-5 px-4 bg-1f1f1f">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="bg-transparent flex-1 text-white focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-ababab mb-2 mt-3 text-sm font-medium">
                  Category
                </label>
                <div className="flex item-center rounded-lg p-5 px-4 bg-1f1f1f">
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="bg-transparent flex-1 text-white focus:outline-none"
                    placeholder="Vegetarian"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full rounded-lg mt-10 mb-6 py-3 text-lg bg-yellow-400 text-gray-900 font-bold"
          >
            Add {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Modal;