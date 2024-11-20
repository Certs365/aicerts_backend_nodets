import AWS from 'aws-sdk';

// Initialize S3 client
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadToS3 = async (file: Express.Multer.File,keyName:string): Promise<string> => {
  const timestamp = Date.now();
  const fileExtension = file.originalname.split('.').pop();
  const fileName = `${timestamp}-${file.originalname}`;
 

  const params = {
    Bucket: process.env.BUCKET_NAME!,
    Key: keyName,
    Body: file.buffer,
    ACL: process.env.ACL_NAME!,
    ContentType: file.mimetype,
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location; // Return the public URL of the uploaded file
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};
