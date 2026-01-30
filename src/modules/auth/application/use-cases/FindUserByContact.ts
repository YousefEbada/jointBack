import { detectContactType } from "../../../../shared/utils/detectContactType.js";
import { UserRepoPort } from "../ports/UserRepoPort.js";
import { User } from "modules/auth/domain/User.js";

type FindUserReturn = {
    ok: true | false;
    user?: User | null;
    error?: string | null;
}

export class FindUserByContact {
    constructor(private userRepo: UserRepoPort) {}
    async exec(contact: string): Promise<FindUserReturn> {
        try {
            if(!contact) {
                return { ok: false, error: 'Contact is required' };
            }
            const contactType = detectContactType(contact);
            console.log("CONTACT TYPE: ", contactType);
            if (contactType === 'invalid') return { ok: false, user: null, error: 'Invalid contact type' };
            const user = await this.userRepo.findByEmailOrPhone(contactType, contact);
            console.log("TJEHEHHE : ", user)
            if(!user) {
                return {ok: false, error: `User Not Found`}
            }
            return { ok: true, user };
        } catch (error) {
            console.log('[Find User] Error in find user controller:', (error as Error).message);
            return { ok: false, error: 'Internal server error' };
        }
    }
}