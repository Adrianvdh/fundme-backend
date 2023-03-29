import { IDownloadResult, IStorageService, IUploadResult } from '@/shared/storage/storage';

export class UploadResult implements IUploadResult {
    fullPath(): string {
        return '';
    }

    mimeType(): string {
        return '';
    }

    relativePath(): string {
        return '';
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
}
