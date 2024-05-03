"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const app = (0, express_1.default)();
const port = 3000;
// Connexion à la base de données PostgreSQL
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const connectionString = `${process.env.DATABASE_URL}`;
console.log(connectionString);
const pool = new pg_1.Pool({ connectionString });
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Erreur lors de la connexion à la base de données :', err);
    }
    console.log('Connexion à la base de données réussie !');
    release(); // Libération du client pour le pool
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
// Middleware pour le parsing des requêtes JSON
app.use(express_1.default.json());
app.use('/api', auth_1.default);
// Démarrage du serveur
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
