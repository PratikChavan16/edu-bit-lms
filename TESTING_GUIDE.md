# 🧪 Quick Testing Guide

## Test Scenario 1: Admin - Cash Payment Flow

**User**: admin@sai.edu / admin123

### Steps:
1. ✅ Login as admin
2. ✅ Go to **Dashboard** → Verify you see "Cash Payments" card
3. ✅ Go to **Payments** → Verify you see TWO tabs: "Online Payments" and "Cash Payments"
4. ✅ Click **"Record Payment"**
5. ✅ Select a student with pending fees
6. ✅ Choose **Payment Mode**: Cash (this option should be visible)
7. ✅ Enter amount: 50000
8. ✅ Click **"Record Payment"**
9. ✅ Verify you're automatically switched to "Cash Payments" tab
10. ✅ Verify payment appears with CASH prefix (e.g., CASH000001)
11. ✅ Go to **Dashboard** → Verify "Cash Payments" total increased by 50000
12. ✅ Go to **Students** → Verify student's "Paid" amount increased

**Expected Results**:
- ✅ Payment recorded successfully
- ✅ Receipt number starts with "CASH"
- ✅ Appears in "Cash Payments" tab
- ✅ Dashboard shows cash total
- ✅ Student fees updated

---

## Test Scenario 2: Admin - Online Payment Flow

**User**: admin@sai.edu / admin123

### Steps:
1. ✅ Login as admin
2. ✅ Go to **Payments** → Click "Online Payments" tab
3. ✅ Click **"Record Payment"**
4. ✅ Select a student
5. ✅ Choose **Payment Mode**: Online
6. ✅ Enter Transaction ID: TXN123456
7. ✅ Enter amount: 100000
8. ✅ Click **"Record Payment"**
9. ✅ Verify you stay on "Online Payments" tab
10. ✅ Verify payment appears with RCP prefix (e.g., RCP000001)
11. ✅ Go to **Dashboard** → Verify "Total Collected" includes this payment
12. ✅ Go to **Students** → Verify student's "Paid" amount increased

**Expected Results**:
- ✅ Payment recorded successfully
- ✅ Receipt number starts with "RCP"
- ✅ Appears in "Online Payments" tab
- ✅ Dashboard shows in total collected
- ✅ Student fees updated

---

## Test Scenario 3: Accountant - Cannot See Cash

**User**: accountant@sai.edu / accountant123

### Steps:
1. ✅ Login as accountant
2. ✅ Go to **Dashboard** → Verify you DON'T see "Cash Payments" card
3. ✅ Go to **Payments** → Verify you see NO tabs (just one view)
4. ✅ Click **"Record Payment"**
5. ✅ Check **Payment Mode** dropdown
6. ✅ Verify "Cash" option is NOT present
7. ✅ Select any other mode (Online, Cheque, Card, UPI)
8. ✅ Record a payment
9. ✅ Verify payment appears in the list
10. ✅ Switch between tabs (if admin recorded cash) - should not see cash payments
11. ✅ Go to **Dashboard** → Verify you only see online payment stats

**Expected Results**:
- ❌ Cannot see "Courses" menu
- ❌ Cannot see "Cash Payments" tab
- ❌ Cannot select "Cash" as payment mode
- ❌ Cannot see any cash transactions
- ✅ Can record online/cheque/card/UPI payments
- ✅ Can see only non-cash payments

---

## Test Scenario 4: Admin - Course Management

**User**: admin@sai.edu / admin123

### Steps:
1. ✅ Login as admin
2. ✅ Click **"Courses"** in navigation menu
3. ✅ Verify you see 10 courses listed
4. ✅ Check courses include: B.Tech variants, BBA, BCA, B.Com, MBA, M.Tech
5. ✅ Click **"Add Course"**
6. ✅ Fill in:
   - Course Name: M.Com
   - Course Code: MCOM
   - Duration: 2 Years
   - Default Fees: 350000
   - Active: ✅
7. ✅ Click **"Add Course"**
8. ✅ Verify new course appears in table
9. ✅ Click **Edit** icon on any course
10. ✅ Modify the fees
11. ✅ Click **"Update Course"**
12. ✅ Verify changes reflected in table
13. ✅ Click on **Status badge** to toggle active/inactive
14. ✅ Verify inactive courses show with reduced opacity

**Expected Results**:
- ✅ Can view all courses
- ✅ Can add new courses
- ✅ Can edit existing courses
- ✅ Can toggle course status
- ✅ Cannot delete course if students enrolled

---

## Test Scenario 5: Payment Updates Student Fees

**User**: admin@sai.edu / admin123

### Setup:
- Find a student with:
  - Total Fees: 500000
  - Paid Fees: 0
  - Pending Fees: 500000

### Steps:
1. ✅ Go to **Students** → Note the student's current fees
2. ✅ Go to **Payments** → Click "Record Payment"
3. ✅ Select the student
4. ✅ Enter amount: 150000
5. ✅ Choose any payment mode
6. ✅ Submit payment
7. ✅ Go back to **Students**
8. ✅ Refresh if needed
9. ✅ Verify student now shows:
   - Total Fees: 500000 (unchanged)
   - Paid Fees: 150000 (increased)
   - Pending Fees: 350000 (decreased)

**Expected Results**:
- ✅ Paid Fees = Previous Paid + Payment Amount
- ✅ Pending Fees = Total Fees - Paid Fees
- ✅ Calculation is accurate
- ✅ Updates immediately after payment

---

## Test Scenario 6: Search and Filter

**User**: Any user

### Steps:
1. ✅ Go to **Payments**
2. ✅ Test **Search**:
   - Enter enrollment number → Verify filter works
   - Enter student name → Verify filter works
   - Enter receipt number → Verify filter works
3. ✅ Test **Payment Mode Filter**:
   - Select "Online" → Verify only online payments show
   - Select "Cheque" → Verify only cheque payments show
4. ✅ Test **Date Range Filter**:
   - Set Start Date: 01/10/2025
   - Set End Date: 14/10/2025
   - Verify only payments in range show
5. ✅ Click **"Clear Filters"**
6. ✅ Verify all filters reset

**Expected Results**:
- ✅ Search works across receipt, enrollment, student name
- ✅ Payment mode filter works correctly
- ✅ Date range filter works correctly
- ✅ Clear filters resets all

---

## Common Issues & Solutions

### Issue: "Cash" option not visible for accountant
**Solution**: ✅ This is correct behavior - accountants cannot record cash payments

### Issue: Payment not updating student fees
**Solution**: 
1. Check if payment was recorded successfully
2. Refresh the Students page
3. Verify in database that student.paidFees is updated

### Issue: Cannot see cash payments as admin
**Solution**: 
1. Make sure you're logged in as admin
2. Check you're on the "Cash Payments" tab
3. Verify cash payments were recorded (not online payments)

### Issue: Courses page not showing
**Solution**: 
1. Only visible to admin users
2. Accountants don't see "Courses" in menu
3. This is correct behavior

---

## Database Verification

### Check Payment Collections:

**In MongoDB Shell:**
```javascript
// Check non-cash payments
db.payments.find({}).count()
db.payments.find({}).pretty()

// Check cash payments
db.cashpayments.find({}).count()
db.cashpayments.find({}).pretty()

// Check courses
db.courses.find({}).count()
db.courses.find({}).pretty()

// Check student with updated fees
db.students.findOne({ enrollmentNumber: "YOUR_ENROLLMENT_NUMBER" })
```

---

## Quick Verification Checklist

### Admin Portal:
- [ ] Can see "Courses" menu
- [ ] Can see two payment tabs
- [ ] Can record cash payments
- [ ] Can record online payments
- [ ] Can see cash stats in dashboard
- [ ] Can manage courses
- [ ] Can delete payments

### Accountant Portal:
- [ ] Cannot see "Courses" menu
- [ ] Cannot see payment tabs (single view)
- [ ] Cannot record cash payments
- [ ] Can record online/cheque/card/UPI payments
- [ ] Cannot see cash stats in dashboard
- [ ] Cannot access course management
- [ ] Cannot delete payments

### Payment Processing:
- [ ] Cash payments go to `cashpayments` collection
- [ ] Online payments go to `payments` collection
- [ ] Receipt numbers: CASH prefix for cash, RCP prefix for others
- [ ] Student fees update after payment
- [ ] Pending fees calculate correctly
- [ ] Payment appears in correct tab/view

---

## Performance Verification

### Load Times:
- Dashboard should load < 2 seconds
- Payments list should load < 3 seconds
- Student list should load < 3 seconds
- Course list should load < 1 second

### Pagination:
- Should show 10 records per page
- Next/Previous buttons work correctly
- Page numbers display correctly

---

## Browser Testing

Test in:
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari (if available)

All features should work consistently across browsers.

---

**Testing Date**: October 14, 2025
**Testers**: Development Team
