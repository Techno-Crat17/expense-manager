const mongoose = require('mongoose');
const dns = require('dns');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Asset = require('./models/Asset');
const { generateDemoAccounts } = require('./config/seedData');

const seedAtlasDatabase = async () => {
  try {
    console.log('🚀 Connecting to MongoDB Atlas Cloud...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ Connected to MongoDB Atlas Cloud!');

    // Clear existing data in MongoDB Atlas
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await Asset.deleteMany({});
    console.log('🧹 Cleared existing Atlas database records.');

    // Generate demo data from seedData
    const demoData = await generateDemoAccounts();

    // Map for storing generated Mongoose user IDs
    const userIdMap = {};

    // Create Users in MongoDB Atlas
    for (const u of demoData.users) {
      const newUser = new User({
        name: u.name,
        email: u.email,
        password: 'password123', // Hashed automatically via pre-save hook
        employmentStatus: u.employmentStatus,
        annualIncomeOrPocketMoney: u.annualIncomeOrPocketMoney,
        age: u.employmentStatus === 'dependent' ? 21 : 28,
        sex: 'Male',
        dob: u.employmentStatus === 'dependent' ? '2004-05-15' : '1997-08-20',
        address: u.employmentStatus === 'dependent' ? 'Delhi, NCR, India' : 'Bengaluru, Karnataka, India',
        savingsGoals: u.savingsGoals || [],
      });

      const savedUser = await newUser.save();
      userIdMap[u._id] = savedUser._id;
      console.log(`👤 Created Seed User: ${savedUser.name} (${savedUser.email})`);
    }

    // Create Transactions in MongoDB Atlas
    let txCount = 0;
    for (const tx of demoData.transactions) {
      const mappedUserId = userIdMap[tx.userId];
      if (mappedUserId) {
        await Transaction.create({
          userId: mappedUserId,
          title: tx.title,
          amount: tx.amount,
          type: tx.type,
          category: tx.category,
          note: tx.note,
          date: tx.date,
        });
        txCount++;
      }
    }
    console.log(`✅ Created ${txCount} Transactions in Atlas!`);

    // Create Assets in MongoDB Atlas
    let astCount = 0;
    for (const ast of demoData.assets) {
      const mappedUserId = userIdMap[ast.userId];
      if (mappedUserId) {
        await Asset.create({
          userId: mappedUserId,
          name: ast.name,
          symbol: ast.symbol,
          assetType: ast.assetType,
          quantity: ast.quantity,
          buyPrice: ast.buyPrice,
          currentPrice: ast.currentPrice,
          notes: ast.notes,
        });
        astCount++;
      }
    }
    console.log(`✅ Created ${astCount} Asset Holdings in Atlas!`);

    console.log('\n🎉 ALL DEMO ACCOUNTS SUCCESSFULLY SEEDED INTO YOUR ONLINE MONGODB ATLAS DATABASE!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error Seeding MongoDB Atlas:', error.message);
    process.exit(1);
  }
};

seedAtlasDatabase();
