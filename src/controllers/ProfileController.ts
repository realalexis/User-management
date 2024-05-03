import {PrismaClient, User} from '@prisma/client';
import {Request, Response} from "express";
import bcrypt from "bcrypt";


class ProfileController {
    private prisma : PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }

    async update(req: Request, res: Response){
        try {
            const userId: number = req.body.id
            const {email , password, username } = req.body
            if(!userId){
                return res.json({message: 'UserId required'})
            }
            let hashPassword;
            if(password) {
                hashPassword = await bcrypt.hash(password,10)
            }

            const updateProfile = await this.prisma.user.update({
                where :{ id: userId },
                data :{
                    email,
                    password: hashPassword,
                    username
                }
            })
            res.json({message: 'Update successfully'})
        } catch (error){
            res.json({message: `Failed to update profile: ${error}`})
        }
    }

    async destroy(req: Request, res: Response){
        try {


            const userId = req.body.userId;

            if (!userId) {
                return res.json({message: "Body Request invalid : userId required"})
            }

            await this.prisma.session.deleteMany({
                where: {
                    userId: userId
                }
            });

            const user = await this.prisma.user.delete({
                where: {
                    id: userId
                }
            })
            if(!user){
                return res.send("User not found !")
            }

            res.json({message: "User delete successfully"})
        } catch (error){
            res.json({message: `Failed to delete user : ${error}`})
        }
    }
}

export default new ProfileController()