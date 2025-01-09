import { Router } from 'express';
import issuerDashboardController from '../controllers/isuuerDashboard.controller';

const router = Router();

// All certificate operation counter as per current month and year
router.get(
  '/get-status-graph-data/:month/:year/:email',
  issuerDashboardController.statusGraphDetails
);

// Sinle and Batch issuance counter
router.get('/get-graph-data/:email', issuerDashboardController.graphDetails);

// Total count for all certificate operation
router.get('/get-issuers-log/:email', issuerDashboardController.issuerLogs);

export default router;
