const Warehouse = require('../models/Warehouse');
const Seller = require('../models/Seller');
const { calculateDistance } = require('../utils/geoUtils');

// @desc    Get nearest warehouse for a seller
// @route   GET /api/v1/warehouse/nearest
// @access  Public
const getNearestWarehouse = async (req, res) => {
  try {
    const { sellerId } = req.query;

    if (!sellerId) {
      return res.status(400).json({ message: 'Seller ID is required' });
    }

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const warehouses = await Warehouse.find({});
    if (warehouses.length === 0) {
      return res.status(404).json({ message: 'No warehouses found' });
    }

    let nearestWarehouse = null;
    let minDistance = Infinity;

    warehouses.forEach((warehouse) => {
      const distance = calculateDistance(
        seller.location.lat,
        seller.location.lng,
        warehouse.location.lat,
        warehouse.location.lng
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestWarehouse = warehouse;
      }
    });

    res.json({
      warehouseId: nearestWarehouse._id,
      warehouseLocation: {
        lat: nearestWarehouse.location.lat,
        long: nearestWarehouse.location.lng,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getNearestWarehouse };
