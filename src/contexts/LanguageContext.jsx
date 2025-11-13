import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('pos-language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('pos-language', newLanguage);
  };

  const translations = {
    en: {
      // Customer Details
      customerDetails: 'Customer Details',
      customerName: 'Customer Name',
      phoneNumber: 'Phone Number',
      orderId: 'Order ID',
      orderType: 'Order Type',
      table: 'Table',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      required: 'Required',

      // Menu
      menuItems: 'Menu Items',
      searchItems: 'Search items...',
      addToCart: 'Add to Cart',
      noItemsFound: 'No items found',

      // Cart
      cart: 'Cart',
      subtotal: 'Subtotal',
      tax: 'Tax',
      total: 'Total',
      clearCart: 'Clear Cart',
      sendOrderViaWhatsApp: 'Send Order via WhatsApp',
      printReceipt: 'Print Receipt',
      yourCartIsEmpty: 'Your cart is empty',
      addSomeDeliciousItems: 'Add some delicious items from the menu!',

      // Dark Mode
      toggleDarkMode: 'Toggle Dark Mode',

      // Messages
      itemAddedToCart: 'Item added to cart!',
      itemRemovedFromCart: 'Item removed from cart',
      cartCleared: 'Cart cleared',
      customerDetailsSaved: 'Customer details saved',
      orderSentSuccessfully: 'Order sent successfully!',
      pleaseEnterCustomerName: 'Please enter customer name',
      pleaseEnterPhoneNumber: 'Please enter phone number',
      cartIsEmpty: 'Your cart is empty!',

      // Order Types
      dineIn: 'Dine in',
      takeAway: 'Take away',
      delivery: 'Delivery',

      // Receipt
      receipt: 'Receipt',
      orderNumber: 'Order Number',
      date: 'Date',
      time: 'Time',
      items: 'Items',
      quantity: 'Qty',
      price: 'Price',
      amount: 'Amount',
      thankYou: 'Thank you for your order!',
    },
    es: {
      // Customer Details
      customerDetails: 'Detalles del Cliente',
      customerName: 'Nombre del Cliente',
      phoneNumber: 'Número de Teléfono',
      orderId: 'ID del Pedido',
      orderType: 'Tipo de Pedido',
      table: 'Mesa',
      edit: 'Editar',
      save: 'Guardar',
      cancel: 'Cancelar',
      required: 'Requerido',

      // Menu
      menuItems: 'Artículos del Menú',
      searchItems: 'Buscar artículos...',
      addToCart: 'Agregar al Carrito',
      noItemsFound: 'No se encontraron artículos',

      // Cart
      cart: 'Carrito',
      subtotal: 'Subtotal',
      tax: 'Impuesto',
      total: 'Total',
      clearCart: 'Vaciar Carrito',
      sendOrderViaWhatsApp: 'Enviar Pedido por WhatsApp',
      printReceipt: 'Imprimir Recibo',
      yourCartIsEmpty: 'Tu carrito está vacío',
      addSomeDeliciousItems: '¡Agrega algunos deliciosos artículos del menú!',

      // Dark Mode
      toggleDarkMode: 'Cambiar Modo Oscuro',

      // Messages
      itemAddedToCart: '¡Artículo agregado al carrito!',
      itemRemovedFromCart: 'Artículo eliminado del carrito',
      cartCleared: 'Carrito vaciado',
      customerDetailsSaved: 'Detalles del cliente guardados',
      orderSentSuccessfully: '¡Pedido enviado exitosamente!',
      pleaseEnterCustomerName: 'Por favor ingrese el nombre del cliente',
      pleaseEnterPhoneNumber: 'Por favor ingrese el número de teléfono',
      cartIsEmpty: '¡Tu carrito está vacío!',

      // Order Types
      dineIn: 'Comer aquí',
      takeAway: 'Para llevar',
      delivery: 'Entrega',

      // Receipt
      receipt: 'Recibo',
      orderNumber: 'Número de Pedido',
      date: 'Fecha',
      time: 'Hora',
      items: 'Artículos',
      quantity: 'Cant.',
      price: 'Precio',
      amount: 'Monto',
      thankYou: '¡Gracias por tu pedido!',
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
