const express = require('express');
const router = express.Router();
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getSummaryStats,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All transaction routes are protected

router.route('/')
  .get(getTransactions)
  .post(addTransaction);

router.get('/summary', getSummaryStats);

router.route('/:id')
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
