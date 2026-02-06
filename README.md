# TurfBuddy - Smart Sports Turf Booking Platform
<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)


**Turf Buddy System Architecture**
<img width="3361" height="1840" alt="image" src="https://github.com/user-attachments/assets/3ca210e6-009c-46e2-a50e-96b8e6565e4d" />


**A comprehensive full-stack solution for sports turf booking and management**

[Features](#-key-features) • [Architecture](#-system-architecture) • [Tech Stack](#-technology-stack) • [Getting Started](#-getting-started) • [API Documentation](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Mobile App Deployment](#-mobile-app-deployment)
- [Security & Authentication](#-security--authentication)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**TurfBuddy** is a modern, scalable platform that revolutionizes the sports turf booking experience. It bridges the gap between sports enthusiasts seeking venues and turf owners managing their facilities through three integrated modules:

### 🎭 Three-Module Architecture

1. **👥 User Module** - Cross-platform booking application (Web + Android)
2. **🏢 Owner Module** - Comprehensive management dashboard
3. **⚙️ Backend API** - Robust Node.js server with MongoDB

### 🎪 Use Cases

- **For Players**: Discover, book, and review sports turfs in your area
- **For Turf Owners**: Manage facilities, track bookings, and analyze revenue
- **For Administrators**: Oversee platform operations and approve new owners

---

## ✨ Key Features

### 👤 User Application

| Feature | Description |
|---------|-------------|
| 🔍 **Smart Search** | Filter turfs by location, sport type, and price range |
| 📱 **Cross-Platform** | Available as PWA and native Android app via Capacitor |
| 💳 **Secure Payments** | Razorpay integration for seamless transactions |
| ⏰ **Real-time Availability** | Live slot status updates |
| 🎫 **Digital Tickets** | QR code-based booking confirmations |
| 📜 **Booking History** | Complete transaction records |
| ⭐ **Review System** | Rate and review facilities post-booking |

### 🏢 Owner Dashboard

| Feature | Description |
|---------|-------------|
| 📊 **Analytics Dashboard** | Visual revenue and booking trends (Recharts) |
| 🎯 **Slot Management** | Dynamic pricing for day/night slots |
| 📅 **Calendar View** | Comprehensive booking overview |
| 💬 **Review Management** | Respond to customer feedback |
| 📈 **Revenue Tracking** | Real-time financial analytics |
| 🏟️ **Multi-Turf Support** | Manage multiple facilities |

### 🛡️ Admin & Backend

| Feature | Description |
|---------|-------------|
| 🔐 **Role-Based Access Control** | Secure authentication for Users, Owners, Admins |
| ✅ **Owner Verification** | Approval workflow for new turf owners |
| 📧 **Automated Notifications** | Email confirmations with QR codes |
| 📝 **Activity Logging** | Winston-based comprehensive logging |
| 🔒 **Data Security** | Argon2 password hashing + JWT tokens |

---

## 🏗️ System Architecture

### High-Level Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        UA[User Web App<br/>React + Vite]
        UMA[User Mobile App<br/>Capacitor Android]
        OD[Owner Dashboard<br/>React + Vite]
    end

    subgraph "API Gateway"
        API[Express API Server<br/>Port 3000]
        Auth[JWT Authentication<br/>Middleware]
        RBAC[Role-Based Access<br/>Control]
    end

    subgraph "Business Logic Layer"
        UC[User Controller]
        OC[Owner Controller]
        BC[Booking Controller]
        PC[Payment Controller]
        AC[Admin Controller]
    end

    subgraph "Data Layer"
        DB[(MongoDB Database)]
        Models[Mongoose Models]
    end

    subgraph "External Services"
        Cloud[Cloudinary<br/>Image Storage]
        RP[Razorpay<br/>Payment Gateway]
        NM[Nodemailer<br/>Email Service]
    end

    UA -->|HTTP/REST| API
    UMA -->|HTTP/REST| API
    OD -->|HTTP/REST| API
    
    API --> Auth
    Auth --> RBAC
    RBAC --> UC
    RBAC --> OC
    RBAC --> BC
    RBAC --> PC
    RBAC --> AC
    
    UC --> Models
    OC --> Models
    BC --> Models
    PC --> Models
    AC --> Models
    
    Models --> DB
    
    UC -.->|Upload Images| Cloud
    OC -.->|Upload Images| Cloud
    PC -.->|Process Payments| RP
    BC -.->|Send Confirmations| NM
```

### Request Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client App
    participant API as API Server
    participant Auth as Auth Middleware
    participant Ctrl as Controller
    participant DB as MongoDB
    participant Ext as External Services

    U->>C: Action (e.g., Book Turf)
    C->>API: HTTP Request + JWT Token
    API->>Auth: Validate Token
    Auth->>Auth: Check Role Permissions
    alt Valid Token & Permissions
        Auth->>Ctrl: Forward Request
        Ctrl->>DB: Query/Update Data
        DB-->>Ctrl: Response
        Ctrl->>Ext: External Service Call
        Ext-->>Ctrl: Service Response
        Ctrl-->>API: Processed Data
        API-->>C: JSON Response
        C-->>U: Update UI
    else Invalid Token
        Auth-->>API: 401 Unauthorized
        API-->>C: Error Response
        C-->>U: Show Error
    end
```

### Data Flow Architecture

```mermaid
graph LR
    subgraph "Input Layer"
        UI[User Input]
        FV[Form Validation]
    end

    subgraph "Processing Layer"
        Redux[Redux Store]
        API[API Calls]
        Middleware[Express Middleware]
    end

    subgraph "Storage Layer"
        Persist[Redux Persist]
        Mongo[(MongoDB)]
        Cloud[Cloudinary]
    end

    UI --> FV
    FV --> Redux
    Redux --> API
    API --> Middleware
    Middleware --> Mongo
    Middleware --> Cloud
    Redux --> Persist
    Mongo -.->|Query Results| Middleware
    Middleware -.->|Response| Redux
```

---

## 🛠️ Technology Stack

### Frontend Technologies

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | React 18 + Vite | Fast, modern UI development |
| **State Management** | Redux Toolkit | Centralized state management |
| **State Persistence** | Redux Persist | Maintain state across sessions |
| **Styling** | Tailwind CSS + DaisyUI | Utility-first responsive design |
| **Routing** | React Router DOM v6 | Client-side navigation |
| **Mobile** | Capacitor | Cross-platform mobile deployment |
| **Charts** | Recharts | Data visualization |
| **HTTP Client** | Axios | API communication |

### Backend Technologies

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Runtime** | Node.js 18+ | Server-side JavaScript |
| **Framework** | Express.js | Web application framework |
| **Database** | MongoDB | NoSQL document database |
| **ODM** | Mongoose | MongoDB object modeling |
| **Authentication** | JWT | Stateless authentication |
| **Password Hashing** | Argon2 | Secure password storage |
| **Logging** | Winston | Application logging |
| **Validation** | Express Validator | Input validation |

### Third-Party Integrations

| Service | Purpose | Documentation |
|---------|---------|---------------|
| **Cloudinary** | Image upload & management | [Docs](https://cloudinary.com/documentation) |
| **Razorpay** | Payment processing | [Docs](https://razorpay.com/docs/) |
| **Nodemailer** | Email notifications | [Docs](https://nodemailer.com/) |

### Development Tools

- **Package Manager**: npm
- **Version Control**: Git
- **API Testing**: Postman/Thunder Client
- **Code Quality**: ESLint
- **Mobile Build**: Android Studio

---

## 📂 Project Structure

```
turfBuddy/
│
├── client/
│   ├── user/                      # User-facing application
│   │   ├── src/
│   │   │   ├── components/        # Reusable React components
│   │   │   │   ├── common/        # Shared UI components
│   │   │   │   ├── turf/          # Turf-related components
│   │   │   │   ├── booking/       # Booking flow components
│   │   │   │   └── review/        # Review components
│   │   │   ├── pages/             # Page components
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── TurfDetails.jsx
│   │   │   │   ├── Booking.jsx
│   │   │   │   └── Profile.jsx
│   │   │   ├── redux/             # State management
│   │   │   │   ├── store.js       # Redux store configuration
│   │   │   │   ├── slices/        # Redux slices
│   │   │   │   │   ├── authSlice.js
│   │   │   │   │   ├── turfSlice.js
│   │   │   │   │   └── bookingSlice.js
│   │   │   │   └── api/           # API integration
│   │   │   ├── utils/             # Utility functions
│   │   │   ├── hooks/             # Custom React hooks
│   │   │   ├── App.jsx            # Root component
│   │   │   └── main.jsx           # Entry point
│   │   ├── public/                # Static assets
│   │   ├── android/               # Capacitor Android project
│   │   ├── capacitor.config.json  # Capacitor configuration
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   └── owner/                     # Owner dashboard
│       ├── src/
│       │   ├── components/        # Dashboard components
│       │   │   ├── analytics/     # Analytics components
│       │   │   ├── turf/          # Turf management
│       │   │   ├── booking/       # Booking management
│       │   │   └── review/        # Review management
│       │   ├── pages/             # Dashboard pages
│       │   │   ├── Dashboard.jsx
│       │   │   ├── MyTurfs.jsx
│       │   │   ├── Bookings.jsx
│       │   │   └── Analytics.jsx
│       │   ├── redux/             # State management
│       │   ├── utils/
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── public/
│       ├── package.json
│       └── vite.config.js
│
├── server/                        # Backend API
│   ├── config/                    # Configuration files
│   │   ├── db.js                  # Database connection
│   │   ├── cloudinary.js          # Cloudinary setup
│   │   └── razorpay.js            # Payment gateway setup
│   ├── controllers/               # Request handlers
│   │   ├── userController.js      # User operations
│   │   ├── ownerController.js     # Owner operations
│   │   ├── turfController.js      # Turf management
│   │   ├── bookingController.js   # Booking logic
│   │   ├── paymentController.js   # Payment processing
│   │   └── adminController.js     # Admin operations
│   ├── models/                    # Mongoose schemas
│   │   ├── User.js
│   │   ├── Owner.js
│   │   ├── Turf.js
│   │   ├── Booking.js
│   │   └── Review.js
│   ├── routes/                    # API routes
│   │   ├── userRoutes.js
│   │   ├── ownerRoutes.js
│   │   ├── turfRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/                # Custom middleware
│   │   ├── auth.js                # Authentication
│   │   ├── roleCheck.js           # Authorization
│   │   ├── upload.js              # File upload
│   │   └── errorHandler.js        # Error handling
│   ├── utils/                     # Utility functions
│   │   ├── emailService.js        # Email utilities
│   │   ├── qrGenerator.js         # QR code generation
│   │   └── logger.js              # Winston logger
│   ├── validators/                # Input validation
│   ├── .env                       # Environment variables
│   ├── .env.example               # Environment template
│   ├── server.js                  # Entry point
│   └── package.json
│
├── docs/                          # Documentation
│   ├── API.md                     # API documentation
│   ├── DEPLOYMENT.md              # Deployment guide
│   └── CONTRIBUTING.md            # Contribution guidelines
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ BOOKING : creates
    USER ||--o{ REVIEW : writes
    OWNER ||--o{ TURF : owns
    TURF ||--o{ BOOKING : receives
    TURF ||--o{ REVIEW : receives
    BOOKING ||--|| PAYMENT : includes

    USER {
        ObjectId _id PK
        string name
        string email UK
        string phone UK
        string password
        string role
        boolean isVerified
        timestamp createdAt
    }

    OWNER {
        ObjectId _id PK
        string name
        string email UK
        string phone UK
        string password
        string role
        boolean isApproved
        string businessName
        string gstNumber
        timestamp createdAt
    }

    TURF {
        ObjectId _id PK
        ObjectId ownerId FK
        string name
        string location
        array sports
        object pricing
        array images
        object amenities
        number rating
        timestamp createdAt
    }

    BOOKING {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId turfId FK
        date bookingDate
        string timeSlot
        number amount
        string status
        string qrCode
        timestamp createdAt
    }

    REVIEW {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId turfId FK
        number rating
        string comment
        string ownerReply
        timestamp createdAt
    }

    PAYMENT {
        ObjectId _id PK
        ObjectId bookingId FK
        string razorpayOrderId
        string razorpayPaymentId
        number amount
        string status
        timestamp createdAt
    }
```

### Collection Schemas

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  phone: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'owner', 'admin']),
  isVerified: Boolean (default: false),
  profileImage: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

#### Turfs Collection
```javascript
{
  _id: ObjectId,
  ownerId: ObjectId (ref: 'Owner'),
  name: String (required),
  description: String,
  location: {
    address: String,
    city: String,
    state: String,
    coordinates: { lat: Number, lng: Number }
  },
  sports: [String] (e.g., ['cricket', 'football']),
  pricing: {
    daySlot: Number,
    nightSlot: Number
  },
  images: [String] (Cloudinary URLs),
  amenities: [String],
  capacity: Number,
  rating: Number (default: 0),
  totalReviews: Number (default: 0),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

#### Bookings Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  turfId: ObjectId (ref: 'Turf'),
  bookingDate: Date (required),
  timeSlot: String (required, enum: ['day', 'night']),
  amount: Number (required),
  status: String (enum: ['pending', 'confirmed', 'cancelled', 'completed']),
  paymentId: ObjectId (ref: 'Payment'),
  qrCode: String (base64 encoded),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:

| Software | Minimum Version | Download Link |
|----------|----------------|---------------|
| Node.js | 18.0.0 | [nodejs.org](https://nodejs.org/) |
| MongoDB | 4.4+ | [mongodb.com](https://www.mongodb.com/) |
| Git | Latest | [git-scm.com](https://git-scm.com/) |
| Android Studio | Latest (for mobile) | [developer.android.com](https://developer.android.com/studio) |

### Installation Steps

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/azizadnan/turfBuddy.git
cd turfBuddy
```

#### 2️⃣ Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

**Environment Variables (.env):**

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/turfbuddy
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/turfbuddy

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Gmail)
EMAIL=your_email@gmail.com
PASSWORD=your_gmail_app_password

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET_KEY=your_razorpay_secret_key

# CORS - Frontend URLs
USER_URL=http://localhost:5173
OWNER_URL=http://localhost:5174
```

**Start the backend server:**

```bash
npm run server
# Server will run on http://localhost:3000
```

#### 3️⃣ User Client Setup

```bash
# Navigate to user client directory
cd ../client/user

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:3000/api" > .env

# Start development server
npm run dev
# App will run on http://localhost:5173
```

#### 4️⃣ Owner Dashboard Setup

```bash
# Navigate to owner client directory
cd ../owner

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:3000/api" > .env

# Start development server
npm run dev
# Dashboard will run on http://localhost:5174
```

### 🧪 Verification Steps

1. **Backend Health Check:**
   ```bash
   curl http://localhost:3000/api/health
   # Expected: {"status": "OK", "timestamp": "..."}
   ```

2. **Database Connection:**
   - Check server logs for "MongoDB Connected Successfully"

3. **Frontend Access:**
   - User App: http://localhost:5173
   - Owner Dashboard: http://localhost:5174

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### API Endpoints Overview

#### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| POST | `/auth/logout` | User logout | Yes |
| GET | `/auth/verify-email/:token` | Verify email address | No |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password/:token` | Reset password | No |

#### 👤 User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/profile` | Get user profile | Yes (User) |
| PUT | `/users/profile` | Update profile | Yes (User) |
| GET | `/users/bookings` | Get booking history | Yes (User) |
| DELETE | `/users/account` | Delete account | Yes (User) |

#### 🏟️ Turf Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/turfs` | Get all turfs (with filters) | No |
| GET | `/turfs/:id` | Get turf details | No |
| POST | `/turfs` | Create new turf | Yes (Owner) |
| PUT | `/turfs/:id` | Update turf | Yes (Owner) |
| DELETE | `/turfs/:id` | Delete turf | Yes (Owner) |
| GET | `/turfs/:id/availability` | Check slot availability | No |

#### 📅 Booking Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/bookings` | Create booking | Yes (User) |
| GET | `/bookings/:id` | Get booking details | Yes |
| PUT | `/bookings/:id/cancel` | Cancel booking | Yes (User) |
| GET | `/bookings/user/:userId` | Get user bookings | Yes (User) |
| GET | `/bookings/turf/:turfId` | Get turf bookings | Yes (Owner) |

#### 💳 Payment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/payments/create-order` | Create Razorpay order | Yes (User) |
| POST | `/payments/verify` | Verify payment | Yes (User) |
| GET | `/payments/:bookingId` | Get payment details | Yes |

#### ⭐ Review Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/reviews` | Add review | Yes (User) |
| GET | `/reviews/turf/:turfId` | Get turf reviews | No |
| PUT | `/reviews/:id` | Update review | Yes (User) |
| DELETE | `/reviews/:id` | Delete review | Yes (User) |
| POST | `/reviews/:id/reply` | Owner reply to review | Yes (Owner) |

#### 👨‍💼 Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/owners/pending` | Get pending approvals | Yes (Admin) |
| PUT | `/admin/owners/:id/approve` | Approve owner | Yes (Admin) |
| PUT | `/admin/owners/:id/reject` | Reject owner | Yes (Admin) |
| GET | `/admin/analytics` | Platform analytics | Yes (Admin) |

### Example API Requests

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "password": "SecurePass123!",
  "role": "user"
}
```

#### Create Booking
```bash
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "turfId": "507f1f77bcf86cd799439011",
  "bookingDate": "2024-02-15",
  "timeSlot": "day",
  "amount": 1500
}
```

#### Get Turfs with Filters
```bash
GET /api/turfs?city=Mysuru&sport=cricket&minPrice=1000&maxPrice=2000
```

---

## 📱 Mobile App Deployment

### Android APK Build Process

#### Prerequisites
- Android Studio installed
- Java Development Kit (JDK) 11 or higher
- Android SDK configured

#### Build Steps

1. **Prepare the Build:**
   ```bash
   cd client/user
   
   # Install dependencies (if not already done)
   npm install
   
   # Build production assets
   npm run build
   ```

2. **Sync Capacitor:**
   ```bash
   # Copy web assets to native project
   npx cap sync android
   
   # Optional: Update Capacitor
   npx cap update android
   ```

3. **Open in Android Studio:**
   ```bash
   npx cap open android
   ```

4. **Configure Build Settings:**
   
   Edit `android/app/build.gradle`:
   ```gradle
   android {
       defaultConfig {
           applicationId "com.turfbuddy.app"
           minSdkVersion 22
           targetSdkVersion 33
           versionCode 1
           versionName "1.0.0"
       }
   }
   ```

5. **Generate Signed APK:**
   - In Android Studio: `Build > Generate Signed Bundle / APK`
   - Select `APK`
   - Create new keystore or use existing
   - Choose build variant: `release`
   - APK location: `android/app/release/app-release.apk`

6. **Generate Debug APK (for testing):**
   ```bash
   cd android
   ./gradlew assembleDebug
   # APK: android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Capacitor Configuration

`capacitor.config.json`:
```json
{
  "appId": "com.turfbuddy.app",
  "appName": "TurfBuddy",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "android": {
    "allowMixedContent": true,
    "backgroundColor": "#ffffff"
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#ffffff",
      "showSpinner": true
    }
  }
}
```

---

## 🔒 Security & Authentication

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant API
    participant DB

    User->>Client: Enter Credentials
    Client->>API: POST /auth/login
    API->>DB: Verify Credentials
    DB-->>API: User Data
    API->>API: Generate JWT
    API-->>Client: JWT Token
    Client->>Client: Store in Redux + LocalStorage
    
    Note over Client,API: Protected Request
    Client->>API: Request + JWT Header
    API->>API: Verify JWT
    alt Valid Token
        API-->>Client: Protected Resource
    else Invalid/Expired
        API-->>Client: 401 Unauthorized
        Client->>Client: Clear Token
        Client->>User: Redirect to Login
    end
```

### Security Features

| Feature | Implementation | Purpose |
|---------|----------------|---------|
| **Password Hashing** | Argon2 | Secure password storage |
| **Token-Based Auth** | JWT (7-day expiry) | Stateless authentication |
| **Role-Based Access** | Middleware checks | Authorization control |
| **Input Validation** | Express Validator | Prevent injection attacks |
| **CORS** | Configured origins | Prevent unauthorized access |
| **Rate Limiting** | Express Rate Limit | Prevent DDoS attacks |
| **XSS Protection** | Helmet.js | Security headers |
| **SQL Injection** | Mongoose ODM | Parameterized queries |

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Workflow

1. **Fork the Repository**
   ```bash
   # Click 'Fork' on GitHub, then:
   git clone https://github.com/YOUR_USERNAME/turfBuddy.git
   cd turfBuddy
   git remote add upstream https://github.com/azizadnan/turfBuddy.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/bug-description
   ```

3. **Make Your Changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable
   - Update documentation

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```
   
   **Commit Message Convention:**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes
   - `refactor:` Code refactoring
   - `test:` Test additions/changes
   - `chore:` Build/config changes

5. **Push to Your Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Provide clear description of changes
   - Link related issues

### Code Style Guidelines

- Use ESLint configuration provided
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Write meaningful variable names
- Add comments for complex logic

### Reporting Issues

When reporting bugs, include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, etc.)

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 TurfBuddy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

See the [LICENSE](LICENSE) file for full details.

---

## 📞 Contact & Support

### Project Maintainer

**Aziz Adnan**
- 📧 Email: azizadnan370@gmail.com
- 🐙 GitHub: [@azizadnan](https://github.com/azizadnan)
- 💼 LinkedIn: [Connect with me](https://linkedin.com/in/azizadnan)

### Support Channels

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/azizadnan/turfBuddy/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/azizadnan/turfBuddy/discussions)
- 📖 **Documentation**: [Wiki](https://github.com/azizadnan/turfBuddy/wiki)

---

## 🌟 Acknowledgments

Special thanks to:
- All contributors who have helped improve this project
- Open-source community for amazing tools and libraries
- Sports enthusiasts who inspired this platform

---

## 🗺️ Roadmap

### Upcoming Features

- [ ] **Payment Integration Expansion**
  - Support for UPI payments
  - Multiple payment gateways
  
- [ ] **Advanced Booking Features**
  - Recurring bookings
  - Group booking discounts
  - Waitlist functionality

- [ ] **Enhanced Analytics**
  - Predictive analytics for owners
  - User behavior insights
  - Revenue forecasting

- [ ] **Social Features**
  - Player profiles
  - Team formation
  - Tournament organization

- [ ] **Mobile App Enhancements**
  - iOS version
  - Push notifications
  - Offline mode

- [ ] **AI Integration**
  - Smart turf recommendations
  - Dynamic pricing based on demand
  - Chatbot support

---

<div align="center">

### Made with ❤️ for the Sports Community

**⭐ Star this repo if you find it helpful!**

[Report Bug](https://github.com/azizadnan/turfBuddy/issues) • [Request Feature](https://github.com/azizadnan/turfBuddy/issues) • [Contribute](CONTRIBUTING.md)

</div>
