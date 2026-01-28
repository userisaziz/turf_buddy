# 🏟️ Klb TurfBuddy

**TurfBooking made simple.** A comprehensive sports turf booking platform bridging the gap between sports enthusiasts and turf owners.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

---

## 📖 Overview

**Klb TurfBuddy** is a robust full-stack solution designed to streamline the reservation process for sports turfs. It features three distinct but integrated modules:

1.  **User Application**: A cross-platform app (Web & Android) for finding, booking, and reviewing turfs.
2.  **Owner Dashboard**: A powerful management interface for turf owners to track bookings, revenue, and slots.
3.  **Backend API**: A secure and scalable NodeJS server managing data, authentication, and payments.

## 🏗️ Architecture

The following diagram illustrates the high-level architecture of the TurfBuddy ecosystem:

```mermaid
graph TD
    subgraph Clients
        UserApp[User Web/App] -->|HTTP/REST| API
        OwnerApp[Owner Dashboard] -->|HTTP/REST| API
    end

    subgraph Backend
        API[Node.js Express Server]
        Auth[Auth Middleware]
        Controllers[Business Logic]
        API --> Auth
        Auth --> Controllers
    end

    subgraph Database
        DB[(MongoDB)]
    end

    subgraph External_Services
        Cloudinary[Cloudinary (Images)]
        Razorpay[Razorpay (Payments)]
        Email[Nodemailer (Notifications)]
    end

    Controllers -->|Read/Write| DB
    Controllers -->|Uploads| Cloudinary
    Controllers -->|Payments| Razorpay
    Controllers -->|Send Emails| Email
```

---

## ✨ Features

### 👤 User Module
*   **Platform Agnostic**: Available as a Progressive Web App (PWA) and a native Android App (via Capacitor).
*   **Smart Search**: Filter turfs by location, sport, and price.
*   **Real-time Availability**: View current slot availability instantly.
*   **Secure Payments**: Integrated Razorpay gateway for seamless bookings.
*   **Booking History**: Track past games and download QR-code based tickets.
*   **Review System**: Rate and review turfs after play.

### 🏢 Owner Module
*   **Dashboard Analytics**: Visual graphs (Recharts) for revenue and booking trends.
*   **Slot Management**: Dynamic pricing for Day/Night slots.
*   **Booking Overview**: Calendar view of all upcoming reservations.
*   **Review Management**: Reply to user reviews to maintain engagement.

### 🛡️ Admin/Server
*   **Role-Based Access Control (RBAC)**: Secure routes for Users, Owners, and Admins.
*   **Owner Vetting**: Approval workflow for new turf owners.
*   **Automated Emails**: Confirmation emails with QR codes for bookings.

---

## 🛠️ Tech Stack

### Frontend (Client)
*   **Framework**: React.js (Vite)
*   **State Management**: Redux Toolkit & Redux Persist
*   **Styling**: Tailwind CSS & DaisyUI
*   **Mobile**: capacitor/core & capacitor/android (User Client)
*   **Routing**: React Router DOM

### Backend (Server)
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (Mongoose ODM)
*   **Authentication**: JSON Web Tokens (JWT) & Argon2 (Hashing)
*   **Logging**: Winston

### Third-Party Services
*   **Payments**: Razorpay
*   **Storage**: Cloudinary
*   **Email**: Nodemailer

---

## 📂 Project Structure

```bash
turfBuddy/
├── client/
│   ├── user/          # User-facing Application (React + Capacitor)
│   └── owner/         # Owner Management Dashboard (React)
├── server/            # Backend API (Node/Express)
└── README.md          # Project Documentation
```

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas URL)
*   Cloudinary Account
*   Razorpay Test Account

### 1. Backend Setup

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in `server/` with the following keys:
    ```env
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    
    JWT_SECRET=your_super_secret_key
    
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    
    EMAIL=your_gmail_address
    PASSWORD=your_gmail_app_password
    
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_SECRET_KEY=your_razorpay_secret_key
    
    # Frontend URLs for CORS
    USER_URL=http://localhost:5173
    OWNER_URL=http://localhost:5174
    ```
4.  Start the server:
    ```bash
    npm run server
    ```

### 2. Client Setup (User & Owner)

**User Client:**
```bash
cd client/user
npm install
npm run dev
# App runs at http://localhost:5173
```

**Owner Client:**
```bash
cd client/owner
npm install
npm run dev
# App runs at http://localhost:5174
```

---

## 📱 Mobile App (Android)

The User client is configured with Capacitor to generate a native Android APK.

1.  Ensure you have **Android Studio** installed.
2.  Sync the web assets:
    ```bash
    cd client/user
    npm run build
    npx cap sync
    ```
3.  Open the project in Android Studio:
    ```bash
    npx cap open android
    ```
4.  Build the APK from Android Studio menu: `Build > Build Bundle(s) / APK(s) > Build APK(s)`.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:
1.  Fork the repo.
2.  Create a feature branch: `git checkout -b feature/AmazingFeature`.
3.  Commit changes: `git commit -m 'Add AmazingFeature'`.
4.  Push to branch: `git push origin feature/AmazingFeature`.
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

**Klb TurfBuddy Team**  
Email: azizadnan370@gmail.com
