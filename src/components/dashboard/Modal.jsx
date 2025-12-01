import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { addNewTable } from "../../redux/slices/tablesSlice";
import { addTable } from "../../https/Index";
import { addCategoryAsync, addDishAsync } from "../../redux/slices/menuSlice";
import { useQueryClient } from "@tanstack/react-query";

const Modal = ({ setIsOpen, type = "table", onSubmit, menus = [] }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(
    type === "table" ? { tableNo: "", seats: "" } :
    type === "category" ? { name: "", bgColor: "", icon: "" } :
    { name: "", price: "", category: "", categoryId: "" }
  );

  useEffect(() => {
    setFormData(
      type === "table" ? { tableNo: "", seats: "" } :
      type === "category" ? { name: "", bgColor: "", icon: "" } :
      { name: "", price: "", category: "", categoryId: "" }
    );
  }, [type]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
      setIsOpen(false);
      return;
    }
    try {
      if (type === "table") {
        // Persist table to backend then update redux
        const payload = { tableNo: parseInt(formData.tableNo, 10), seats: parseInt(formData.seats, 10) };
        // Basic validation
        if (!payload.tableNo || !payload.seats) {
          enqueueSnackbar("Invalid table number or seats", { variant: "warning" });
          return;
        }

        // Try server first; fallback to local state only if server fails
        try {
          const resp = await addTable(payload);
          // Normalize response to a table object when possible
          const created = resp?.data?.data || resp?.data || resp;

          // If server returns created table object with id and fields, push it to redux
          if (created && (created.tableNo || created.tableNo === 0 || created.id || created._id)) {
            dispatch(addNewTable(created));
          } else {
            // Server didn't return a table object - still dispatch a local entry using payload
            dispatch(addNewTable(payload));
          }
        } catch (err) {
          console.error("Failed to persist table to backend, falling back to local store:", err);
          enqueueSnackbar("Failed to save table to server — added locally.", { variant: "warning" });
          // fallback: add locally so UX is preserved
          dispatch(addNewTable(payload));
        }
      } else if (type === "category") {
        await dispatch(addCategoryAsync(formData)).unwrap();
      } else if (type === "dish") {
        await dispatch(addDishAsync({ ...formData, categoryId: parseInt(formData.categoryId) })).unwrap();
      }

      enqueueSnackbar(`${type.charAt(0).toUpperCase() + type.slice(1)} added successfully`, { variant: "success" });

      // Invalidate and refetch queries
      if (type === "table") {
        queryClient.invalidateQueries({ queryKey: ["tables"] });
      } else if (type === "category") {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      } else if (type === "dish") {
        queryClient.invalidateQueries({ queryKey: ["dishes"] });
        queryClient.invalidateQueries({ queryKey: ["menu"] });
      }

      setIsOpen(false);
    } catch (error) {
      console.error("Error adding item:", error);
      enqueueSnackbar(`Failed to add ${type}. Please try again.`, { variant: "error" });
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="modal-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="modal-container"
      >
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            Add {type.charAt(0).toUpperCase() + type.slice(1)}
          </h2>
          <button
            onClick={handleCloseModal}
            className="close-button"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="modal-form">
          {type === "table" && (
            <>
              <div className="form-group">
                <label className="form-label">
                  Table Number
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    name="tableNo"
                    value={formData.tableNo}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter table number"
                    required
                    min="1"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Number of Seats
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    name="seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter number of seats"
                    required
                    min="1"
                  />
                </div>
              </div>
            </>
          )}
          {type === "category" && (
            <>
              <div className="form-group">
                <label className="form-label">
                  Category Name
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter category name"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Background Color
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="bgColor"
                    value={formData.bgColor}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="#4a7c59"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Icon (emoji)
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="🍲"
                    required
                  />
                </div>
              </div>
            </>
          )}
          {type === "dish" && (
            <>
              <div className="form-group">
                <label className="form-label">
                  Dish Name
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter dish name"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Price
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="0.00"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Category
                </label>
                <div className="input-wrapper">
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="">Select a category</option>
                    {(() => {
                      // Guard: accept either an array or API wrapper objects
                      const list = Array.isArray(menus)
                        ? menus
                        : (menus?.data?.data || menus?.data || []);

                      // Read recent category names from localStorage (if available)
                      let recentNames = [];
                      try {
                        recentNames = JSON.parse(localStorage.getItem("recentCategories") || "[]");
                      } catch (e) {
                        recentNames = [];
                      }

                      const recentList = list.filter((m) => recentNames.includes(m.name));
                      const otherList = list.filter((m) => !recentNames.includes(m.name));

                      return (
                        <>
                          {recentList.length > 0 && (
                            <optgroup label="Recent categories">
                              {recentList.map((menu) => (
                                <option key={`recent-${menu.id || menu._id}`} value={menu.id || menu._id}>
                                  {menu.name}
                                </option>
                              ))}
                            </optgroup>
                          )}

                          {otherList.map((menu) => (
                            <option key={menu.id || menu._id} value={menu.id || menu._id}>
                              {menu.name}
                            </option>
                          ))}
                        </>
                      );
                    })()}
                  </select>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="submit-button"
          >
            Add {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        </form>
      </motion.div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1rem;
          backdrop-filter: blur(4px);
        }

        .modal-container {
          background: var(--card-bg);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          width: 100%;
          max-width: 28rem;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .close-button {
          color: var(--text-secondary);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          color: var(--text-primary);
          background: var(--border-color);
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          color: var(--text-primary);
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0;
        }

        .input-wrapper {
          background: var(--input-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 12px;
          padding: 0.875rem 1rem;
          transition: all 0.2s ease;
        }

        .input-wrapper:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--focus-ring);
        }

        .form-input {
          background: transparent;
          border: none;
          outline: none;
          width: 100%;
          color: var(--text-primary);
          font-size: 1rem;
          font-family: 'Inter', sans-serif;
        }

        .form-input::placeholder {
          color: var(--text-muted);
        }

        .form-input:focus {
          outline: none;
        }

        select.form-input {
          cursor: pointer;
          background: transparent;
        }

        select.form-input option {
          background: var(--card-bg);
          color: var(--text-primary);
          padding: 0.5rem;
        }

        select.form-input optgroup {
          background: var(--bg-body);
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.875rem;
        }

        .submit-button {
          width: 100%;
          padding: 1rem 1.5rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 0.5rem;
          position: relative;
          overflow: hidden;
        }

        .submit-button:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(44, 85, 48, 0.3);
        }

        .submit-button:active {
          transform: translateY(0);
        }

        .submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .submit-button:hover::before {
          left: 100%;
        }

        /* Responsive Design */
        @media (max-width: 640px) {
          .modal-container {
            padding: 1.5rem;
            margin: 1rem;
          }

          .modal-title {
            font-size: 1.25rem;
          }

          .input-wrapper {
            padding: 0.75rem 0.875rem;
          }

          .form-input {
            font-size: 0.95rem;
          }

          .submit-button {
            padding: 0.875rem 1.25rem;
            font-size: 0.95rem;
          }
        }

        @media (max-width: 480px) {
          .modal-container {
            padding: 1.25rem;
          }

          .modal-header {
            margin-bottom: 1.5rem;
          }

          .modal-form {
            gap: 1.25rem;
          }
        }

        /* Custom scrollbar for modal */
        .modal-container::-webkit-scrollbar {
          width: 6px;
        }

        .modal-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .modal-container::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
        }

        .modal-container::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }

        /* Animation for form elements */
        .form-group {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Stagger animation for multiple form groups */
        .modal-form .form-group:nth-child(1) { animation-delay: 0.1s; }
        .modal-form .form-group:nth-child(2) { animation-delay: 0.2s; }
        .modal-form .form-group:nth-child(3) { animation-delay: 0.3s; }
        .modal-form .submit-button { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
};

export default Modal;