# Plastic Ware Inventory Management System

A full-stack Inventory Management System designed for businesses that sell and manage plastic ware products.

The system allows authorized users to manage products, categories, suppliers, inventory transactions, stock levels, and low-stock products through a web-based interface and RESTful API.

## Features

- User registration and login
- JWT-based authentication
- Role-based access control
- Product management
- Category management
- Supplier management
- Inventory transactions
- Stock IN and Stock OUT tracking
- Current stock monitoring
- Low-stock monitoring
- Input validation
- MySQL database integration
- RESTful API
- Centralized error handling
- Frontend dashboard

## User Roles

### Admin
- Full access to the system
- Manage products
- Manage categories
- Manage suppliers
- Record inventory transactions
- View stock levels
- Manage users

### Manager
- View products, categories, suppliers and inventory
- Create and update products
- Create and update categories
- Create and update suppliers
- Record inventory transactions
- View stock levels and low-stock products

### Staff
- View products
- View categories
- View suppliers
- View inventory
- View current stock
- View low-stock products

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- JWT
- bcryptjs
- MySQL2

### Database
- MySQL

### Development Tools
- VS Code
- Postman
- Git
- GitHub

## Project Structure

```text
plastic-ware-inventory-system/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── validators/
│   └── server.js
│
├── database/
│   ├── plastic_ware_inventory.sql
│   └── plastic_ware_New_inventory.sql
│
├── frontend/
│   ├── app.html
│   ├── app.css
│   └── app.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── Readme.md