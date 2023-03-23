import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { CREDENTIALS, LOG_FORMAT, NODE_ENV, ORIGIN, PORT } from '@config';
import { logger, stream } from '@/shared/utils/logger';
import { Module } from './shared/framework/module';
import { Constructable } from '@/shared/types';
import { MongoConfig } from '@/config/databases/mongodb';
import { DatabaseConnection } from '@/config/databases/connection';
import internalServerErrorMiddleware from '@/shared/exceptions/handlers/internal-server-error.middleware';
import authenticationErrorMiddleware from '@/shared/exceptions/handlers/authentication-error.middleware';
import validationErrorMiddleware from '@/shared/exceptions/handlers/validation-error.middleware';

class App {
    public app: express.Application;
    public env: string;
    public port: string | number;
    public databaseConnection: DatabaseConnection;

    constructor() {
        this.app = express();
        this.env = NODE_ENV || 'development';
        this.port = PORT || 3000;
    }

    public async setup(modules: Constructable<Module>[]) {
        await this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeModules(modules);
        this.initializeSwagger();
        this.initializeErrorHandling();
    }

    public listen() {
        this.app.listen(this.port, () => {
            logger.info(`=================================`);
            logger.info(`======= ENV: ${this.env} =======`);
            logger.info(`🚀 App listening on the port ${this.port}`);
            logger.info(`=================================`);
        });
    }

    private async connectToDatabase() {
        this.databaseConnection = await new MongoConfig().connect();
    }

    private initializeMiddlewares() {
        this.app.use(morgan(LOG_FORMAT, { stream }));
        this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
        this.app.use(hpp());
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
    }

    private initializeModules(modules: Constructable<Module>[]) {
        modules.forEach(ModuleClass => {
            const moduleObj = new ModuleClass(this.databaseConnection);
            this.app.use('/api/', moduleObj.routes.router);
        });
    }

    private initializeSwagger() {
        const options = {
            swaggerDefinition: {
                info: {
                    title: 'REST API',
                    version: '1.0.0',
                    description: 'Example docs',
                },
            },
            apis: ['swagger.yaml'],
        };

        const specs = swaggerJSDoc(options);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    }

    private initializeErrorHandling() {
        this.app.use(authenticationErrorMiddleware);
        this.app.use(validationErrorMiddleware);
        this.app.use(internalServerErrorMiddleware);
    }
}

export default App;
