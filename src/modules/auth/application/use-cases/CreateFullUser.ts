import { UserRepoPort } from "../ports/UserRepoPort.js";
import { CreateFullUserRequest, User, UserStatus } from "../../domain/User.js";

type CreateFullUserResult = {
	ok: true | false;
	message?: string;
	user?: User;
	error?: string;
}

export class CreateFullUser {
	constructor(private userRepo: UserRepoPort) {}
	
	async exec(data: CreateFullUserRequest): Promise<CreateFullUserResult> {
		const { userId, ...updateFields } = data;
		
		if (!userId) {
			return { ok: false, error: "userId is required to complete a user profile." };
		}

		const user = await this.userRepo.findById(userId);
		if (!user) {
			return { ok: false, error: "User not found." };
		}

		const status = user.userStatus || {} as UserStatus;

		// Require that the partial profile was completed and register OTP verified
		if (!status.partialProfileCompleted) {
			return { ok: false, error: "User is not eligible to complete full profile. Ensure partial profile is completed." };
		}

		if (!status.registerOtpVerified) {
			return { ok: false, error: "User is not eligible to complete full profile. Ensure registration OTP is verified." };
		}

		// Idempotent: if already full, return full user
		if (status.fullProfileCompleted) {
			return {ok: true, message: "User profile is already fully completed.", user};
		}

		// Convert birthdate string to Date if needed
		// if (updateFields.birthdate && typeof updateFields.birthdate === 'string') {
		// 	updateFields.birthdate = new Date(updateFields.birthdate);
		// }

		// Handle guardian information validation
		// if (updateFields.guardianInformation) {
		// 	// Validate required guardian fields if provided
		// 	const guardian = updateFields.guardianInformation;
		// 	if (!guardian.guardianName || !guardian.guardianRelation) {
		// 		return { ok: false, error: "Guardian name and relation are required when providing guardian information." };
		// 	}
		// }

		// Update user with new fields and mark as full profile completed
		const updated: any = await this.userRepo.save({
			...user,
			...updateFields,
			_id: user._id,
			userStatus: { ...status, fullProfileCompleted: true }
		} as any);

		return { ok: true, user: updated };
	}
}

