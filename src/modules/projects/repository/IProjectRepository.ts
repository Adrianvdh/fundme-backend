import { MongoDict } from '@/config/databases/types';
import { Project, ProjectDetails, ProjectFundGoal, ProjectImage, ProjectPublishState } from '@/modules/projects/models/project.interface';

export interface IProjectRepository {
    find(filter: MongoDict): Promise<Project>;

    findOneById(projectId: string): Promise<Project>;

    findOneLatestIncompleteByOwnerId(userId: string): Promise<Project>;

    findAll(): Promise<Project[]>;

    create(ownerId: string, project: ProjectImage): Promise<Project>;

    updateProjectDetails(projectId: string, project: ProjectDetails): Promise<Project>;

    updateFundGoal(projectId: string, project: ProjectFundGoal): Promise<Project>;

    updatePublishState(projectId: string, project: ProjectPublishState): Promise<Project>;

    deleteOne(projectId: string);
}
