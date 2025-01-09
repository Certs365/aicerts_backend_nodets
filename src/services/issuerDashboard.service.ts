import logger from '../utils/logger';
import baseRepository from '../repositories/base.repository';
import { responseHandler, responseScenario } from '../utils/responseHandler';
import { messageCodes } from '../common/codes';
import { getKey } from '../utils/redis';
import moment from 'moment';

const getMonthWiseCertificateCounts = (monthYear: string, data: any) => {
  try {
    // Get the number of days in the specified month
    const daysInMonth = moment(monthYear, 'YYYY-MM').daysInMonth();

    const result = [];

    // Loop over all days of the month (1 to 31) and check for data
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = String(day).padStart(2, '0'); // Format day as '01', '02', etc.

      // Get the counts for the current day, default to 0 if missing
      const issueCount = data?.issued?.[monthYear]?.[dayStr] || 0;
      const reissueCount = data?.reissued?.[monthYear]?.[dayStr] || 0;
      const reactivatedCount = data?.reactivated?.[monthYear]?.[dayStr] || 0;
      const revokedCount = data?.revoked?.[monthYear]?.[dayStr] || 0;

      // Push the data in the required format
      result.push({
        day: day,
        count: [
          issueCount, // Issue count
          reissueCount, // Reissue count
          reactivatedCount, // Reactivated count
          revokedCount, // Revoked count
        ],
      });
    }

    return result;
  } catch (error: any) {
    logger.error('Error: getMonthWiseCertificateCounts operation', error);
    throw new Error('Error processing data');
  }
};

const getMonthWiseIssueType = (data: any) => {
  try {
    // Result array will be built on-the-fly
    const result = [];

    // Loop through all months of the year (1 to 12)
    for (let month = 1; month <= 12; month++) {
      const monthKey = `2025-${month.toString().padStart(2, '0')}`; // e.g., "2025-01", "2025-02"

      // Prepare the entry for the current month, default to [0, 0]
      const count = [0, 0];

      // If data exists for this month, update the counts
      if (data[monthKey]) {
        count[0] = data[monthKey].single || 0;
        count[1] = data[monthKey].batch || 0;
      }

      // Add the current month data to the result array
      result.push({
        month,
        count,
      });
    }
    return result;
  } catch (error: any) {
    logger.error('Error: getMonthWiseIssueType operation', error);
    throw new Error('Error processing data');
  }
};

const statusGraphDetails = async (
  email: string,
  month: string,
  year: string
) => {
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
    const statusGraph = await getKey(validIssuer.issuerId, 'monthly');
    if (!statusGraph) {
      return responseHandler(404, responseScenario.fail, 'No data found');
    }
    const parsedData = JSON.parse(statusGraph);

    const data = getMonthWiseCertificateCounts(`${year}-${month}`, parsedData);

    return responseHandler(
      200,
      responseScenario.success,
      messageCodes.msgGraphDataFetched,
      data
    );
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
    const graphData = await getKey(validIssuer.issuerId, 'issuanceType');
    if (!graphData) {
      return responseHandler(404, responseScenario.fail, 'No data found');
    }
    const data = getMonthWiseIssueType(JSON.parse(graphData));
    return responseHandler(
      200,
      responseScenario.success,
      messageCodes.msgGraphDataFetched,
      data
    );
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

const issuerLogs = async (email: string) => {
  try {
    logger.info('Start: issuerLogsService');
    const validIssuer = await baseRepository.findUser(email);
    if (!validIssuer) {
      return responseHandler(
        404,
        responseScenario.fail,
        messageCodes.msgUserNotFound
      );
    }
    const issuerLogsData = await getKey(validIssuer.issuerId, 'total');
    if (!issuerLogsData) {
      return responseHandler(404, responseScenario.fail, 'No data found');
    }
    return responseHandler(
      200,
      responseScenario.success,
      messageCodes.msgIssueLogsFetched,
      {
        // As default keys with 0
        ...{
          issued: 0,
          reissued: 0,
          reactivated: 0,
          revoked: 0,
        },
        // Update the counter with redis value
        ...JSON.parse(issuerLogsData),
      }
    );
  } catch (error: any) {
    logger.error('Error: issuerLogsService', error);
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info('End: issuerLogsService');
  }
};

export default { statusGraphDetails, graphDetails, issuerLogs };
