const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { getDbMode } = require('../config/db');

// @desc    Get all transactions for logged in user (with search & filter options)
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const { type, category, search, startDate, endDate, sort } = req.query;
    const { isInMemory, inMemoryStore } = getDbMode();

    if (isInMemory) {
      let list = inMemoryStore.transactions.filter(
        (t) => t.userId.toString() === req.user._id.toString()
      );

      if (type && type !== 'all') {
        list = list.filter((t) => t.type === type);
      }

      if (category && category !== 'all') {
        list = list.filter((t) => t.category === category);
      }

      if (search) {
        const query = search.toLowerCase();
        list = list.filter((t) => t.title.toLowerCase().includes(query));
      }

      if (startDate) {
        const start = new Date(startDate);
        list = list.filter((t) => new Date(t.date) >= start);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        list = list.filter((t) => new Date(t.date) <= end);
      }

      // Sorting
      if (sort === 'amount-asc') list.sort((a, b) => a.amount - b.amount);
      else if (sort === 'amount-desc') list.sort((a, b) => b.amount - a.amount);
      else if (sort === 'date-asc') list.sort((a, b) => new Date(a.date) - new Date(b.date));
      else list.sort((a, b) => new Date(b.date) - new Date(a.date)); // Default newest first

      return res.json(list);
    }

    // Standard MongoDB Path
    const query = { userId: req.user._id };

    if (type && type !== 'all') query.type = type;
    if (category && category !== 'all') query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    let sortOptions = { date: -1 };
    if (sort === 'amount-asc') sortOptions = { amount: 1 };
    if (sort === 'amount-desc') sortOptions = { amount: -1 };
    if (sort === 'date-asc') sortOptions = { date: 1 };

    const transactions = await Transaction.find(query).sort(sortOptions);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new transaction
// @route   POST /api/transactions
// @access  Private
const addTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, note, date } = req.body;

    if (!title || !amount || !type || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const { isInMemory, inMemoryStore, saveData } = getDbMode();

    if (isInMemory) {
      const newTx = {
        _id: 'tx_' + Date.now() + Math.random().toString(36).substring(2, 7),
        userId: req.user._id,
        title: title.trim(),
        amount: Number(amount),
        type,
        category,
        note: note || '',
        date: date ? new Date(date) : new Date(),
        createdAt: new Date(),
      };
      inMemoryStore.transactions.push(newTx);
      saveData();
      return res.status(201).json(newTx);
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      title,
      amount: Number(amount),
      type,
      category,
      note: note || '',
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
  try {
    const { isInMemory, inMemoryStore, saveData } = getDbMode();
    const { title, amount, type, category, note, date } = req.body;

    if (isInMemory) {
      const tx = inMemoryStore.transactions.find(
        (t) => t._id === req.params.id && t.userId.toString() === req.user._id.toString()
      );
      if (!tx) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      if (title) tx.title = title.trim();
      if (amount !== undefined) tx.amount = Number(amount);
      if (type) tx.type = type;
      if (category) tx.category = category;
      if (note !== undefined) tx.note = note;
      if (date) tx.date = new Date(date);

      saveData();
      return res.json(tx);
    }

    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this transaction' });
    }

    transaction.title = title || transaction.title;
    transaction.amount = amount !== undefined ? Number(amount) : transaction.amount;
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.note = note !== undefined ? note : transaction.note;
    if (date) transaction.date = new Date(date);

    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const { isInMemory, inMemoryStore, saveData } = getDbMode();

    if (isInMemory) {
      const index = inMemoryStore.transactions.findIndex(
        (t) => t._id === req.params.id && t.userId.toString() === req.user._id.toString()
      );
      if (index === -1) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      inMemoryStore.transactions.splice(index, 1);
      saveData();
      return res.json({ id: req.params.id, message: 'Transaction removed successfully' });
    }

    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this transaction' });
    }

    await transaction.deleteOne();
    res.json({ id: req.params.id, message: 'Transaction removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get summary metrics & analytical statistics
// @route   GET /api/transactions/summary
// @access  Private
const getSummaryStats = async (req, res) => {
  try {
    const { isInMemory, inMemoryStore } = getDbMode();
    let transactions = [];
    let userDetails = {
      employmentStatus: req.user.employmentStatus || 'dependent',
      annualIncomeOrPocketMoney: req.user.annualIncomeOrPocketMoney || 0,
    };

    if (isInMemory) {
      transactions = inMemoryStore.transactions.filter(
        (t) => t.userId.toString() === req.user._id.toString()
      );
      const foundUser = inMemoryStore.users.find((u) => u._id === req.user._id);
      if (foundUser) {
        userDetails = {
          employmentStatus: foundUser.employmentStatus || 'dependent',
          annualIncomeOrPocketMoney: foundUser.annualIncomeOrPocketMoney || 0,
        };
      }
    } else {
      transactions = await Transaction.find({ userId: req.user._id });
      const user = await User.findById(req.user._id);
      if (user) {
        userDetails = {
          employmentStatus: user.employmentStatus || 'dependent',
          annualIncomeOrPocketMoney: user.annualIncomeOrPocketMoney || 0,
        };
      }
    }

    let totalIncome = 0;
    let totalExpense = 0;

    const categoryMap = {};
    const monthlyMap = {};

    transactions.forEach((tx) => {
      const amt = Number(tx.amount);
      const monthYear = new Date(tx.date).toLocaleString('default', { month: 'short', year: 'numeric' });

      if (!monthlyMap[monthYear]) {
        monthlyMap[monthYear] = { income: 0, expense: 0 };
      }

      if (tx.type === 'income') {
        totalIncome += amt;
        monthlyMap[monthYear].income += amt;
      } else {
        totalExpense += amt;
        monthlyMap[monthYear].expense += amt;
        categoryMap[tx.category] = (categoryMap[tx.category] || 0) + amt;
      }
    });

    const totalBalance = totalIncome - totalExpense;
    const savings = totalIncome > 0 ? Math.max(0, totalBalance) : 0;
    const savingsPercentage = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0;

    let highestCategory = { category: 'None', amount: 0 };
    Object.keys(categoryMap).forEach((cat) => {
      if (categoryMap[cat] > highestCategory.amount) {
        highestCategory = { category: cat, amount: categoryMap[cat] };
      }
    });

    const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentTransactions = sorted.slice(0, 5);

    res.json({
      userDetails,
      totalBalance,
      totalIncome,
      totalExpense,
      savings,
      savingsPercentage,
      highestCategory,
      categoryBreakdown: categoryMap,
      monthlyTrend: monthlyMap,
      recentTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getSummaryStats,
};
