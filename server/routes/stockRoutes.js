const express = require('express');
const router = express.Router();
const { getStockQuotes, searchStockQuote } = require('../controllers/stockController');

router.get('/quotes', getStockQuotes);
router.get('/search/:symbol', searchStockQuote);

module.exports = router;
