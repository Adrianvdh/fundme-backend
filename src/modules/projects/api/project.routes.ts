import { Routes } from '@/shared/framework/routes.interface';
import validated from '@/shared/http/middlewares/validate-body.middleware';
import authenticated from '@/modules/auth/middleware/auth.middleware';
import { UserRepository } from '@/modules/users/repository/UserRepository';
import ProjectController from '@/modules/projects/api/project.controller';
import { ProjectRepository } from '@/modules/projects/repository/ProjectRepository';
import { SaveProjectDetailsRequest, SaveProjectFundGoalRequest } from '@/modules/projects/api/project.model';
import { singleFileUpload } from '@/shared/http/middlewares/file.middleware';

class ProjectRoutes extends Routes {
    public path = '/projects';

    constructor(
        private projectController: ProjectController,
        private projectRepository: ProjectRepository,
        private userRepository: UserRepository,
    ) {
        super();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.projectController.getProjects);
        this.router.post(
            `${this.path}`,
            authenticated(this.userRepository),
            singleFileUpload(),
            this.projectController.createProject,
        );
        this.router.get(
            `${this.path}/latest-incomplete`,
            authenticated(this.userRepository),
            this.projectController.getLatestIncomplete,
        );

        this.router.get(`${this.path}/:id`, this.projectController.getProjectById);
        this.router.delete(
            `${this.path}/:id`,
            authenticated(this.userRepository),
            this.projectController.deleteProject,
        );

        this.router.put(
            `${this.path}/:id/project-details`,
            authenticated(this.userRepository),
            validated(SaveProjectDetailsRequest, 'body', true),
            this.projectController.saveProjectDetails,
        );
        this.router.put(
            `${this.path}/:id/fund-goal`,
            authenticated(this.userRepository),
            validated(SaveProjectFundGoalRequest, 'body', true),
            this.projectController.saveFundGoal,
        );
        this.router.put(
            `${this.path}/:id/publish`,
            authenticated(this.userRepository),
            this.projectController.publishProject,
        );
    }
}

export default ProjectRoutes;
