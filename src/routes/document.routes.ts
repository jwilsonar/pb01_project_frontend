import { Router } from 'express';
import { DocumentController, upload } from '../controllers/document.controller';

const router = Router();

router.get('/document-types', DocumentController.getDocumentTypes);
router.get('/employees/:employeeId/documents', DocumentController.getEmployeeDocuments);
router.post('/documents/upload', upload.single('file'), DocumentController.uploadDocument);
router.delete('/documents/:id', DocumentController.deleteDocument);

export default router; 