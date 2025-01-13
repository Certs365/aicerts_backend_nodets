import { messageCodes } from '../common/codes';
import {
  responseHandler,
  ResponseHandlerType,
  responseScenario,
} from '../utils/responseHandler';
import logger from '../utils/logger';
import authRepository from '../repositories/auth.repository';
import { compare, hash } from 'bcrypt';
import {
  generateJwtToken,
  generateOtp,
  generateRefreshToken,
  verifyRefreshToken,
  generateAccountAddress,
} from '../utils/authUtils';
import { IUser } from '../models/user';
import { sendOTPEmail, sendWelcomeMail } from '../utils/emails';

const signup = async (body: Record<string, any>) => {
  try {
    logger.info('Start: authService/signup');
    const user = await authRepository.findUser(body.email.trim());
    if (user && user.approved === true) {
      return responseHandler(
        409,
        responseScenario.fail,
        messageCodes.msgExistEmail
      );
    }
    body.issuerId = generateAccountAddress();
    body.password = await hash(
      body.password,
      Number(process.env.SALT_ROUND) || 10
    );
    const isUserCreated = await authRepository.createUser(body);
    if (isUserCreated?.issuerId) {
      const issuerServices = await authRepository.createUserServiceQuote(
        isUserCreated.issuerId
      );
      if (issuerServices) {
        await sendWelcomeMail(isUserCreated.name, isUserCreated.email);
        return responseHandler(
          201,
          responseScenario.success,
          messageCodes.msgSignupSuccess,
          { ...isUserCreated }
        );
      }
    }
    throw new Error('Something went wrong...');
  } catch (error: any) {
    logger.error('Error: authService/signup', error);
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info('End: authService/signup');
  }
};

const login = async (
  email: string,
  password: string
): Promise<ResponseHandlerType> => {
  try {
    logger.info('Start: authService/login');
    const user = await authRepository.findUser(email);
    if (user && user.approved === true) {
      const isPasswordValid = await compare(password, user.password);
      if (isPasswordValid) {
        const JWTToken = generateJwtToken(user.issuerId);
        const refreshToken = generateRefreshToken(user.issuerId);
        const updatedUser: IUser | null =
          await authRepository.updateUserRefreshToken(email, refreshToken);
        if (updatedUser?.refreshToken) {
          return responseHandler(
            200,
            responseScenario.success,
            messageCodes.msgValidCredentials,
            {
              JWTToken,
              refreshToken,
              name: updatedUser.name,
              organization: updatedUser.organization,
              email: updatedUser.email,
              certificatesIssued: updatedUser.certificatesIssued,
              issuerId: updatedUser.issuerId,
            }
          );
        }
      }
      return responseHandler(
        401,
        responseScenario.fail,
        messageCodes.msgErrorOnComparePassword
      );
    }
    return responseHandler(
      404,
      responseScenario.fail,
      messageCodes.msgExistingUserError
    );
  } catch (error: any) {
    logger.error('Error: authService/login', error);
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info('End: authService/login');
  }
};

const twoFactor = async (email: string): Promise<ResponseHandlerType> => {
  try {
    logger.info('Start: authService/twoFactor');
    const user = await authRepository.findUser(email);
    if (user && user.approved === true) {
      const userOtp = generateOtp();
      const isOtpSet = await authRepository.saveUserOtp(email, userOtp);
      if (isOtpSet) {
        await sendOTPEmail(userOtp, user.email, user.name);
        return responseHandler(
          200,
          responseScenario.success,
          messageCodes.msgOtpSent
        );
      }
    }
    return responseHandler(
      404,
      responseScenario.fail,
      messageCodes.msgExistingUserError
    );
  } catch (error: any) {
    logger.error('Error: authService/twoFactor', error);
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info('End: authService/twoFactor');
  }
};

const refreshToken = async (
  email: string,
  token: string
): Promise<ResponseHandlerType> => {
  try {
    logger.info('Start: authService/refreshToken');
    const user = await authRepository.findUser(email);
    if (user && user.approved === true) {
      const verifiedUser = await verifyRefreshToken(token);
      if (verifiedUser.issuerId === user.issuerId) {
        const JWTToken = generateJwtToken(user.issuerId);
        const refreshToken = generateRefreshToken(user.issuerId);
        const updatedUser: IUser | null =
          await authRepository.updateUserRefreshToken(email, refreshToken);
        if (updatedUser?.refreshToken) {
          return responseHandler(
            200,
            responseScenario.success,
            messageCodes.msgValidCredentials,
            {
              JWTToken,
              refreshToken,
              name: updatedUser.name,
              organization: updatedUser.organization,
              email: updatedUser.email,
              certificatesIssued: updatedUser.certificatesIssued,
              issuerId: updatedUser.issuerId,
            }
          );
        }
      }
      return responseHandler(
        401,
        responseScenario.fail,
        messageCodes.msgInvalidToken
      );
    }
    return responseHandler(
      404,
      responseScenario.fail,
      messageCodes.msgExistingUserError
    );
  } catch (error: any) {
    logger.error('Error: authService/refreshToken', error);
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info('End: authService/refreshToken');
  }
};

export default { signup, login, refreshToken, twoFactor };
