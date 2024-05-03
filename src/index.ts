import express from 'express';
import AuthRouter from "./routes/auth";



const app = express();
const port = 3000;

// Connexion à la base de données PostgreSQL
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = `${process.env.DATABASE_URL}`


const pool = new Pool({ connectionString })
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Erreur lors de la connexion à la base de données :', err);
    }
    console.log('Connexion à la base de données réussie !');
    release(); // Libération du client pour le pool
});
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Middleware pour le parsing des requêtes JSON
app.use(express.json());

app.use('/api', AuthRouter)




// Démarrage du serveur
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
