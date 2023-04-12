import { NextFunction, Request, Response } from 'express';
import { HttpResponse } from '@/shared/http/httpResponse';
import PaymentService from '@/modules/payments/service/payment.service';
import { InitializePaymentRequest, PaymentResponse, VerifyPaymentRequest } from '@/modules/payments/api/payment.model';
import { RequestWithUser } from '@/modules/auth/api/auth.models';

class PaymentController {
    constructor(private paymentsService: PaymentService) {}

    public getPayments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const findAllProjects: PaymentResponse[] = await this.paymentsService.findAllPayments();

            res.status(200).json(findAllProjects);
        } catch (error) {
            next(error);
        }
    };

    public getProjectById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const paymentId: string = req.params.id;
            const paymentResponse: PaymentResponse = await this.paymentsService.findPaymentById(paymentId);

            return HttpResponse.ok(res, paymentResponse);
        } catch (error) {
            next(error);
        }
    };

    public initializePayment = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const requestData: InitializePaymentRequest = req.body;
            const paymentResponse: PaymentResponse = await this.paymentsService.initialisePayment(
                req.userId,
                requestData,
            );

            return HttpResponse.ok(res, paymentResponse);
        } catch (error) {
            next(error);
        }
    };

    public verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const paymentId: string = req.params.id;
            const requestData: VerifyPaymentRequest = req.body;
            const paymentResponse: PaymentResponse = await this.paymentsService.verifyPayment(
                paymentId,
                requestData,
            );

            return HttpResponse.ok(res, paymentResponse);
        } catch (error) {
            next(error);
        }
    };
}

export default PaymentController;
