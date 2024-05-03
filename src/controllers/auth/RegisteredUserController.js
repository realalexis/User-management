"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserData = void 0;
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const validateUserData = [
    // Validation du nom d'utilisateur
    (0, express_validator_1.check)('username').isAlphanumeric().withMessage('Username must be alphanumeric'),
    // Validation du mot de passe (au moins 8 caractères)
    (0, express_validator_1.check)('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    // Validation de l'email
    (0, express_validator_1.check)('email').isEmail().withMessage('Invalid email address'),
];
exports.validateUserData = validateUserData;
class RegisteredUserController {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const { username, email, password } = req.body;
                const hashPassword = yield bcrypt_1.default.hash(password, 10);
                const userData = yield this.prisma.user.create({
                    data: {
                        username,
                        email,
                        password: hashPassword
                    }
                });
                res.send(userData);
            }
            catch (error) {
                res.status(500).json(`Failed to create user: ${error}`);
            }
        });
    }
}
exports.default = new RegisteredUserController();
