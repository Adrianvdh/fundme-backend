import { isEmpty } from '@/shared/utils/util';
import { NotFound, ValidationError } from '@/shared/exceptions/exceptions';
import { IProjectRepository } from '@/modules/projects/repository/IProjectRepository';
import {
    mapDetailedProjectToProjectResponse,
    ProjectResponse,
    SaveProjectDetailsRequest,
    SaveProjectFundGoalRequest,
} from '@/modules/projects/api/project.model';
import { DetailedProject, Project, ProjectStatus } from '@/modules/projects/models/project.interface';
import { IStorageService } from '@/shared/storage/storage';
import { File } from '@/shared/http/file';
import { ContractService } from '@/modules/contracts/service/contract.service';

class ProjectService {
    constructor(
        private projectRepository: IProjectRepository,
        private contractService: ContractService,
        private storageService: IStorageService,
    ) {}

    public async findAllProjects(): Promise<ProjectResponse[]> {
        const mappedProjects = (await this.projectRepository.findAll()).map(project =>
            mapDetailedProjectToProjectResponse(project, this.storageService),
        );
        return await Promise.all(mappedProjects);
    }

    public async findProjectById(projectId: string): Promise<ProjectResponse> {
        if (isEmpty(projectId)) {
            throw new ValidationError('Empty request!');
        }

        const project: DetailedProject = await this.projectRepository.findOneById(projectId);
        if (!project) {
            throw new NotFound("Project doesn't exist");
        }

        return mapDetailedProjectToProjectResponse(project, this.storageService);
    }

    public async findLatestIncomplete(userId: string): Promise<ProjectResponse> {
        if (isEmpty(userId)) {
            throw new ValidationError('You need to be logged in first!');
        }

        const project: Project = await this.projectRepository.findOneLatestIncompleteByOwnerId(userId);
        if (project) {
            return mapDetailedProjectToProjectResponse(project, this.storageService);
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
                urlPath: result.relativePath(),
                fileType: file.mimeType(),
            },
            published: false,
            status: ProjectStatus.COVER_UPLOADED,
        });
        return mapDetailedProjectToProjectResponse(project, this.storageService);
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
        return mapDetailedProjectToProjectResponse(project, this.storageService);
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
        return mapDetailedProjectToProjectResponse(project, this.storageService);
    }

    public async publishProject(userId: string, projectId: string): Promise<ProjectResponse> {
        const project = await this.projectRepository.findOneById(projectId);
        const contract = await this.contractService.deployContract(userId, project.title, project.description);

        const updatedProject = await this.projectRepository.updatePublishState(projectId, {
            published: true,
            status: ProjectStatus.PUBLISHED,
            contractId: contract._id,
        });
        return mapDetailedProjectToProjectResponse(updatedProject, this.storageService);
    }

    public async deleteProject(projectId: string): Promise<void> {
        const project: Project = await this.projectRepository.findOneById(projectId);
        if (!project) {
            throw new NotFound("Project doesn't exist");
        }

        await this.projectRepository.deleteOne(projectId);
    }

    public async getProjectContractAddress(projectId: string): Promise<string> {
        const project: Project = await this.projectRepository.findOneById(projectId);
        if (!project) {
            throw new NotFound("Project doesn't exist");
        }
        return (await this.contractService.getContract(project.contractId.toString())).address();
    }
}

export default ProjectService;
