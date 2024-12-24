import { Response, Request } from 'express';
import { messageCodes } from '../common/codes';
import {
  responseHandler,
  ResponseHandlerType,
  responseScenario,
} from '../utils/responseHandler';
import subscriptionService from '../services/subscription.service';
import logger from '../utils/logger';

const getSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    logger.info('Start: getSubscriptionPlanController');
    const { planCode } = req.body;

    const response: ResponseHandlerType =
      await subscriptionService.getSubscriptionPlan(planCode);

    res.status(response.code).json(response);
  } catch (error: any) {
    logger.error('Error: getSubscriptionPlanController', error);
    const response: ResponseHandlerType = responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
    res.status(response.code).json(response);
  } finally {
    logger.info('End: getSubscriptionPlanController');
  }
};

const addSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    logger.info('Start: addSubscriptionPlanController');
    const { email, code, title, subheader, fee, limit, rate, validity } =
      req.body;
    const response: ResponseHandlerType =
      await subscriptionService.addSubscriptionPlan({
        email,
        code,
        title,
        subheader,
        fee,
        limit,
        rate,
        validity,
      });
    res.status(response.code).json(response);
  } catch (error) {
    logger.error('Error: addSubscriptionPlanController');
    const response: ResponseHandlerType = responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
    res.status(response.code).json(response);
  } finally {
    logger.info('End: addSubscriptionPlanController');
  }
};

const updateSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    logger.info('Start: updateSubscriptionPlanController');
    const { email, code, title, subheader, fee, limit, rate, validity } =
      req.body;
    const response: ResponseHandlerType =
      await subscriptionService.updateSubscriptionPlan({
        email,
        code,
        title,
        subheader,
        fee,
        limit,
        rate,
        validity,
      });
    res.status(response.code).json(response);
  } catch (error) {
    logger.error('Error: updateSubscriptionPlanController');
    const response: ResponseHandlerType = responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
    res.status(response.code).json(response);
  } finally {
    logger.info('End: updateSubscriptionPlanController');
  }
};

const deleteSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    logger.info('Start: deleteSubscriptionPlanController');
    const { email, code } = req.body;

    const response: ResponseHandlerType =
      await subscriptionService.deleteSubscriptionPlan({
        email,
        code,
      });

    res.status(response.code).json(response);
  } catch (error: any) {
    logger.error('Error: deleteSubscriptionPlanController', error);
    const response: ResponseHandlerType = responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
    res.status(response.code).json(response);
  } finally {
    logger.info('End: deleteSubscriptionPlanController');
  }
};

const addUserSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    logger.info('Start: addUserSubscriptionPlanController');
    const { email, code } = req.body;

    const response: ResponseHandlerType =
      await subscriptionService.addUserSubscriptionPlan(email, code);

    res.status(response.code).json(response);
  } catch (error: any) {
    logger.error('Error: addUserSubscriptionPlanController', error);
    const response: ResponseHandlerType = responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
    res.status(response.code).json(response);
  } finally {
    logger.info('End: addUserSubscriptionPlanController');
  }
};

const addEnterpriseSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    logger.info('Start: addEnterpriseSubscriptionPlanController');
    const { email, code } = req.body;

    const response: ResponseHandlerType =
      await subscriptionService.addEnterpriseSubscriptionPlan({
        email,
        code,
      });

    res.status(response.code).json(response);
  } catch (error: any) {
    logger.error('Error: addEnterpriseSubscriptionPlanController', error);
    const response: ResponseHandlerType = responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
    res.status(response.code).json(response);
  } finally {
    logger.info('End: addEnterpriseSubscriptionPlanController');
  }
};

const getIssuerSubscriptionDetails = async (req: Request, res: Response) => {
  try {
    logger.info('Start: getIssuerSubscriptionDetailsController');
    const { email, code } = req.body;

    const response: ResponseHandlerType =
      await subscriptionService.getIssuerSubscriptionDetails(email);

    res.status(response.code).json(response);
  } catch (error: any) {
    logger.error('Error: getIssuerSubscriptionDetailsController', error);
    const response: ResponseHandlerType = responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
    res.status(response.code).json(response);
  } finally {
    logger.info('End: getIssuerSubscriptionDetailsController');
  }
};

const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    logger.info('Start: createCheckoutSessionController');
    const { email, plan } = req.body;
    const response = await subscriptionService.createCheckoutSession(
      email,
      plan
    );
    res.status(response.code).json(response);
  } catch (error: any) {
    logger.error('Error: createCheckoutSessionController', error);
    const response: ResponseHandlerType = responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
    res.status(response.code).json(response);
  } finally {
    logger.info('End: createCheckoutSessionController');
  }
};

const createGrievance = async (req: Request, res: Response) => {
  try {
    logger.info('Start: createGrievanceController');
    const { email, paymentID } = req.body;
    const response = await subscriptionService.createGrievance(
      email,
      paymentID
    );
    res.status(response.code).json(response);
  } catch (error: any) {
    logger.error('Error: createGrievanceController', error);
    const response: ResponseHandlerType = responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
    res.status(response.code).json(response);
  } finally {
    logger.info('End: createGrievanceController');
  }
};

const fetchPaymentDetails = async (req: Request, res: Response) => {
  try {
    logger.info('Start: fetchPaymentDetailsController');
    const { email, sessionId } = req.body;
    const response = await subscriptionService.fetchPaymentDetails(
      email,
      sessionId
    );
    res.status(response.code).json(response);
  } catch (error: any) {
    logger.error('Error: fetchPaymentDetailsController', error);
    const response: ResponseHandlerType = responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
    res.status(response.code).json(response);
  } finally {
    logger.info('End: fetchPaymentDetailsController');
  }
};

export default {
  getSubscriptionPlan,
  addSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  addUserSubscriptionPlan,
  addEnterpriseSubscriptionPlan,
  getIssuerSubscriptionDetails,
  createCheckoutSession,
  createGrievance,
  fetchPaymentDetails,
};
