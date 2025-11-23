# 📦 Inventory Management System (MERN + SQLite)

A complete **Product Inventory Management System** built using  
**React (frontend)**, **Node.js + Express (backend)**, and **SQLite (database)**.

This project includes:

- Product listing & filtering  
- Search (client + server)  
- Inline editing  
- CSV import & export  
- Inventory change history tracking  
- JWT user authentication (Login + Register)  
- Pagination, sorting, category filtering  
- Deployed frontend & backend  
- Sample CSV dataset  

---

## 🚀 Live Demo URLs

### 🔗 Frontend (React)  
👉 https://your-frontend-url.vercel.app

### 🔗 Backend API (Node + Express)  
👉 https://your-backend-url.onrender.com

Example API endpoint:  
`GET /api/products`

---

## 📝 Features

### ✔ Products Management
- Add new products  
- Edit inline in table  
- Delete product  
- View product history  
- Dynamic “In Stock / Out of Stock” badges  

### ✔ Search & Filters
- Search by name  
- Filter by category  
- Sort by name, category, brand, stock, status  
- Pagination: 10 / 20 / 30 / 50 items per page  

### ✔ CSV Import & Export
- Import CSV with validation  
- Skip duplicates  
- Export all products with correct headers  

### ✔ Inventory History
- Auto-logs on stock updates  
- History panel with timestamp, old & new quantity, updated by  

### ✔ Authentication (JWT)
- Register, Login  
- Token stored in localStorage  
- Protected routes for managing products  
- Authorization: Bearer Token  

---

## 🗂 Project Structure
```
inventory-management-app/
│
├── backend/
│ ├── controllers/
│ ├── middlewares/
│ ├── routes/
│ ├── utils/
│ ├── inventory.db (auto-created)
│ ├── server.js
│ └── package.json
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── api/
│ │ └── styles/
│ └── package.json
│
├── sample-products.csv
└── README.md
```

---

## ⚙️ Tech Stack

### **Frontend**
- React  
- React Router  
- Axios  
- React Toastify  
- CSS  

### **Backend**
- Node.js  
- Express  
- SQLite3  
- Multer (file upload)  
- CSV-parser  
- jsonwebtoken (JWT)  
- bcryptjs  
- express-validator  

---

## 🛠 Installation & Running Locally

### 1️⃣ Clone Repo

```bash
git clone https://github.com/<your-username>/Inventory-Management-System.git
cd Inventory-Management-System
```
### 2️⃣ Backend Setup
```bash
cd backend
npm install
npm run dev
```
### Environment variables (backend/.env):
```bash 
PORT=5000
DB_PATH=./inventory.db
JWT_SECRET=your_secret_key_here
```
Backend runs at:
```bash
👉 http://localhost:5000
```
### 3️⃣ Frontend Setup
``` bash
cd ../frontend
npm install
npm start
``` 
Environment variables (frontend/.env):
```bash
REACT_APP_API_URL=http://localhost:5000
```
Frontend runs at:
```bash
👉 http://localhost:3000
```
