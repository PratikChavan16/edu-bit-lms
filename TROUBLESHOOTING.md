# 🔧 Troubleshooting Guide - Sai LMS Fee Management

## Common Issues and Solutions

---

## 🚨 Installation Issues

### Issue 1: PowerShell Execution Policy Error
```
Error: File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled
```

**Solution:**
```powershell
# Option 1: Set for current session only
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Option 2: Set permanently (requires admin)
Set-ExecutionPolicy RemoteSigned
```

### Issue 2: npm install fails
**Solution:**
```powershell
# Clear cache and retry
npm cache clean --force
Remove-Item -Recurse -Force node_modules
npm install
```

### Issue 3: Module not found errors
**Solution:**
```powershell
# Reinstall dependencies
cd c:\Bitflow_LMS\SAI_LMS_FEES
npm install
cd frontend
npm install
```

---

## 💾 MongoDB Issues

### Issue 1: Cannot connect to MongoDB
```
Error: MongoNetworkError: failed to connect to server [localhost:27017]
```

**Solution:**
```powershell
# Check if MongoDB is running
mongosh

# If not, start it:
net start MongoDB

# Or manually:
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
```

### Issue 2: MongoDB not installed
**Solution:**
1. Download from: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. Start MongoDB service
4. Verify: `mongosh`

### Issue 3: Database connection timeout
**Solution:**
Check `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/sai_lms_fees
```

Verify MongoDB is listening on port 27017:
```powershell
netstat -an | findstr "27017"
```

---

## 🔑 Authentication Issues

### Issue 1: Invalid token error
**Symptoms:**
- Automatically logged out
- "Invalid token" message

**Solution:**
1. Clear browser local storage
2. Login again
3. Token expires after 8 hours (normal behavior)

### Issue 2: Cannot login - Invalid credentials
**Solution:**
```powershell
# Recreate users
node backend/scripts/createAdmin.js
```

Default credentials:
- Admin: `admin` / `admin123`
- Accountant: `accountant` / `accountant123`

### Issue 3: User already exists error
**Solution:**
Users already created. Use existing credentials or:
```javascript
// Connect to MongoDB and delete users
mongosh
use sai_lms_fees
db.users.deleteMany({})
```
Then run `node backend/scripts/createAdmin.js` again

---

## 🌐 Server Issues

### Issue 1: Port 5000 already in use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution A - Change Port:**
Edit `.env`:
```env
PORT=5001
```

**Solution B - Kill Process:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill it (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Issue 2: Port 3000 already in use (Frontend)
**Solution:**
When prompted, type `Y` to use a different port (like 3001)

Or kill the process:
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue 3: Cannot access API from frontend
**Symptoms:**
- CORS errors in browser console
- Network errors

**Solution:**
1. Check backend is running: http://localhost:5000/api/health
2. Check `frontend/package.json` has proxy:
```json
"proxy": "http://localhost:5000"
```
3. Restart both servers

---

## 📤 CSV Upload Issues

### Issue 1: CSV upload fails
**Solution:**
1. Check CSV format matches sample: `sample_students.csv`
2. Ensure required fields are present:
   - enrollmentNumber
   - firstName, lastName
   - email, phone
   - course, batch
   - admissionDate (YYYY-MM-DD format)
   - totalFees

### Issue 2: Some students not imported
**Solution:**
- Check console/logs for error details
- Verify no duplicate enrollment numbers
- Ensure dates are in correct format
- Check for special characters in data

### Issue 3: "No file uploaded" error
**Solution:**
- Select a .csv file (not .xlsx or other format)
- File size should be reasonable (<10MB)
- Restart backend if issue persists

---

## 💳 Payment Issues

### Issue 1: Payment not recorded
**Symptoms:**
- Success message but payment doesn't appear
- Student fees not updated

**Solution:**
1. Refresh the page
2. Check MongoDB:
```javascript
mongosh
use sai_lms_fees
db.payments.find().pretty()
```
3. Check backend logs for errors

### Issue 2: Student not found when recording payment
**Solution:**
- Ensure student exists in database
- Refresh students list
- Try searching by enrollment number

### Issue 3: Receipt number not generating
**Solution:**
Receipt numbers auto-generate as `RCP000001`, `RCP000002`, etc.
If not working, check backend logs for errors in Payment model.

---

## 👁️ Display Issues

### Issue 1: Dashboard shows incorrect totals
**For Accountant:**
- Cash payments should be shown separately
- Total should exclude cash
- This is intended behavior

**For Admin:**
- All payments should be tallied
- If not, check role in browser localStorage

### Issue 2: Charts not displaying
**Solution:**
1. Check browser console for errors
2. Verify `recharts` is installed:
```powershell
cd frontend
npm list recharts
```
3. Reinstall if missing:
```powershell
npm install recharts
```

### Issue 3: Blank page after login
**Solution:**
1. Check browser console for errors
2. Verify backend is running
3. Check network tab for failed API calls
4. Clear browser cache and refresh

---

## 🔄 Data Issues

### Issue 1: Student fees not updating after payment
**Solution:**
This should auto-update. If not:
1. Check Payment model's post-save hook
2. Verify payment was created successfully
3. Manually refresh:
```javascript
mongosh
use sai_lms_fees
// Find student and recalculate
db.students.updateOne(
  {enrollmentNumber: "ENR2024001"},
  {$set: {paidFees: <new_value>}}
)
```

### Issue 2: Duplicate students after CSV upload
**Solution:**
CSV upload updates by enrollment number.
To prevent duplicates:
1. Ensure enrollment numbers are unique in CSV
2. Check for typos in enrollment numbers

### Issue 3: Cannot delete student with payments
**Solution:**
Delete associated payments first (Admin only):
```javascript
mongosh
use sai_lms_fees
db.payments.deleteMany({student: ObjectId("...")})
```

---

## 🎨 UI/UX Issues

### Issue 1: Buttons not clickable
**Solution:**
- Clear browser cache
- Hard refresh (Ctrl + Shift + R)
- Check for JavaScript errors in console

### Issue 2: Modal won't close
**Solution:**
- Click outside the modal
- Press Escape key
- Refresh page if stuck

### Issue 3: Responsive design broken on mobile
**Solution:**
- Ensure viewport meta tag in index.html
- Clear mobile browser cache
- Try different mobile browser

---

## 🔐 Permission Issues

### Issue 1: "Access denied. Admin only" error
**Symptom:**
Accountant trying to perform admin action

**Solution:**
This is intended behavior. Only admins can:
- Delete payments
- Edit payments
- Delete students

### Issue 2: "Invalid token" after some time
**Solution:**
Tokens expire after 8 hours. Login again.

---

## 📱 Performance Issues

### Issue 1: Slow loading
**Solution:**
1. Check MongoDB performance
2. Add indexes (if needed):
```javascript
mongosh
use sai_lms_fees
db.students.createIndex({enrollmentNumber: 1})
db.payments.createIndex({student: 1})
```

### Issue 2: Large CSV upload takes too long
**Solution:**
- Break into smaller files (500-1000 records each)
- Upload during off-peak hours
- Increase backend timeout if needed

---

## 🛠️ Development Issues

### Issue 1: Changes not reflecting
**Solution:**
1. **Backend changes**: Restart server (Ctrl+C, then restart)
2. **Frontend changes**: Should auto-reload, if not:
```powershell
cd frontend
npm start
```

### Issue 2: Build errors
**Solution:**
```powershell
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force build
npm install
npm run build
```

---

## 🗄️ Database Management

### Backup Database
```powershell
mongodump --db sai_lms_fees --out C:\backup\
```

### Restore Database
```powershell
mongorestore --db sai_lms_fees C:\backup\sai_lms_fees
```

### Reset Database (Caution!)
```javascript
mongosh
use sai_lms_fees
db.dropDatabase()
```
Then recreate users:
```powershell
node backend/scripts/createAdmin.js
```

### View all data
```javascript
mongosh
use sai_lms_fees
db.users.find().pretty()
db.students.find().pretty()
db.payments.find().pretty()
```

---

## 🔍 Debugging Tips

### Enable Debug Logging
Add to backend/server.js:
```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### Check Browser Console
- Press F12
- Go to Console tab
- Look for red errors

### Check Network Tab
- Press F12
- Go to Network tab
- Monitor API calls
- Check response codes (200 = OK, 401 = Unauthorized, 500 = Server Error)

### Check Backend Logs
Look at the terminal where backend is running for:
- Error stack traces
- MongoDB queries
- Request logs

---

## 📞 Getting Help

### Before Asking for Help:
1. ✅ Check this troubleshooting guide
2. ✅ Read README.md
3. ✅ Check browser console for errors
4. ✅ Check backend terminal for errors
5. ✅ Verify MongoDB is running
6. ✅ Verify all dependencies installed

### When Reporting Issues:
Include:
- Error message (full text)
- Steps to reproduce
- Browser console output
- Backend terminal output
- Operating system version
- Node.js version (`node --version`)
- MongoDB version (`mongosh --version`)

---

## 🔄 Quick Reset (Nuclear Option)

If everything is broken:

```powershell
# Stop all servers (Ctrl+C in terminals)

# Backend reset
cd c:\Bitflow_LMS\SAI_LMS_FEES
Remove-Item -Recurse -Force node_modules
npm install

# Frontend reset
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force build
npm install
cd ..

# Database reset
mongosh
use sai_lms_fees
db.dropDatabase()
exit

# Recreate users
node backend/scripts/createAdmin.js

# Start fresh
.\start.bat
```

---

## ✅ Verification Checklist

Run this after any fix:

- [ ] MongoDB is running (`mongosh` works)
- [ ] Backend starts without errors
- [ ] Can access http://localhost:5000/api/health
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can login as admin
- [ ] Can see dashboard
- [ ] Can view students
- [ ] Can record payment
- [ ] No console errors

---

## 🎓 Learn More

### Useful Commands

**Check versions:**
```powershell
node --version
npm --version
mongosh --version
```

**View logs:**
```powershell
# Backend logs in terminal where you ran: node backend/server.js
# Frontend logs in browser console (F12)
```

**Check running processes:**
```powershell
netstat -ano | findstr "5000"
netstat -ano | findstr "3000"
netstat -ano | findstr "27017"
```

---

**Still stuck? Review the documentation:**
- `README.md` - Complete documentation
- `SETUP_GUIDE.md` - Setup instructions
- `PROJECT_SUMMARY.md` - Project overview

---

Last Updated: October 2025
