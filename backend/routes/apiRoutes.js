const express = require('express');
const router = express.Router();
const { getNearestWarehouse } = require('../controllers/warehouseController');
const { getShippingCharge, calculateShippingChargeCombined } = require('../controllers/shippingController');
const { getSellers, getCustomers, getProducts, getWarehouses } = require('../controllers/dataController');

// 1. Get the Nearest Warehouse for a Seller
router.get('/warehouse/nearest', getNearestWarehouse);

// 2. Get the Shipping Charge for a Customer from a Warehouse
router.get('/shipping-charge', getShippingCharge);

// 3. Get the Shipping Charges for a Seller and Customer
router.post('/shipping-charge/calculate', calculateShippingChargeCombined);

// Helper Routes for Frontend
router.get('/sellers', getSellers);
router.get('/customers', getCustomers);
router.get('/products', getProducts);
router.get('/warehouses', getWarehouses);

module.exports = router;
