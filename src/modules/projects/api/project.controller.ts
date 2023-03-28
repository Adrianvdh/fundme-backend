import { NextFunction, Request, Response } from 'express';
import ProjectService from '@/modules/projects/service/project.service';
import { ProjectResponse, SaveProjectDetailsRequest, SaveProjectFundGoalRequest } from '@/modules/projects/api/project.model';
import { RequestWithUser } from '@/modules/auth/api/auth.models';
import { File } from '@/shared/http/file';

class ProjectController {
    constructor(private projectService: ProjectService) {}

    public getProjects = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const findAllProjects: ProjectResponse[] = await this.projectService.findAllProjects();

            res.status(200).json(findAllProjects);
        } catch (error) {
            next(error);
        }
    };

    public getProjectById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectId: string = req.params.id;
            const projectResponse: ProjectResponse = await this.projectService.findProjectById(projectId);

            res.status(200).json(projectResponse);
        } catch (error) {
            next(error);
        }
    };

    public getLatestIncomplete = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const projectResponse: ProjectResponse = await this.projectService.findLatestIncomplete(req.userId);
            if (!projectResponse) {
                return res.status(204);
            }
            res.status(200).json(projectResponse);
        } catch (error) {
            next(error);
        }
    };

    public createProject = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const file = new File(req.file.buffer, req.file.mimetype);
            const response: ProjectResponse = await this.projectService.createProject(req.userId, file);

            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    };

    public saveProjectDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectId: string = req.params.id;
            const requestData: SaveProjectDetailsRequest = req.body;
            const projectResponse: ProjectResponse = await this.projectService.saveProjectDetails(projectId, requestData);

            res.status(200).json(projectResponse);
        } catch (error) {
            next(error);
        }
    };

    public saveFundGoal = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectId: string = req.params.id;
            const requestData: SaveProjectFundGoalRequest = req.body;
            const projectResponse: ProjectResponse = await this.projectService.saveFundGoal(projectId, requestData);

            res.status(200).json(projectResponse);
        } catch (error) {
            next(error);
        }
    };

    public publishProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectId: string = req.params.id;
            const projectResponse: ProjectResponse = await this.projectService.publishProject(projectId);

            res.status(200).json(projectResponse);
        } catch (error) {
            next(error);
        }
    };

    public deleteProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectId: string = req.params.id;
            await this.projectService.deleteProject(projectId);

            res.status(200).json({ projectId });
        } catch (error) {
            next(error);
        }
    };
}

export default ProjectController;
