import { Router } from 'express';
import subscriptionController from '../controllers/subscription.controller';
import validateRequest from '../middlewares/validationHandler';
import subscriptionValidation from '../utils/ValidationSchema/subscriptionSchema';
import { decryptRequestBody } from '../utils/authUtils';

const router = Router();

/**
 * @swagger
 * /api/get-subscription-plans:
 *   post:
 *     summary: API to get selected / all subscritpion plans in DB by valid email and planCode (optional).
 *     description: API to get selected / all subscritpion plans in DB by valid email and planCode (optional).
 *     tags: [Subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Enter valid email.
 *               planCode:
 *                 type: string
 *                 description: The valid (unique) plan code.
 *             required:
 *               - email
 *     responses:
 *       '200':
 *         description: Successfully fetched the subscription plan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               code: 200
 *               status: "SUCCESS"
 *               message: "Plan details fetched successfully"
 *               data: {}
 *       '400':
 *         description: Invalid request due to missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               code: 400
 *               status: "FAILED"
 *               message: "Entered invalid input / Please check and try again..."
 *
 *       '401':
 *         description: Unauthorized (e.g., invalid credentials)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 401.
 *               status: "FAILED"
 *               message: Invalid / unauthorized token
 *       '422':
 *         description: User given invalid input (Unprocessable Entity)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 422.
 *               status: "FAILED"
 *               message: "Input field cannot be empty"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 500
 *               status: "FAILED"
 *               message: "Unable to reach the server, Please try again..."
 */
router.post(
  '/get-subscription-plans',
  validateRequest(subscriptionValidation.getSubscriptionPlansSchema),
  subscriptionController.getSubscriptionPlan
);

/**
 * @swagger
 * /api/add-subscription-plan:
 *   post:
 *     summary: API to set details of the new subscription plan in DB by admin email.
 *     description: |
 *       API to set details of the new subscription plan in DB by admin email, code (plan code), title, subheader, fee, limit, rate, validity.
 *     tags:
 *       - Subscription
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email associated with the admin.
 *               code:
 *                 type: string
 *                 description: The valid (unique) plan code.
 *               title:
 *                 type: string
 *                 description: The valid (unique) plan title.
 *               subheader:
 *                 type: string
 *                 description: The sub header (unique) of the plan.
 *               fee:
 *                 type: number
 *                 description: The fee of the plan.
 *               limit:
 *                 type: number
 *                 description: The limit (credits) of the plan.
 *               rate:
 *                 type: number
 *                 description: The rate (for each credit value) of the plan.
 *               validity:
 *                 type: number
 *                 description: The validity (in days) of the plan.
 *             required:
 *               - email
 *               - code
 *               - title
 *               - subheader
 *               - fee
 *               - limit
 *               - rate
 *               - validity
 *     responses:
 *       '201':
 *         description: Successfully created the subscription plan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               code: 200
 *               status: "SUCCESS"
 *               message: "Plan added successfully"
 *       '400':
 *         description: Invalid request due to missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               code: 400
 *               status: "FAILED"
 *               message: "Entered invalid input / Please check and try again..."
 *       '401':
 *         description: Unauthorized (e.g., invalid credentials)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 401
 *               status: "FAILED"
 *               message: "Invalid / unauthorized token"
 *       '422':
 *         description: User given invalid input (Unprocessable Entity)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 422.
 *               status: "FAILED"
 *               message: "Input field cannot be empty"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 500
 *               status: "FAILED"
 *               message: "Unable to reach the server, Please try again..."
 */
router.post(
  '/add-subscription-plan',
  decryptRequestBody,
  validateRequest(subscriptionValidation.addSubscriptionPlanSchema),
  subscriptionController.addSubscriptionPlan
);

/**
 * @swagger
 * /api/update-subscription-plan:
 *   post:
 *     summary: API to update details of the existing subscritpion plan in DB by admin email.
 *     description: API to updaet details of the new subscritpion plan in DB by admin email, code (plan code), title, subheader, fee, limit, rate, validity.
 *     tags: [Subscription]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email associated with the admin.
 *               code:
 *                 type: string
 *                 description: The valid (unique) plan code.
 *               title:
 *                 type: string
 *                 description: The valid (unique) plan title.
 *               subheader:
 *                 type: string
 *                 description: The sub header (unique) of the plan.
 *               fee:
 *                 type: number
 *                 description: The fee of the plan.
 *               limit:
 *                 type: number
 *                 description: The limit (credits) of the plan.
 *               rate:
 *                 type: number
 *                 description: The rate (for each credit value) of the plan.
 *               validity:
 *                 type: number
 *                 description: The validity (in days) of the plan.
 *             required:
 *               - email
 *               - code
 *               - title
 *               - subheader
 *               - fee
 *               - limit
 *               - rate
 *               - validity
 *     responses:
 *       '200':
 *         description: Successfully updated the subscription plan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               code: 200
 *               status: "SUCCESS"
 *               message: "Plan updated successfully."
 *       '400':
 *         description: Invalid request due to missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               code: 400
 *               status: "FAILED"
 *               message: "Entered invalid input / Please check and try again..."
 *
 *       '401':
 *         description: Unauthorized (e.g., invalid credentials)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 401.
 *               status: "FAILED"
 *               message: Invalid / unauthorized token
 *       '422':
 *         description: User given invalid input (Unprocessable Entity)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 422.
 *               status: "FAILED"
 *               message: "Input field cannot be empty"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 500
 *               status: "FAILED"
 *               message: "Unable to reach the server, Please try again..."
 */
router.post(
  '/update-subscription-plan',
  decryptRequestBody,
  validateRequest(subscriptionValidation.updateSubscriptionPlanSchema),
  subscriptionController.updateSubscriptionPlan
);

/**
 * @swagger
 * /api/delete-subscription-plan:
 *   delete:
 *     summary: API to delete the details of an existing subscritpion plan in DB by admin email, and code.
 *     description: API to delete the details of an existing subscritpion plan in DB by admin email, and code.
 *     tags: [Subscription]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email associated with the admin.
 *               code:
 *                 type: string
 *                 description: The valid (unique) plan code.
 *             required:
 *               - email
 *               - code
 *     responses:
 *       '200':
 *         description: Successfully deleted the subscription plan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               code: 200
 *               status: "SUCCESS"
 *               message: "Plan removed successfully"
 *       '400':
 *         description: Invalid request due to missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               code: 400
 *               status: "FAILED"
 *               message: "Entered invalid input / Please check and try again..."
 *
 *       '401':
 *         description: Unauthorized (e.g., invalid credentials)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 401.
 *               status: "FAILED"
 *               message: Invalid / unauthorized token
 *       '422':
 *         description: User given invalid input (Unprocessable Entity)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 422.
 *               status: "FAILED"
 *               message: "Input field cannot be empty"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 500
 *               status: "FAILED"
 *               message: "Unable to reach the server, Please try again..."
 */
router.delete(
  '/delete-subscription-plan',
  decryptRequestBody,
  validateRequest(subscriptionValidation.deleteSubscriptionPlanSchema),
  subscriptionController.deleteSubscriptionPlan
);

/**
 * @swagger
 * /api/add-user-subscription-plan:
 *   post:
 *     summary: API to allocate details of the existing subscritpion plan to an issuer in DB by issuer email and plan code.
 *     description: API to allocate details of the existing subscritpion plan to an issuer in DB by issuer email and plan code.
 *     tags: [Subscription]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email associated with the issuer.
 *               code:
 *                 type: string
 *                 description: The valid (unique) plan code.
 *             required:
 *               - email
 *               - code
 *     responses:
 *       '200':
 *         description: Successfully added the subscription plan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               code: 200
 *               status: "SUCCESS"
 *               message: "Plan added successfully"
 *               data: {}
 *       '400':
 *         description: Invalid request due to missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               code: 400
 *               status: "FAILED"
 *               message: "Entered invalid input / Please check and try again..."
 *
 *       '401':
 *         description: Unauthorized (e.g., invalid credentials)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 401.
 *               status: "FAILED"
 *               message: Invalid / unauthorized token
 *       '422':
 *         description: User given invalid input (Unprocessable Entity)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 422.
 *               status: "FAILED"
 *               message: "Input field cannot be empty"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 500
 *               status: "FAILED"
 *               message: "Unable to reach the server, Please try again..."
 */
router.post(
  '/add-user-subscription-plan',
  decryptRequestBody,
  validateRequest(subscriptionValidation.addUserSubscriptionPlanSchema),
  subscriptionController.addUserSubscriptionPlan
);

/**
 * @swagger
 * /api/add-enterprise-subscription-plan:
 *   post:
 *     summary: API to add / update details of the enterprise subscritpion plan to an issuer (specific) in DB by issuer email and custom plan details.
 *     description: API to add / update details of the enterprise subscritpion plan to an issuer (specific) in DB by issuer email, plan title, plan duration and credits.
 *     tags: [Subscription]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email associated with the issuer.
 *               subscriptionPlanTitle:
 *                 type: string
 *                 description: The valid enterprise subscription plan title.
 *               subscriptionDuration:
 *                 type: number
 *                 description: The valid enterprise subscription plan duration (in days).
 *               allocatedCredentials:
 *                 type: number
 *                 description: The valid enterprise subscription plan credits.
 *             required:
 *               - email
 *               - subscriptionPlanTitle
 *               - subscriptionDuration
 *               - allocatedCredentials
 *     responses:
 *       '200':
 *         description: Successfully added the subscription plan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               code: 200
 *               status: "SUCCESS"
 *               message: "Plan added successfully"
 *               data: {}
 *       '400':
 *         description: Invalid request due to missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               code: 400
 *               status: "FAILED"
 *               message: "Entered invalid input / Please check and try again..."
 *
 *       '401':
 *         description: Unauthorized (e.g., invalid credentials)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 401.
 *               status: "FAILED"
 *               message: Invalid / unauthorized token
 *       '422':
 *         description: User given invalid input (Unprocessable Entity)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 422.
 *               status: "FAILED"
 *               message: "Input field cannot be empty"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 500
 *               status: "FAILED"
 *               message: "Unable to reach the server, Please try again..."
 */

router.post(
  '/add-enterprise-subscription-plan',
  decryptRequestBody,
  validateRequest(subscriptionValidation.addEnterpriseSubscriptionPlanSchema),
  subscriptionController.addEnterpriseSubscriptionPlan
);

/**
 * @swagger
 * /api/fetch-user-subscription-details:
 *   post:
 *     summary: API to get active subscritpion plans in DB by valid issuer email.
 *     description: API to get active subscritpion plans in DB by valid issuer email.
 *     tags: [Subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Enter valid email.
 *             required:
 *               - email
 *     responses:
 *       '200':
 *         description: Successfully fetched the subscription plan (active) details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               code: 200
 *               status: "SUCCESS"
 *               message: "Limit About to Exhaust | Plan details fetched successfully"
 *               data: {}
 *       '400':
 *         description: Invalid request due to missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               code: 400
 *               status: "FAILED"
 *               message: "Entered invalid input / Please check and try again..."
 *
 *       '401':
 *         description: Unauthorized (e.g., invalid credentials)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 401.
 *               status: "FAILED"
 *               message: Invalid / unauthorized token
 *       '422':
 *         description: User given invalid input (Unprocessable Entity)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 422.
 *               status: "FAILED"
 *               message: "Input field cannot be empty"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 500
 *               status: "FAILED"
 *               message: "Unable to reach the server, Please try again..."
 */
router.post(
  '/fetch-user-subscription-details',
  validateRequest(subscriptionValidation.getIssuerSubscriptionDetailsSchema),
  subscriptionController.getIssuerSubscriptionDetails
);

/**
 * @swagger
 * /api/create-checkout-session:
 *   post:
 *     summary: API to perform checkout with valid email and plan details (optional).
 *     description: |
 *       API to initiate a checkout session using a valid email and subscription plan details (optional).
 *       Returns selected or all subscription plans based on the provided input.
 *     tags: [Subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the admin or user.
 *               plan:
 *                 type: object
 *                 description: Details of the subscription plan.
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The title of the subscription plan.
 *                   fee:
 *                     type: number
 *                     description: The fee for the subscription plan.
 *                   rate:
 *                     type: number
 *                     description: The rate for each credit in the subscription plan.
 *                   validity:
 *                     type: number
 *                     description: The validity of the subscription plan in days.
 *                   credits:
 *                     type: number
 *                     description: The number of credits included in the subscription plan.
 *                   successUrl:
 *                     type: string
 *                     format: uri
 *                     description: URL to redirect to on successful subscription.
 *                   cancelUrl:
 *                     type: string
 *                     format: uri
 *                     description: URL to redirect to on subscription cancellation.
 *                 required:
 *                   - name
 *                   - fee
 *                   - rate
 *                   - validity
 *                   - credits
 *                   - successUrl
 *                   - cancelUrl
 *             required:
 *               - email
 *               - plan
 *     responses:
 *       '200':
 *         description: Successfully fetched the subscription plan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               code: 200
 *               status: "SUCCESS"
 *               message: "Checkout session created"
 *               data: {}
 *       '400':
 *         description: Invalid request due to missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               code: 400
 *               status: "FAILED"
 *               message: "Entered invalid input / Please check and try again..."
 *
 *       '401':
 *         description: Unauthorized (e.g., invalid credentials)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 401.
 *               status: "FAILED"
 *               message: Invalid / unauthorized token
 *       '422':
 *         description: User given invalid input (Unprocessable Entity)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 422.
 *               status: "FAILED"
 *               message: "Input field cannot be empty"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 500
 *               status: "FAILED"
 *               message: "Unable to reach the server, Please try again..."
 */
router.post(
  '/create-checkout-session',
  decryptRequestBody,
  validateRequest(subscriptionValidation.checkoutSubscriptionPaymentSchema),
  subscriptionController.createCheckoutSession
);

/**
 * @swagger
 * /api/checkout-grievance:
 *   post:
 *     summary: API to send grievance request to admin with email & payment ID.
 *     description: API to send grievance request to admin with email & payment ID.
 *     tags: [Subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email associated with the issuer.
 *               paymentID:
 *                 type: string
 *                 description: Provide vaid paymentID.
 *             required:
 *               - email
 *               - paymentID
 *     responses:
 *       '200':
 *         description: Successfully placed grievance request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               code: 200
 *               status: "SUCCESS"
 *               message: "Grievance request placed successfully"
 *               data: {}
 *       '400':
 *         description: Invalid request due to missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               code: 400
 *               status: "FAILED"
 *               message: "Entered invalid input / Please check and try again..."
 *
 *       '401':
 *         description: Unauthorized (e.g., invalid credentials)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 401.
 *               status: "FAILED"
 *               message: Invalid / unauthorized token
 *       '422':
 *         description: User given invalid input (Unprocessable Entity)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 422.
 *               status: "FAILED"
 *               message: "Input field cannot be empty"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 500
 *               status: "FAILED"
 *               message: "Unable to reach the server, Please try again..."
 */
router.post(
  '/checkout-grievance',
  validateRequest(subscriptionValidation.grievanceMailSchema),
  subscriptionController.createGrievance
);

/**
 * @swagger
 * /api/validate-transaction:
 *   post:
 *     summary: API to validate payment transaction with email and session ID.
 *     description: API to validate payment transaction with email and session ID.
 *     tags: [Subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email associated with the issuer (valid).
 *               sessionId:
 *                 type: string
 *                 description: The valid (unique) plan code.
 *             required:
 *               - email
 *               - sessionId
 *     responses:
 *       '200':
 *         description: Session retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               code: 200
 *               status: "SUCCESS"
 *               message: "Session retrieved successfully"
 *               data: {}
 *       '400':
 *         description: Invalid request due to missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               code: 400
 *               status: "FAILED"
 *               message: "Entered invalid input / Please check and try again..."
 *
 *       '401':
 *         description: Unauthorized (e.g., invalid credentials)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 401.
 *               status: "FAILED"
 *               message: Invalid / unauthorized token
 *       '422':
 *         description: User given invalid input (Unprocessable Entity)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 422.
 *               status: "FAILED"
 *               message: "Input field cannot be empty"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               code: 500
 *               status: "FAILED"
 *               message: "Unable to reach the server, Please try again..."
 */
router.post(
  '/validate-transaction',
  validateRequest(subscriptionValidation.fetchPaymentDetailsSchema),
  subscriptionController.fetchPaymentDetails
);

export default router;
