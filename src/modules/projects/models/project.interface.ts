import { ObjectId } from 'mongodb';

export interface Project {
    _id?: ObjectId;
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
    startDate: Date;
    endDate: Date;
    categories: Array<string>;
    published: boolean;
    status: ProjectStatus;
    ownerId: ObjectId;
    contributors: Array<any>;
}

export type ProjectImage = Pick<Project, 'image' | 'published' | 'status'>;

export type ProjectDetails = Pick<Project, 'title' | 'description' | 'status'>;

export type ProjectFundGoal = Pick<Project, 'fundGoal' | 'status'>;

export type ProjectPublishState = Pick<Project, 'published' | 'status'>;

export enum ProjectStatus {
    EMPTY = 'EMPTY',
    COVER_UPLOADED = 'COVER_UPLOADED',
    CAPTURED_PROJECT_DETAILS = 'CAPTURED_PROJECT_DETAILS',
    SET_FUND_GOAL = 'SET_FUND_GOAL',
    PUBLISHED = 'PUBLISHED',
    ENDED = 'ENDED',
}
