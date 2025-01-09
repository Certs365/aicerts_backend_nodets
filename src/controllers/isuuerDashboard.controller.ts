import { Response, Request } from 'express';
import issuerDashboardService from '../services/issuerDashboard.service';
import { messageCodes } from '../common/codes';
import {
  responseHandler,
  ResponseHandlerType,
  responseScenario,
} from '../utils/responseHandler';
import logger from '../utils/logger';
import { isValidEmail } from '../utils/helper';

const statusGraphDetails = async (req: Request, res: Response) => {
  try {
    logger.info('Start: statusGraphDetailsController');
    const { email, month, year } = req.params;

    if (!isValidEmail(email)) {
      const response: ResponseHandlerType = responseHandler(
        400,
        responseScenario.fail,
        messageCodes.msgInvalidGraphInput,
        { email }
      );
      res.status(response.code).json(response);
      return;
    }
    const response: ResponseHandlerType =
      await issuerDashboardService.statusGraphDetails(email, month, year);
    res.status(response.code).json(response);
  } catch (error: any) {
    logger.error('Error: statusGraphDetailsController', error);
    const response: ResponseHandlerType = responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
    res.status(response.code).json(response);
  } finally {
    logger.info('End: statusGraphDetailsController');
  }
};

const graphDetails = async (req: Request, res: Response) => {
  try {
    logger.info('Start: graphDetailsController');
    const { email } = req.params;

    if (!isValidEmail(email)) {
      const response: ResponseHandlerType = responseHandler(
        400,
        responseScenario.fail,
        messageCodes.msgInvalidGraphInput,
        { email }
      );
      res.status(response.code).json(response);
      return;
    }
    const response: ResponseHandlerType =
      await issuerDashboardService.graphDetails(email);
    res.status(response.code).json(response);
  } catch (error: any) {
    logger.error('Error: graphDetailsController', error);
    const response: ResponseHandlerType = responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
    res.status(response.code).json(response);
  } finally {
    logger.info('End: graphDetailsController');
  }
};

const issuerLogs = async (req: Request, res: Response) => {
  try {
    logger.info('Start: issuerLogsController');
    const { email } = req.params;

    if (!isValidEmail(email)) {
      const response: ResponseHandlerType = responseHandler(
        400,
        responseScenario.fail,
        messageCodes.msgInvalidGraphInput,
        { email }
      );
      res.status(response.code).json(response);
      return;
    }
    const response: ResponseHandlerType =
      await issuerDashboardService.issuerLogs(email);
    res.status(response.code).json(response);
  } catch (error: any) {
    logger.error('Error: issuerLogsController', error);
    const response: ResponseHandlerType = responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
    res.status(response.code).json(response);
  } finally {
    logger.info('End: issuerLogsController');
  }
};

export default { statusGraphDetails, graphDetails, issuerLogs };
