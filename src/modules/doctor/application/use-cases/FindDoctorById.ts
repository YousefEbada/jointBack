import { DoctorRepoPort } from "../ports/DoctorRepoPort.js";

export class FindDoctorById {
    constructor(private doctorRepo: DoctorRepoPort) { }
    async execute(id: string) {
        try {
            const doctor = await this.doctorRepo.findById(id);
            if (!doctor) {
                return { ok: false, error: 'Doctor Not Found' }
            }
            return { ok: true, doctor };
        } catch (error) {
            console.error("Error finding doctor by ID:", (error as Error).message);
            return { ok: false, error: 'Failed to find doctor by ID' };
        }
    }
}