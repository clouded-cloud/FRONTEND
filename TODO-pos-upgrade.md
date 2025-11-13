# POS System Upgrade TODO

## Phase 1: Core WhatsApp Integration
- [ ] Add phone number field to CustomerDetailsSection
- [ ] Replace "Proceed to Checkout" with "Send Order via WhatsApp" button
- [ ] Implement WhatsApp message generation with formatting (bold, emojis, line breaks)
- [ ] Add clear cart after sending order
- [ ] Save order to localStorage

## Phase 2: Additional Features
- [ ] Add print receipt functionality
- [ ] Add QR code generation for WhatsApp link
- [ ] Add dark mode toggle
- [ ] Add multi-language support (English/Spanish)

## Phase 3: New Components & Utilities
- [ ] Create QRCode component
- [ ] Create Language context/state management
- [ ] Create Dark mode context
- [ ] Enhance cart slice with order history

## Phase 4: Testing & Polish
- [ ] Test WhatsApp URL opening on mobile/desktop
- [ ] Verify print functionality
- [ ] Test QR code generation
- [ ] Ensure translations are complete
- [ ] Test dark mode toggle
- [ ] Update responsive design for new elements
