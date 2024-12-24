import { Router } from 'express';
import {
  updateBadgeTemplate,
  getBadgeTemplateById,
  addBadgeTemplate,
  getBadgeTemplates,
  deleteBadgeTemplateById,
  deleteBadgeTemplates,
} from '../controllers/template';

const router = Router();

// router.post(
//     '/delete-certificatetemplate',
//     deleteCertificateTemplateById
// );
// router.post(
//     '/delete-all-certificatestemplates',
//     deleteCertificateTemplates
// );
router.post('/update-badge-template', updateBadgeTemplate);
router.get('/get-badge-template/:id', getBadgeTemplateById);
router.post('/add-badge-template', addBadgeTemplate);
router.post('/get-badge-templates', getBadgeTemplates);
router.post('/delete-badgetemplate', deleteBadgeTemplateById);
router.post('/delete-all-badgestemplates', deleteBadgeTemplates);

export default router;
