import express, { Router, Request, Response } from 'express';
import template from './template';
import subscription from './subscription.route';
import dashboard from './issuerDashboard.route';
import auth from './auth.route';

const router: Router = express.Router();

router.get('/test', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Index page is working!' });
});

// Use imported routers
router.use(template);
router.use(subscription);
router.use(dashboard);
router.use(auth);

export default router;
