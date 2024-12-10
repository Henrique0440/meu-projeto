import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis de ambiente

export default async function handler(req, res) {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
    return res.status(500).json({ message: "A variável de ambiente MONGO_URI não está definida." });
}
    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Método não permitido' });
        return;
    }

    const client = new MongoClient(MONGO_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();
        const db = await client.db("cardapio_rodinho");
        const collection = await db.collection("cardapio");
        const documentos = await collection.find({}).toArray();
        res.status(200).json(documentos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao conectar ao banco de dados', error: error.message });
    } finally {
        await client.close();
    }
}
