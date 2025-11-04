# TODO List for Fixing New Order Menu and Orders Page

## Customer Details in Menu
- [x] Modify CustomerInfo.jsx to include editable input fields for customer name, phone, and number of guests
- [x] Add local state management for input values in CustomerInfo.jsx
- [x] Dispatch setCustomer action on input changes to update Redux state
- [x] Ensure customer details are properly saved and displayed

## Orders Display in Orders Page
- [x] Fix table data structure in Bill.jsx to send full table object instead of just tableId
- [x] Verify OrderCard.jsx correctly accesses order.table.tableNo
- [x] Test order creation and ensure orders appear in the Orders page with correct customer and table details

## Testing
- [ ] Test customer details input in Menu page
- [ ] Test order placement and verify display in Orders page
- [ ] Check for any console errors or data structure issues
