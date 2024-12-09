
import { MongoClient, ServerApiVersion } from 'mongodb';

export default async function handler(req, res) {
    const MONGO_URI = process.env.MONGO_URI;

    const client = new MongoClient(MONGO_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    try {
        await client.connect();
        // Send a ping to confirm a successful connection
        const db = await client.db("cardapio_rodinho")
        const collection = await db.collection("cardapio")

        const documentos = await collection.find({}).toArray();
        res.status(200).json(documentos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao conectar ao banco de dados', error: error.message });
    } finally {
        await client.close();
    }
}
