import { PrismaClient } from "@prisma/client";
import convertTopLevelStringBooleans from "../utilty/convertTopLevelStringBooleans";
import { DatabaseError } from "../errors/DatabaseError";
import { NotFoundError } from "../errors/NotFoundError";
const prisma = new PrismaClient();

export class roleServices{
  
    public async getAllRole(RoleFilter: any) {
        try {
            console.log('here');
    
            const { page, pageSize } = RoleFilter;
            let { include} = RoleFilter; // Destructure filter conditions and remove include
            delete RoleFilter.page;
            delete RoleFilter.pageSize;
            delete RoleFilter.include
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
                const Roles = await prisma.role.findMany({
                    where: RoleFilter, // Pass filter conditions directly
                    include,
                    skip: +skip,
                    take: +take,
                });
                const total = await prisma.role.count({
                    where: RoleFilter, // Pass filter conditions directly
                });
                return {
                    info: Roles,
                    total,
                    page,
                    pageSize,
                };
            }
            console.log(include);
    
            const Roles = await prisma.role.findMany({
                where: RoleFilter, // Pass filter conditions directly
                include,
            });
            return Roles;
        } catch (error) {
            throw new DatabaseError('Error retrieving attachments.', error);
        }
    }
    public async CreateRole(dataRole: any) {
        try {
            const {name} = dataRole;
            const nameExist=await prisma.role.findFirst({where:{name}})
            if(nameExist){
                throw new NotFoundError(`role ${name} already exist`);
            }
           const role = await prisma.role.create({
               data: dataRole
           })
            return role;
        } catch (error) {
            if(error instanceof NotFoundError){
                throw error
            }
            throw new DatabaseError('Error retrieving attachments.', error);
        }
    }
}
export default new roleServices()