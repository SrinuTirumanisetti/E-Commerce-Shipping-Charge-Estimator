const Warehouse = require('../models/Warehouse');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Seller = require('../models/Seller');
const { calculateDistance } = require('../utils/geoUtils');
const { getNearestWarehouse } = require('./warehouseController');

// Helper to calculate shipping cost
const calculateShippingCost = (distance, weight, deliverySpeed) => {
  let transportRate = 0;
  let mode = '';

  if (distance >= 500) {
    mode = 'Aeroplane';
    transportRate = 1;
  } else if (distance >= 100) {
    mode = 'Truck';
    transportRate = 2;
  } else {
    mode = 'Mini Van';
    transportRate = 3;
  }

  const baseShippingCharge = distance * transportRate * weight;

  let totalCharge = 0;
  const standardCourierCharge = 10;

  if (deliverySpeed.toLowerCase() === 'express') {
    // Rs 10 standard courier charge + Rs 1.2 per Kg Extra for express charge + calculated shipping charge on items
    totalCharge = standardCourierCharge + (1.2 * weight) + baseShippingCharge;
  } else {
    // Standard: Rs 10 standard courier charge + calculated shipping charge on items
    totalCharge = standardCourierCharge + baseShippingCharge;
  }

  return {
    mode,
    rate: transportRate,
    baseShippingCharge,
    totalCharge,
    distance
  };
};

// @desc    Get shipping charge for a customer from a warehouse
// @route   GET /api/v1/shipping-charge
// @access  Public
const getShippingCharge = async (req, res) => {
  try {
    const { warehouseId, customerId, deliverySpeed, productId } = req.query;

    if (!warehouseId || !customerId || !deliverySpeed || !productId) {
      return res.status(400).json({ message: 'Missing required parameters: warehouseId, customerId, deliverySpeed, productId' });
    }

    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) return res.status(404).json({ message: 'Warehouse not found' });

    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const distance = calculateDistance(
      warehouse.location.lat,
      warehouse.location.lng,
      customer.location.lat,
      customer.location.lng
    );

    const calculation = calculateShippingCost(distance, product.weight, deliverySpeed);

    res.json({
      shippingCharge: parseFloat(calculation.totalCharge.toFixed(2))
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Calculate shipping charge for a seller and customer (Combined)
// @route   POST /api/v1/shipping-charge/calculate
// @access  Public
const calculateShippingChargeCombined = async (req, res) => {
  try {
    const { sellerId, customerId, deliverySpeed, productId } = req.body;

    if (!sellerId || !customerId || !deliverySpeed || !productId) {
      return res.status(400).json({ message: 'Missing required parameters: sellerId, customerId, deliverySpeed, productId' });
    }

    // 1. Find Nearest Warehouse
    const seller = await Seller.findById(sellerId);
    if (!seller) return res.status(404).json({ message: 'Seller not found' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const warehouses = await Warehouse.find({});
    if (warehouses.length === 0) return res.status(404).json({ message: 'No warehouses found' });

    let nearestWarehouse = null;
    let minDistance = Infinity;

    warehouses.forEach((warehouse) => {
      const dist = calculateDistance(
        seller.location.lat,
        seller.location.lng,
        warehouse.location.lat,
        warehouse.location.lng
      );

      if (dist < minDistance) {
        minDistance = dist;
        nearestWarehouse = warehouse;
      }
    });

    // 2. Calculate Shipping Charge from Warehouse to Customer
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const distanceWarehouseToCustomer = calculateDistance(
      nearestWarehouse.location.lat,
      nearestWarehouse.location.lng,
      customer.location.lat,
      customer.location.lng
    );

    const calculation = calculateShippingCost(distanceWarehouseToCustomer, product.weight, deliverySpeed);

    res.json({
      shippingCharge: parseFloat(calculation.totalCharge.toFixed(2)),
      nearestWarehouse: {
        warehouseId: nearestWarehouse._id,
        warehouseLocation: {
          lat: nearestWarehouse.location.lat,
          long: nearestWarehouse.location.lng
        }
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getShippingCharge, calculateShippingChargeCombined };
