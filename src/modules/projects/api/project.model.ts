import { DetailedProject, Project, ProjectStatus } from '@/modules/projects/models/project.interface';
import { IsISO8601, IsNumberString, IsString } from 'class-validator';
import { IStorageService } from '@/shared/storage/storage';
import { mapDisplayableUserToUserResponse, UserResponse } from '@/modules/users/api/users.model';
import { Category } from '@/shared/models/category.interface';
import { FileField, mapFileField } from '@/shared/storage/file.interface';
import { ContractResponse, mapDisplayableContractToContractResponse } from '@/modules/contracts/api/contract.model';

export class SaveProjectDetailsRequest {
    @IsString()
    title: string;

    @IsString()
    description: string;
}

export class SaveProjectFundGoalRequest {
    @IsNumberString()
    targetGoal: string;

    @IsISO8601()
    endDate: string;
}

export interface ProjectResponse {
    _id?: string;
    image: FileField;
    title: string;
    description: string;
    fundGoal: {
        targetGoal: string;
        actualAmount: string;
        achieved: boolean;
    };
    startDate: string;
    endDate: string;
    published: boolean;
    status: ProjectStatus;
    created: string;
    modified: string;
    ownerId: string;
    owner?: UserResponse;
    contributors?: Array<UserResponse>;
    categories?: Array<Category>;
    contractId: string;
    contract?: ContractResponse;
}

export async function mapDetailedProjectToProjectResponse(
    project: DetailedProject,
    storageService: IStorageService,
): Promise<ProjectResponse> {
    if (!project) {
        return undefined;
    }
    const mappedContributors = project?.contributors?.map(
        async user => await mapDisplayableUserToUserResponse(user, storageService),
    );
    const contributors = mappedContributors ? await Promise.all(mappedContributors) : [];
    return {
        _id: project._id.toString(),
        image: await mapFileField(project?.image, storageService),
        title: project?.title,
        description: project?.description,
        fundGoal: project?.fundGoal,
        startDate: project?.startDate?.toISOString(),
        endDate: project?.endDate?.toISOString(),
        published: project?.published,
        status: project?.status,
        created: project.created.toISOString(),
        modified: project.modified.toISOString(),
        ownerId: project.ownerId.toString(),
        owner: await mapDisplayableUserToUserResponse(project.owner, storageService),
        contributors: contributors,
        categories: project?.categories || [],
        contractId: project.contractId?.toString(),
        contract: mapDisplayableContractToContractResponse(project.contract),
    };
}
