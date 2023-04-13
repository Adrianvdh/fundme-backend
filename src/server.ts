import App from '@/app';
import validateEnv from '@/shared/utils/validateEnv';
import IndexModule from '@/modules/index';
import AuthModule from '@/modules/auth';
import PaymentModule from '@/modules/payments';
import ProjectModule from '@/modules/projects';
import UserModule from '@/modules/users';

validateEnv();

const app = new App();
app.setup([IndexModule, AuthModule, PaymentModule, ProjectModule, UserModule]);
app.listen();
