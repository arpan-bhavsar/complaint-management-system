# 🛠️ IT Infrastructure & Complaint Management System

A production-grade, full-stack **MERN** (MongoDB, Express.js, React, Node.js) application engineered to streamline the reporting, tracking, and resolution of IT infrastructure issues. This platform features role-based access control, secure cloud media storage, and real-time tracking capabilities.

**🚀 Live Demo:** https://complaint-management-system-sigma-plum.vercel.app/

---

## 🏗️ System Architecture & Tech Stack

This project implements a decoupled client-server architecture, allowing for independent scaling, testing, and deployment.

### **Frontend (Client-Side)**
* **React.js (Vite):** Utilized for lightning-fast hot module replacement (HMR) and optimized production builds.
* **Bootstrap 5:** Implemented for a fully responsive, mobile-first user interface.
* **React Router DOM:** For seamless Single Page Application (SPA) navigation and protected route handling.
* **Axios:** For structured, promise-based HTTP requests to the backend API.
* **Deployment:** Hosted on **Vercel's** Global Edge Network.

### **Backend (Server-Side)**
* **Node.js & Express.js:** RESTful API architecture handling routing, middleware, and business logic.
* **WebSockets:** Integrated for real-time server-to-client event broadcasting and instant dashboard updates.
* **JSON Web Tokens (JWT):** Stateless, encrypted authentication ensuring secure sessions without exposing plaintext passwords.
* **CORS:** Configured with strict origin controls to prevent unauthorized domain access.
* **Deployment:** Hosted on **Render** Cloud Platform.

### **Database & Cloud Storage**
* **MongoDB Atlas:** Cloud-hosted NoSQL database.
* **Mongoose ODM:** For strict schema validation, model associations, and query building.
* **Cloudinary:** Integrated via `multer` and `multer-storage-cloudinary` to intercept file uploads, host images securely, and serve optimized media via CDN.

---

## ✨ Comprehensive Feature List

### 🔐 Security & Authentication
* **Role-Based Access Control (RBAC):** Distinct dashboards and permission levels for "System Administrators" and "Standard Users".
* **Secure Admin Authorization:** System Administrator registration is protected by a hardcoded organizational Secret Key to prevent unauthorized privilege escalation.
* **Password Cryptography:** Passwords are hashed and salted before database insertion.
* **Protected API Routes:** Middleware verifies JWT signatures before granting access to sensitive data or CRUD operations.

### 📝 Complaint Ticket Lifecycle
* **Dynamic Form Submission:** Users can create comprehensive tickets including issue categories, priority levels, and detailed descriptions.
* **Evidence Uploads:** Seamless image uploads. The backend streams the file directly to Cloudinary and saves the secure return URL in the MongoDB document.
* **Real-Time Dashboards:** 
  * **Users:** Can track the status of their personal tickets (Pending, In Progress, Resolved).
  * **Admins:** Have a global view of all system tickets, with the ability to update statuses and manage workflows.

---

## ⚙️ Local Development Setup

Follow these instructions to run the application locally on your machine.

### 1. Prerequisites
Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v16 or higher)
* [Git](https://git-scm.com/)
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
* A [Cloudinary](https://cloudinary.com/) account

### 2. Clone the Repository
```bash
git clone [https://github.com/arpan-bhavsar/complaint-management-system.git](https://github.com/arpan-bhavsar/complaint-management-system.git)
cd complaint-management-system
