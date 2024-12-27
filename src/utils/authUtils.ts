import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import { Request, Response, NextFunction } from 'express';
import { responseHandler, responseScenario } from './responseHandler';
import { messageCodes } from '../common/codes';

function generateJwtToken(): string {
  try {
    const expiresInMinutes = process.env.JWT_EXPIRE;
    const expireTimeUnit = process.env.JWT_EXPIRE_TIME || 'm'; // Default to minutes
    const claims = { authType: 'User' };
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error(
        'ACCESS_TOKEN_SECRET is not defined in environment variables'
      );
    }
    const token = jwt.sign(claims, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: `${expiresInMinutes}${expireTimeUnit}`,
    });
    return token;
  } catch (error) {
    console.error('Error generating JWT token:', error);
    throw error;
  }
}

function generateRefreshToken(user: { _id: string }): string {
  try {
    const expiresInDays = process.env.REFRESH_TOKEN_EXPIRE;
    const expireTimeUnit = process.env.REFRESH_TOKEN_EXPIRE_TIME || 'd'; // Default to days
    const claims = { authType: 'User', userId: user._id };
    if (!process.env.REFRESH_TOKEN) {
      throw new Error('REFRESH_TOKEN is not defined in environment variables');
    }
    const refreshToken = jwt.sign(claims, process.env.REFRESH_TOKEN, {
      expiresIn: `${expiresInDays}${expireTimeUnit}`,
    });
    return refreshToken;
  } catch (error) {
    console.error('Error generating refresh token:', error);
    throw error;
  }
}

// Middleware to decrypt the request body
const decryptRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const key = process.env.ENCRYPTION_KEY; // Use an environment variable for the encryption key
    if (!key) {
      throw new Error('ENCRYPTION_KEY is not defined in environment variables');
    }

    const encryptedData = req.body.data; // Assuming the encrypted data is sent in the request body as 'data'

    if (encryptedData) {
      // Decrypt the data
      const decryptedData = decryptData(encryptedData, key);

      // Replace the body with decrypted data
      req.body = decryptedData;
    }

    next();
  } catch (error) {
    const errRes = responseHandler(
      400,
      responseScenario.fail,
      messageCodes.magInvalidEncryptBody
    );
    res.status(errRes.code).json(errRes);
  }
};

// Decrypt function
const decryptData = (encryptedData: string, key: string): any => {
  const bytes: CryptoJS.lib.WordArray = CryptoJS.AES.decrypt(
    encryptedData,
    key
  );
  const decrypted: string = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted); // Parse the string to get the original data
};

export { generateJwtToken, generateRefreshToken, decryptRequestBody };
