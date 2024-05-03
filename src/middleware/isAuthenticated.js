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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sessionToken = req.headers.authorization;
        if (sessionToken === null || sessionToken === void 0 ? void 0 : sessionToken.startsWith('Bearer')) {
            sessionToken = sessionToken === null || sessionToken === void 0 ? void 0 : sessionToken.replace('Bearer', '').trimStart();
        }
        console.log(sessionToken);
        if (!sessionToken) {
            return res.status(401).json({ message: "Session token is required" });
        }
        const session = yield prisma.session.findUnique({
            where: {
                token: sessionToken
            }
        });
        if (!session || session.expires_at < new Date()) {
            return res.status(401).json({ message: `Unauthorized invalid session ${session}` });
        }
        next();
    }
    catch (error) {
        res.json({ message: "Failed authenticated user" });
    }
});
exports.isAuthenticated = isAuthenticated;
