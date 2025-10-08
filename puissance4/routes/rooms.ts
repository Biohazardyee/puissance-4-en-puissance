import express from 'express';
import roomController from '../controllers/roomController.js';
import { authGuard } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', (req, res, next) => roomController.add(req, res, next));

router.get('/', authGuard, (req, res, next) => roomController.getAll(req, res, next));

router.get('/:id', (req, res, next) => roomController.getById(req, res, next));

router.put('/:id', (req, res, next) => roomController.update(req, res, next));

router.delete('/:id', (req, res, next) => roomController.delete(req, res, next));

export default router;