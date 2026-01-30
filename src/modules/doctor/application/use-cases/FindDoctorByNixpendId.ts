import { DoctorRepoPort } from "../ports/DoctorRepoPort.js";

export class FindDoctorByNixpendId {
    constructor(private doctorRepo: DoctorRepoPort) { }
    async execute(nixpendId: string) {
        try {
            const doctor = await this.doctorRepo.findByNixpendId(nixpendId);
            if (!doctor) {
                return { ok: false, error: 'Doctor Not Found' }
            }
            return { ok: true, doctor };
        } catch (error) {
            console.error("Error finding doctor by Nixpend ID:", (error as Error).message);
            return { ok: false, error: 'Failed to find doctor by Nixpend ID' };
        }
    }
}
