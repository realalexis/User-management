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
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const sessionUtils_1 = require("../../../utils/sessionUtils");
class AuthenticatedSessionController {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield this.prisma.user.findUnique({
                where: {
                    email
                }
            });
            if (!user) {
                return res.status(404).send('User not found');
            }
            const passWordMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!passWordMatch) {
                return res.status(401).send('Invalid password');
            }
            const sessionToken = (0, sessionUtils_1.generateSessionToken)();
            const currentTime = new Date().getTime();
            try {
                const newSession = yield this.prisma.session.create({
                    data: {
                        user: {
                            connect: { id: user.id }
                        },
                        token: sessionToken,
                        expires_at: new Date(currentTime + 3600000)
                    }
                });
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
                });
            }
            catch (error) {
                res.status(500).send(`Failed to connect user: ${error}`);
            }
        });
    }
    destroy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionId = req.body.sessionId;
            console.log(sessionId);
            try {
                yield this.prisma.session.delete({
                    where: {
                        id: sessionId
                    }
                });
                res.json({
                    message: "Logged out successfully"
                });
            }
            catch (error) {
                res.status(500).send(`Failed to delete user: ${error}`);
            }
        });
    }
}
exports.default = new AuthenticatedSessionController();
