# Sai Group of Institute - Fee Management System

A complete fee management system with separate portals for Accountants and Admins. Manage student admissions, record payments (online/offline), and track fee collections with role-based access control.

## Features

### Common Features (Both Portals)
- 🔐 Secure authentication with JWT
- 📊 Interactive dashboard with charts and statistics
- 👥 Student management with CSV bulk upload
- 💳 Payment recording (Cash, Online, UPI, Card, Cheque)
- 🔍 Advanced search and filtering
- 📱 Responsive design

### Admin Portal
- ✅ View all payments including cash
- ✅ Complete payment tallying (all modes)
- ✅ Delete payments and students
- ✅ Full access to all features

### Accountant Portal
- ✅ View all payments (cash shown but not tallied)
- ✅ Tally only online payments (excluding cash)
- ✅ Record payments
- ⚠️ Cash payments visible but excluded from total collection

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Multer for file uploads
- CSV Parser

### Frontend
- React 18
- React Router v6
- Axios for API calls
- Recharts for data visualization
- React Toastify for notifications
- React Icons

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Step 1: Clone the repository
```bash
cd c:\Bitflow_LMS\SAI_LMS_FEES
```

### Step 2: Install Backend Dependencies
```bash
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### Step 4: Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sai_lms_fees
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
```

### Step 5: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# Or start manually
mongod
```

### Step 6: Create Initial Admin User
Run Node.js to create the first admin user:

```bash
node backend/scripts/createAdmin.js
```

Or use MongoDB Compass/Shell to insert:
```javascript
db.users.insertOne({
  username: "admin",
  email: "admin@saigroup.edu",
  password: "$2a$10$rF8qLGZkm8P7mYvKKfZWZuJHqJ5z.3gY9qVYVHqKqLH3pJOEQqK8W", // password: admin123
  role: "admin",
  fullName: "System Administrator",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});
```

## Running the Application

### Development Mode

#### Option 1: Run Both (Recommended)
```bash
# Install concurrently globally if not installed
npm install -g concurrently

# Run both backend and frontend
npm run dev:full
```

#### Option 2: Run Separately
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### Production Mode
```bash
# Build frontend
cd frontend
npm run build
cd ..

# Start backend (serve frontend build)
npm start
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

### Default Login Credentials
```
Username: admin
Password: admin123
```

⚠️ **Important**: Change default credentials after first login!

## Creating Users

### Via API (Recommended)
Use Postman or any API client:

**Endpoint**: `POST http://localhost:5000/api/auth/register`

**Body**:
```json
{
  "username": "accountant1",
  "email": "accountant1@saigroup.edu",
  "password": "secure_password",
  "role": "accountant",
  "fullName": "John Doe"
}
```

**Roles**: `admin` or `accountant`

## CSV Upload Format

Create a CSV file with the following columns:

```csv
enrollmentNumber,firstName,lastName,email,phone,course,batch,admissionDate,totalFees,paidFees,address,parentName,parentPhone
ENR2024001,John,Doe,john@example.com,9876543210,B.Tech CS,2024-2028,2024-01-15,500000,100000,"123 Main St",Mr. Doe,9876543211
ENR2024002,Jane,Smith,jane@example.com,9876543212,B.Tech IT,2024-2028,2024-01-16,450000,50000,"456 Park Ave",Mrs. Smith,9876543213
```

### Required Fields:
- enrollmentNumber
- firstName
- lastName
- email
- phone
- course
- batch
- admissionDate (YYYY-MM-DD)
- totalFees

### Optional Fields:
- paidFees (default: 0)
- address
- parentName
- parentPhone

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get current user profile

### Students
- `GET /api/students` - Get all students (with pagination & filters)
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `POST /api/students/upload-csv` - Bulk upload via CSV

### Payments
- `GET /api/payments` - Get all payments (with pagination & filters)
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments` - Record new payment
- `PUT /api/payments/:id` - Update payment (Admin only)
- `DELETE /api/payments/:id` - Delete payment (Admin only)
- `GET /api/payments/stats/dashboard` - Get dashboard statistics

## Key Differences: Admin vs Accountant

| Feature | Admin | Accountant |
|---------|-------|------------|
| View Cash Payments | ✅ Yes | ✅ Yes (shown only) |
| Cash in Total Collection | ✅ Included | ❌ Excluded |
| Delete Payments | ✅ Yes | ❌ No |
| Delete Students | ✅ Yes | ❌ No |
| Edit Payments | ✅ Yes | ❌ No |
| Record Payments | ✅ Yes | ✅ Yes |
| Upload CSV | ✅ Yes | ✅ Yes |

## Database Schema

### Users Collection
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'accountant',
  fullName: String,
  isActive: Boolean
}
```

### Students Collection
```javascript
{
  enrollmentNumber: String (unique),
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  course: String,
  batch: String,
  admissionDate: Date,
  totalFees: Number,
  paidFees: Number,
  pendingFees: Number (auto-calculated),
  status: 'active' | 'graduated' | 'dropped',
  address: String,
  parentName: String,
  parentPhone: String
}
```

### Payments Collection
```javascript
{
  student: ObjectId (ref: Student),
  enrollmentNumber: String,
  studentName: String,
  amount: Number,
  paymentMode: 'cash' | 'online' | 'cheque' | 'card' | 'upi',
  paymentDate: Date,
  transactionId: String,
  chequeNumber: String,
  remarks: String,
  receiptNumber: String (auto-generated),
  recordedBy: ObjectId (ref: User),
  recordedByName: String
}
```

## Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# If not, start it
# Windows: net start MongoDB
# Linux/Mac: sudo systemctl start mongod
```

### Port Already in Use
```bash
# Change port in .env file
PORT=5001
```

### CORS Issues
The backend is configured to accept requests from `http://localhost:3000`. If you're using a different port, update the CORS configuration in `backend/server.js`.

### JWT Token Expired
Tokens expire after 8 hours. Simply login again to get a new token.

## Project Structure

```
SAI_LMS_FEES/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── students.js
│   │   └── payments.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   └── PrivateRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Dashboard/
│   │   │   ├── Login/
│   │   │   ├── Students/
│   │   │   └── Payments/
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── uploads/ (auto-created)
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Role-based access control
- ✅ Protected API routes
- ✅ Input validation
- ✅ XSS protection
- ✅ CORS configuration

## Future Enhancements

- [ ] Email notifications for payments
- [ ] PDF receipt generation
- [ ] Bulk SMS integration
- [ ] Payment reminders
- [ ] Advanced reporting and analytics
- [ ] Export to Excel/PDF
- [ ] Payment gateway integration
- [ ] Multi-institute support
- [ ] Mobile app

## Support

For issues and questions:
- Create an issue in the repository
- Contact: admin@saigroup.edu

## License

MIT License - See LICENSE file for details

## Contributors

Developed for Sai Group of Institute

---

**Version**: 1.0.0  
**Last Updated**: October 2025
