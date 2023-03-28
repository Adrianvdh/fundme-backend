import App from '@/app';
import validateEnv from '@/shared/utils/validateEnv';
import UserModule from '@/modules/users';
import AuthModule from '@/modules/auth';
import IndexModule from '@/modules/index';
import ProjectModule from '@/modules/projects';

validateEnv();

const app = new App();
app.setup([IndexModule, AuthModule, UserModule, ProjectModule]);
app.listen();
