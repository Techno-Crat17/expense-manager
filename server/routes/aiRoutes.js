const express = require('express');
const router = express.Router();
const {
  chatWithAi,
  scanReceipt,
  forecastBurnRate,
  cleanUpiString,
  optimizeGoalStrategy,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/chat', protect, chatWithAi);
router.post('/scan-receipt', protect, scanReceipt);
router.get('/forecast-burnrate', protect, forecastBurnRate);
router.post('/clean-upi', protect, cleanUpiString);
router.post('/optimize-goal', protect, optimizeGoalStrategy);

module.exports = router;
