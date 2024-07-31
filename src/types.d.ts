import { Request } from 'express';

declare global {
  namespace Express {
    export interface Request {
      User?: any; // Use a more specific type if possible for better type safety
    }
  }
}