export class UpdateUserRole {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async exec(userId, newRole) {
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
        }
        catch (error) {
            return { ok: false, error: 'Internal server error' };
        }
    }
}
