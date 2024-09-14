const express = require('express');
const {
  createShop,
  addItemToShop,
  getAllShops,
  getShopById
} = require('../controllers/shopController');

const router = express.Router();

router.post('/shops', createShop);

router.post('/shops/:shopId/items', addItemToShop);

router.get('/shops', getAllShops);

router.get('/shops/:shopId', getShopById);

module.exports = router;
