const Transaction = require('../models/Transaction');
const { getDbMode } = require('../config/db');

// Auto-categorize transaction titles based on keywords
const autoCategorize = (title) => {
  const t = title.toLowerCase();
  if (t.includes('swiggy') || t.includes('zomato') || t.includes('canteen') || t.includes('food') || t.includes('hotel') || t.includes('restaurant') || t.includes('tea') || t.includes('cafe')) {
    return 'Food';
  }
  if (t.includes('amazon') || t.includes('flipkart') || t.includes('myntra') || t.includes('meesho') || t.includes('mall') || t.includes('store') || t.includes('cloth')) {
    return 'Shopping';
  }
  if (t.includes('rent') || t.includes('pg') || t.includes('hostel') || t.includes('flat') || t.includes('maintenance')) {
    return 'Rent';
  }
  if (t.includes('salary') || t.includes('stipend') || t.includes('payout') || t.includes('freelance') || t.includes('interest')) {
    return 'Salary';
  }
  if (t.includes('fee') || t.includes('college') || t.includes('tuition') || t.includes('book') || t.includes('udemy') || t.includes('exam')) {
    return 'Education';
  }
  if (t.includes('movie') || t.includes('pvr') || t.includes('hotstar') || t.includes('netflix') || t.includes('spotify') || t.includes('game') || t.includes('steam')) {
    return 'Entertainment';
  }
  if (t.includes('pharmacy') || t.includes('apollo') || t.includes('hospital') || t.includes('doctor') || t.includes('medical') || t.includes('lab')) {
    return 'Medical';
  }
  if (t.includes('uber') || t.includes('rapido') || t.includes('ola') || t.includes('metro') || t.includes('petrol') || t.includes('fuel') || t.includes('bus') || t.includes('auto')) {
    return 'Transport';
  }
  return 'Others';
};

// @desc    Import batch transactions from CSV/Statement
// @route   POST /api/bank/import-csv
// @access  Private
const importCsvTransactions = async (req, res) => {
  try {
    const { transactions } = req.body;

    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({ message: 'No transactions provided for import' });
    }

    const { isInMemory, inMemoryStore, saveData } = getDbMode();
    const createdList = [];

    for (const item of transactions) {
      const title = item.title || 'Bank Transaction';
      const amount = Math.abs(Number(item.amount || 0));
      const type = item.type || (item.amount < 0 ? 'expense' : 'expense');
      const category = item.category || autoCategorize(title);
      const note = item.note || 'Imported via Bank Statement';
      const date = item.date ? new Date(item.date) : new Date();

      if (amount <= 0) continue;

      if (isInMemory) {
        const newTx = {
          _id: 'tx_' + Date.now() + Math.random().toString(36).substring(2, 7),
          userId: req.user._id,
          title,
          amount,
          type,
          category,
          note,
          date,
          createdAt: new Date(),
        };
        inMemoryStore.transactions.push(newTx);
        createdList.push(newTx);
      } else {
        const newTx = await Transaction.create({
          userId: req.user._id,
          title,
          amount,
          type,
          category,
          note,
          date,
        });
        createdList.push(newTx);
      }
    }

    if (isInMemory) {
      saveData();
    }

    res.status(201).json({
      message: `Successfully imported ${createdList.length} bank transactions`,
      count: createdList.length,
      transactions: createdList,
    });
  } catch (error) {
    console.error('CSV Import Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Simulate RBI Account Aggregator Bank Account Link
// @route   POST /api/bank/connect-account
// @access  Private
const connectBankAccount = async (req, res) => {
  try {
    const { bankName, accountNumber, mobileNumber, otp } = req.body;

    if (!bankName || !otp) {
      return res.status(400).json({ message: 'Bank name and OTP verification are required' });
    }

    const mockBankTransactions = [
      { title: `HDFC NetBanking Salary Stipend`, amount: 15000, type: 'income', category: 'Salary', note: `Ref: ${bankName} AA Sync` },
      { title: `Swiggy Food Order`, amount: 340, type: 'expense', category: 'Food', note: `UPI via ${bankName}` },
      { title: `HPCL Petrol Pump`, amount: 200, type: 'expense', category: 'Transport', note: `Debit Card ${bankName}` },
      { title: `PG Monthly Rent`, amount: 6500, type: 'expense', category: 'Rent', note: `NEFT transfer ${bankName}` },
      { title: `Myntra Fashion Shopping`, amount: 1290, type: 'expense', category: 'Shopping', note: `UPI Pay ${bankName}` },
    ];

    const { isInMemory, inMemoryStore, saveData } = getDbMode();
    const createdList = [];

    for (const item of mockBankTransactions) {
      if (isInMemory) {
        const newTx = {
          _id: 'tx_' + Date.now() + Math.random().toString(36).substring(2, 7),
          userId: req.user._id,
          title: item.title,
          amount: item.amount,
          type: item.type,
          category: item.category,
          note: item.note,
          date: new Date(),
          createdAt: new Date(),
        };
        inMemoryStore.transactions.push(newTx);
        createdList.push(newTx);
      } else {
        const newTx = await Transaction.create({
          userId: req.user._id,
          title: item.title,
          amount: item.amount,
          type: item.type,
          category: item.category,
          note: item.note,
          date: new Date(),
        });
        createdList.push(newTx);
      }
    }

    if (isInMemory) {
      saveData();
    }

    res.status(200).json({
      message: `Successfully connected ${bankName} account via RBI Account Aggregator!`,
      bankName,
      accountNumberMasked: `XXXX-XXXX-${accountNumber ? accountNumber.slice(-4) : '4821'}`,
      importedCount: createdList.length,
      transactions: createdList,
    });
  } catch (error) {
    console.error('Bank Connect Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Load 1-year transaction history & 3-year stock portfolio into current account
// @route   POST /api/bank/load-example-data
// @access  Private
const loadExampleData = async (req, res) => {
  try {
    const { isInMemory, inMemoryStore, saveData } = getDbMode();

    // 1 Year Transactions
    const sampleTx = [];
    for (let m = 0; m < 12; m++) {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - m);

      // Monthly Allowance/Salary Credit
      const incDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).toISOString();
      sampleTx.push({
        _id: 'tx_ex_inc_' + m + '_' + Date.now(),
        userId: req.user._id,
        title: 'Monthly Income / Allowance Credit',
        amount: 25000,
        type: 'income',
        category: 'Salary',
        note: 'Bank NEFT Credit Example',
        date: incDate,
        createdAt: incDate,
      });

      // Swiggy/Food
      const foodDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 10).toISOString();
      sampleTx.push({
        _id: 'tx_ex_food_' + m + '_' + Date.now(),
        userId: req.user._id,
        title: 'Swiggy & Dining Out Order',
        amount: 450,
        type: 'expense',
        category: 'Food',
        note: 'UPI Payment Example',
        date: foodDate,
        createdAt: foodDate,
      });

      // Rent
      const rentDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 5).toISOString();
      sampleTx.push({
        _id: 'tx_ex_rent_' + m + '_' + Date.now(),
        userId: req.user._id,
        title: 'Monthly Room Rent & Maintenance',
        amount: 7500,
        type: 'expense',
        category: 'Rent',
        note: 'PG / Apartment Rent',
        date: rentDate,
        createdAt: rentDate,
      });
    }

    // 3 Years Assets
    const sampleAssets = [
      {
        _id: 'ast_ex_1_' + Date.now(),
        userId: req.user._id,
        name: 'Reliance Industries Ltd (3-Yr Holding)',
        symbol: 'RELIANCE.NS',
        assetType: 'stock',
        quantity: 25,
        buyPrice: 2350,
        currentPrice: 3120.50,
        notes: 'Real-world NSE stock portfolio example',
        createdAt: new Date(),
      },
      {
        _id: 'ast_ex_2_' + Date.now(),
        userId: req.user._id,
        name: 'Nifty 50 Index Mutual Fund SIP',
        symbol: 'NIFTY50',
        assetType: 'mutual_fund',
        quantity: 120,
        buyPrice: 165,
        currentPrice: 220.40,
        notes: '3-year disciplined SIP investment',
        createdAt: new Date(),
      },
    ];

    if (isInMemory) {
      inMemoryStore.transactions.push(...sampleTx);
      if (!inMemoryStore.assets) inMemoryStore.assets = [];
      inMemoryStore.assets.push(...sampleAssets);
      saveData();
    }

    res.json({
      message: 'Loaded 1 year of transaction history & 3 years of stock portfolio into your account!',
      addedTransactionsCount: sampleTx.length,
      addedAssetsCount: sampleAssets.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  importCsvTransactions,
  connectBankAccount,
  loadExampleData,
};
