const User = require('../models/User');
const { getDbMode } = require('../config/db');

// @desc    Get user's savings goals
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res) => {
  try {
    const { isInMemory, inMemoryStore } = getDbMode();

    if (isInMemory) {
      const user = inMemoryStore.users.find((u) => u._id === req.user._id);
      return res.json(user?.savingsGoals || []);
    }

    const user = await User.findById(req.user._id);
    res.json(user?.savingsGoals || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new savings goal
// @route   POST /api/goals
// @access  Private
const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, currentAmount, category, targetDate } = req.body;

    if (!title || !targetAmount) {
      return res.status(400).json({ message: 'Please provide goal title and target amount' });
    }

    const { isInMemory, inMemoryStore, saveData } = getDbMode();

    const newGoal = {
      _id: 'goal_' + Date.now() + Math.random().toString(36).substring(2, 6),
      title: title.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount || 0),
      category: category || 'Gadgets',
      targetDate: targetDate ? new Date(targetDate) : null,
      createdAt: new Date(),
    };

    if (isInMemory) {
      const user = inMemoryStore.users.find((u) => u._id === req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (!user.savingsGoals) user.savingsGoals = [];
      user.savingsGoals.push(newGoal);
      saveData();
      return res.status(201).json(newGoal);
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.savingsGoals) user.savingsGoals = [];
    user.savingsGoals.push(newGoal);
    await user.save();

    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update savings goal or deposit money into goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = async (req, res) => {
  try {
    const { title, targetAmount, currentAmount, addAmount } = req.body;
    const { isInMemory, inMemoryStore, saveData } = getDbMode();

    if (isInMemory) {
      const user = inMemoryStore.users.find((u) => u._id === req.user._id);
      if (!user || !user.savingsGoals) {
        return res.status(404).json({ message: 'Goal not found' });
      }

      const goal = user.savingsGoals.find((g) => g._id === req.params.id);
      if (!goal) return res.status(404).json({ message: 'Goal not found' });

      if (title) goal.title = title.trim();
      if (targetAmount !== undefined) goal.targetAmount = Number(targetAmount);

      if (addAmount !== undefined) {
        goal.currentAmount = Math.min(goal.targetAmount, goal.currentAmount + Number(addAmount));
      } else if (currentAmount !== undefined) {
        goal.currentAmount = Number(currentAmount);
      }

      saveData();
      return res.json(goal);
    }

    const user = await User.findById(req.user._id);
    if (!user || !user.savingsGoals) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    const goal = user.savingsGoals.id(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    if (title) goal.title = title.trim();
    if (targetAmount !== undefined) goal.targetAmount = Number(targetAmount);

    if (addAmount !== undefined) {
      goal.currentAmount = Math.min(goal.targetAmount, goal.currentAmount + Number(addAmount));
    } else if (currentAmount !== undefined) {
      goal.currentAmount = Number(currentAmount);
    }

    await user.save();
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete savings goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = async (req, res) => {
  try {
    const { isInMemory, inMemoryStore, saveData } = getDbMode();

    if (isInMemory) {
      const user = inMemoryStore.users.find((u) => u._id === req.user._id);
      if (!user || !user.savingsGoals) {
        return res.status(404).json({ message: 'Goal not found' });
      }

      const index = user.savingsGoals.findIndex((g) => g._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Goal not found' });

      user.savingsGoals.splice(index, 1);
      saveData();
      return res.json({ message: 'Savings goal deleted' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.savingsGoals = user.savingsGoals.filter((g) => g._id.toString() !== req.params.id);
    await user.save();

    res.json({ message: 'Savings goal deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
};
