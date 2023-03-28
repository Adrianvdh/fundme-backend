import * as mongodb from 'mongodb';
import { ObjectId } from 'mongodb';
import { MongoConnection } from '@/config/databases/mongodb';
import { Filter } from '@/config/databases/types';
import { DatabaseConnection } from '@/config/databases/connection';
import { Project, ProjectDetails, ProjectFundGoal, ProjectPublishState } from '@/modules/projects/models/project.interface';
import { IProjectRepository } from '@/modules/projects/repository/IProjectRepository';
import { MongoException } from '@/shared/exceptions/exceptions';

export class ProjectRepository implements IProjectRepository {
    private readonly projects: mongodb.Collection<Project>;

    constructor(private databaseConnection: DatabaseConnection) {
        this.projects = (this.databaseConnection as MongoConnection).db.collection<Project>('projects');
    }

    async find(filter: Filter): Promise<Project> {
        return await this.projects.findOne(filter);
    }

    async findOneById(projectId: string): Promise<Project> {
        return await this.projects.findOne({ _id: new ObjectId(projectId) });
    }

    async findOneLatestIncompleteByOwnerId(ownerId: string): Promise<Project> {
        return Promise.resolve(undefined);
    }

    async findAll(): Promise<Project[]> {
        return await this.projects.find().toArray();
    }

    async create(ownerId: string, project: Pick<Project, 'image' | 'published' | 'status'>): Promise<Project> {
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
            categories: [],
            published: project.published,
            status: project.status,
            ownerId: new ObjectId(ownerId),
            contributors: [],
        };
        const result = await this.projects.insertOne(projectDocument);
        if (!result.insertedId) {
            throw new MongoException('Failed to save the project!');
        }
        return { _id: result.insertedId, ...projectDocument };
    }

    async updateProjectDetails(projectId: string, project: ProjectDetails): Promise<Project> {
        return await this.updateProject<ProjectDetails>(project, projectId);
    }

    async updateFundGoal(projectId: string, project: ProjectFundGoal): Promise<Project> {
        return await this.updateProject<ProjectFundGoal>(project, projectId);
    }

    async updatePublishState(projectId: string, project: ProjectPublishState): Promise<Project> {
        return await this.updateProject<ProjectPublishState>(project, projectId);
    }

    private async updateProject<T>(project: T, projectId: string) {
        const update = {
            $set: {
                ...project,
            },
        };
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
