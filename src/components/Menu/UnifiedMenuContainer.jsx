import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity, clearCart, addOrderToHistory } from '../../redux/slices/cartslice';
import { updateCustomer } from '../../redux/slices/customerSlice';
import { enqueueSnackbar } from 'notistack';
import { useLanguage } from '../../contexts/LanguageContext';
import { useDarkMode } from '../../contexts/DarkModeContext';
import QRCode from '../Shared/QRCode';
import {
  FaUser,
  FaShoppingCart,
  FaEdit,
  FaSave,
  FaTrash,
  FaPlus,
  FaMinus,
  FaSearch,
  FaUtensils,
  FaMoon,
  FaSun,
  FaPrint,
  FaQrcode,
  FaWhatsapp
} from 'react-icons/fa';

const UnifiedMenuContainer = () => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart.items || []);
  const customer = useSelector(state => state.customer);
  const menus = useSelector(state => state.menu);

  // Contexts
  const { t, changeLanguage, language } = useLanguage();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Component state
  const [selectedCategory, setSelectedCategory] = useState(menus?.[0]?.name || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    customerName: customer.customerName || '',
    phoneNumber: customer.phoneNumber || '',
    orderId: customer.orderId || '',
    orderType: customer.orderType || 'Dine in'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate cart totals
  const cartSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const taxAmount = cartSubtotal * 0.08; // 8% tax
  const cartTotal = cartSubtotal + taxAmount;
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Filter menu items based on search
  const getFilteredItems = () => {
    if (!Array.isArray(menus)) return [];
    const category = menus.find(menu => menu.name === selectedCategory);
    if (!category?.items) return [];

    if (!searchTerm) return category.items;

    return category.items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Handle cart operations
  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    enqueueSnackbar(`${item.name} added to cart!`, { variant: 'success' });
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity < 1) {
      dispatch(removeFromCart(id));
      enqueueSnackbar('Item removed from cart', { variant: 'info' });
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    enqueueSnackbar('Cart cleared', { variant: 'info' });
  };

  // Handle customer operations
  const handleCustomerFormChange = (field, value) => {
    setCustomerForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveCustomer = () => {
    if (!customerForm.customerName.trim()) {
      enqueueSnackbar('Customer name is required', { variant: 'error' });
      return;
    }

    dispatch(updateCustomer(customerForm));
    setIsEditingCustomer(false);
    enqueueSnackbar('Customer details saved', { variant: 'success' });
  };

  const handleCancelEdit = () => {
    setCustomerForm({
      customerName: customer.customerName || '',
      phoneNumber: customer.phoneNumber || '',
      orderId: customer.orderId || '',
      orderType: customer.orderType || 'Dine in'
    });
    setIsEditingCustomer(false);
  };

  // WhatsApp integration functions
  const generateWhatsAppMessage = () => {
    const orderNumber = customerForm.orderId || `ORD-${Date.now()}`;
    const customerName = customerForm.customerName || 'Valued Customer';

    let message = `*🍽️ NEW ORDER - ${orderNumber}*\n\n`;
    message += `*Customer:* ${customerName}\n`;
    message += `*Order Type:* ${customerForm.orderType}\n`;
    message += `*Date:* ${new Date().toLocaleDateString()}\n\n`;

    message += `*📋 ORDER DETAILS:*\n`;
    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.name}* - Qty: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\n*💰 BILL SUMMARY:*\n`;
    message += `Subtotal: $${cartSubtotal.toFixed(2)}\n`;
    message += `Tax (8%): $${taxAmount.toFixed(2)}\n`;
    message += `*Total: $${cartTotal.toFixed(2)}*\n\n`;

    message += `Thank you for your order! 🎉\n`;
    message += `Please confirm receipt of this order.`;

    return message;
  };

  const handleSendOrderViaWhatsApp = () => {
    if (!customerForm.phoneNumber) {
      enqueueSnackbar(t('pleaseEnterPhoneNumber'), { variant: 'error' });
      return;
    }

    if (cart.length === 0) {
      enqueueSnackbar(t('cartIsEmpty'), { variant: 'error' });
      return;
    }

    const message = generateWhatsAppMessage();
    const phoneNumber = customerForm.phoneNumber.replace(/\D/g, ''); // Remove non-digits
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Save order to history
    const orderData = {
      id: Date.now(),
      orderNumber: customerForm.orderId || `ORD-${Date.now()}`,
      customerName: customerForm.customerName,
      phoneNumber: customerForm.phoneNumber,
      orderType: customerForm.orderType,
      items: [...cart],
      subtotal: cartSubtotal,
      tax: taxAmount,
      total: cartTotal,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    dispatch(addOrderToHistory(orderData));

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Clear cart after sending
    dispatch(clearCart());

    enqueueSnackbar(t('orderSentSuccessfully'), { variant: 'success' });
  };

  const handlePrintReceipt = () => {
    const printWindow = window.open('', '_blank');
    const orderNumber = customerForm.orderId || `ORD-${Date.now()}`;

    const receiptHtml = `
      <html>
        <head>
          <title>Receipt - ${orderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 300px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .total { border-top: 1px solid #000; padding-top: 10px; font-weight: bold; }
            .center { text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>RECEIPT</h2>
            <p>Order: ${orderNumber}</p>
            <p>Customer: ${customerForm.customerName || 'N/A'}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>

          <div class="items">
            ${cart.map(item => `
              <div class="item">
                <span>${item.name} x${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>

          <div class="total">
            <div class="item">
              <span>Subtotal:</span>
              <span>$${cartSubtotal.toFixed(2)}</span>
            </div>
            <div class="item">
              <span>Tax (8%):</span>
              <span>$${taxAmount.toFixed(2)}</span>
            </div>
            <div class="item">
              <span>TOTAL:</span>
              <span>$${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <div class="center" style="margin-top: 20px;">
            <p>Thank you for your business!</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(receiptHtml);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShowQRCode = () => {
    if (!customerForm.phoneNumber) {
      enqueueSnackbar(t('pleaseEnterPhoneNumber'), { variant: 'error' });
      return;
    }
    setShowQRCode(!showQRCode);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="bg-white shadow-sm h-16"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-sm h-96"></div>
              <div className="bg-white rounded-lg shadow-sm h-96"></div>
              <div className="bg-white rounded-lg shadow-sm h-96"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <FaUtensils className="text-2xl text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">POS System</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaShoppingCart className="text-2xl text-gray-600" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="text-lg font-semibold text-gray-900">
                ${cartTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Layout: Customer → Cart → Menu */}
        <div className="block lg:hidden space-y-8">
          {/* Customer Details - Mobile First */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <CustomerDetailsSection
              customer={customer}
              isEditing={isEditingCustomer}
              customerForm={customerForm}
              onEdit={() => setIsEditingCustomer(true)}
              onSave={handleSaveCustomer}
              onCancel={handleCancelEdit}
              onChange={handleCustomerFormChange}
            />
          </div>

          {/* Cart - Mobile Second */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <CartSection
              cart={cart}
              cartSubtotal={cartSubtotal}
              taxAmount={taxAmount}
              cartTotal={cartTotal}
              onUpdateQuantity={handleUpdateQuantity}
              onClearCart={handleClearCart}
              onSendOrderViaWhatsApp={handleSendOrderViaWhatsApp}
              onPrintReceipt={handlePrintReceipt}
              onShowQRCode={handleShowQRCode}
              showQRCode={showQRCode}
              customerForm={customerForm}
            />
          </div>

          {/* Menu - Mobile Last */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <MenuSection
              menus={menus}
              selectedCategory={selectedCategory}
              searchTerm={searchTerm}
              filteredItems={getFilteredItems()}
              onCategoryChange={setSelectedCategory}
              onSearchChange={setSearchTerm}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        {/* Desktop Layout: Customer | Menu | Cart */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {/* Customer Details - Desktop Left */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <CustomerDetailsSection
              customer={customer}
              isEditing={isEditingCustomer}
              customerForm={customerForm}
              onEdit={() => setIsEditingCustomer(true)}
              onSave={handleSaveCustomer}
              onCancel={handleCancelEdit}
              onChange={handleCustomerFormChange}
            />
          </div>

          {/* Menu Section - Desktop Center */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <MenuSection
              menus={menus}
              selectedCategory={selectedCategory}
              searchTerm={searchTerm}
              filteredItems={getFilteredItems()}
              onCategoryChange={setSelectedCategory}
              onSearchChange={setSearchTerm}
              onAddToCart={handleAddToCart}
            />
          </div>

          {/* Cart Section - Desktop Right */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <CartSection
              cart={cart}
              cartSubtotal={cartSubtotal}
              taxAmount={taxAmount}
              cartTotal={cartTotal}
              onUpdateQuantity={handleUpdateQuantity}
              onClearCart={handleClearCart}
              onSendOrderViaWhatsApp={handleSendOrderViaWhatsApp}
              onPrintReceipt={handlePrintReceipt}
              onShowQRCode={handleShowQRCode}
              showQRCode={showQRCode}
              customerForm={customerForm}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Customer Details Section Component
const CustomerDetailsSection = ({
  customer,
  isEditing,
  customerForm,
  onEdit,
  onSave,
  onCancel,
  onChange
}) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-900">Customer Details</h2>
      {!isEditing && (
        <button
          onClick={onEdit}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FaEdit />
          <span>Edit</span>
        </button>
      )}
    </div>

    {!isEditing ? (
      // View Mode
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <FaUser className="text-blue-600 text-xl" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {customer.customerName || 'No customer selected'}
            </h3>
            <p className="text-sm text-gray-600">
              Order #{customer.orderId || 'N/A'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Order Type:</span>
            <p className="text-gray-900">{customer.orderType || 'Dine in'}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Table:</span>
            <p className="text-gray-900">{customer.table?.tableNo || 'N/A'}</p>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          {new Date().toLocaleString()}
        </div>
      </div>
    ) : (
      // Edit Mode
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name *
          </label>
          <input
            type="text"
            value={customerForm.customerName}
            onChange={(e) => onChange('customerName', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter customer name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={customerForm.phoneNumber}
            onChange={(e) => onChange('phoneNumber', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter phone number (for WhatsApp orders)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order ID
          </label>
          <input
            type="text"
            value={customerForm.orderId}
            onChange={(e) => onChange('orderId', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter order ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order Type
          </label>
          <select
            value={customerForm.orderType}
            onChange={(e) => onChange('orderType', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Dine in">Dine in</option>
            <option value="Take away">Take away</option>
            <option value="Delivery">Delivery</option>
          </select>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onSave}
            className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaSave />
            <span>Save</span>
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )}
  </div>
);

// Menu Section Component
const MenuSection = ({
  menus,
  selectedCategory,
  searchTerm,
  filteredItems,
  onCategoryChange,
  onSearchChange,
  onAddToCart
}) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Menu Items</h2>

    {/* Search Bar */}
    <div className="relative mb-6">
      <FaSearch className="absolute left-3 top-3 text-gray-400" />
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Category Tabs */}
    <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
      {Array.isArray(menus) && menus.map((category) => (
        <button
          key={category.name}
          onClick={() => onCategoryChange(category.name)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedCategory === category.name
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>

    {/* Menu Items Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {filteredItems.map((item) => (
        <div
          key={item.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-32 object-cover rounded-md mb-3"
            />
          )}
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900">{item.name}</h3>
            <span className="text-green-600 font-bold">${item.price}</span>
          </div>
          {item.description && (
            <p className="text-gray-600 text-sm mb-3">{item.description}</p>
          )}
          <button
            onClick={() => onAddToCart(item)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>

    {filteredItems.length === 0 && (
      <div className="text-center py-8 text-gray-500">
        <p>No items found</p>
      </div>
    )}
  </div>
);

// Cart Section Component
const CartSection = ({
  cart,
  cartSubtotal,
  taxAmount,
  cartTotal,
  onUpdateQuantity,
  onClearCart,
  onSendOrderViaWhatsApp,
  onPrintReceipt,
  onShowQRCode,
  showQRCode,
  customerForm
}) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Cart</h2>

    {cart.length > 0 ? (
      <>
        {/* Cart Items */}
        <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b pb-3">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.name}</h4>
                <p className="text-gray-600 text-xs">${item.price} each</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                >
                  <FaMinus className="text-xs" />
                </button>
                <span className="font-medium w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                >
                  <FaPlus className="text-xs" />
                </button>
                <span className="font-bold w-16 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.id, 0)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Totals */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${cartSubtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (8%):</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* QR Code Display */}
        {showQRCode && customerForm.phoneNumber && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <QRCode value={`https://wa.me/${customerForm.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(generateWhatsAppMessage())}`} />
            <p className="text-center text-sm text-gray-600 mt-2">Scan to send order via WhatsApp</p>
          </div>
        )}

        {/* Cart Actions */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={onClearCart}
            className="bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
          >
            <FaTrash />
            <span>Clear Cart</span>
          </button>
          <button
            onClick={onPrintReceipt}
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <FaPrint />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={onShowQRCode}
            className="bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
          >
            <FaQrcode />
            <span>{showQRCode ? 'Hide' : 'Show'} QR Code</span>
          </button>
          <button
            onClick={onSendOrderViaWhatsApp}
            className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <FaWhatsapp />
            <span>Send via WhatsApp</span>
          </button>
        </div>
      </>
    ) : (
      <div className="text-center py-12 text-gray-500">
        <FaShoppingCart className="mx-auto text-4xl mb-4 opacity-50" />
        <p className="text-lg">Your cart is empty</p>
        <p className="text-sm">Add some delicious items from the menu!</p>
      </div>
    )}
  </div>
);

// PropTypes
UnifiedMenuContainer.propTypes = {
  // No props needed as it uses Redux
};

CustomerDetailsSection.propTypes = {
  customer: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  customerForm: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

MenuSection.propTypes = {
  menus: PropTypes.array.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  searchTerm: PropTypes.string.isRequired,
  filteredItems: PropTypes.array.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired
};

CartSection.propTypes = {
  cart: PropTypes.array.isRequired,
  cartSubtotal: PropTypes.number.isRequired,
  taxAmount: PropTypes.number.isRequired,
  cartTotal: PropTypes.number.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onClearCart: PropTypes.func.isRequired
};

export default UnifiedMenuContainer;
