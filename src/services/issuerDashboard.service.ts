import logger from '../utils/logger';
import baseRepository from '../repositories/base.repository';
import { responseHandler, responseScenario } from '../utils/responseHandler';
import { messageCodes } from '../common/codes';
import { getKey } from '../utils/redis';

const statusGraphDetails = async (email: string) => {
  try {
    logger.info('Start: statusGraphDetailsService');
    const validIssuer = await baseRepository.findUser(email);
    if (!validIssuer) {
      return responseHandler(
        404,
        responseScenario.fail,
        messageCodes.msgUserNotFound
      );
    }
    const statusGraph = await getKey(
      `dashboard:${validIssuer.issuerId}`,
      'statusGraph'
    );
    if (statusGraph) {
      return responseHandler(
        200,
        responseScenario.success,
        'Data fetched successfully',
        { statusGraph: JSON.parse(statusGraph) }
      );
    }
    return responseHandler(404, responseScenario.fail, 'No data found');
  } catch (error: any) {
    logger.error('Error: statusGraphDetailsService', error);
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info('End: statusGraphDetailsService');
  }
};

const graphDetails = async (email: string) => {
  try {
    logger.info('Start: graphDetailsService');
    const validIssuer = await baseRepository.findUser(email);
    if (!validIssuer) {
      return responseHandler(
        404,
        responseScenario.fail,
        messageCodes.msgUserNotFound
      );
    }
    const statusGraph = await getKey(
      `dashboard:${validIssuer.issuerId}`,
      'graph'
    );
    if (statusGraph) {
      return responseHandler(
        200,
        responseScenario.success,
        'Data fetched successfully',
        { statusGraph: JSON.parse(statusGraph) }
      );
    }
    return responseHandler(404, responseScenario.fail, 'No data found');
  } catch (error: any) {
    logger.error('Error: graphDetailsService', error);
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info('End: graphDetailsService');
  }
};

export default { statusGraphDetails, graphDetails };
