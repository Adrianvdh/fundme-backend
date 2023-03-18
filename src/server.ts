import App from '@/app';
import validateEnv from '@/shared/utils/validateEnv';
import UserModule from '@/modules/users';
import AuthModule from '@/modules/auth';
import IndexModule from '@/modules/index';

validateEnv();

const app = new App();
app.setup([IndexModule, UserModule, AuthModule]);
app.listen();
