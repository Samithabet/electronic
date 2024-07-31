import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET as string, (err, user: any) => {
            if (err) {
                return res.status(403).json(
                    {
                        "message": "User is Forbidden"
                    }
                );
            }

            req.User = user;
            console.log('req: ', req.User);

            next();
        });
    } else {
        res.status(401).json(
            {
                "message": "User need to login"
            }
        );
    }
};

export default isAuthenticated;
