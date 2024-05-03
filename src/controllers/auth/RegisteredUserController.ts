import {PrismaClient, User} from '@prisma/client';
import {Request, Response} from "express";
import { validationResult, check } from 'express-validator';
import bcrypt from 'bcrypt'


const validateUserData = [
    // Validation du nom d'utilisateur
    check('username').isAlphanumeric().withMessage('Username must be alphanumeric'),
    // Validation du mot de passe (au moins 8 caractères)
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    // Validation de l'email
    check('email').isEmail().withMessage('Invalid email address'),
];
class RegisteredUserController {
    private prisma: PrismaClient
    constructor() {
        this.prisma = new PrismaClient()
    }
     async store(req: Request, res : Response) {
        const errors = validationResult(req);


        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { username, email, password } = req.body;

            const hashPassword = await bcrypt.hash(password,10)
            const userData : User =  await this.prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashPassword
                }
            });

            res.send(userData)

        } catch (error) {
             res.status(500).json(`Failed to create user: ${error}`);
        }
    }

}

export default new RegisteredUserController() ;
export {validateUserData}
