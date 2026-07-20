const bcrypt = require('bcryptjs');

const generateDemoAccounts = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  // Account 1: Student / Dependent (Aarav Sharma)
  const studentUser = {
    _id: 'usr_student_demo_123',
    name: 'Aarav Sharma',
    email: 'aarav.sharma2025@gmail.com',
    password: hashedPassword,
    employmentStatus: 'dependent',
    annualIncomeOrPocketMoney: 12000, // ₹12,000 / month pocket money
    savingsGoals: [
      {
        _id: 'goal_ps5_student',
        title: 'PlayStation 5 Slim',
        targetAmount: 54990,
        currentAmount: 24500,
        category: 'Electronics',
        targetDate: '2026-11-30',
      },
      {
        _id: 'goal_trip_student',
        title: 'Goa College Trip',
        targetAmount: 15000,
        currentAmount: 9200,
        category: 'Travel',
        targetDate: '2026-09-15',
      },
    ],
    createdAt: '2023-01-15T00:00:00.000Z',
  };

  // Account 2: Independent Working Professional (Rohan Verma)
  const proUser = {
    _id: 'usr_pro_demo_456',
    name: 'Rohan Verma',
    email: 'rohan.verma.tech@gmail.com',
    password: hashedPassword,
    employmentStatus: 'independent',
    annualIncomeOrPocketMoney: 1800000, // ₹18 LPA CTC (₹1,50,000 / month)
    savingsGoals: [
      {
        _id: 'goal_car_pro',
        title: 'EV Car Down Payment',
        targetAmount: 300000,
        currentAmount: 185000,
        category: 'Vehicle',
        targetDate: '2026-12-31',
      },
      {
        _id: 'goal_macbook_pro',
        title: 'MacBook Pro M3 Max',
        targetAmount: 220000,
        currentAmount: 160000,
        category: 'Work Tech',
        targetDate: '2026-08-30',
      },
    ],
    createdAt: '2023-01-15T00:00:00.000Z',
  };

  // Generate 1 Full Year of Student Transactions
  const studentTx = [];
  const studentCategories = [
    { title: 'Swiggy Gourmet Biryani', amount: 340, cat: 'Food', type: 'expense' },
    { title: 'Zomato Pizza Party', amount: 480, cat: 'Food', type: 'expense' },
    { title: 'College Canteen & Tea', amount: 120, cat: 'Food', type: 'expense' },
    { title: 'Hostel PG Room Rent', amount: 6500, cat: 'Rent', type: 'expense' },
    { title: 'Bookstore & Exam Photocopy', amount: 450, cat: 'Education', type: 'expense' },
    { title: 'Delhi Metro Smart Card Recharge', amount: 500, cat: 'Transport', type: 'expense' },
    { title: 'Monthly Pocket Money from Parents', amount: 12000, cat: 'Stipend', type: 'income' },
    { title: 'Tech Internship Stipend', amount: 8000, cat: 'Stipend', type: 'income' },
    { title: 'Amazon Electronics Cable', amount: 699, cat: 'Shopping', type: 'expense' },
  ];

  for (let m = 0; m < 12; m++) {
    const monthDate = new Date();
    monthDate.setMonth(monthDate.getMonth() - m);

    const incDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).toISOString();
    studentTx.push({
      _id: `tx_std_inc_${m}`,
      userId: studentUser._id,
      title: 'Monthly Pocket Money Allowance',
      amount: 12000,
      type: 'income',
      category: 'Stipend',
      note: 'Auto-credited allowance',
      date: incDate,
      createdAt: incDate,
    });

    if (m % 2 === 0) {
      const stipendDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 10).toISOString();
      studentTx.push({
        _id: `tx_std_stipend_${m}`,
        userId: studentUser._id,
        title: 'Freelance Frontend Dev Stipend',
        amount: 8000,
        type: 'income',
        category: 'Stipend',
        note: 'React project payment',
        date: stipendDate,
        createdAt: stipendDate,
      });
    }

    studentCategories.forEach((cat, idx) => {
      if (cat.type === 'expense') {
        const day = (idx * 3 + m) % 27 + 1;
        const expDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day).toISOString();
        studentTx.push({
          _id: `tx_std_exp_${m}_${idx}`,
          userId: studentUser._id,
          title: cat.title,
          amount: cat.amount,
          type: 'expense',
          category: cat.cat,
          note: 'Regular student expense',
          date: expDate,
          createdAt: expDate,
        });
      }
    });
  }

  // Generate 1 Full Year of Working Professional Transactions
  const proTx = [];
  for (let m = 0; m < 12; m++) {
    const monthDate = new Date();
    monthDate.setMonth(monthDate.getMonth() - m);

    const salDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).toISOString();
    proTx.push({
      _id: `tx_pro_sal_${m}`,
      userId: proUser._id,
      title: 'Monthly Salary Credit (Software Engineer)',
      amount: 125000,
      type: 'income',
      category: 'Salary',
      note: 'Monthly salary after tax TDS',
      date: salDate,
      createdAt: salDate,
    });

    const rentDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 3).toISOString();
    proTx.push({
      _id: `tx_pro_rent_${m}`,
      userId: proUser._id,
      title: '2BHK Apartment Rent & Maintenance',
      amount: 32000,
      type: 'expense',
      category: 'Rent',
      note: 'Flat rent debit',
      date: rentDate,
      createdAt: rentDate,
    });

    const sipDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 5).toISOString();
    proTx.push({
      _id: `tx_pro_sip_${m}`,
      userId: proUser._id,
      title: 'Zerodha Coin Equity Mutual Fund SIP',
      amount: 25000,
      type: 'expense',
      category: 'Investment',
      note: 'Auto-debit SIP investment',
      date: sipDate,
      createdAt: sipDate,
    });

    const blinkitDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 12).toISOString();
    proTx.push({
      _id: `tx_pro_blink_${m}`,
      userId: proUser._id,
      title: 'Blinkit & Zepto Grocery Order',
      amount: 4200,
      type: 'expense',
      category: 'Groceries',
      note: 'Monthly pantry restock',
      date: blinkitDate,
      createdAt: blinkitDate,
    });

    const fuelDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 20).toISOString();
    proTx.push({
      _id: `tx_pro_fuel_${m}`,
      userId: proUser._id,
      title: 'Shell Petrol Station Fuel',
      amount: 3500,
      type: 'expense',
      category: 'Transport',
      note: 'Car fuel topup',
      date: fuelDate,
      createdAt: fuelDate,
    });
  }

  // 3 Years Stock Holdings for Student
  const studentAssets = [
    {
      _id: 'ast_std_1',
      userId: studentUser._id,
      name: 'Nifty 50 Index Mutual Fund (3-Yr Accumulation)',
      symbol: 'NIFTY50',
      assetType: 'mutual_fund',
      quantity: 150,
      buyPrice: 160.00,
      currentPrice: 220.40,
      notes: 'Accumulated over past 36 months via pocket money SIP',
      createdAt: '2023-05-10T00:00:00.000Z',
    },
    {
      _id: 'ast_std_2',
      userId: studentUser._id,
      name: 'Sovereign Gold Bond Series 2023',
      symbol: 'SGB2023',
      assetType: 'gold',
      quantity: 4,
      buyPrice: 5800.00,
      currentPrice: 7250.00,
      notes: 'RBI Gold Bond holding',
      createdAt: '2023-08-15T00:00:00.000Z',
    },
    {
      _id: 'ast_std_3',
      userId: studentUser._id,
      name: 'State Bank of India (SBI) Student FD',
      symbol: 'SBI-FD',
      assetType: 'fd',
      quantity: 1,
      buyPrice: 20000.00,
      currentPrice: 22400.00,
      notes: '7.1% FD reserved for final year college fees',
      createdAt: '2024-01-10T00:00:00.000Z',
    },
  ];

  // 3 Years Stock Holdings for Professional
  const proAssets = [
    {
      _id: 'ast_pro_1',
      userId: proUser._id,
      name: 'Reliance Industries Ltd (Bought 2023)',
      symbol: 'RELIANCE.NS',
      assetType: 'stock',
      quantity: 40,
      buyPrice: 2350.00,
      currentPrice: 3120.50,
      notes: 'Core long-term Indian bluechip equity portfolio',
      createdAt: '2023-02-14T00:00:00.000Z',
    },
    {
      _id: 'ast_pro_2',
      userId: proUser._id,
      name: 'Tata Motors Ltd',
      symbol: 'TATAMOTORS.NS',
      assetType: 'stock',
      quantity: 120,
      buyPrice: 450.00,
      currentPrice: 980.20,
      notes: 'EV leadership stock buy holding since 2023',
      createdAt: '2023-04-20T00:00:00.000Z',
    },
    {
      _id: 'ast_pro_3',
      userId: proUser._id,
      name: 'Tata Consultancy Services',
      symbol: 'TCS.NS',
      assetType: 'stock',
      quantity: 25,
      buyPrice: 3300.00,
      currentPrice: 4280.00,
      notes: 'IT Sector compounder holding',
      createdAt: '2023-06-11T00:00:00.000Z',
    },
    {
      _id: 'ast_pro_4',
      userId: proUser._id,
      name: 'Apple Inc (US Tech Holding)',
      symbol: 'AAPL',
      assetType: 'stock',
      quantity: 15,
      buyPrice: 150.00,
      currentPrice: 224.30,
      notes: 'Indmoney US stock holding',
      createdAt: '2023-01-10T00:00:00.000Z',
    },
    {
      _id: 'ast_pro_5',
      userId: proUser._id,
      name: 'HDFC Bank Emergency Liquid FD',
      symbol: 'HDFC-FD',
      assetType: 'fd',
      quantity: 1,
      buyPrice: 250000.00,
      currentPrice: 275000.00,
      notes: '6 months emergency fund backup',
      createdAt: '2023-03-01T00:00:00.000Z',
    },
  ];

  return {
    users: [studentUser, proUser],
    transactions: [...studentTx, ...proTx],
    assets: [...studentAssets, ...proAssets],
  };
};

module.exports = { generateDemoAccounts };
