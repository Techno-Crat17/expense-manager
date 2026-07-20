const { getDbMode } = require('../config/db');

// @desc    Get user's asset portfolio & net worth summary
// @route   GET /api/assets
// @access  Private
const getAssets = async (req, res) => {
  try {
    const { isInMemory, inMemoryStore } = getDbMode();
    let userAssets = [];

    if (isInMemory) {
      if (!inMemoryStore.assets) inMemoryStore.assets = [];
      userAssets = inMemoryStore.assets.filter((a) => a.userId.toString() === req.user._id.toString());
    } else {
      // MongoDB query if Schema registered
      const Asset = require('../models/Asset');
      userAssets = await Asset.find({ userId: req.user._id });
    }

    // Default sample portfolio items if brand new user
    if (userAssets.length === 0 && isInMemory) {
      const initialSample = [
        {
          _id: 'ast_1',
          userId: req.user._id,
          name: 'Reliance Industries Ltd',
          symbol: 'RELIANCE.NS',
          assetType: 'stock',
          quantity: 10,
          buyPrice: 2850,
          currentPrice: 3120.50,
          notes: 'Long term equity holding',
          createdAt: new Date(),
        },
        {
          _id: 'ast_2',
          userId: req.user._id,
          name: 'Nifty 50 Index Mutual Fund',
          symbol: 'NIFTY50',
          assetType: 'mutual_fund',
          quantity: 100,
          buyPrice: 180,
          currentPrice: 220.40,
          notes: 'Monthly SIP investment',
          createdAt: new Date(),
        },
        {
          _id: 'ast_3',
          userId: req.user._id,
          name: 'HDFC Bank Fixed Deposit (FD)',
          symbol: 'HDFC-FD',
          assetType: 'fd',
          quantity: 1,
          buyPrice: 50000,
          currentPrice: 53500,
          notes: '7.1% Annual Interest FD',
          createdAt: new Date(),
        },
        {
          _id: 'ast_4',
          userId: req.user._id,
          name: 'Sovereign Gold Bond (SGB)',
          symbol: 'GOLD',
          assetType: 'gold',
          quantity: 5,
          buyPrice: 6200,
          currentPrice: 7250,
          notes: '2.5% RBI Interest + Gold Growth',
          createdAt: new Date(),
        },
      ];
      inMemoryStore.assets.push(...initialSample);
      userAssets = initialSample;
    }

    // Calculate Portfolio Summary Metrics
    let totalInvested = 0;
    let totalCurrentValue = 0;
    const allocation = { stock: 0, mutual_fund: 0, fd: 0, gold: 0, crypto: 0, real_estate: 0, others: 0 };

    userAssets.forEach((a) => {
      const invested = Number(a.quantity || 1) * Number(a.buyPrice || 0);
      const current = Number(a.quantity || 1) * Number(a.currentPrice || a.buyPrice || 0);
      totalInvested += invested;
      totalCurrentValue += current;

      const typeKey = a.assetType || 'others';
      allocation[typeKey] = (allocation[typeKey] || 0) + current;
    });

    const totalProfitLoss = totalCurrentValue - totalInvested;
    const returnPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

    res.json({
      assets: userAssets,
      summary: {
        totalInvested: Math.round(totalInvested),
        totalCurrentValue: Math.round(totalCurrentValue),
        totalProfitLoss: Math.round(totalProfitLoss),
        returnPercentage: parseFloat(returnPercentage.toFixed(2)),
        allocation,
      },
    });
  } catch (error) {
    console.error('Get Assets Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new asset to portfolio
// @route   POST /api/assets
// @access  Private
const createAsset = async (req, res) => {
  try {
    const { name, symbol, assetType, quantity, buyPrice, currentPrice, notes } = req.body;

    if (!name || !quantity || !buyPrice) {
      return res.status(400).json({ message: 'Asset Name, Quantity, and Buy Price are required' });
    }

    const { isInMemory, inMemoryStore, saveData } = getDbMode();
    const newAsset = {
      _id: 'ast_' + Date.now() + Math.random().toString(36).substring(2, 7),
      userId: req.user._id,
      name,
      symbol: symbol ? symbol.toUpperCase() : 'ASSET',
      assetType: assetType || 'stock',
      quantity: Number(quantity),
      buyPrice: Number(buyPrice),
      currentPrice: Number(currentPrice || buyPrice),
      notes: notes || '',
      createdAt: new Date(),
    };

    if (isInMemory) {
      if (!inMemoryStore.assets) inMemoryStore.assets = [];
      inMemoryStore.assets.push(newAsset);
      saveData();
    } else {
      const Asset = require('../models/Asset');
      await Asset.create(newAsset);
    }

    res.status(201).json(newAsset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete asset from portfolio
// @route   DELETE /api/assets/:id
// @access  Private
const deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { isInMemory, inMemoryStore, saveData } = getDbMode();

    if (isInMemory) {
      inMemoryStore.assets = inMemoryStore.assets.filter((a) => a._id !== id);
      saveData();
    } else {
      const Asset = require('../models/Asset');
      await Asset.findByIdAndDelete(id);
    }

    res.json({ message: 'Asset removed from portfolio successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAssets,
  createAsset,
  deleteAsset,
};
