import express, { Router } from 'express';
import subscriptionController from '../controllers/subscription.controller';
import validateRequest from '../middlewares/validationHandler';
import subscriptionValidation from '../utils/ValidationSchema/subscriptionSchema';
import { decryptRequestBody } from '../utils/authUtils';

const router = express.Router();

router.post(
  '/get-subscription-plans',
  validateRequest(subscriptionValidation.getSubscriptionPlansSchema),
  subscriptionController.getSubscriptionPlan
);

router.post(
  '/add-subscription-plan',
  decryptRequestBody,
  validateRequest(subscriptionValidation.addSubscriptionPlanSchema),
  subscriptionController.addSubscriptionPlan
);

router.post(
  '/update-subscription-plan',
  decryptRequestBody,
  validateRequest(subscriptionValidation.updateSubscriptionPlanSchema),
  subscriptionController.updateSubscriptionPlan
);

router.delete(
  '/delete-subscription-plan',
  decryptRequestBody,
  validateRequest(subscriptionValidation.deleteSubscriptionPlanSchema),
  subscriptionController.deleteSubscriptionPlan
);

router.post(
  '/add-user-subscription-plan',
  // decryptRequestBody,
  validateRequest(subscriptionValidation.addUserSubscriptionPlanSchema),
  subscriptionController.addUserSubscriptionPlan
);

router.post(
  '/add-enterprise-subscription-plan',
  decryptRequestBody,
  validateRequest(subscriptionValidation.addEnterpriseSubscriptionPlanSchema),
  subscriptionController.addEnterpriseSubscriptionPlan
);

router.post(
  '/fetch-user-subscription-details',
  validateRequest(subscriptionValidation.getIssuerSubscriptionDetailsSchema),
  subscriptionController.getIssuerSubscriptionDetails
);

router.post(
  '/create-checkout-session',
  decryptRequestBody,
  validateRequest(subscriptionValidation.checkoutSubscriptionPaymentSchema),
  subscriptionController.createCheckoutSession
);

router.post(
  '/checkout-grievance',
  validateRequest(subscriptionValidation.grievanceMailSchema),
  subscriptionController.createGrievance
);

router.post(
  '/validate-transaction',
  validateRequest(subscriptionValidation.fetchPaymentDetailsSchema),
  subscriptionController.fetchPaymentDetails
);

export default router;
