import { User } from "modules/auth/domain/User.js";
import { UserRepoPort } from "../ports/UserRepoPort.js";

export class UpdateUserRole {
    constructor(private userRepo: UserRepoPort) {}
    async exec(userId: string, newRole: User['role']) {
        try {
            const user = await this.userRepo.findById(userId);
            if (!user) {
                return { ok: false, error: 'User not found' };
            }
            const updatedUser = await this.userRepo.updateUserRole(userId, newRole);
            if (!updatedUser) {
                return { ok: false, error: 'Failed to update user role' };
            }
            return { ok: true, data: updatedUser };
        } catch (error) {
            return { ok: false, error: 'Internal server error' };
        }
    }
}