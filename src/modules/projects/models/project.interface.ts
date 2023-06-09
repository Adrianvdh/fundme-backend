import { ObjectId } from 'mongodb';
import { DisplayableUser } from '@/modules/users/models/users.interface';
import { Category } from '@/shared/models/category.interface';
import { FileField } from '@/shared/storage/file.interface';
import { DisplayableContract } from '@/modules/contracts/models/contract.interface';
import { PaymentItem } from '@/modules/payments/models/payment.interface';
import { ContractResponse } from '@/modules/contracts/api/contract.model';

export interface Project {
    _id?: ObjectId;
    image: FileField;
    title: string;
    description: string;
    fundGoal: {
        targetGoal: string;
        actualAmount: string;
        achieved: boolean;
    };
    startDate: Date;
    endDate: Date;
    categoryIds: Array<ObjectId>;
    published: boolean;
    status: ProjectStatus;
    contractId: ObjectId;
    ownerId: ObjectId;
    contributorIds: Array<ObjectId>;
    created: Date;
    modified: Date;
}

export type DetailedProject = Project & {
    contract?: DisplayableContract;
    owner?: DisplayableUser;
    contributors?: Array<DisplayableUser>;
    categories?: Array<Category>;
};

export type ProjectImage = Pick<Project, 'image' | 'published' | 'status'>;

export type ProjectDetails = Pick<Project, 'title' | 'description' | 'status'>;

export type ProjectFundGoal = Pick<Project, 'endDate' | 'status'> & Pick<Project['fundGoal'], 'targetGoal'>;

export type ProjectPublishState = Pick<Project, 'published' | 'status' | 'contractId'>;

export enum ProjectStatus {
    EMPTY = 'EMPTY',
    COVER_UPLOADED = 'COVER_UPLOADED',
    CAPTURED_PROJECT_DETAILS = 'CAPTURED_PROJECT_DETAILS',
    SET_FUND_GOAL = 'SET_FUND_GOAL',
    PUBLISHED = 'PUBLISHED',
    ENDED = 'ENDED',
}

export interface ProjectItem extends PaymentItem {
    contractId: ObjectId;
}
