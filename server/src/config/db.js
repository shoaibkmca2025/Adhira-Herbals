import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('strictQuery', true);

export async function connectDB() {
  const conn = await mongoose.connect(env.mongoUri);
  console.log(`[db] connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
}
