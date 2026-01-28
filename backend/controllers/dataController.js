const Customer = require('../models/Customer');
const Seller = require('../models/Seller');
const Product = require('../models/Product');
const Warehouse = require('../models/Warehouse');

const getSellers = async (req, res) => {
  try {
    const sellers = await Seller.find({});
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find({});
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getSellers, getCustomers, getProducts, getWarehouses };
