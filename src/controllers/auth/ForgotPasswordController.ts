import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Mailjet from "node-mailjet";
class ForgotPasswordController {
    private prisma: PrismaClient;
    private mailjet: Mailjet

    constructor() {
        this.prisma = new PrismaClient();
        this.mailjet = new Mailjet({
            apiKey:`${process.env.API_KEY_MAILJET}`,
            apiSecret:`${process.env.API_SECRET_KEY_MAILJET}`
        })
    };

    }

    async sendPasswordResetEmail(req: Request, res: Response) {
        try {
            const email = req.body.email;

           


            
            const request = mailjet.post('send', { version: 'v3.1' }).request({
                Messages: [
                    {
                        From: {
                            Email: 'votre@email.com',
                            Name: 'Votre Nom',
                        },
                        To: [
                            {
                                Email: email,
                                Name: 'Destinataire',
                            },
                        ],
                        Subject: 'Réinitialisation de votre mot de passe',
                        TextPart: 'Voici votre lien de réinitialisation de mot de passe...',
                        HTMLPart: '<p>Voici votre lien de réinitialisation de mot de passe...</p>',
                    },
                ],
            });

            // Envoyez l'e-mail
            const result = await request;
            console.log(result.body); // Affichez la réponse de l'API Mailjet

            // Répondez avec un message approprié
            res.json({ message: 'E-mail de réinitialisation envoyé avec succès.' });
        } catch (error) {
            console.error('Erreur lors de l'envoi de l'e-mail de réinitialisation :', error);
            res.status(500).json({ error: 'Une erreur s'est produite lors de l'envoi de l'e-mail de réinitialisation.' });
            }
        }

    async resetPassword(req: Request, res: Response) {

    }
}

export default new ForgotPasswordController();
