# CTechLit Tech Consultancy Website

A modern, full-stack technology consultancy website built with React, Node.js, and MySQL. This project provides a complete solution for managing clients, service requests, and admin operations for a tech consultancy business.

## 🚀 Features

### Frontend (React + Vite)
- **Modern UI**: Built with TailwindCSS and responsive design
- **Animation**: Smooth animations using Framer Motion
- **Routing**: Client-side routing with React Router DOM
- **State Management**: Context API for authentication and state
- **API Integration**: Axios for HTTP requests
- **Form Handling**: React Hook Form with validation
- **Notifications**: Toast notifications for user feedback
- **Slider**: Hero section with SwiperJS

### Backend (Express.js)
- **RESTful API**: Well-structured API endpoints
- **Authentication**: JWT-based authentication with refresh tokens
- **Authorization**: Role-based access control (client, admin)
- **Database**: MySQL with connection pooling
- **Security**: Helmet, CORS, rate limiting, input validation
- **File Uploads**: Multer for handling file uploads
- **Error Handling**: Comprehensive error handling and logging
- **Audit Logging**: Automatic audit trails for sensitive operations

### Database (MySQL)
- **Normalized Schema**: Well-designed relational database structure
- **Indexes**: Optimized queries with proper indexing
- **Foreign Keys**: Data integrity with cascading deletes
- **JSON Storage**: Flexible data storage for complex structures
- **Views**: Simplified queries with database views
- **Triggers**: Automatic audit logging with database triggers

## 📁 Project Structure

```
CTechLit-Consultancy/
├── client/                     # React frontend
│   ├── public/                # Static files
│   ├── src/                   # Source code
│   │   ├── components/        # Reusable components
│   │   ├── contexts/          # React contexts
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Utility functions
│   │   └── App.jsx            # Main App component
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
├── server/                     # Express backend
│   ├── config/                # Configuration files
│   ├── middleware/            # Express middleware
│   ├── routes/                # API routes
│   ├── uploads/               # File uploads
│   ├── server.js              # Main server file
│   ├── package.json
│   └── .env.example
├── database/                   # Database setup
│   ├── schema.sql             # Database schema
│   └── sample_data.sql        # Sample data
└── README.md                  # This file
```

## 🛠️ Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MySQL** (v8.0 or higher)
- **Git**

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CTechLit-Consultancy
```

### 2. Database Setup

#### Option A: Using MySQL Command Line

```bash
# Start MySQL service
mysql -u root -p

# Create database and import schema
source database/schema.sql;
source database/sample_data.sql;
```

#### Option B: Using MySQL Workbench or phpMyAdmin

1. Create a new database named `ctechlit_db`
2. Import the SQL files in order:
   - `database/schema.sql` (create tables)
   - `database/sample_data.sql` (insert sample data)

### 3. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your database credentials
nano .env
```

Update the `.env` file with your database configuration:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ctechlit_db
JWT_SECRET=your-super-secret-jwt-key
```

#### Start the backend server:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file if needed
nano .env
```

#### Start the frontend development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔐 Default Login Credentials

After setting up the database with sample data, you can use these credentials:

### Admin Account
- **Email**: admin@ctechlit.com
- **Password**: admin123

### Test Client Account
You can create a new account through the registration form on the website.

## 📡 API Documentation

The backend provides RESTful API endpoints organized as follows:

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Service Endpoints
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services/request` - Submit service request
- `GET /api/services/requests/my` - Get user's requests

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password

### Admin Endpoints
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/requests` - Get all service requests
- `PUT /api/admin/requests/:id/status` - Update request status

## 🎨 Frontend Components

### Layouts
- **PublicLayout**: For public pages (home, about, services, contact)
- **ClientLayout**: For authenticated client dashboard
- **AdminLayout**: For admin panel

### Key Components
- **Header**: Navigation component with authentication
- **Footer**: Site footer with contact information
- **ProtectedRoute**: Route protection based on authentication and roles

### Pages
- **Home**: Landing page with hero section and services overview
- **Login/Register**: Authentication pages
- **Client Dashboard**: Client area for managing requests
- **Admin Dashboard**: Admin panel for managing users and requests

## 🔧 Configuration

### Environment Variables

#### Server (.env)
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ctechlit_db
JWT_SECRET=your-jwt-secret
```

#### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CTechLit Tech Consultancy
```

## 📝 Development

### Running Tests

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

### Code Formatting

```bash
# Backend
cd server
npm run lint

# Frontend
cd client
npm run lint
```

### Building for Production

```bash
# Build frontend
cd client
npm run build

# The build will be in the 'dist' folder
```

## 🚀 Deployment

### Backend Deployment

1. Set `NODE_ENV=production` in your environment
2. Update database credentials for production
3. Set strong JWT secrets
4. Configure proper CORS origins
5. Set up SSL/TLS certificates

### Frontend Deployment

1. Update `VITE_API_URL` to point to your production API
2. Build the frontend: `npm run build`
3. Deploy the `dist` folder to your hosting service

### Database Migration

For production, ensure you:
1. Set up database backups
2. Configure proper indexes
3. Set up monitoring and alerting
4. Implement connection pooling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@ctechlit.com
- Documentation: [Link to documentation]
- Issues: [GitHub Issues]

## 🎯 Roadmap

- [ ] Email notification system
- [ ] Payment integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app integration
- [ ] Multi-language support
- [ ] Advanced search and filtering
- [ ] Real-time chat system

## 🔒 Security

This project implements several security measures:
- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- SQL injection prevention
- XSS protection with Helmet.js

Make sure to:
- Use strong passwords and JWT secrets
- Keep dependencies updated
- Regularly backup your database
- Monitor for security vulnerabilities

---

Built with ❤️ by the CTechLit team