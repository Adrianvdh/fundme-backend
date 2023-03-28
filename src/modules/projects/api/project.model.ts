import { Project, ProjectStatus } from '@/modules/projects/models/project.interface';
import { ObjectId } from 'mongodb';

export class CreateProjectRequest {
    image: {
        url: string;
        fileType: string;
    };
}

export class SaveProjectDetailsRequest {
    title: string;
    description: string;
}

export class SaveProjectFundGoalRequest {
    fundGoal: {
        targetGoal: string;
        actualAmount: string;
        achieved: boolean;
    };
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
    };
}
