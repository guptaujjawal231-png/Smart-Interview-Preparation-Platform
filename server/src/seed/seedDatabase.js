import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Question from '../models/Question.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedQuestions = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_interview_prep';
    console.log('Connecting to database for seeding...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Read seed file
    const dataPath = path.join(__dirname, 'questionsSeed.json');
    const questions = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Clear existing questions
    const deleteResult = await Question.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing questions`);

    // Insert new questions
    const inserted = await Question.insertMany(questions);
    console.log(`\n🎉 Successfully seeded ${inserted.length} questions into Question Bank!`);

    // Grouping summary
    const counts = {
      'Software Developer': 0,
      'Data Analyst': 0,
      'ECE / Core Electronics': 0,
    };

    inserted.forEach((q) => {
      if (counts[q.role] !== undefined) counts[q.role]++;
    });

    console.log('📊 Question Distribution by Role:');
    console.log(` - Software Developer: ${counts['Software Developer']} questions`);
    console.log(` - Data Analyst: ${counts['Data Analyst']} questions`);
    console.log(` - ECE / Core Electronics: ${counts['ECE / Core Electronics']} questions`);

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
    process.exit(1);
  }
};

seedQuestions();
