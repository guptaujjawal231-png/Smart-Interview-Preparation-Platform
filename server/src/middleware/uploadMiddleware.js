import multer from 'multer';

// Use memory storage to process PDF buffer in RAM without storing files on disk
const storage = multer.memoryStorage();

// Validate file type
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/pdf' ||
    file.originalname.toLowerCase().endsWith('.pdf')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Please upload a valid PDF document.'), false);
  }
};

export const uploadResume = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB maximum file size
  },
  fileFilter,
});
