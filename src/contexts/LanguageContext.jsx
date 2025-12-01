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
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('pos-language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
      updateDocumentDirection(savedLanguage);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (['es', 'ar'].includes(browserLang)) {
        setLanguage(browserLang);
        updateDocumentDirection(browserLang);
      }
    }
  }, []);

  const updateDocumentDirection = (lang) => {
    const isRTL = lang === 'ar';
    setIsRTL(isRTL);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Add language-specific CSS classes
    if (isRTL) {
      document.documentElement.classList.add('rtl');
      document.documentElement.classList.remove('ltr');
    } else {
      document.documentElement.classList.add('ltr');
      document.documentElement.classList.remove('rtl');
    }
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    updateDocumentDirection(newLanguage);
    localStorage.setItem('pos-language', newLanguage);
  };

  const languages = {
    en: { name: 'English', flag: '🇺🇸', dir: 'ltr' },
    es: { name: 'Español', flag: '🇪🇸', dir: 'ltr' },
    ar: { name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
    fr: { name: 'Français', flag: '🇫🇷', dir: 'ltr' },
    sw: { name: 'Kiswahili', flag: '🇰🇪', dir: 'ltr' }
  };

  const translations = {
    en: {
      // Navigation & App
      dashboard: 'Dashboard',
      menu: 'Menu',
      orders: 'Orders',
      tables: 'Tables',
      users: 'Users',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',

      // Customer Details
      customerDetails: 'Customer Details',
      customerName: 'Customer Name',
      phoneNumber: 'Phone Number',
      numberOfGuests: 'Number of Guests',
      orderId: 'Order ID',
      orderType: 'Order Type',
      table: 'Table',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      required: 'Required',
      optional: 'Optional',

      // Menu & Categories
      menuItems: 'Menu Items',
      categories: 'Categories',
      searchItems: 'Search items...',
      addToCart: 'Add to Cart',
      noItemsFound: 'No items found',
      allCategories: 'All Categories',
      popular: 'Popular',
      recommended: 'Recommended',

      // Cart & Orders
      cart: 'Cart',
      subtotal: 'Subtotal',
      tax: 'Tax',
      total: 'Total',
      discount: 'Discount',
      serviceCharge: 'Service Charge',
      clearCart: 'Clear Cart',
      sendOrderViaWhatsApp: 'Send Order via WhatsApp',
      printReceipt: 'Print Receipt',
      yourCartIsEmpty: 'Your cart is empty',
      addSomeDeliciousItems: 'Add some delicious items from the menu!',
      proceedToCheckout: 'Proceed to Checkout',
      applyDiscount: 'Apply Discount',

      // Tables
      tableManagement: 'Table Management',
      availableTables: 'Available Tables',
      occupiedTables: 'Occupied Tables',
      reservedTables: 'Reserved Tables',
      tableNumber: 'Table Number',
      capacity: 'Capacity',
      status: 'Status',
      available: 'Available',
      occupied: 'Occupied',
      reserved: 'Reserved',

      // Orders Management
      orderManagement: 'Order Management',
      allOrders: 'All Orders',
      pendingOrders: 'Pending Orders',
      completedOrders: 'Completed Orders',
      inProgress: 'In Progress',
      ready: 'Ready',
      completed: 'Completed',
      cancelled: 'Cancelled',

      // User Management
      userManagement: 'User Management',
      addUser: 'Add User',
      editUser: 'Edit User',
      deleteUser: 'Delete User',
      role: 'Role',
      admin: 'Admin',
      staff: 'Staff',
      active: 'Active',
      inactive: 'Inactive',

      // Actions & Buttons
      add: 'Add',
      create: 'Create',
      update: 'Update',
      delete: 'Delete',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      reset: 'Reset',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',

      // Status & Messages
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information',
      loading: 'Loading...',
      saving: 'Saving...',
      processing: 'Processing...',

      // Dark Mode & Theme
      toggleDarkMode: 'Toggle Dark Mode',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      autoMode: 'Auto Mode',
      theme: 'Theme',
      language: 'Language',

      // Notifications
      itemAddedToCart: 'Item added to cart!',
      itemRemovedFromCart: 'Item removed from cart',
      cartCleared: 'Cart cleared',
      customerDetailsSaved: 'Customer details saved',
      orderSentSuccessfully: 'Order sent successfully!',
      pleaseEnterCustomerName: 'Please enter customer name',
      pleaseEnterPhoneNumber: 'Please enter phone number',
      cartIsEmpty: 'Your cart is empty!',
      orderPlacedSuccessfully: 'Order placed successfully!',
      tableSelected: 'Table selected',
      userAddedSuccessfully: 'User added successfully',
      userUpdatedSuccessfully: 'User updated successfully',
      userDeletedSuccessfully: 'User deleted successfully',

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
      visitAgain: 'We hope to see you again soon!',

      // Payment
      payment: 'Payment',
      paymentMethod: 'Payment Method',
      cash: 'Cash',
      card: 'Card',
      mobileMoney: 'Mobile Money',
      change: 'Change',
      payNow: 'Pay Now',

      // Time
      today: 'Today',
      yesterday: 'Yesterday',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      customRange: 'Custom Range',

      // Statistics
      totalSales: 'Total Sales',
      totalOrders: 'Total Orders',
      averageOrderValue: 'Average Order Value',
      popularItems: 'Popular Items',
      revenue: 'Revenue',
      growth: 'Growth'
    },
    es: {
      // Navigation & App
      dashboard: 'Panel de Control',
      menu: 'Menú',
      orders: 'Pedidos',
      tables: 'Mesas',
      users: 'Usuarios',
      settings: 'Configuración',
      profile: 'Perfil',
      logout: 'Cerrar Sesión',
      login: 'Iniciar Sesión',
      register: 'Registrarse',

      // Customer Details
      customerDetails: 'Detalles del Cliente',
      customerName: 'Nombre del Cliente',
      phoneNumber: 'Número de Teléfono',
      numberOfGuests: 'Número de Invitados',
      orderId: 'ID del Pedido',
      orderType: 'Tipo de Pedido',
      table: 'Mesa',
      edit: 'Editar',
      save: 'Guardar',
      cancel: 'Cancelar',
      required: 'Requerido',
      optional: 'Opcional',

      // Menu & Categories
      menuItems: 'Artículos del Menú',
      categories: 'Categorías',
      searchItems: 'Buscar artículos...',
      addToCart: 'Agregar al Carrito',
      noItemsFound: 'No se encontraron artículos',
      allCategories: 'Todas las Categorías',
      popular: 'Popular',
      recommended: 'Recomendado',

      // Cart & Orders
      cart: 'Carrito',
      subtotal: 'Subtotal',
      tax: 'Impuesto',
      total: 'Total',
      discount: 'Descuento',
      serviceCharge: 'Cargo por Servicio',
      clearCart: 'Vaciar Carrito',
      sendOrderViaWhatsApp: 'Enviar Pedido por WhatsApp',
      printReceipt: 'Imprimir Recibo',
      yourCartIsEmpty: 'Tu carrito está vacío',
      addSomeDeliciousItems: '¡Agrega algunos deliciosos artículos del menú!',
      proceedToCheckout: 'Proceder al Pago',
      applyDiscount: 'Aplicar Descuento',

      // Tables
      tableManagement: 'Gestión de Mesas',
      availableTables: 'Mesas Disponibles',
      occupiedTables: 'Mesas Ocupadas',
      reservedTables: 'Mesas Reservadas',
      tableNumber: 'Número de Mesa',
      capacity: 'Capacidad',
      status: 'Estado',
      available: 'Disponible',
      occupied: 'Ocupada',
      reserved: 'Reservada',

      // Orders Management
      orderManagement: 'Gestión de Pedidos',
      allOrders: 'Todos los Pedidos',
      pendingOrders: 'Pedidos Pendientes',
      completedOrders: 'Pedidos Completados',
      inProgress: 'En Progreso',
      ready: 'Listo',
      completed: 'Completado',
      cancelled: 'Cancelado',

      // User Management
      userManagement: 'Gestión de Usuarios',
      addUser: 'Agregar Usuario',
      editUser: 'Editar Usuario',
      deleteUser: 'Eliminar Usuario',
      role: 'Rol',
      admin: 'Administrador',
      staff: 'Personal',
      active: 'Activo',
      inactive: 'Inactivo',

      // Actions & Buttons
      add: 'Agregar',
      create: 'Crear',
      update: 'Actualizar',
      delete: 'Eliminar',
      confirm: 'Confirmar',
      back: 'Atrás',
      next: 'Siguiente',
      submit: 'Enviar',
      reset: 'Reiniciar',
      search: 'Buscar',
      filter: 'Filtrar',
      sort: 'Ordenar',

      // Status & Messages
      success: 'Éxito',
      error: 'Error',
      warning: 'Advertencia',
      info: 'Información',
      loading: 'Cargando...',
      saving: 'Guardando...',
      processing: 'Procesando...',

      // Dark Mode & Theme
      toggleDarkMode: 'Cambiar Modo Oscuro',
      lightMode: 'Modo Claro',
      darkMode: 'Modo Oscuro',
      autoMode: 'Modo Automático',
      theme: 'Tema',
      language: 'Idioma',

      // Notifications
      itemAddedToCart: '¡Artículo agregado al carrito!',
      itemRemovedFromCart: 'Artículo eliminado del carrito',
      cartCleared: 'Carrito vaciado',
      customerDetailsSaved: 'Detalles del cliente guardados',
      orderSentSuccessfully: '¡Pedido enviado exitosamente!',
      pleaseEnterCustomerName: 'Por favor ingrese el nombre del cliente',
      pleaseEnterPhoneNumber: 'Por favor ingrese el número de teléfono',
      cartIsEmpty: '¡Tu carrito está vacío!',
      orderPlacedSuccessfully: '¡Pedido realizado exitosamente!',
      tableSelected: 'Mesa seleccionada',
      userAddedSuccessfully: 'Usuario agregado exitosamente',
      userUpdatedSuccessfully: 'Usuario actualizado exitosamente',
      userDeletedSuccessfully: 'Usuario eliminado exitosamente',

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
      visitAgain: '¡Esperamos verte pronto de nuevo!',

      // Payment
      payment: 'Pago',
      paymentMethod: 'Método de Pago',
      cash: 'Efectivo',
      card: 'Tarjeta',
      mobileMoney: 'Dinero Móvil',
      change: 'Cambio',
      payNow: 'Pagar Ahora',

      // Time
      today: 'Hoy',
      yesterday: 'Ayer',
      thisWeek: 'Esta Semana',
      thisMonth: 'Este Mes',
      customRange: 'Rango Personalizado',

      // Statistics
      totalSales: 'Ventas Totales',
      totalOrders: 'Total de Pedidos',
      averageOrderValue: 'Valor Promedio del Pedido',
      popularItems: 'Artículos Populares',
      revenue: 'Ingresos',
      growth: 'Crecimiento'
    },
    ar: {
      // Navigation & App
      dashboard: 'لوحة التحكم',
      menu: 'القائمة',
      orders: 'الطلبات',
      tables: 'الطاولات',
      users: 'المستخدمين',
      settings: 'الإعدادات',
      profile: 'الملف الشخصي',
      logout: 'تسجيل الخروج',
      login: 'تسجيل الدخول',
      register: 'تسجيل',

      // Customer Details
      customerDetails: 'تفاصيل العميل',
      customerName: 'اسم العميل',
      phoneNumber: 'رقم الهاتف',
      numberOfGuests: 'عدد الضيوف',
      orderId: 'رقم الطلب',
      orderType: 'نوع الطلب',
      table: 'طاولة',
      edit: 'تعديل',
      save: 'حفظ',
      cancel: 'إلغاء',
      required: 'مطلوب',
      optional: 'اختياري',

      // Menu & Categories
      menuItems: 'عناصر القائمة',
      categories: 'الفئات',
      searchItems: 'البحث في العناصر...',
      addToCart: 'إضافة إلى السلة',
      noItemsFound: 'لم يتم العثور على عناصر',
      allCategories: 'جميع الفئات',
      popular: 'شائع',
      recommended: 'موصى به',

      // Cart & Orders
      cart: 'سلة التسوق',
      subtotal: 'المجموع الفرعي',
      tax: 'الضريبة',
      total: 'المجموع',
      discount: 'الخصم',
      serviceCharge: 'رسوم الخدمة',
      clearCart: 'تفريغ السلة',
      sendOrderViaWhatsApp: 'إرسال الطلب عبر واتساب',
      printReceipt: 'طباعة الإيصال',
      yourCartIsEmpty: 'سلة التسوق فارغة',
      addSomeDeliciousItems: 'أضف بعض العناصر اللذيذة من القائمة!',
      proceedToCheckout: 'المتابعة للدفع',
      applyDiscount: 'تطبيق الخصم',

      // Order Types
      dineIn: 'تناول في المطعم',
      takeAway: 'طلب خارجي',
      delivery: 'توصيل',

      // Basic fallback for other keys
      success: 'نجاح',
      error: 'خطأ',
      loading: 'جاري التحميل...'
    }
  };

  const t = (key, params = {}) => {
    let translation = translations[language]?.[key] || translations['en']?.[key] || key;
    
    // Replace parameters in translation
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{{${param}}}`, params[param]);
    });
    
    return translation;
  };

  const formatCurrency = (amount, currency = 'KES') => {
    const formatters = {
      en: new Intl.NumberFormat('en-KE', { style: 'currency', currency }),
      es: new Intl.NumberFormat('es-ES', { style: 'currency', currency }),
      ar: new Intl.NumberFormat('ar-SA', { style: 'currency', currency })
    };
    
    return formatters[language]?.format(amount) || formatters.en.format(amount);
  };

  const formatDate = (date) => {
    const formatters = {
      en: new Intl.DateTimeFormat('en-US'),
      es: new Intl.DateTimeFormat('es-ES'),
      ar: new Intl.DateTimeFormat('ar-SA')
    };
    
    return formatters[language]?.format(new Date(date)) || formatters.en.format(new Date(date));
  };

  const value = {
    language,
    languages,
    isRTL,
    changeLanguage,
    t,
    formatCurrency,
    formatDate
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
