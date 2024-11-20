import express from 'express';
import { uploadFileS3 } from '../controllers/ads';
import {getAds} from '../controllers/getAds'
import { upload } from '../middlewares/upload';

const router = express.Router();

// Define the route for uploading an image
router.post('/upload-file-s3', upload.single('file'), uploadFileS3);

router.get('/get-ads',getAds)

export default router;
