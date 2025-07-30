// scripts/resetDatabase.js
const mongoose = require('mongoose');
require('dotenv').config();

async function resetDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('⚠️  WARNING: This will delete ALL data in the database!');
    console.log('Are you sure you want to continue? (y/N)');

    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('', async (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        console.log('🗑️  Dropping database...');
        await mongoose.connection.db.dropDatabase();
        console.log('✅ Database reset successfully!');
        
        // Optionally re-setup
        console.log('Would you like to re-setup the database with sample data? (y/N)');
        rl.question('', async (setupAnswer) => {
          if (setupAnswer.toLowerCase() === 'y' || setupAnswer.toLowerCase() === 'yes') {
            const { setupDatabase } = require('./setupDatabase');
            await setupDatabase();
          }
          rl.close();
          await mongoose.connection.close();
        });
      } else {
        console.log('❌ Database reset cancelled');
        rl.close();
        await mongoose.connection.close();
      }
    });

  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  resetDatabase();
}

module.exports = { resetDatabase };