# Intelligent Loan Eligibility Calculator

An automated loan underwriting platform featuring a React-based premium wizard interface and Node.js/Express backend. Provides real-time loan eligibility assessment using intelligent algorithms. Includes secure user authentication with JWT, comprehensive application history tracking, and MongoDB Atlas integration for seamless data persistence and user account management.

## 🌟 Features

- **User Authentication**: Secure JWT-based login and registration system
- **Intelligent Loan Assessment**: Real-time eligibility calculation using advanced algorithms
- **Application History**: Complete tracking of all loan applications and decisions
- **Responsive Dashboard**: Premium UI with intuitive wizard interface
- **Secure Backend**: Express.js server with comprehensive middleware protection
- **Cloud Database**: MongoDB Atlas integration for reliable data storage
- **Real-time Updates**: Instant feedback on application status

## 🛠️ Tech Stack

### Frontend
- **React** - UI library for building interactive interfaces
- **Vite** - Modern build tool and dev server
- **CSS** - Styling and responsive design
- **API Integration** - RESTful API communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud database
- **JWT** - Secure authentication tokens
- **Middleware** - Custom authentication and request handling

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- npm (installed automatically with Node.js)
- Git (for version control)
- MongoDB Atlas account (already configured)

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
npm start
```

The server will run on `http://localhost:5001` with MongoDB successfully connected.

**Environment Variables** (already configured):
```env
PORT=5001
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key


```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173` (or your configured dev server port).

## 📁 Project Structure

```
├── backend/                 # Node.js/Express server
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API endpoints
│   ├── db.json            # Sample data
│   ├── server.js          # Entry point
│   └── package.json       # Dependencies
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── App.jsx        # Main component
│   │   └── main.jsx       # Entry point
│   ├── public/            # Static assets
│   ├── package.json       # Dependencies
│   └── vite.config.js     # Build configuration
│
├── README_RUN_GUIDE.md     # Detailed setup instructions
├── TECHNICAL_VIVA_GUIDE.md # Technical documentation
└── README.md              # This file
```

## 🔄 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user info

### Loan Routes
- `POST /api/loans/assess` - Assess loan eligibility
- `GET /api/loans/` - Get all loans
- `GET /api/loans/:id` - Get specific loan

### History Routes
- `GET /api/history/` - Get application history
- `POST /api/history/` - Create history record
- `DELETE /api/history/:id` - Delete history record

## 🔐 Authentication Flow

1. User registers with email and password
2. System creates JWT token upon successful login
3. Token is stored on frontend and sent with each request
4. Backend validates token in protected routes
5. Unauthorized requests are rejected with appropriate error messages

## 💾 Database Models

### User Model
- Email (unique identifier)
- Password (hashed)
- Created timestamp

### Loan Model
- User reference
- Loan amount
- Eligibility status
- Assessment details

### History Model
- User reference
- Application details
- Timestamp
- Status tracking

## 🧪 Development

### Frontend Development
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend Development
```bash
cd backend
npm start        # Start server
npm run dev      # Start with nodemon (if configured)
```

## 📝 Documentation

- **README_RUN_GUIDE.md** - Complete setup and running instructions
- **TECHNICAL_VIVA_GUIDE.md** - Technical architecture and implementation details

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## ⚠️ Important Notes

- Keep your `.env` file secure and never commit it to version control
- Ensure MongoDB Atlas connection is active before starting the server
- Frontend requires backend server to be running
- Clear browser cache if you experience any UI issues

## 🐛 Troubleshooting

### Backend won't start
- Verify MongoDB Atlas connection is active
- Check that port 5001 is not in use
- Ensure all environment variables are set correctly

### Frontend won't connect to backend
- Verify backend is running on http://localhost:5001
- Check CORS settings if using different ports
- Clear browser cache and local storage

### Database connection errors
- Check MongoDB Atlas credentials
- Verify IP whitelist allows your connection
- Ensure stable internet connection

## 📄 License

This project is provided as-is for educational purposes.

## 👤 Author

Created for the Intelligent Loan Eligibility Calculator project.

---

**Last Updated**: May 2026

For detailed setup instructions, refer to [README_RUN_GUIDE.md](README_RUN_GUIDE.md).
