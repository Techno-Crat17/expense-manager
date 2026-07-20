const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { getDbMode } = require('../config/db');
const bcrypt = require('bcryptjs');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, employmentStatus, annualIncomeOrPocketMoney } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const status = employmentStatus === 'independent' ? 'independent' : 'dependent';
    const incomeValue = Number(annualIncomeOrPocketMoney || 0);

    const { isInMemory, inMemoryStore, saveData } = getDbMode();

    if (isInMemory) {
      const formattedEmail = email.toLowerCase().trim();
      const existingUser = inMemoryStore.users.find((u) => u.email === formattedEmail);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: 'usr_' + Date.now() + Math.random().toString(36).substring(2, 7),
        name: name.trim(),
        email: formattedEmail,
        password: hashedPassword,
        employmentStatus: status,
        annualIncomeOrPocketMoney: incomeValue,
        createdAt: new Date(),
      };

      inMemoryStore.users.push(newUser);
      saveData();

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        employmentStatus: newUser.employmentStatus,
        annualIncomeOrPocketMoney: newUser.annualIncomeOrPocketMoney,
        token: generateToken(newUser._id),
      });
    }

    // Standard MongoDB path
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      employmentStatus: status,
      annualIncomeOrPocketMoney: incomeValue,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        employmentStatus: user.employmentStatus,
        annualIncomeOrPocketMoney: user.annualIncomeOrPocketMoney,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const { isInMemory, inMemoryStore } = getDbMode();

    if (isInMemory) {
      const formattedEmail = email.toLowerCase().trim();
      const user = inMemoryStore.users.find((u) => u.email === formattedEmail);

      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          employmentStatus: user.employmentStatus || 'dependent',
          annualIncomeOrPocketMoney: user.annualIncomeOrPocketMoney || 0,
          token: generateToken(user._id),
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    // Standard MongoDB path
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        employmentStatus: user.employmentStatus || 'dependent',
        annualIncomeOrPocketMoney: user.annualIncomeOrPocketMoney || 0,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const { isInMemory, inMemoryStore } = getDbMode();

    if (isInMemory) {
      const user = inMemoryStore.users.find((u) => u._id === req.user._id);
      if (user) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          employmentStatus: user.employmentStatus || 'dependent',
          annualIncomeOrPocketMoney: user.annualIncomeOrPocketMoney || 0,
          age: user.age || 21,
          sex: user.sex || 'Male',
          dob: user.dob || '2004-05-15',
          address: user.address || 'Mumbai, Maharashtra, India',
          createdAt: user.createdAt,
        });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        employmentStatus: user.employmentStatus || 'dependent',
        annualIncomeOrPocketMoney: user.annualIncomeOrPocketMoney || 0,
        age: user.age || 21,
        sex: user.sex || 'Male',
        dob: user.dob || '2004-05-15',
        address: user.address || 'Mumbai, Maharashtra, India',
        createdAt: user.createdAt,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { name, age, sex, dob, annualIncomeOrPocketMoney, address, employmentStatus } = req.body;
    const { isInMemory, inMemoryStore, saveData } = getDbMode();

    if (isInMemory) {
      const user = inMemoryStore.users.find((u) => u._id === req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (name) user.name = name;
      if (age) user.age = Number(age);
      if (sex) user.sex = sex;
      if (dob) user.dob = dob;
      if (annualIncomeOrPocketMoney !== undefined) user.annualIncomeOrPocketMoney = Number(annualIncomeOrPocketMoney);
      if (address) user.address = address;
      if (employmentStatus) user.employmentStatus = employmentStatus;

      saveData();

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        employmentStatus: user.employmentStatus,
        annualIncomeOrPocketMoney: user.annualIncomeOrPocketMoney,
        age: user.age,
        sex: user.sex,
        dob: user.dob,
        address: user.address,
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (age) user.age = Number(age);
    if (sex) user.sex = sex;
    if (dob) user.dob = dob;
    if (annualIncomeOrPocketMoney !== undefined) user.annualIncomeOrPocketMoney = Number(annualIncomeOrPocketMoney);
    if (address) user.address = address;
    if (employmentStatus) user.employmentStatus = employmentStatus;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      employmentStatus: updatedUser.employmentStatus,
      annualIncomeOrPocketMoney: updatedUser.annualIncomeOrPocketMoney,
      age: updatedUser.age,
      sex: updatedUser.sex,
      dob: updatedUser.dob,
      address: updatedUser.address,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
};
