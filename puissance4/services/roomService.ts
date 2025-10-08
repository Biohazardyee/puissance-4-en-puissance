import { Service } from './service.js';
import { Room, IRoom } from '../schema/rooms.js';
import { NotFound } from '../utils/errors.js';

class RoomService extends Service<IRoom, string> {
    // 📍 Récupérer toutes les salles
    async getAll(): Promise<IRoom[]> {
        return await Room.find();
    }

    // 📍 Récupérer une salle par ID
    async getById(id: string): Promise<IRoom> {
        const room = await Room.findById(id);
        if (!room) throw new NotFound('Room not found');
        return room;
    }

    // 📍 Récupérer une salle par nom (si tu veux le garder)
    async getByName(name: string): Promise<IRoom | null> {
        return await Room.findOne({ name });
    }

    // 📍 Créer une salle
    async add(data: Partial<IRoom>): Promise<IRoom> {
        return await Room.create(data);
    }

    // 📍 Mettre à jour une salle
    async update(id: string, patch: Partial<IRoom>): Promise<IRoom> {
        const updatedRoom = await Room.findByIdAndUpdate(id, patch, { new: true });
        if (!updatedRoom) throw new NotFound('Room not found');
        return updatedRoom;
    }

    // 📍 Supprimer une salle
    async delete(id: string): Promise<IRoom> {
        const deletedRoom = await Room.findByIdAndDelete(id);
        if (!deletedRoom) throw new NotFound('Room not found');
        return deletedRoom;
    }
}

export default new RoomService();
