const Shop = require('../models/shopModel');
const Item = require('../models/itemModel');


const createShop = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  try {
    const newShop = new Shop({
      name,
      address,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],  
      }
    });

    await newShop.save();
    return res.status(201).json({ message: 'Shop created successfully', shop: newShop });
  } catch (error) {
    console.error('Error creating shop:', error);
    return res.status(500).json({ message: 'Error creating shop' });
  }
};

const addItemToShop = async (req, res) => {
  const { shopId } = req.params;
  const { name, description, price } = req.body;

  try {
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }


    const newItem = new Item({
      name,
      description,
      price,
      shop: shopId
    });

    await newItem.save();
    shop.items.push(newItem._id);
    await shop.save();

    return res.status(201).json({ message: 'Item added to shop', item: newItem });
  } catch (error) {
    console.error('Error adding item to shop:', error);
    return res.status(500).json({ message: 'Error adding item to shop' });
  }
};


const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate('items'); 
    return res.status(200).json(shops);
  } catch (error) {
    console.error('Error fetching shops:', error);
    return res.status(500).json({ message: 'Error fetching shops' });
  }
};

const getShopById = async (req, res) => {
  const { shopId } = req.params;

  try {
    const shop = await Shop.findById(shopId).populate('items');
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    return res.status(200).json(shop);
  } catch (error) {
    console.error('Error fetching shop:', error);
    return res.status(500).json({ message: 'Error fetching shop' });
  }
};

module.exports = {
  createShop,
  addItemToShop,
  getAllShops,
  getShopById,
};
