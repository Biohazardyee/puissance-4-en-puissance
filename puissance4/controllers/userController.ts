import type { Request, Response, NextFunction } from 'express';
import { Controller } from './controller.js';
import { Unauthorized, BadRequest, NotFound } from '../utils/errors.js';
import userService from '../services/userService.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

class UserController extends Controller {
    private readonly service;

    constructor(service = userService) {
        super();
        this.service = service;
    }

    // 📍 GET all users
    async getAll(_req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.service.getAll();
            res.json(users);
        } catch (e) {
            next(e);
        }
    }

    // 📍 GET user by ID
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id) return next(new BadRequest('ID is required'));

            const user = await this.service.getById(id);
            if (!user) return next(new NotFound('User not found'));

            res.json(user);
        } catch (e) {
            next(e);
        }
    }

    // 📍 CREATE user
    async add(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password, roles } = req.body;

            if (!name || !email || !password) {
                return next(new BadRequest('Name, email and password are required'));
            }

            // vérifier si l'email est déjà utilisé
            const existing = await this.service.getByName(name);
            if (existing) {
                return next(new BadRequest('Name already exists'));
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const created = await this.service.add({
                name,
                email,
                password: hashedPassword,
                roles: roles
            });

            res.status(201).json(created);
        } catch (e) {
            next(e);
        }
    }

    // 📍 UPDATE user
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id) return next(new BadRequest('ID is required'));

            const { name, email, password, roles } = req.body;

            const patch: any = {};
            if (name) patch.name = name;
            if (email) patch.email = email;
            if (password) patch.password = await bcrypt.hash(password, 10);
            if (roles) patch.roles = roles;

            const updated = await this.service.update(id, patch);
            if (!updated) return next(new NotFound('User not found'));

            res.json(updated);
        } catch (e) {
            next(e);
        }
    }

    // 📍 DELETE user
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id) return next(new BadRequest('ID is required'));

            const deleted = await this.service.delete(id);
            if (!deleted) return next(new NotFound('User not found'));

            res.json(deleted);
        } catch (e) {
            next(e);
        }
    }

    // 📍 LOGIN (returns JWT)
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, password } = req.body;
            if (!name || !password) {
                return next(new BadRequest('Name and password are required'));
            }

            // Recherche par email
            const user = await this.service.getByName(name);
            if (!user) {
                return next(new Unauthorized('Invalid name or password'));
            }

            // Vérification du mot de passe
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return next(new Unauthorized('Invalid name or password'));
            }

            // Générer un JWT
            const token = jwt.sign(
                { id: user._id, name: user.name, email: user.email },
                process.env.JWT_SECRET || '',
                { expiresIn: '1h' }
            );

            return res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    roles: user.roles
                }
            });
        } catch (e) {
            next(e);
        }
    }
}

export default new UserController();
