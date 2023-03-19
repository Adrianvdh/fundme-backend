import * as mongodb from 'mongodb';
import { ConnectionDetails, DatabaseConnection } from '@/config/databases/connection';
import { DB_DATABASE, DB_HOST, DB_PORT } from '@config';

export class MongoConnection extends DatabaseConnection {
    public db: mongodb.Db;
    public client: mongodb.MongoClient;
    constructor(public connectionDetails: ConnectionDetails) {
        super(connectionDetails);
        this.db = connectionDetails.db;
        this.client = connectionDetails.client;
    }
}

export class MongoConfig {
    private client: mongodb.MongoClient;
    private db: mongodb.Db;

    public async connect(): Promise<DatabaseConnection> {
        const url = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
        this.client = await mongodb.MongoClient.connect(url);
        this.db = await this.client.db(process.env.DB_NAME);
        return new MongoConnection({ db: this.db, client: this.client });
    }
}
