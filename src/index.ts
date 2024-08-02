// src/index.ts or src/app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import rootRouter from './routers';
import { errorMiddleware } from './middlewares/errorMiddleware';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session'
// import session from 'express-session'; // If you plan to use sessions
require('dotenv').config()

class App {
    public app: Application;
    constructor() {
        this.app = express();
        this.setMiddlewares();
        this.setRoutes();
        this.setErrorMiddlewares();
        this.setPassport();
        
    }
    private setPassport(): void {
        this.app.use(session({
            secret: 'your_secret_key_here', // Secret key for signing the session ID cookie
            resave: false, // Don't save session if unmodified
            saveUninitialized: false, // Don't create session until stored
            cookie: {
              httpOnly: true, // Prevents client-side JS from reading the cookie
              maxAge: 24 * 60 * 60 * 1000, // Set cookie expiry limit (e.g., 24 hours)
              secure: true, // Uncomment if your site uses HTTPS
            }
          }));
      
          // Initialize Passport and restore authentication state, if any, from the session
          this.app.use(passport.initialize());
          this.app.use(passport.session());    }

     private setMiddlewares(): void {
        // It's good to have a middleware that parses incoming requests with JSON payloads.
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(express.urlencoded({ extended: true })); // `true` allows for rich objects and arrays to be encoded into the URL-encoded format.
        // CORS and other security-related middleware would also go here.
        const corsOptions: cors.CorsOptions = {
            origin: ['*'], // Specify the allowed origin
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Specify which methods are allowed
            allowedHeaders: ['Content-Type', 'Authorization'] // Specify which headers are allowed
          };
      
          this.app.use(cors(corsOptions));
    }
    private setRoutes(): void {
        // Prefixing the routes with '/api' is a common convention for indicating that this is an API endpoint.
        this.app.use('/api', rootRouter)
        // Here you would add the other routes in a similar manner.
        // Example: this.app.use('/api/users', userRoutes);
    }

    private setErrorMiddlewares(): void {
        // Error handling middleware should be the last middleware added.
        this.app.use(errorMiddleware);
    }
   
    public listen(): void {
        const PORT = process.env.PORT || 3000; // Good use of environment variable for the PORT with a fallback.
        this.app.listen(PORT, async () => {
        
            console.log(`Server is running on http://localhost:${PORT}`); // Informative startup log is useful.
        });
    }
}
// This part initiates your app listening, so it makes sense to be outside of the App class.
const appInstance = new App().app;
export default appInstance;

// If you want to start the server directly from this file
if (require.main === module) {
    const app = new App();
    app.listen();
}



