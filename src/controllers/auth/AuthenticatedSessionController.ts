import {PrismaClient} from '@prisma/client';
import  {Request, Response} from "express";
import bcrypt from 'bcrypt'
import {generateSessionToken} from "../../../utils/sessionUtils";


class AuthenticatedSessionController {
    private prisma : PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }

    async store(req: Request, res: Response){

        const {email, password} = req.body;

        const user  = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if(!user){
            return res.status(404).send('User not found')
        }

        const passWordMatch = await bcrypt.compare(password, user.password);

        if(!passWordMatch){
            return res.status(401).send('Invalid password');
        }

        const sessionToken = generateSessionToken()
        const currentTime = new Date().getTime();
        try {


            const newSession = await this.prisma.session.create({
                data: {
                    user: {
                        connect: {id: user.id}
                    },
                    token: sessionToken,
                    expires_at: new Date(currentTime + 3600000)
                }
            })

            res.json({
                message: 'logged in successfully',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                },
                session: {
                    id: newSession.id,
                    token: newSession.token,
                    expires_at: newSession.expires_at,
                }
            })
        }catch (error){
            res.status(500).send(`Failed to connect user: ${error}`);
        }
    }

   public async destroy(req: Request, res: Response){
        const sessionToken = req.headers.authorization

        console.log(sessionToken)

        try{
            await  this.prisma.session.delete({
                where :{
                    token: sessionToken
                }
            })
            res.json({
                message: "Logged out successfully"
            })
        }catch (error){
            res.status(500).send(`Failed to delete user: ${error}`);
        }
    }
}

export default new AuthenticatedSessionController();
