import mongoose from 'mongoose';
import Hospital from '../models/Hospital.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the parent directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function addPasswordsToHospitals() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Hash the password
    const password = "12345";
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update all hospitals to add the hashed password
    const result = await Hospital.updateMany(
      {}, // Empty filter to match all documents
      { 
        $set: { 
          password: hashedPassword 
        } 
      }
    );

    console.log(`Updated ${result.modifiedCount} hospitals with password`);

    // Verify the update
    const hospitalsWithPasswords = await Hospital.countDocuments({ 
      password: { $exists: true, $ne: null } 
    });
    
    console.log(`Total hospitals with passwords: ${hospitalsWithPasswords}`);
    
    console.log('Password update completed successfully!');
    
  } catch (error) {
    console.error('Error updating hospital passwords:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addPasswordsToHospitals();
