import type { Request, Response, NextFunction } from 'express';
import { Controller } from './controller.js';
import { Unauthorized, BadRequest, NotFound } from '../utils/errors.js';
import roomService from '../services/roomService.js';
import { tokenRetrieval } from '../middlewares/tokenRetrievalMiddleware.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { Schema, Types } from 'mongoose';

dotenv.config();

class RoomController extends Controller {
    private readonly service;

    constructor(service = roomService) {
        super();
        this.service = service;
    }

    // 📍 GET all rooms
    async getAll(_req: Request, res: Response, next: NextFunction) {
        try {
            const rooms = await this.service.getAll();
            res.json(rooms);
        } catch (e) {
            next(e);
        }
    }

    // 📍 GET room by ID
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id) return next(new BadRequest('ID is required'));

            const room = await this.service.getById(id);
            if (!room) return next(new NotFound('Room not found'));

            res.json(room);
        } catch (e) {
            next(e);
        }
    }

    async getByName(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.params;
            if (!name) return next(new BadRequest('Name is required'));
            const room = await this.service.getByName(name);
            if (!room) return next(new NotFound('Room not found'));
            res.json(room);
        }
        catch (e) {
            next(e);
        }
    }
    

    // 📍 CREATE room
    async add(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, password } = req.body;

            if (!name || !password) {
                return next(new BadRequest('Name and password are required'));
            }

            // vérifier si le nom est déjà utilisé
            const existing = await this.service.getByName(name);
            if (existing) {
                return next(new BadRequest('Name already exists'));
            }

            const roomPassword =  await bcrypt.hash(password, 10);
    
            const created = await this.service.add({
                name,
                password: roomPassword
            });

            if (!req.user) {
                return next(new Unauthorized('User not authenticated'));
            }

            this.service.update((created._id.toString()), { player1: new Schema.Types.ObjectId(req.user.id)});

            res.status(201).json(created);
        } catch (e) {
            next(e);
        }
    }

    // 📍 UPDATE room
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id) return next(new BadRequest('ID is required'));

            const { name, password } = req.body;

            const patch: any = {};
            if (name) patch.name = name;
            if (password) patch.password = password;

            const updated = await this.service.update(id, patch);
            if (!updated) return next(new NotFound('Room not found'));

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
            if (!deleted) return next(new NotFound('Room not found'));

            res.json(deleted);
        } catch (e) {
            next(e);
        }
    }

    // 📍 LOGIN 
    async join(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, password } = req.body;
            if (!name || !password) {
                return next(new BadRequest('Name and password are required'));
            }

            // Recherche par nom
            const room = await this.service.getByName(name);

            if (!room) {
                return next(new Unauthorized('Invalid name or password'));
            }

            // Vérification du mot de passe
            const isPasswordValid = await bcrypt.compare(password, room.password);
            if (!isPasswordValid) {
                return next(new Unauthorized('Invalid name or password'));
            }

            if (!req.user) {
                return next(new Unauthorized('User not authenticated'));
            }

            this.service.update((room._id.toString()), { player2: new Schema.Types.ObjectId(req.user.id) });
            
            return res.json({
                message: 'Connected successfully to the room',
                room: {
                    id: room._id,
                    name: room.name,
                }
            });
        } catch (e) {
            next(e);
        }
    }
}

export default new RoomController();
