import { Router } from 'express';
import { decryptRequestParseBody } from '../utils/authUtils'; // Adjust the import path as needed
const userController = require('../controller/fetch');

const router = Router();

router.post(
    '/get-batch-certificate-dates',
    decryptRequestParseBody,
    userController.getBatchCertificateDates
);
router.post(
    '/delete-certificatetemplate',
    userController.deleteCertificateTemplateById
);
router.post(
    '/delete-all-certificatestemplates',
    userController.deleteCertificateTemplates
);
router.post(
    '/update-badge-template',
    userController.updateBadgeTemplate
);
router.get(
    '/get-badge-template/:id',
    userController.getBadgeTemplateById
);
router.post(
    '/add-badge-template',
    userController.addBadgeTemplate
);
router.post(
    '/get-badge-templates',
    userController.getBadgeTemplates
);
router.post(
    '/delete-badgetemplate',
    userController.deleteBadgeTemplateById
);
router.post(
    '/delete-all-badgestemplates',
    userController.deleteBadgeTemplates
);

export default router;
