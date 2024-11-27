import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import { Request, Response, NextFunction } from 'express';

function generateJwtToken(): string {
    try {
        const expiresInMinutes = process.env.JWT_EXPIRE;
        const expireTimeUnit = process.env.JWT_EXPIRE_TIME || 'm'; // Default to minutes
        const claims = { authType: "User" };
        if (!process.env.ACCESS_TOKEN_SECRET) {
            throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables");
        }
        const token = jwt.sign(claims, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: `${expiresInMinutes}${expireTimeUnit}`,
        });
        return token;
    } catch (error) {
        console.error("Error generating JWT token:", error);
        throw error;
    }
}

function generateRefreshToken(user: { _id: string }): string {
    try {
        const expiresInDays = process.env.REFRESH_TOKEN_EXPIRE;
        const expireTimeUnit = process.env.REFRESH_TOKEN_EXPIRE_TIME || 'd'; // Default to days
        const claims = { authType: "User", userId: user._id };
        if (!process.env.REFRESH_TOKEN) {
            throw new Error("REFRESH_TOKEN is not defined in environment variables");
        }
        const refreshToken = jwt.sign(claims, process.env.REFRESH_TOKEN, {
            expiresIn: `${expiresInDays}${expireTimeUnit}`,
        });
        return refreshToken;
    } catch (error) {
        console.error("Error generating refresh token:", error);
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
            throw new Error("ENCRYPTION_KEY is not defined in environment variables");
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
        res.status(400).json({ message: 'Failed to decrypt request data' });
    }
};

const decryptRequestParseBody = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const key = process.env.ENCRYPTION_KEY; // Use an environment variable for the encryption key
        if (!key) {
            throw new Error("ENCRYPTION_KEY is not defined in environment variables");
        }

        const encryptedData = req.body.data; // Assuming the encrypted data is sent in the request body as 'encryptedData'

        if (encryptedData) {
            // Decrypt the data
            const decryptedData = decryptData(encryptedData, key);
            console.log(key, "key");
            console.log(encryptedData, "encrypt");
            console.log(decryptedData, "decrypt");
            req.body = decryptedData;
        }

        next();
    } catch (error) {
        res.status(400).json({ message: 'Failed to decrypt request data' });
    }
};

// Decrypt function
const decryptData = (encryptedData: string, key: string): any => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted); // Parse the string to get the original data
};

export {
    generateJwtToken,
    generateRefreshToken,
    decryptRequestBody,
    decryptRequestParseBody,
};
