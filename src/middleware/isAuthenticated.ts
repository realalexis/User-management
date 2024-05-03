import {Request, Response, NextFunction} from "express";
import {PrismaClient} from "@prisma/client";
import authenticatedSessionController from "../controllers/auth/AuthenticatedSessionController";


const prisma = new PrismaClient()
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) =>{

    try {
        let sessionToken = req.headers.authorization
        if(sessionToken?.startsWith('Bearer')){
            sessionToken = sessionToken?.replace('Bearer', '').trimStart()
        }
        console.log(sessionToken)

        if(!sessionToken){
            return res.status(401).json({message: "Session token is required"})
        }

        const session = await prisma.session.findUnique({
            where:{
                token: sessionToken
            }
        })

        if(!session){
            return res.status(401).json({message: `Unauthorized invalid session ${session}` })

        } else if(session.expires_at < new Date()){
            await  authenticatedSessionController.destroy(req,res)
        }

        next();
    } catch (error){
        res.json({message: "Failed authenticated user"})

    }

}