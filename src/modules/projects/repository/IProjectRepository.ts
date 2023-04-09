import {
    DetailedProject,
    Project,
    ProjectDetails,
    ProjectFundGoal,
    ProjectImage,
    ProjectPublishState,
} from '@/modules/projects/models/project.interface';

export interface IProjectRepository {
    findOneById(projectId: string): Promise<DetailedProject>;

    findAll(): Promise<DetailedProject[]>;

    findOneLatestIncompleteByOwnerId(userId: string): Promise<Project>;

    create(ownerId: string, project: ProjectImage): Promise<DetailedProject>;

    updateProjectDetails(projectId: string, project: ProjectDetails): Promise<DetailedProject>;

    updateFundGoal(projectId: string, project: ProjectFundGoal): Promise<DetailedProject>;

    updatePublishState(projectId: string, project: ProjectPublishState): Promise<DetailedProject>;

    deleteOne(projectId: string);
}
