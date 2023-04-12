import { UserRepository } from '@/modules/users/repository/UserRepository';
import { Routes } from '@/shared/framework/routes.interface';
import { Module } from '@/shared/framework/module';
import PaymentRoutes from '@/modules/payments/api/payment.routes';
import PaymentController from '@/modules/payments/api/payment.controller';
import PaymentService from '@/modules/payments/service/payment.service';
import { PaymentRepository } from '@/modules/payments/repository/PaymentRepository';

export class PaymentModule extends Module {
    public routes: Routes;

    protected setup() {
        const userRepository = new UserRepository(this.databaseConnection);
        const paymentRepository = new PaymentRepository(this.databaseConnection);
        // Payment Service
        const paymentService = new PaymentService(paymentRepository);
        const paymentController = new PaymentController(paymentService);

        this.routes = new PaymentRoutes(paymentController, paymentRepository, userRepository);
    }
}
