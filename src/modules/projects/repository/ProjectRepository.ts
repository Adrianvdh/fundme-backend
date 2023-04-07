import * as mongodb from 'mongodb';
import { ObjectId } from 'mongodb';
import { MongoConnection } from '@/config/databases/mongodb';
import { MongoDict } from '@/config/databases/types';
import { DatabaseConnection } from '@/config/databases/connection';
import {
    DetailedProject,
    Project,
    ProjectDetails,
    ProjectFundGoal,
    ProjectImage,
    ProjectPublishState,
    ProjectStatus,
} from '@/modules/projects/models/project.interface';
import { IProjectRepository } from '@/modules/projects/repository/IProjectRepository';
import { MongoException } from '@/shared/exceptions/exceptions';
import { projectProjectionFactory } from '@/modules/projects/repository/ProjectProjections';

export class ProjectRepository implements IProjectRepository {
    private readonly projects: mongodb.Collection<Project>;

    constructor(private databaseConnection: DatabaseConnection) {
        this.projects = (this.databaseConnection as MongoConnection).db.collection<Project>('projects');
    }

    async findOneById(projectId: string): Promise<DetailedProject> {
        const queryResult = await this.projects.aggregate<DetailedProject>([
            {
                $match: {
                    _id: new ObjectId(projectId),
                },
            },
            ...projectProjectionFactory(true, true, true),
        ]);

        const result = await queryResult.toArray();
        return result.length === 1 ? result[0] : null;
    }

    async findAll(): Promise<DetailedProject[]> {
        const queryResult = await this.projects.aggregate<DetailedProject>(projectProjectionFactory());

        return await queryResult.toArray();
    }

    async findOneLatestIncompleteByOwnerId(ownerId: string): Promise<Project | null> {
        const filter = {
            ownerId: new ObjectId(ownerId),
            status: {
                $ne: ProjectStatus.PUBLISHED,
            },
        };
        const array = await this.projects.find(filter).sort({ modified: -1 }).limit(1).toArray();
        return array.length > 0 ? array[0] : null;
    }

    async create(ownerId: string, project: ProjectImage): Promise<Project> {
        const projectDocument = {
            image: project.image,
            title: '',
            description: '',
            fundGoal: {
                achieved: false,
                actualAmount: '0',
                targetGoal: '0',
            },
            startDate: null,
            endDate: null,
            categoryIds: [],
            published: project.published,
            status: project.status,
            contractId: null,
            ownerId: new ObjectId(ownerId),
            contributorIds: [],
            created: new Date(),
            modified: new Date(),
        };
        const result = await this.projects.insertOne(projectDocument);
        if (!result.insertedId) {
            throw new MongoException('Failed to save the project!');
        }
        return await this.findOneById(result.insertedId.toString());
    }

    async updateProjectDetails(projectId: string, project: ProjectDetails): Promise<DetailedProject> {
        const update = {
            $set: {
                ...project,
                modified: new Date(),
            },
        };
        return await this.updateProject(projectId, update);
    }

    async updateFundGoal(projectId: string, project: ProjectFundGoal): Promise<DetailedProject> {
        const update = {
            $set: {
                'fundGoal.targetGoal': project.targetGoal,
                endDate: project.endDate,
                status: project.status,
                modified: new Date(),
            },
        };
        return await this.updateProject(projectId, update);
    }

    async updatePublishState(projectId: string, project: ProjectPublishState): Promise<DetailedProject> {
        const update = {
            $set: {
                ...project,
                modified: new Date(),
            },
        };
        return await this.updateProject(projectId, update);
    }

    private async updateProject(projectId: string, update: MongoDict): Promise<DetailedProject> {
        const result = await this.projects.updateOne({ _id: new ObjectId(projectId) }, update);
        if (result.modifiedCount === 0) {
            throw new MongoException('Failed to update the project!');
        }
        return await this.findOneById(projectId);
    }

    async deleteOne(projectId: string): Promise<void> {
        await this.projects.deleteOne({ _id: new ObjectId(projectId) });
    }
}
