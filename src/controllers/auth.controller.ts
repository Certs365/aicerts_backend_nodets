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

const twoFactor = async (req: Request, res: Response) => {
  try {
    logger.info('Start: authController/twoFactor');
    const { email } = req.body;
    const response: ResponseHandlerType = await authService.twoFactor(email);
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

export default { signup, login, refreshToken, twoFactor };
