import { Router } from 'express';
import issuerDashboardController from '../controllers/isuuerDashboard.controller';

const router = Router();

router.get(
  '/get-status-graph-data/:email',
  issuerDashboardController.statusGraphDetails
);

router.get('/get-graph-data/:email', issuerDashboardController.graphDetails);

export default router;
