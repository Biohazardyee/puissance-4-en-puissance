import express from 'express';
import roomController from '../controllers/roomController.js';
import { authGuard } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authGuard, (req, res, next) => roomController.add(req, res, next));

router.get('/', authGuard, (req, res, next) => roomController.getAll(req, res, next));

router.get('/:id', authGuard, (req, res, next) => roomController.getById(req, res, next));

router.get('/name/:name', authGuard, (req, res, next) => roomController.getByName(req, res, next));

router.put('/:id', authGuard, (req, res, next) => roomController.update(req, res, next));

router.delete('/:id', authGuard,  (req, res, next) => roomController.delete(req, res, next));

export default router;