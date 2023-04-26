import * as mongodb from 'mongodb';
import { ConnectionDetails, DatabaseConnection } from '@/config/databases/connection';
import { DATABASE_CONNECTION_STRING } from '@config';

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
        this.client = await mongodb.MongoClient.connect(DATABASE_CONNECTION_STRING);
        this.db = await this.client.db(process.env.DB_NAME);
        return new MongoConnection({ db: this.db, client: this.client });
    }
}
