import { IDownloadResult, IStorageService, IUploadResult } from '@/shared/storage/storage';

export class UploadResult implements IUploadResult {
    fullPath(): string {
        return 'https://ionic-docs-demo-v6.vercel.app/assets/madison.jpg';
    }

    mimeType(): string {
        return 'image/jpeg';
    }

    relativePath(): string {
        return 'assets/madison.jpg';
    }
}

export class DownloadResult implements IDownloadResult {}

export class NoopStorageService implements IStorageService {
    uploadFile(path: string, objectName: string, file: Buffer): Promise<IUploadResult> {
        return Promise.resolve(new UploadResult());
    }

    downloadFile(path: string, objectName: string): Promise<IDownloadResult> {
        return Promise.resolve(new DownloadResult());
    }

    getAbsolutePath(relativePath: string): Promise<string> {
        return Promise.resolve('https://ionic-docs-demo-v6.vercel.app/assets/madison.jpg');
    }
}
