import { isEmpty } from '@/shared/utils/util';
import { NotFound, ValidationError } from '@/shared/exceptions/exceptions';
import { IProjectRepository } from '@/modules/projects/repository/IProjectRepository';
import {
    mapProjectToProjectResponse,
    ProjectResponse,
    SaveProjectDetailsRequest,
    SaveProjectFundGoalRequest
} from '@/modules/projects/api/project.model';
import { Project, ProjectStatus } from '@/modules/projects/models/project.interface';
import { IStorageService } from '@/shared/storage/storage';
import { File } from '@/shared/http/file';
import { ContractService } from '@/modules/contracts/service/contract.service';

class ProjectService {
    constructor(
        private projectRepository: IProjectRepository,
        private contractService: ContractService,
        private storageService: IStorageService,
    ) {}

    public async findAllProjects(): Promise<Promise<ProjectResponse>[]> {
        return (await this.projectRepository.findAll()).map(project => mapProjectToProjectResponse(project, this.storageService));
    }

    public async findProjectById(projectId: string): Promise<ProjectResponse> {
        if (isEmpty(projectId)) {
            throw new ValidationError('Empty request!');
        }

        const project: Project = await this.projectRepository.findOneById(projectId);
        if (!project) {
            throw new NotFound("Project doesn't exist");
        }

        return mapProjectToProjectResponse(project, this.storageService);
    }

    public async findLatestIncomplete(userId: string): Promise<ProjectResponse> {
        if (isEmpty(userId)) {
            throw new ValidationError('You need to be logged in first!');
        }

        const project: Project = await this.projectRepository.findOneLatestIncompleteByOwnerId(userId);
        if (project) {
            return mapProjectToProjectResponse(project, this.storageService);
        }
        return null;
    }

    public async createProject(ownerId: string, file: File): Promise<ProjectResponse> {
        if (isEmpty(ownerId)) {
            throw new ValidationError('You need to be logged in first!');
        }
        const result = await this.storageService.uploadFile('projects', 'image.png', file.buffer());

        const project = await this.projectRepository.create(ownerId, {
            image: {
                url: result.relativePath(),
                fileType: file.mimeType(),
            },
            published: false,
            status: ProjectStatus.COVER_UPLOADED,
        });
        return mapProjectToProjectResponse(project, this.storageService);
    }

    public async saveProjectDetails(
        projectId: string,
        projectDetails: SaveProjectDetailsRequest,
    ): Promise<ProjectResponse> {
        if (isEmpty(projectDetails)) {
            throw new ValidationError('Empty request!');
        }

        const project = await this.projectRepository.updateProjectDetails(projectId, {
            ...projectDetails,
            status: ProjectStatus.CAPTURED_PROJECT_DETAILS,
        });
        return mapProjectToProjectResponse(project, this.storageService);
    }

    public async saveFundGoal(projectId: string, projectDetails: SaveProjectFundGoalRequest): Promise<ProjectResponse> {
        if (isEmpty(projectDetails)) {
            throw new ValidationError('Empty request!');
        }

        const project1 = {
            targetGoal: projectDetails.targetGoal,
            endDate: new Date(projectDetails.endDate),
            status: ProjectStatus.SET_FUND_GOAL,
        };
        const project = await this.projectRepository.updateFundGoal(projectId, project1);
        return mapProjectToProjectResponse(project, this.storageService);
    }

    public async publishProject(projectId: string): Promise<ProjectResponse> {
        this.contractService.publishContract();

        const project = await this.projectRepository.updatePublishState(projectId, {
            published: true,
            status: ProjectStatus.PUBLISHED,
        });
        return mapProjectToProjectResponse(project, this.storageService);
    }

    public async deleteProject(projectId: string): Promise<void> {
        const project: Project = await this.projectRepository.findOneById(projectId);
        if (!project) {
            throw new NotFound("Project doesn't exist");
        }

        await this.projectRepository.deleteOne(projectId);
    }
}

export default ProjectService;
