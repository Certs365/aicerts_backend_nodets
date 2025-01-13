import { Response, Request } from 'express';
import { messageCodes } from '../common/codes';
import {
  responseHandler,
  ResponseHandlerType,
  responseScenario,
} from '../utils/responseHandler';
import logger from '../utils/logger';
import authService from '../services/auth.service';

const signup = async (req: Request, res: Response) => {
  try {
    logger.info('Start: authController/signup');
    const response = await authService.signup(req.body);
    res.status(response.code).json(response);
  } catch (error: any) {
    logger.error('Error: authController/signup', error);
    const response: ResponseHandlerType = responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
    res.status(response.code).json(response);
  } finally {
    logger.info('End: authController/signup');
  }
};

const login = async (req: Request, res: Response) => {
  try {
    logger.info('Start: authController/login');
    const { email, password } = req.body;
    const response: ResponseHandlerType = await authService.login(
      email,
      password
    );
    res.status(response.code).json(response);
  } catch (error: any) {
    logger.error('Error: authController/login', error);
    const response: ResponseHandlerType = responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
    res.status(response.code).json(response);
  } finally {
    logger.info('End: authController/login');
  }
};

const onboarding = async (req: Request, res: Response) => {
  try {
    logger.info('Start: authController/onboarding');
    const response: ResponseHandlerType = await authService.onboarding(
      req.body
    );
    res.status(response.code).json(response);
  } catch (error: any) {
    logger.error('Error: authController/onboarding', error);
    const response: ResponseHandlerType = responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
    res.status(response.code).json(response);
  } finally {
    logger.info('End: authController/onboarding');
  }
};

const twoFactor = async (req: Request, res: Response) => {
  try {
    logger.info('Start: authController/twoFactor');
    const { email, code } = req.body;
    const response: ResponseHandlerType = await authService.twoFactor(
      email,
      Number(code)
    );
    res.status(response.code).json(response);
  } catch (error: any) {
    logger.error('Error: authController/twoFactor', error);
    const response: ResponseHandlerType = responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
    res.status(response.code).json(response);
  } finally {
    logger.info('End: authController/twoFactor');
  }
};

const verifyIssuer = async (req: Request, res: Response) => {
  try {
    logger.info('Start: authController/verifyIssuer');
    const { email, code } = req.body;
    const response: ResponseHandlerType = await authService.verifyIssuer(
      email,
      Number(code)
    );
    res.status(response.code).json(response);
  } catch (error: any) {
    logger.error('Error: authController/verifyIssuer', error);
    const response: ResponseHandlerType = responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
    res.status(response.code).json(response);
  } finally {
    logger.info('End: authController/verifyIssuer');
  }
};

const forgetPassword = async (req: Request, res: Response) => {
  try {
    logger.info('Start: authController/forgetPassword');
    const response: ResponseHandlerType = await authService.forgetPassword(
      req.body.email
    );
    res.status(response.code).json(response);
  } catch (error: any) {
    logger.error('Error: authController/forgetPassword', error);
    const response: ResponseHandlerType = responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
    res.status(response.code).json(response);
  } finally {
    logger.info('End: authController/forgetPassword');
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    logger.info('Start: authController/refreshToken');
    const { email, token } = req.body;
    const response: ResponseHandlerType = await authService.refreshToken(
      email,
      token
    );
    res.status(response.code).json(response);
  } catch (error: any) {
    logger.error('Error: authController/refreshToken', error);
    const response: ResponseHandlerType = responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
    res.status(response.code).json(response);
  } finally {
    logger.info('End: authController/refreshToken');
  }
};

const oAuthSignup = async (req: any, res: any) => {
  try {
    logger.info('End: authController/oAuthSignup');
    const { email } = req.user;
    if (!email) {
      const response = responseHandler(
        401,
        responseScenario.fail,
        'User not authenticated'
      );
      res.status(response.code).json(response);
      return;
    }
    const response: ResponseHandlerType = await authService.oAuthSignup(email);
    res.status(response.code).json(response);
  } catch (error: any) {
    logger.error('Error: authController/oAuthSignup:', error);
    const response: ResponseHandlerType = responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
    res.status(response.code).json(response);
  } finally {
    logger.info('End: authController/oAuthSignup');
  }
};

export default {
  signup,
  onboarding,
  login,
  refreshToken,
  twoFactor,
  forgetPassword,
  verifyIssuer,
  oAuthSignup,
};
