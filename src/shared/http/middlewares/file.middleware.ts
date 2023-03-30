import multer from 'multer';

export function singleFileUpload() {
    const upload = multer({ storage: multer.memoryStorage() });
    return upload.single('file');
}
