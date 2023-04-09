import { IStorageService } from '@/shared/storage/storage';

export interface FileField {
    urlPath: string;
    fileType: string;
}

export async function mapFileField(fileField: FileField, storageService: IStorageService): Promise<FileField> {
    if (!fileField) {
        return undefined;
    }
    const url = await storageService.getAbsolutePath(fileField?.urlPath);
    return {
        urlPath: url,
        fileType: fileField?.fileType,
    };
}
