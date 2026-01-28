# E-Commerce Shipping Charge Estimator

This project is a B2B e-commerce shipping charge estimator built using the **MERN Stack** (MongoDB, Express, React, Node.js) + Vite. It calculates shipping charges based on distance, weight, and delivery speed, and finds the nearest warehouse for sellers.

## Project Structure

- **backend/**: Node.js/Express server with MongoDB connection.
- **frontend/**: React application built with Vite.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (Atlas connection string provided in configuration)

## Setup & Installation

### 1. Backend Setup

1.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Environment Variables**: A `.env` file is already created with the necessary credentials.
    *   `MONGO_URI`: (Pre-configured)
    *   `PORT`: 5000
4.  **Seed the Database**: Populate the database with the specific assignment data (Sellers, Products, Customers, Warehouses):
    ```bash
    npm run seed
    # OR
    node seeder.js
    ```
5.  Start the server:
    ```bash
    npm start
    # OR for development (with nodemon)
    npm run dev
    ```
    The server runs on `http://localhost:5000`.

### 2. Frontend Setup

1.  Open a new terminal and navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open the link shown in the terminal (usually `http://localhost:5173`) to view the app.

## Features & APIs

The application implements the following APIs as per the assignment requirements:

1.  **Get Nearest Warehouse** (`GET /api/v1/warehouse/nearest`)
    *   Calculates distance using Haversine formula.
    *   Returns the nearest warehouse for a given seller.

2.  **Get Shipping Charge** (`GET /api/v1/shipping-charge`)
    *   Calculates cost based on transport mode (Aeroplane/Truck/Mini Van) and distance.
    *   Includes logic for Standard vs Express delivery speeds.

3.  **Calculate Combined** (`POST /api/v1/shipping-charge/calculate`)
    *   Chains the logic: Seller -> Nearest Warehouse -> Customer.
    *   Returns final shipping charge and warehouse details.

## Tech Stack

- **Frontend**: React, Vite, Axios
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB Atlas
