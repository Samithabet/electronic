// src/passport-config.ts
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


require('dotenv').config()

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const saltRounds = 10; // The cost factor controls how much time is needed to calculate a single bcrypt hash. The higher the cost factor, the more hashing rounds are done.


passport.use(new LocalStrategy({
  usernameField: 'email', // Specify that the "email" field will be used instead of "username"
  passwordField: 'password' // You can also specify the password field if it's named differently
},
  async (email, password, done) => {
    // Here you'd typically look up the user in the database
    const user = await prisma.user.findFirst({
      where: {
        email: email
      }
    })
    if (user) {
      done(null, {
        email: user.email
      });
    } else {
      done(null, false, { message: 'Incorrect email or password.' });
    }
  }));

// Function to generate JWT token
export const generateToken = (user: any): string => {
  const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key'; // Move to environment variable
  return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
};

export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error; // Rethrow or handle error appropriately
  }
}

export async function verifyPassword(submittedPassword: string, storedHash: string): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(submittedPassword, storedHash);
    return isMatch; // true if the password matches, false otherwise
  } catch (error) {
    console.error('Error verifying password:', error);
    throw error; // Rethrow or handle error appropriately
  }
}
