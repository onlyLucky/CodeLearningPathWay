import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const storage = diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/avatars');
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = uuidv4();
    const ext = extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

export const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];
  const maxSize = 5 * 1024 * 1024;

  if (!allowedMimes.includes(file.mimetype)) {
    cb(new Error('Only image files are allowed'), false);
  } else if (file.size > maxSize) {
    cb(new Error('File size exceeds 5MB limit'), false);
  } else {
    cb(null, true);
  }
};
