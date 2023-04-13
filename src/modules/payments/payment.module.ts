import { UserRepository } from '@/modules/users/repository/UserRepository';
import { Routes } from '@/shared/framework/routes.interface';
import { Module } from '@/shared/framework/module';
import PaymentRoutes from '@/modules/payments/api/payment.routes';
import PaymentController from '@/modules/payments/api/payment.controller';
import PaymentService from '@/modules/payments/service/payment.service';
import { PaymentRepository } from '@/modules/payments/repository/PaymentRepository';
import { TransactionRepository } from '@/modules/payments/repository/TransactionRepository';
import { DatabaseConnection } from '@/config/databases/connection';
import { projectServiceFactory } from '@/modules/projects/project.module';

export function paymentServiceFactory(databaseConnection: DatabaseConnection): {
    paymentService: PaymentService;
    paymentRepository: PaymentRepository;
    userRepository: UserRepository;
} {
    const paymentRepository = new PaymentRepository(databaseConnection);
    const transactionRepository = new TransactionRepository(databaseConnection);
    // Payment Service
    const { userRepository, projectService } = projectServiceFactory(databaseConnection);
    const paymentService = new PaymentService(paymentRepository, transactionRepository, projectService);
    return { paymentService, paymentRepository, userRepository };
}

export class PaymentModule extends Module {
    public routes: Routes;

    protected setup() {
        const { userRepository, paymentRepository, paymentService } = paymentServiceFactory(this.databaseConnection);

        const paymentController = new PaymentController(paymentService);
        this.routes = new PaymentRoutes(paymentController, paymentRepository, userRepository);
    }
}
