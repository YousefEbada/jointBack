export class UpdateUser {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async exec(userId, updateData) {
        try {
            const updatedUser = await this.userRepo.updateUserInfo(userId, updateData);
            if (!updatedUser) {
                return { ok: false, error: 'Failed to update user' };
            }
            return { ok: true, data: updatedUser };
        }
        catch (error) {
            console.log('[UpdateUser] Error in update user use case:', error.message);
            return { ok: false, error: 'Internal server error' };
        }
    }
}
