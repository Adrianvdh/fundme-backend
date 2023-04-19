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
import TransactionService from '@/modules/payments/transactions/transaction.service';

export function paymentServiceFactory(databaseConnection: DatabaseConnection): {
    paymentService: PaymentService;
    paymentRepository: PaymentRepository;
    userRepository: UserRepository;
} {
    const paymentRepository = new PaymentRepository(databaseConnection);
    const transactionRepository = new TransactionRepository(databaseConnection);
    // Transaction Service
    const transactionService = new TransactionService(transactionRepository);
    // Project Service
    const { userRepository, projectService } = projectServiceFactory(databaseConnection);
    // Payment Service
    const paymentService = new PaymentService(paymentRepository, transactionService, projectService);
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
