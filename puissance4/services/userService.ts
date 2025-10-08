import { Service } from './service.js';
import { User, IUser } from '../schema/users.js';
import { NotFound } from '../utils/errors.js';

class UserService extends Service<IUser, string> {
    // 📍 Récupérer tous les utilisateurs
    async getAll(): Promise<IUser[]> {
        return await User.find();
    }

    // 📍 Récupérer un utilisateur par ID
    async getById(id: string): Promise<IUser> {
        const user = await User.findById(id);
        if (!user) throw new NotFound('User not found');
        return user;
    }

    // 📍 Récupérer un utilisateur par nom (si tu veux le garder)
    async getByName(name: string): Promise<IUser | null> {
        return await User.findOne({ name });
    }

    // 📍 Récupérer un utilisateur par email (utilisé pour login)
    async getByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email });
    }

    // 📍 Créer un utilisateur
    async add(data: Partial<IUser>): Promise<IUser> {
        return await User.create(data);
    }

    // 📍 Mettre à jour un utilisateur
    async update(id: string, patch: Partial<IUser>): Promise<IUser> {
        const updatedUser = await User.findByIdAndUpdate(id, patch, { new: true });
        if (!updatedUser) throw new NotFound('User not found');
        return updatedUser;
    }

    // 📍 Supprimer un utilisateur
    async delete(id: string): Promise<IUser> {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) throw new NotFound('User not found');
        return deletedUser;
    }
}

export default new UserService();
