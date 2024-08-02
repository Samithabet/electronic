import { PrismaClient } from "@prisma/client";
import { NotFoundError } from "../errors/NotFoundError";
import { DatabaseError } from "../errors/DatabaseError";
import { Request, Response, NextFunction } from 'express';
import{generateToken, hashPassword, verifyPassword} from "../passport-config"
import passport from "passport";
import convertTopLevelStringBooleans from "../utilty/convertTopLevelStringBooleans";
const prisma = new PrismaClient();

export class authServices {
    
    
    static async getAllUser(userFilter: any) {
        try {
            console.log('here');
    
            const { page, pageSize } = userFilter;
            let { include} = userFilter; // Destructure filter conditions and remove include
            delete userFilter.page;
            delete userFilter.pageSize;
            delete userFilter.include
            if (include) {
                const convertTopLevel = convertTopLevelStringBooleans(include);
                include = convertTopLevel;
            } else {
                include = {};
            }
            console.log(include);
    
            if (page && pageSize) {
                const skip = (+page - 1) * +pageSize;
                const take = +pageSize;
                const users = await prisma.user.findMany({
                    where: userFilter, // Pass filter conditions directly
                    include,
                    skip: +skip,
                    take: +take,
                });
                const total = await prisma.user.count({
                    where: userFilter, // Pass filter conditions directly
                });
                return {
                    info: users,
                    total,
                    page,
                    pageSize,
                };
            }
            console.log(include);
    
            const users = await prisma.user.findMany({
                where: userFilter, // Pass filter conditions directly
                include,
            });
            return users;
        } catch (error) {
            throw new DatabaseError('Error retrieving attachments.', error);
        }
    }


  static async registration(userData: any) 
  {
    try {
            const { email, password } = userData;
            const roleId = userData.roleId;
            delete userData.roleId;
            const roleIdExist=await prisma.role.findUnique({where:{id:roleId}})
            if(!roleIdExist){
                throw new NotFoundError(`roleId ${roleId} not exist`)
            }
            const existUser = await prisma.user.findFirst({
            where: {
                email: email,
            },
            });
            if (existUser) {
            throw new NotFoundError(`User with${email}  found`);
            }
            const passwordhash = await hashPassword(password);
            const user = await prisma.user.create({
            
            data: {
            ...userData,
            password: passwordhash
            },
            });
           
              
                await prisma.userRole.create({
                    data: {
                      userId: user.id,
                      roleId: roleId
                    }
                    
                })
                
        
          
            return user

    }
    catch (error: any) {
        if(error instanceof NotFoundError){
            throw error 
        }
        throw new DatabaseError("Error creating user in server"  );
        
    }
  }

  static login(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) {
    try {
        passport.authenticate('local', { session: false }, (err: any, user: any, info: any) => {
            if (err || !user) {
                console.log(err);

                return res.status(400).json({
                    message: info ? info.message : 'Login failed',
                    user: user,
                });
            }

            req.login(user, { session: false }, async (err: any) => {
                if (err) {
                    res.send(err);
                }
                const auth = await prisma.user.findFirst({
                    where: {
                        email: user.email
                    }
                });
                if (!auth) {
                    return res.status(404).json({ message: "User not found." });
                }
                const password = req.body.password;
                const isPasswordCorrect = await verifyPassword(password, auth.password);
                console.log(isPasswordCorrect);

                if (isPasswordCorrect) {
                    // generate a signed json web token with the contents of user object and return it in the response
                    const token = generateToken(user);
                    const currentDate = new Date();
                    await prisma.user.update({
                        where: { id: auth.id },
                        data: {
                            resetToken: token,
                            resetTokenExpiry: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)
                        },
                    });
                    return res.json({
                        user: {
                            name: auth.name,
                            email: auth.email
                        },
                        token
                    });
                } else {
                    return res.status(400).json({
                        message: info ? info.message : 'Login failed1',
                        user: user,
                    });
                }
            });
        })(req, res);
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }
        throw new DatabaseError('Error creating new Activity.', error);
    }
}



}
export default new authServices()