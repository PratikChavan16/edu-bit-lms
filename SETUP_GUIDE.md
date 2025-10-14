# 🚀 Quick Setup Guide - Sai LMS Fee Management

## Prerequisites Check ✓
Before starting, ensure you have:
- [ ] Node.js installed (v14+) - Check: `node --version`
- [ ] MongoDB installed and running - Check: `mongosh`
- [ ] npm or yarn - Check: `npm --version`

---

## 🎯 Quick Start (5 Steps)

### Step 1: Install Backend Dependencies
```powershell
cd c:\Bitflow_LMS\SAI_LMS_FEES
npm install
```

### Step 2: Install Frontend Dependencies
```powershell
cd frontend
npm install
cd ..
```

### Step 3: Start MongoDB
```powershell
# If MongoDB is installed as a Windows service:
net start MongoDB

# Or check if it's already running:
mongosh
```

### Step 4: Create Admin & Accountant Users
```powershell
node backend/scripts/createAdmin.js
```

**You should see:**
```
✅ Admin user created successfully!
Username: admin
Password: admin123

✅ Accountant user created successfully!
Username: accountant
Password: accountant123
```

### Step 5: Start the Application

#### Option A: Start Both Backend & Frontend Together (Recommended)
```powershell
npm run dev:full
```

#### Option B: Start Separately
**Terminal 1 - Backend:**
```powershell
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```

---

## 🌐 Access the Application

### Frontend URLs:
- **Main Application**: http://localhost:3000
- **Login Page**: http://localhost:3000/login

### Backend URLs:
- **API Base**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

---

## 🔑 Login Credentials

### Admin Portal Access:
```
Username: admin
Password: admin123
Role: Full access to all features
```

### Accountant Portal Access:
```
Username: accountant
Password: accountant123
Role: Limited access (cash not tallied)
```

---

## 📊 Test with Sample Data

### Upload Sample Students CSV:
1. Login to the application
2. Go to **Students** page
3. Click **"Upload CSV"** button
4. Select `sample_students.csv` from project root
5. Click **Upload**

The sample file contains 10 students with realistic data!

---

## ✨ Key Features to Test

### As Admin:
1. **Dashboard**: View complete statistics including cash payments
2. **Students**: 
   - Upload CSV file
   - Add individual students
   - View/Edit/Delete students
3. **Payments**:
   - Record payments (all modes)
   - View all payments
   - Delete payments
   - See cash payments tallied in totals

### As Accountant:
1. **Dashboard**: Statistics excluding cash from totals
2. **Students**: Same as admin
3. **Payments**:
   - Record payments (all modes)
   - View all payments (cash shown separately)
   - Cash payments NOT included in total collection
   - Cannot delete payments

---

## 🔧 Common Issues & Solutions

### Issue 1: MongoDB Connection Error
```powershell
# Check if MongoDB is running:
mongosh

# If not running, start it:
net start MongoDB

# Or manually:
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

### Issue 2: Port 5000 Already in Use
**Solution**: Change port in `.env` file:
```env
PORT=5001
```

### Issue 3: Port 3000 Already in Use
**Solution**: When prompted, type 'Y' to use a different port, or close other apps using port 3000.

### Issue 4: npm install errors
**Solution**:
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Issue 5: Cannot create admin user
**Solution**: Make sure MongoDB is running and .env file exists with correct MONGODB_URI

---

## 📱 Using the Application

### Recording a Payment:
1. Go to **Payments** page
2. Click **"Record Payment"** button
3. Select student from dropdown
4. Enter amount
5. Choose payment mode (Cash/Online/UPI/Cheque/Card)
6. Add transaction ID (if online)
7. Click **"Record Payment"**

### Uploading Students via CSV:
1. Prepare CSV with required columns (see sample_students.csv)
2. Go to **Students** page
3. Click **"Upload CSV"**
4. Select your CSV file
5. Click **Upload**
6. Check results (inserted/updated/errors)

### Viewing Dashboard:
- **Admin**: Sees total collection including cash
- **Accountant**: Sees total collection excluding cash (cash shown separately)

---

## 🎨 Portal Differences

| Feature | Admin Portal | Accountant Portal |
|---------|-------------|-------------------|
| View Cash Payments | ✅ Yes | ✅ Yes |
| Cash in Total | ✅ Included | ❌ Excluded |
| Delete Records | ✅ Yes | ❌ No |
| Edit Payments | ✅ Yes | ❌ No |
| Record Payments | ✅ All modes | ✅ All modes |
| Dashboard Stats | All payments | Excludes cash |

---

## 🔐 Security Notes

⚠️ **Important**:
1. Change default passwords immediately after first login
2. Never commit `.env` file to version control
3. Use strong JWT_SECRET in production
4. Enable HTTPS in production
5. Implement rate limiting for production

---

## 📞 Need Help?

1. Check MongoDB is running: `mongosh`
2. Check Node version: `node --version`
3. Check backend logs in terminal
4. Check browser console for frontend errors
5. Verify .env file exists and is configured correctly

---

## 🎯 Next Steps After Setup

1. ✅ Login as admin
2. ✅ Change default password
3. ✅ Upload sample students CSV
4. ✅ Record some test payments
5. ✅ Create accountant users as needed
6. ✅ Explore dashboard and reports
7. ✅ Test both admin and accountant portals

---

**Setup Complete! 🎉**

Your Sai LMS Fee Management System is now ready to use!

For detailed documentation, see README.md
