import { messageCodes } from '../common/codes';
import {
  responseHandler,
  ResponseHandlerType,
  responseScenario,
} from '../utils/responseHandler';
import subsscriptionRepository from '../repositories/subscription.repository';
import { ISubscriptionPlan } from '../models/subscription';
import logger from '../utils/logger';
import { SimpleObject } from '../utils/types';
import {
  stripe,
  CheckoutSession,
  CheckoutSessionCreateParams,
  LineItem,
} from '../utils/stripe';
import { sendGrievanceEmail, planPurchasedEmail } from '../utils/emails';
import { IUser } from '../models/user';
import { IUserSubscriptionPlan } from '../models/userSubscription';

const normalizeDate = (date: Date): Date => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const getLatestPlanDetails = (subscriptionDetails: IUserSubscriptionPlan) => {
  const latestDetails = {
    subscriptionPlanTitle: subscriptionDetails.subscriptionPlanTitle.at(-1),
    purchasedDate: subscriptionDetails.purchasedDate.at(-1),
    subscriptionFee: subscriptionDetails.subscriptionFee.at(-1),
    subscriptionDuration: subscriptionDetails.subscriptionDuration.at(-1),
    allocatedCredentials: subscriptionDetails.allocatedCredentials.at(-1),
    currentCredentials: subscriptionDetails.currentCredentials.at(-1),
  };
  return latestDetails;
};

const getSubscriptionPlan = async (
  planCode: string
): Promise<ResponseHandlerType> => {
  try {
    logger.info('Start: getSubscriptionPlanService');
    if (planCode) {
      const getPlan:
        | ResponseHandlerType
        | ISubscriptionPlan
        | null
        | undefined = await subsscriptionRepository.getSubscriptionPlan(
        planCode
      );

      //   DB Error
      if (getPlan?.status === responseScenario.fail) return getPlan;

      return getPlan
        ? //   Plan found
          responseHandler(
            200,
            responseScenario.success,
            messageCodes.msgPlanDetailsFetched,
            getPlan
          )
        : //   Plan not found
          responseHandler(
            404,
            responseScenario.fail,
            messageCodes.msgPlanNotFound
          );
    }

    // All plan list
    const allPlans = await subsscriptionRepository.getSubscriptionPlanList();
    return responseHandler(
      200,
      responseScenario.success,
      messageCodes.msgPlanDetailsFetched,
      allPlans
    );
  } catch (error: any) {
    logger.error('Error: getSubscriptionPlanService', error);
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info('End: getSubscriptionPlanService');
  }
};

const addSubscriptionPlan = async (plan: SimpleObject) => {
  try {
    logger.info('Start: addSubscriptionPlanService');
    const { email, code, title, subheader, fee, limit, rate, validity } = plan;
    const addingStatus: ISubscriptionPlan | ResponseHandlerType | null =
      await subsscriptionRepository.addSubscriptionPlan({
        email,
        code,
        title,
        subheader,
        fee,
        limit,
        rate,
        validity,
      });
    if (addingStatus?.status === responseScenario.fail) {
      return addingStatus;
    }
    if (!addingStatus) {
      return responseHandler(
        201,
        responseScenario.success,
        messageCodes.msgPlanAddedSuccess
      );
    }
    return responseHandler(
      409,
      responseScenario.fail,
      messageCodes.msgPlanCodeExist
    );
  } catch (error: any) {
    logger.error('Error: addSubscriptionPlanService', error);
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info('End: addSubscriptionPlanService');
  }
};

const updateSubscriptionPlan = async (
  body: SimpleObject
): Promise<ResponseHandlerType> => {
  try {
    logger.info('Start: updateSubscriptionPlanService');
    const { email, code, title, subheader, fee, limit, rate, validity } = body;
    const addingStatus: ISubscriptionPlan | ResponseHandlerType | null =
      await subsscriptionRepository.updateSubscriptionPlan({
        email,
        code,
        title,
        subheader,
        fee,
        limit,
        rate,
        validity,
      });
    if (addingStatus?.status === responseScenario.fail) {
      return addingStatus;
    }
    if (!addingStatus) {
      return responseHandler(
        404,
        responseScenario.fail,
        messageCodes.msgPlanNotFound
      );
    }
    return responseHandler(
      200,
      responseScenario.success,
      messageCodes.msgPlanUpdatedSuccess
    );
  } catch (error: any) {
    logger.error('Error: updateSubscriptionPlanService', error);
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info('End: updateSubscriptionPlanService');
  }
};

const deleteSubscriptionPlan = async (
  body: SimpleObject
): Promise<ResponseHandlerType> => {
  try {
    logger.info('Start: deleteSubscriptionPlanService');
    const deletePlanStatus =
      await subsscriptionRepository.deleteSubscriptionPlan(body);
    if (deletePlanStatus?.status === responseScenario.fail) {
      return deletePlanStatus;
    }
    if (!deletePlanStatus) {
      return responseHandler(
        404,
        responseScenario.fail,
        messageCodes.msgPlanNotFound
      );
    }
    return responseHandler(
      200,
      responseScenario.success,
      messageCodes.msgPlanDeleted
    );
  } catch (error: any) {
    logger.error('Error: deleteSubscriptionPlanService', error);
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info('End: deleteSubscriptionPlanService');
  }
};

const addUserSubscriptionPlan = async (
  email: string,
  code: string
): Promise<ResponseHandlerType> => {
  try {
    logger.info('Start: addUserSubscriptionPlanService');
    const user: IUser | null = await subsscriptionRepository.findUser(email);
    if (!user) {
      logger.info(`${email} issuer is not available/approved.`);
      return responseHandler(
        403,
        responseScenario.fail,
        messageCodes.msgInvalidIssuer
      );
    }
    const plan: ISubscriptionPlan | null =
      await subsscriptionRepository.findPlan(code);
    if (!plan) {
      logger.info(`Plan with ${code} is not available.`);
      return responseHandler(
        404,
        responseScenario.fail,
        messageCodes.msgPlanNotFound
      );
    }
    const subscribedPlan: ResponseHandlerType | IUserSubscriptionPlan =
      await subsscriptionRepository.addUserSubscriptionPlan(email, user, plan);
    if (subscribedPlan.status === responseScenario.fail) {
      return subscribedPlan;
    }
    // Send email to user of plan purchsed
    planPurchasedEmail(
      email,
      user.name,
      getLatestPlanDetails(subscribedPlan as IUserSubscriptionPlan)
    );

    return responseHandler(
      200,
      responseScenario.success,
      messageCodes.msgPlanAddedSuccess,
      subscribedPlan
    );
  } catch (error: any) {
    logger.error('Error: addUserSubscriptionPlanService', error);
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info('End: addUserSubscriptionPlanService');
  }
};

const addEnterpriseSubscriptionPlan = async (
  plan: SimpleObject
): Promise<ResponseHandlerType> => {
  try {
    logger.info('Start: addEnterpriseSubscriptionPlanService');
    const user: IUser | null = await subsscriptionRepository.findUser(
      plan.email as string
    );
    if (!user) {
      logger.info(`${plan.email} issuer is not available/approved.`);
      return responseHandler(
        403,
        responseScenario.fail,
        messageCodes.msgInvalidIssuer
      );
    }
    const subscribedPlan: ResponseHandlerType | IUserSubscriptionPlan =
      await subsscriptionRepository.addEnterpriseSubscriptionPlan(plan, user);
    if (subscribedPlan.status === responseScenario.fail) {
      return subscribedPlan;
    }
    // Send email to user of plan purchsed
    planPurchasedEmail(
      plan.email as string,
      user.name,
      getLatestPlanDetails(subscribedPlan as IUserSubscriptionPlan)
    );

    return responseHandler(
      200,
      responseScenario.success,
      messageCodes.msgPlanAddedSuccess,
      subscribedPlan
    );
  } catch (error: any) {
    logger.error('Error: addEnterpriseSubscriptionPlanService', error);
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info('End: addEnterpriseSubscriptionPlanService');
  }
};

const getIssuerSubscriptionDetails = async (
  email: string
): Promise<ResponseHandlerType> => {
  try {
    logger.info('Start: getIssuerSubscriptionDetailsService');
    const user: IUser | null = await subsscriptionRepository.findUser(
      email as string
    );
    if (!user) {
      logger.info(`${email} issuer is not available/approved.`);
      return responseHandler(
        403,
        responseScenario.fail,
        messageCodes.msgInvalidIssuer
      );
    }
    const subscriptionDetails:
      | ResponseHandlerType
      | IUserSubscriptionPlan
      | null = await subsscriptionRepository.getIssuerSubscriptionDetails(
      email
    );
    // Plan not found
    if (!subscriptionDetails) {
      return responseHandler(
        404,
        responseScenario.fail,
        messageCodes.msgPlanNotFound
      );
    }
    // DB Error
    if (subscriptionDetails.status === responseScenario.fail) {
      return subscriptionDetails;
    }

    // Get the latest details (last element of each array)
    const latestDetails = getLatestPlanDetails(
      subscriptionDetails as IUserSubscriptionPlan
    );

    const today = normalizeDate(new Date());
    const purchaseDate = normalizeDate(
      new Date(latestDetails.purchasedDate as Date)
    );
    const subscriptionDuration = latestDetails.subscriptionDuration as number;

    // Calculate the expiration date
    const expireDate = normalizeDate(
      new Date(
        purchaseDate.getTime() + subscriptionDuration * 24 * 60 * 60 * 1000
      )
    );

    // Calculate the difference in days, handling expired subscriptions
    const diffDays = Math.max(
      0,
      Math.ceil(
        (expireDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      )
    );

    // If plan will expire  within 5 days
    if (diffDays <= 5 && diffDays > 0) {
      return responseHandler(
        200,
        responseScenario.success,
        messageCodes.msgLimitAboutToExhaust,
        { planDetails: latestDetails, remainingDays: diffDays }
      );
    }
    // If plan is expired add the free plan
    const plan: ISubscriptionPlan | null =
      await subsscriptionRepository.findPlan('Free');

    const subscribedPlan: ResponseHandlerType | IUserSubscriptionPlan =
      await subsscriptionRepository.addUserSubscriptionPlan(
        email,
        user,
        plan as ISubscriptionPlan
      );
    if (subscribedPlan.status === responseScenario.fail) {
      return subscribedPlan;
    }
    return responseHandler(
      200,
      responseScenario.success,
      messageCodes.msgLimitAboutToExhaust,
      {
        planDetails: getLatestPlanDetails(
          subscribedPlan as IUserSubscriptionPlan
        ),
      }
    );
  } catch (error: any) {
    logger.error('Error: getIssuerSubscriptionDetailsService', error);
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info('End: getIssuerSubscriptionDetailsService');
  }
};

const createCheckoutSession = async (
  email: string,
  plan: SimpleObject
): Promise<ResponseHandlerType> => {
  try {
    logger.info(
      `Start: Creating stripe checkoutsession for ${email} Issuer...`
    );
    const userFound: IUser | null = await subsscriptionRepository.findUser(
      email
    );
    if (!userFound) {
      logger.info(`${email} issuer is not available/approved.`);
      return responseHandler(
        403,
        responseScenario.fail,
        messageCodes.msgInvalidIssuer
      );
    }
    // Checkout plan details
    const line_items: LineItem[] = [
      {
        price_data: {
          product_data: {
            name: `${plan.name} plan`,
          },
          unit_amount: Math.round((plan.fee as number) * 100), // Convert fee to cents
          currency: 'usd', // Add currency (e.g., 'usd', 'eur', etc.)
        },
        quantity: 1,
      },
    ];

    // Session config obj
    const sessionParams: CheckoutSessionCreateParams = {
      line_items,
      payment_method_types: ['card'], // Accept card payments
      mode: 'payment', // For one-time payments
      success_url: plan.successUrl as string, // Redirection URL after success
      cancel_url: plan.cancelUrl as string, // Redirection URL after cancellation
      metadata: {
        name: `${plan.name} plan`,
        price: plan.fee as number, // Store the fee in metadata
        credits: plan.limit as number, // Store the plan limit
        rate: plan.rate as number, // Store the rate in metadata
      },
    };

    // Generating session
    const session: CheckoutSession = await stripe.checkout.sessions.create(
      sessionParams
    );
    return responseHandler(
      200,
      responseScenario.success,
      'Checkout session created',
      { sessionId: session.id, sessionUrl: session.url }
    );
  } catch (error: any) {
    logger.error('Error: deleteSubscriptionPlanService', error);
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info(`Ending the create checkout session process...`);
  }
};

const createGrievance = async (email: string, paymentID: string) => {
  try {
    logger.info('Start: createGrievanceService');
    const user: IUser | null = await subsscriptionRepository.findUser(
      email as string
    );
    if (!user) {
      logger.info(`${email} issuer is not available/approved.`);
      return responseHandler(
        403,
        responseScenario.fail,
        messageCodes.msgInvalidIssuer
      );
    }
    logger.info(
      `Sending grievance mail for ${email} regarding ${paymentID} payment ...`
    );
    await sendGrievanceEmail(email, paymentID);
    logger.info(`Mail sent!`);
    return responseHandler(
      200,
      responseScenario.success,
      messageCodes.msgGrievanceSent,
      { email, paymentID }
    );
  } catch (error: any) {
    logger.error('Error: createGrievanceService', error);
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info('End: createGrievanceService');
  }
};

const fetchPaymentDetails = async (email: string, sessionId: string) => {
  try {
    logger.info('Start: fetchPaymentDetailsService');
    const user: IUser | null = await subsscriptionRepository.findUser(
      email as string
    );
    if (!user) {
      logger.info(`${email} issuer is not available/approved.`);
      return responseHandler(
        403,
        responseScenario.fail,
        messageCodes.msgInvalidIssuer
      );
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return responseHandler(
      200,
      responseScenario.success,
      'Session retrieved successfully',
      { session }
    );
  } catch (error: any) {
    logger.error('Error: fetchPaymentDetailsService', error);
    return responseHandler(
      500,
      responseScenario.fail,
      messageCodes.msgInternalError
    );
  } finally {
    logger.info('End: fetchPaymentDetailsService');
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
