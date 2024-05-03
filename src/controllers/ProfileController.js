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
class ProfileController {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.body.id;
                const { email, password, username } = req.body;
                if (!userId) {
                    return res.json({ message: 'UserId required' });
                }
                let hashPassword;
                if (password) {
                    hashPassword = yield bcrypt_1.default.hash(password, 10);
                }
                const updateProfile = yield this.prisma.user.update({
                    where: { id: userId },
                    data: {
                        email,
                        password: hashPassword,
                        username
                    }
                });
                res.json({ message: 'Update successfully' });
            }
            catch (error) {
                res.json({ message: `Failed to update profile: ${error}` });
            }
        });
    }
    destroy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.body.userId;
                if (!userId) {
                    return res.json({ message: "Body Request invalid : userId required" });
                }
                yield this.prisma.session.deleteMany({
                    where: {
                        userId: userId
                    }
                });
                const user = yield this.prisma.user.delete({
                    where: {
                        id: userId
                    }
                });
                if (!user) {
                    return res.send("User not found !");
                }
                res.json({ message: "User delete successfully" });
            }
            catch (error) {
                res.json({ message: `Failed to delete user : ${error}` });
            }
        });
    }
}
exports.default = new ProfileController();
