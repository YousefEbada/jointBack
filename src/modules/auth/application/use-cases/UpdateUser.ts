import { UserRepoPort } from "../ports/UserRepoPort.js";

export class UpdateUser {
    constructor(private userRepo: UserRepoPort) {}
    async exec(userId: string, updateData: Partial<any>) {
        try {
            const updatedUser = await this.userRepo.updateUserInfo(userId, updateData);
            if (!updatedUser) {
                return { ok: false, error: 'Failed to update user' };
            }
            return { ok: true, data: updatedUser };
        } catch (error) {
            console.log('[UpdateUser] Error in update user use case:', (error as Error).message);
            return { ok: false, error: 'Internal server error' };
        }
    }
}