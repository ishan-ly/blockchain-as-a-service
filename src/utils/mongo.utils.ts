import { MongoClient } from "mongodb";



export class MongoUtils {
    private uri;
    private client;
    private database_name;
    private sc_database_name;
    private nft_database_name;
    
    constructor() {
        this.uri = process.env.MONGODB_URI ? process.env.MONGODB_URI : "";
        this.client = new MongoClient(this.uri);
        this.database_name = process.env.MONGODB_DBNAME;
        this.sc_database_name = 'smartcontract_db';
        this.nft_database_name = 'nft_marketplace_db';
    }


    async connect() {
        this.client.connect();
    }

    async disconnect() {
        this.client.close();
    }

    async filter(collectionName: string, query: any, options: any) {
        const database = this.client.db(this.database_name);
        const collection = database.collection(collectionName);

        // Query for a movie that has the title 'The Room'
        // const query = { title: "The Room" };

        // const options = {
        //     // sort matched documents in descending order by rating
        //     sort: { "imdb.rating": -1 },
        //     // Include only the `title` and `imdb` fields in the returned document
        //     projection: { _id: 0, title: 1, imdb: 1 },
        // };

        return await collection.find(query, options).toArray();
    }

    async get(collectionName: string, query: any, options: any) {
        const database = this.client.db(this.database_name);
        const collection = database.collection(collectionName);

        return await collection.findOne(query, options);
    }

    async insert(collectionName: string, object: any) {
        const database = this.client.db(this.database_name);
        const collection = database.collection(collectionName);

        return await collection.insertOne(object)
    }

    async update(collectionName: string, query: any, object: any) {
        const database = this.client.db(this.database_name);
        const collection = database.collection(collectionName);

        const res = await collection.replaceOne(query, object, { upsert: true })

    }

    async pushToSmartcontractDB(collectionName: string, query: any, object: any) {
        const database = this.client.db(this.sc_database_name);
        const collection = database.collection(collectionName);

        const res = await collection.replaceOne(query, object, { upsert: true })
    }

    async saveAirdropDetails(collectionName: string, object: any) {
        const database = this.client.db(this.nft_database_name);
        const collection = database.collection(collectionName);

        return await collection.insertOne(object)
    }
}