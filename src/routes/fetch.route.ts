import express from 'express';
import { getOrgs, setGroupedOrgs, getGroupedOrgs, getOrgIssues } from '../controllers/fetch';

const router = express.Router();

/**
 * @swagger
 * /api/get-orgs:
 *   get:
 *     summary: API to fetch list of organizations of all registered issuers.
 *     description: API to fetch list of organizations of all registered issuers.
 *     tags: [Fetch]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully fetched details.
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
 *               message: "Successfully fetched details"
 *       '400':
 *         description: No match found.
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
 *               message: "No match found / Please check and try again..."
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
router.get('/get-orgs', getOrgs);

router.post('/set-group-orgs', setGroupedOrgs);

router.get('/get-organization-details', getGroupedOrgs);

router.post('/get-organization-issues', getOrgIssues);

export default router;