import { Routes } from '@/shared/framework/routes.interface';
import ContractController from '@/modules/contracts/api/contract.controller';
import authenticated from '@/modules/auth/middleware/auth.middleware';
import { UserRepository } from '@/modules/users/repository/UserRepository';

class ContractRoutes extends Routes {
    public path = '/contracts';

    constructor(private contractController: ContractController, private userRepository: UserRepository) {
        super();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}/:id`,
            authenticated(this.userRepository),
            this.contractController.getContractById,
        );
    }
}

export default ContractRoutes;
