import { Router } from 'express';
import { Routes } from '@/shared/framework/routes.interface';
import validated from '@/shared/http/middlewares/validate-body.middleware';
import authenticated from '@/modules/auth/middleware/auth.middleware';
import { UserRepository } from '@/modules/users/repository/UserRepository';
import PaymentController from '@/modules/payments/api/payment.controller';
import { PaymentRepository } from '@/modules/payments/repository/PaymentRepository';
import { InitializePaymentRequest, VerifyPaymentRequest } from '@/modules/payments/api/payment.model';

class PaymentRoutes implements Routes {
    public path = '/payments';
    public router = Router();

    constructor(
        private paymentController: PaymentController,
        private paymentRepository: PaymentRepository,
        private userRepository: UserRepository,
    ) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.paymentController.getPayments);
        this.router.post(
            `${this.path}/initialize`,
            authenticated(this.userRepository),
            validated(InitializePaymentRequest, 'body', true),
            this.paymentController.initializePayment,
        );
        this.router.put(
            `${this.path}/:id/verify`,
            authenticated(this.userRepository),
            validated(VerifyPaymentRequest, 'body', true),
            this.paymentController.verifyPayment,
        );
        this.router.get(`${this.path}/:id`, this.paymentController.getProjectById);
    }
}

export default PaymentRoutes;
