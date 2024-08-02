import{Request,Response,NextFunction} from 'express'
import  roleServices  from '../services/roleServices';
export class roleController{
    public async getAllUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const roleFilter = req.query;
            const role = await roleServices.getAllRole(roleFilter);
            res.status(201).json(role);
        } catch (error) {
            next(error);
        }
    }
    public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const dataRole = req.body;
            const role = await roleServices.CreateRole(dataRole);
            res.status(201).json(role);
        } catch (error) {
            next(error);
        }
    }
}
export default new roleController();
