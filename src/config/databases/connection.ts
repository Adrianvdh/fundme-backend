export type ConnectionDetails = {
    [key: string]: any;
};

export abstract class DatabaseConnection {
    protected constructor(protected connectionDetails: ConnectionDetails) {}
}
