const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Customer = require('./models/Customer');
const Seller = require('./models/Seller');
const Warehouse = require('./models/Warehouse');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Drop collections to ensure indexes are rebuilt (especially for unique constraints)
    try { await Customer.collection.drop(); } catch (e) {}
    try { await Seller.collection.drop(); } catch (e) {}
    try { await Warehouse.collection.drop(); } catch (e) {}
    try { await Product.collection.drop(); } catch (e) {}

    // Warehouses
    const warehouses = await Warehouse.insertMany([
      {
        name: 'BLR_Warehouse',
        location: { lat: 12.99999, lng: 37.923273 },
      },
      {
        name: 'MUMB_Warehouse',
        location: { lat: 11.99999, lng: 27.923273 },
      },
    ]);

    // Sellers - Locations assumed as they are not explicitly provided in the table, 
    // but we need them for "Nearest Warehouse" logic.
    const sellers = await Seller.insertMany([
      {
        name: 'Nestle Seller',
        email: 'nestle@example.com',
        location: { lat: 12.5, lng: 37.5 }, // Near BLR
      },
      {
        name: 'Rice Seller',
        email: 'rice@example.com',
        location: { lat: 11.5, lng: 27.5 }, // Near MUMB
      },
      {
        name: 'Sugar Seller',
        email: 'sugar@example.com',
        location: { lat: 28.7041, lng: 77.1025 }, // Delhi (Far from both)
      },
    ]);

    // Products
    const products = await Product.insertMany([
      {
        name: 'Maggie 500g Packet',
        weight: 0.5,
        sellingPrice: 10,
        dimensions: { length: 10, width: 10, height: 10 }, // 10cmx10cmx10cm
        sellerId: sellers[0]._id, // Nestle Seller
      },
      {
        name: 'Rice Bag 10Kg',
        weight: 10,
        sellingPrice: 500,
        dimensions: { length: 1000, width: 800, height: 500 }, // 1000cmx800cmx500cm
        sellerId: sellers[1]._id, // Rice Seller
      },
      {
        name: 'Sugar Bag 25kg',
        weight: 25,
        sellingPrice: 700,
        dimensions: { length: 1000, width: 900, height: 600 }, // 1000cmx900cmx600cm
        sellerId: sellers[2]._id, // Sugar Seller
      },
    ]);

    // Customers
    const customers = await Customer.insertMany([
      {
        name: 'Shree Kirana Store',
        phoneNumber: '9847******',
        // Cust-123 location: { lat: 11.232, lng: 23.445495 }
        location: { lat: 11.232, lng: 23.445495 },
      },
      {
        name: 'Andheri Mini Mart',
        phoneNumber: '9101******',
        // Cust-124 location: { lat: 17.232, lng: 33.445495 }
        location: { lat: 17.232, lng: 33.445495 },
      },
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
