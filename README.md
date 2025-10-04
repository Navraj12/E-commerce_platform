<h1>E-commerce Platform</h1>

<h2> A full-stack e-commerce web application designed to provide a seamless online shopping experience. This project demonstrates the integration of frontend and backend technologies to create a robust and scalable platform. </h2>

Features

User Authentication: Secure login and registration system.

Product Catalog: Browse products by categories.

Shopping Cart: Add, remove, and update product quantities.

Order Management: View order history and order status.

Admin Dashboard: Manage products, categories, and orders.

Tech Stack

Frontend: HTML, CSS, JavaScript

Backend: Node.js with Express

Database: MongoDB

Authentication: JWT (JSON Web Tokens)

Payment Integration: Stripe (for handling payments)


Installation

Clone the repository:git clone https://github.com/Navraj12/E-commerce_platform.git
cd E-commerce_platform

Install dependencies:

For the backend:cd Backend
npm install

For the frontend:cd Frontend
npm install

Set up environment variables:

Create a .env file in the Backend directory and add the following:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key

Directory Structure
E-commerce_platform/
├── Backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
└── Frontend/
    ├── src/
    ├── public/
    └── package.json

Contributing

Fork the repository.

Create a new branch (git checkout -b feature-name).

Make your changes.

Commit your changes (git commit -am 'Add new feature').

Push to the branch (git push origin feature-name).

Create a new Pull Request.

























