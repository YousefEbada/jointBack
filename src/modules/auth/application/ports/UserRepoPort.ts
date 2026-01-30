import { User } from '../../domain/User.js';
export interface UserRepoPort {
  findByEmailOrPhone(contactType: string, contact: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: Partial<User>): Promise<User>;
  save(user: Partial<User>): Promise<User | null>;
  updateUserStatus(userId: string, statusUpdate: Partial<User['userStatus']>): Promise<void>;
  updateUserInfo(userId: string, updateData: Partial<User>): Promise<User | null>;
  updateUserRole(userId: string, newRole: User['role']): Promise<User | null>;
}
  