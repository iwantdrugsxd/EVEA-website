// scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
require('dotenv').config();

// Simple Admin model (you can expand this)
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔐 Create Admin Account');
    console.log('======================');

    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password: ');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('❌ Admin with this email already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();

    console.log('✅ Admin account created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log('\n⚠️  Please change the password after first login');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    rl.close();
    await mongoose.connection.close();
  }
}

if (require.main === module) {
  createAdmin();
}

module.exports = { createAdmin };