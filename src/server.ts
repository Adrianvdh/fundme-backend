import App from '@/app';
import validateEnv from '@/shared/utils/validateEnv';
import AuthModule from '@/modules/auth';
import PaymentModule from '@/modules/payments';
import ProjectModule from '@/modules/projects';
import UserModule from '@/modules/users';
import ContractModule from '@/modules/contracts';

validateEnv();

const app = new App();
app.setup([AuthModule, ContractModule, PaymentModule, ProjectModule, UserModule]);
app.listen();
