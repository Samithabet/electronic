import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { generateToken } from '../passport-config';
import { validationResult } from 'express-validator';
import { ApiError } from '../errors/ApiError';
import { ValidationError } from '../errors/ValidationError';
import { NotFoundError } from '../errors/NotFoundError';
import { authServices } from '../services/authServices';

class AuthController {
    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            await authServices.login(req, res, next);
        } catch (error) {
            next(error);
        }
    }
    public async registrtion(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const userData = req.body;
            const newBank = await authServices.registration(userData);
            res.status(201).json(newBank);
        } catch (error) {
            next(error);
        }
    }
    public async getAllUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const userFilter = req.query;
            const newBank = await authServices.getAllUser(userFilter);
            res.status(201).json(newBank);
        } catch (error) {
            next(error);
        }
    }
}


export default new AuthController();