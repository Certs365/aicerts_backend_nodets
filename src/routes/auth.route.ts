import { Router } from 'express';
import authValidation from '../utils/ValidationSchema/authSchema';
import validateRequest from '../middlewares/validationHandler';
import { decryptRequestBody } from '../utils/authUtils';
import authController from '../controllers/auth.controller';
import passport from 'passport';

const router = Router();

/**
 * @openapi
 * /api/signup:
 *   post:
 *     summary: Create a new user account
 *     tags: [Signup]
 *     description: Create a new user account with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name
 *               organization:
 *                 type: string
 *                 description: User's organization
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password (at least 8 characters long)
 *               address:
 *                 type: string
 *                 description: User's address (optional)
 *               country:
 *                 type: string
 *                 description: User's country (optional)
 *               organizationType:
 *                 type: string
 *                 description: User's organization type (optional)
 *               city:
 *                 type: string
 *                 description: User's city (optional)
 *               zip:
 *                 type: string
 *                 description: User's ZIP code (optional)
 *               industrySector:
 *                 type: string
 *                 description: User's industry sector (optional)
 *               state:
 *                 type: string
 *                 description: User's state (optional)
 *               websiteLink:
 *                 type: string
 *                 description: User's website link (optional)
 *               phoneNumber:
 *                 type: string
 *                 description: User's phone number (optional)
 *               designation:
 *                 type: string
 *                 description: User's designation (optional)
 *               username:
 *                 type: string
 *                 description: User's username (optional)
 *             required:
 *               - name
 *               - organization
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Successful user registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: A message describing the result of the operation
 *                 data:
 *                   type: object
 *                   description: Information about the registered user
 *
 *       '400':
 *         description: Bad request (e.g., empty input fields, invalid email, short password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: A message describing the error
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
 *               status: "FAILED"
 *               message: Error message for invalid input.
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: A message describing the error
 */
router.post(
  '/signup',
  decryptRequestBody,
  validateRequest(authValidation.signUpSchema),
  authController.signup
);

router.post(
  '/onboarding',
  decryptRequestBody,
  validateRequest(authValidation.onboardingSchema),
  authController.onboarding
);

/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: User Login
 *     tags: [Login]
 *     description: Logs in a user with the provided email and password.
 *     requestBody:
 *       description: User email and password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *
 *     responses:
 *       '200':
 *         description: Login successful, OTP sent for verification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: A message describing the result of the operation
 *
 *       '400':
 *         description: Bad request (e.g., missing or invalid parameters)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: A message describing the error
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
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: A message describing the error
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
 *               status: "FAILED"
 *               message: Error message for invalid input.
 *
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: A message describing the error
 */
router.post(
  '/login',
  decryptRequestBody,
  validateRequest(authValidation.loginSchema),
  authController.login
);

/**
 * @swagger
 * /api/login-with-phone:
 *   post:
 *     summary: Login with phone number using two-factor authentication
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: The ID token obtained from the user during two-factor authentication.
 *               email:
 *                 type: string
 *                 description: The email address of the user for two-factor authentication.
 *             required:
 *               - idToken
 *               - email
 *     responses:
 *       '200':
 *         description: Successful login with valid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 message:
 *                   type: string
 *                   example: Valid User Credentials
 *                 data:
 *                   type: object
 *                   properties:
 *                     JWTToken:
 *                       type: string
 *                       example: <JWT_TOKEN>
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     organization:
 *                       type: string
 *                       example: ABC Corporation
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     phoneNumber:
 *                       type: string
 *                       example: +1234567890
 *       '401':
 *         description: Invalid OTP or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 message:
 *                   type: string
 *                   example: Invalid OTP or expired token
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
 *               status: "FAILED"
 *               message: Error message for invalid input.
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 message:
 *                   type: string
 *                   example: User not found
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 message:
 *                   type: string
 *                   example: Internal Server Error. Please try again later.
 */
router.post(
  '/two-factor-auth',
  decryptRequestBody,
  validateRequest(authValidation.twoFactorAuthSchema),
  authController.twoFactor
);

/**
 * @swagger
 * /api/refresh:
 *   post:
 *     summary: Refresh for the Issuer authorization/authentication
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The ID refresh token obtained from the user during the authentication.
 *               email:
 *                 type: string
 *                 description: The email address of the user for login/authentication.
 *             required:
 *               - token
 *               - email
 *     responses:
 *       '200':
 *         description: Successful login with valid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *                 message:
 *                   type: string
 *                   example: Valid User Credentials
 *                 data:
 *                   type: object
 *                   properties:
 *                     JWTToken:
 *                       type: string
 *                       example: <JWT_TOKEN>
 *                     refreshToken:
 *                       type: string
 *                       example: <JWT_TOKEN>
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     organization:
 *                       type: string
 *                       example: ABC Corporation
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     phoneNumber:
 *                       type: string
 *                       example: +1234567890
 *       '401':
 *         description: Invalid OTP or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 message:
 *                   type: string
 *                   example: Invalid OTP or expired token
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
 *               status: "FAILED"
 *               message: Error message for invalid input.
 *       '403':
 *         description: User provided invalid Token
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
 *               status: "FAILED"
 *               message: User provided invalid Token.
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 message:
 *                   type: string
 *                   example: Internal Server Error. Please try again later.
 */
router.post(
  '/refresh',
  decryptRequestBody,
  validateRequest(authValidation.refreshTokenSchema),
  authController.refreshToken
);

router.post(
  '/forget-password',
  decryptRequestBody,
  validateRequest(authValidation.forgetPasswordSchema),
  authController.forgetPassword
);

router.post(
  '/verify-issuer',
  decryptRequestBody,
  validateRequest(authValidation.verifyIssuerSchema),
  authController.verifyIssuer
);

// Route to start Google OAuth authentication
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback route to handle the Google response after authentication
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  authController.oAuthSignup
);

// Route to start LinkedIn OAuth authentication
router.get(
  '/auth/linkedin',
  passport.authenticate('linkedin', {
    scope: ['profile', 'email'],
  })
);

// Callback route to handle the LinkedIn response after authentication
router.get(
  '/auth/linkedin/callback',
  passport.authenticate('linkedin', {
    failureRedirect: '/login',
  }),
  authController.oAuthSignup
);

export default router;
