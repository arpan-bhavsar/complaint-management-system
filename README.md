# 🛠️ IT Infrastructure & Complaint Management System

A production-grade, full-stack **MERN** (MongoDB, Express.js, React, Node.js) application engineered to streamline the reporting, tracking, and resolution of IT infrastructure issues. This platform features role-based access control, secure cloud media storage, and real-time tracking capabilities.

**🚀 Live Demo:** [Insert Your Vercel Link Here]

---

## 🏗️ System Architecture & Tech Stack

This project implements a decoupled client-server architecture, allowing for independent scaling, testing, and deployment.

### **Frontend (Client-Side)**
* **React.js (Vite):** Utilized for lightning-fast hot module replacement (HMR) and optimized production builds.
* **Bootstrap 5:** Implemented for a fully responsive, mobile-first user interface.
* **React Router DOM:** For seamless Single Page Application (SPA) navigation and protected route handling.
* **Axios:** For structured, promise-based HTTP requests to the backend API.
* **Chart.js:** Implemented for data visualization and administrative analytics.
* **Deployment:** Hosted on **Vercel's** Global Edge Network.

### **Backend (Server-Side)**
* **Node.js & Express.js:** RESTful API architecture handling routing, middleware, and business logic.
* **WebSockets:** Integrated for real-time server-to-client event broadcasting and instant dashboard updates.
* **JSON Web Tokens (JWT):** Stateless, encrypted authentication ensuring secure sessions without exposing plaintext passwords.
* **NodeMailer / SendGrid:** Automated email notification system for status updates.
* **CORS:** Configured with strict origin controls to prevent unauthorized domain access.
* **Deployment:** Hosted on **Render** Cloud Platform.

### **Database & Cloud Storage**
* **MongoDB Atlas:** Cloud-hosted NoSQL database.
* **Mongoose ODM:** For strict schema validation, model associations, query building, and pagination logic.
* **Cloudinary:** Integrated via `multer` and `multer-storage-cloudinary` to intercept file uploads, host images securely, and serve optimized media via CDN.

---

## ✨ Comprehensive Feature List

### 🔐 Security & Authentication
* **Role-Based Access Control (RBAC):** Distinct dashboards and permission levels for "System Administrators" and "Standard Users".
* **Secure Admin Authorization:** System Administrator registration is protected by a hardcoded organizational Secret Key to prevent unauthorized privilege escalation.
* **Password Cryptography:** Passwords are hashed and salted before database insertion.
* **Protected API Routes:** Middleware verifies JWT signatures before granting access to sensitive data or CRUD operations.

### 📝 Complaint Ticket Lifecycle & Tracking
* **Dynamic Form Submission:** Users can create comprehensive tickets including issue categories, priority levels, and detailed descriptions.
* **Evidence Uploads:** Seamless image uploads. The backend streams the file directly to Cloudinary and saves the secure return URL in the MongoDB document.
* **Automated Email Notifications:** Users receive instant email alerts whenever their ticket status is updated by an administrator.
* **Search & Pagination:** Advanced filtering mechanisms allow administrators to easily search, sort, and navigate through hundreds of historical tickets.

### 📊 Real-Time Analytics & Dashboards
* **User Dashboard:** Users can track the real-time status of their personal tickets (Pending, In Progress, Resolved).
* **Global Admin Dashboard:** Administrators have a global view of all system tickets, with the ability to update statuses and manage workflows.
* **Data Visualization:** Interactive charts visualize complaint volume, resolution times, and category distributions to help administrators track infrastructure health over time.

---

## ⚙️ Local Development Setup

Follow these instructions to run the application locally on your machine.

### 1. Prerequisites
Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v16 or higher)
* [Git](https://git-scm.com/)
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
* A [Cloudinary](https://cloudinary.com/) account
* An Email Service provider (for SMTP credentials)

### 2. Clone the Repository
```bash
git clone [https://github.com/arpan-bhavsar/complaint-management-system.git](https://github.com/arpan-bhavsar/complaint-management-system.git)
cd complaint-management-system
