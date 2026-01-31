import { detectContactType } from "../../../../shared/utils/detectContactType.js";
export class FindUserByContact {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async exec(contact) {
        try {
            if (!contact) {
                return { ok: false, error: 'Contact is required' };
            }
            const contactType = detectContactType(contact);
            console.log("CONTACT TYPE: ", contactType);
            if (contactType === 'invalid')
                return { ok: false, user: null, error: 'Invalid contact type' };
            const user = await this.userRepo.findByEmailOrPhone(contactType, contact);
            console.log("TJEHEHHE : ", user);
            if (!user) {
                return { ok: false, error: `User Not Found` };
            }
            return { ok: true, user };
        }
        catch (error) {
            console.log('[Find User] Error in find user controller:', error.message);
            return { ok: false, error: 'Internal server error' };
        }
    }
}
