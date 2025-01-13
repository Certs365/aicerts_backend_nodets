import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import { Request, Response, NextFunction } from 'express';
import { responseHandler, responseScenario } from './responseHandler';
import { messageCodes } from '../common/codes';
import logger from './logger';
import crypto from 'crypto';
import { ethers } from 'ethers';

const {
  ACCESS_TOKEN_SECRET,
  JWT_EXPIRE,
  JWT_EXPIRE_TIME = 'm',
  REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRE,
  REFRESH_TOKEN_EXPIRE_TIME = 'd',
  ENCRYPTION_KEY,
} = process.env;

const generateJwtToken = (issuerId: string): string => {
  try {
    if (!ACCESS_TOKEN_SECRET) {
      throw new Error('Missing ACCESS_TOKEN_SECRET in environment variables.');
    }

    const claims = { issuerId, authType: 'User' };
    const expiresIn = `${JWT_EXPIRE}${JWT_EXPIRE_TIME}`; // e.g., '15m'

    return jwt.sign(claims, ACCESS_TOKEN_SECRET, { expiresIn });
  } catch (error: any) {
    logger.error('Error: Failed to generate JWT token: ', error);
    throw new Error('Unable to generate token. Please try again later.');
  }
};

const generateRefreshToken = (issuerId: string): string => {
  try {
    if (!REFRESH_TOKEN) {
      throw new Error('Missing REFRESH_TOKEN in environment variables.');
    }

    const claims = { authType: 'User', issuerId };
    const expiresIn = `${REFRESH_TOKEN_EXPIRE}${REFRESH_TOKEN_EXPIRE_TIME}`; // e.g., '1d'

    return jwt.sign(claims, REFRESH_TOKEN, { expiresIn });
  } catch (error: any) {
    logger.error('Error: Failed to generate refresh token: ', error);
    throw new Error(
      'Unable to generate refresh token. Please try again later.'
    );
  }
};

const verifyRefreshToken = async (token: string) => {
  try {
    if (!REFRESH_TOKEN) {
      throw new Error('Missing REFRESH_TOKEN in environment variables.');
    }
    // Return a promise-based jwt.verify
    const userData = await new Promise<any>((resolve, reject) => {
      jwt.verify(token, REFRESH_TOKEN, (err, decoded) => {
        if (err) {
          return reject(err); // Reject the promise if there is an error
        }
        resolve(decoded); // Resolve the promise with userData if successful
      });
    });
    return userData; // Return userData to the caller
  } catch (error: any) {
    logger.error('Error: Failed to verify refresh token: ', error);
    return null;
  }
};

// Middleware to decrypt the request body
const decryptRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!ENCRYPTION_KEY) {
      throw new Error('ENCRYPTION_KEY is not defined in environment variables');
    }

    const encryptedData = req.body.data; // Assuming the encrypted data is sent in the request body as 'data'

    if (encryptedData) {
      // Decrypt the data
      const decryptedData = decryptData(encryptedData, ENCRYPTION_KEY);

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

const generateOtp = (): number => {
  try {
    // Generate a secure 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    return Number(otp);
  } catch (error: any) {
    logger.error('Error: generating OTP:', error);
    throw new Error('Failed to generate OTP. Please try again later.');
  }
};

// Function to generate a new Ethereum account with a private key
const generateAccountAddress = () => {
  try {
    const id = crypto.randomBytes(32).toString('hex');
    const privateKey = '0x' + id;
    const wallet = new ethers.Wallet(privateKey);
    const addressWithoutPrefix = wallet.address; // Remove '0x' from the address
    return addressWithoutPrefix;
  } catch (error: any) {
    logger.error('Error: generating Ethereum account:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export {
  generateJwtToken,
  generateRefreshToken,
  verifyRefreshToken,
  decryptRequestBody,
  generateOtp,
  generateAccountAddress,
};
