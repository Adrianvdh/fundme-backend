import * as mongodb from 'mongodb';
import { DatabaseConnection } from '@/config/databases/connection';
import { DB_DATABASE, DB_HOST, DB_PORT } from '@config';

export class MongoConnection extends DatabaseConnection {
    constructor(public connection: mongodb.Db) {
        super(connection);
    }
}

export class MongoConfig {
    private client: mongodb.MongoClient;
    private db: mongodb.Db;

    public async connect(): Promise<DatabaseConnection> {
        const url = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
        this.client = await mongodb.MongoClient.connect(url);
        this.db = await this.client.db(process.env.DB_NAME);
        return new MongoConnection(this.db);
    }
}
