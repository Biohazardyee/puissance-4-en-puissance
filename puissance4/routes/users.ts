import express from 'express';
import userController from '../controllers/userController.js';
import { authGuard } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', (req, res, next) => userController.login(req, res, next));

router.get('/', authGuard, (req, res, next) => userController.getAll(req, res, next));

router.get('/:id', (req, res, next) => userController.getById(req, res, next));

router.post('/', (req, res, next) => userController.add(req, res, next));

router.put('/:id', (req, res, next) => userController.update(req, res, next));

router.delete('/:id', (req, res, next) => userController.delete(req, res, next));

export default router;