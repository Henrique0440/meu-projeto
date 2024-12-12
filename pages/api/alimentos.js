import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis de ambiente

export default async function handler(req, res) {
    // Adicionar cabeçalhos CORS
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permite todas as origens
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS'); // Métodos permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Cabeçalhos permitidos

    // Responde às requisições OPTIONS rapidamente
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
        return res.status(500).json({ message: "A variável de ambiente MONGO_URI não está definida." });
    }

    const client = new MongoClient(MONGO_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        console.log("Tentando conectar ao MongoDB...");
        await client.connect();
        console.log("Conexão com o MongoDB estabelecida.");
        const db = await client.db("cardapio_rodinho");
        const collection = await db.collection("cardapio");
        
        if (req.method === 'GET') {
            const documentos = await collection.find({}).toArray();
            res.status(200).json(documentos);
        }
        else if (req.method === 'POST') {
            const { name, description, price, link } = req.body;

            if (!name || !description || !price || !link) {
                return res.status(400).json({ error: "Todos os campos são obrigatórios." })
            }

            const novoItem = { name, description, price, link };
            const result = await collection.insertOne(novoItem);

            return res.status(201).json({
                message: "Item adicionado ao cardápio com sucsso!",
                id: result.insertedId,
            })
        } else {
            res.status(405).json({ message: "Método não permitido" })
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao conectar ao banco de dados', error: error.message });
    } finally {
        await client.close();
    }
}
