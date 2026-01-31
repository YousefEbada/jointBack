export class FindDoctorByNixpendId {
    doctorRepo;
    constructor(doctorRepo) {
        this.doctorRepo = doctorRepo;
    }
    async execute(nixpendId) {
        try {
            const doctor = await this.doctorRepo.findByNixpendId(nixpendId);
            if (!doctor) {
                return { ok: false, error: 'Doctor Not Found' };
            }
            return { ok: true, doctor };
        }
        catch (error) {
            console.error("Error finding doctor by Nixpend ID:", error.message);
            return { ok: false, error: 'Failed to find doctor by Nixpend ID' };
        }
    }
}
