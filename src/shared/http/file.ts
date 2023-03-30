export class File {
    constructor(
        private file: {
            filename: string;
            originalname: string;
            encoding: string;
            mimetype: string;
            buffer: Buffer;
            size: number;
        },
    ) {}

    public buffer(): Buffer {
        return this.file.buffer;
    }

    public mimeType(): string {
        return this.file.mimetype;
    }

    public bytesSize(): number {
        return this.file.size;
    }
}
