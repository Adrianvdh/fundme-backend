export interface IUploadResult {
    mimeType(): string;
    relativePath(): string;
    fullPath(): string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDownloadResult {}

export interface IStorageService {
    uploadFile(path: string, objectName: string, file: Buffer): Promise<IUploadResult>;

    downloadFile(path: string, objectName: string): Promise<IDownloadResult>;
}
