import { detectContactType } from "../../../../shared/utils/detectContactType.js";
import { UserRepoPort } from "../ports/UserRepoPort.js";
import { User } from "modules/auth/domain/User.js";

type CreatePartialResult = {
    ok: true | false,
    user?: User | null,
    error?: string
}

export class CreatePartialUser {
    constructor(private userRepo: UserRepoPort) {}
    async exec(fullName: string, gender: 'Male' | 'Female' | 'male' | 'female', birthdate: Date, contact: string): Promise<CreatePartialResult> {
        try {
            const contactType = detectContactType(contact);
            console.log('[Create Partial User] Detected contact type:', contactType);
            console.log('[Create Partial User] Creating partial user with contact:', contact);
            const existingUser = await this.userRepo.findByEmailOrPhone(contactType, contact);
            if (existingUser) {
                console.log('[Create Partial User] User already exists with contact:', existingUser);
                return {ok: false, error: 'User Already Exists.'};
            }
            const user = await this.userRepo.create({ fullName, gender, birthdate, [contactType]: contact, userStatus: { partialProfileCompleted: true, registerOtpVerified: false, fullProfileCompleted: false } });
            return {ok: true, user};
        } catch (error) {
            console.log('[Create Partial User] Error in creating partial user:', (error as Error).message);
            return {ok: false, error: (error as Error).message};
        }
    }
}