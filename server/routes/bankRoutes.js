const express = require('express');
const router = express.Router();
const {
  importCsvTransactions,
  connectBankAccount,
  loadExampleData,
} = require('../controllers/bankSyncController');
const { protect } = require('../middleware/authMiddleware');

router.post('/import-csv', protect, importCsvTransactions);
router.post('/connect-account', protect, connectBankAccount);
router.post('/load-example-data', protect, loadExampleData);

module.exports = router;
