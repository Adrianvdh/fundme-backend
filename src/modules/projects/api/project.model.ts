import { Project, ProjectStatus } from '@/modules/projects/models/project.interface';
import { ObjectId } from 'mongodb';
import { IsISO8601, IsNumberString, IsString } from 'class-validator';

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
    image: {
        url: string;
        fileType: string;
    };
    title: string;
    description: string;
    fundGoal: {
        targetGoal: string;
        actualAmount: string;
        achieved: boolean;
    };
    startDate: string;
    endDate: string;
    categories: Array<string>;
    published: boolean;
    status: ProjectStatus;
    ownerId: ObjectId;
    contributors: Array<any>;
    created: string;
    modified: string;
}

export function mapProjectToProjectResponse(project: Project): ProjectResponse {
    return {
        _id: project._id.toString(),
        image: project?.image,
        title: project?.title,
        description: project?.description,
        fundGoal: project?.fundGoal,
        startDate: project?.startDate?.toISOString(),
        endDate: project?.endDate?.toISOString(),
        categories: project?.categories,
        published: project?.published,
        status: project?.status,
        ownerId: project?.ownerId,
        contributors: project.contributors,
        created: project.created.toISOString(),
        modified: project.modified.toISOString(),
    };
}
