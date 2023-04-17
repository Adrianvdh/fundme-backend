import { PaymentItem } from '@/modules/payments/models/payment.interface';
import { ProjectResponse } from '@/modules/projects/api/project.model';
import { IPaymentResolver } from '@/modules/payments/service/IPaymentResolver';
import ProjectService from '@/modules/projects/service/project.service';

export class ProjectPaymentResolver implements IPaymentResolver {
    constructor(private projectService: ProjectService) {}

    async resolve(item: PaymentItem): Promise<ProjectResponse> {
        return await this.projectService.findProjectById(item.id.toString());
    }
}
