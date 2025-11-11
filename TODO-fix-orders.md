# Fix Customer Orders to Show Details and Total Price

## Tasks
- [x] Update cartSlice.js getTotalPrice to multiply item price by quantity
- [x] Update CartInfo.jsx to display total price per item (price * quantity)
- [x] Verify OrderCard.jsx shows customer details and correct total price
- [x] Update all order display components to show customer name or fallback to phone number if name is missing
- [x] Optionally update OrderList.jsx to show total price for consistency

## Notes
- The main issue is cart total not accounting for quantities, causing incorrect order totals.
- OrderCard already displays customer details (name, phone, table) and total price.
- Fixing cart calculations will ensure orders have correct totals.
