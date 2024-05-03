import express, { Router, Request, Response } from 'express';


import RegisteredUserController, {validateUserData} from "../controllers/auth/RegisteredUserController";
import AuthenticatedSessionController from "../controllers/auth/AuthenticatedSessionController";
import ProfileController from "../controllers/ProfileController";
import {isAuthenticated} from "../middleware/isAuthenticated";



const router: Router = express.Router();

//Public
router.post('/register', validateUserData, (req: Request, res : Response) => RegisteredUserController.store(req, res));
router.post('/login', (req: Request, res: Response) => AuthenticatedSessionController.store(req, res));

//Authenticated
router.use(isAuthenticated)

//Profile
router.delete('/profile', (req: Request, res: Response) => ProfileController.destroy(req,res))
router.put('/profile', (req: Request, res: Response) => ProfileController.update(req, res))

//session
router.delete('/logout', (req: Request, res: Response) => AuthenticatedSessionController.destroy(req, res) )




export default router;