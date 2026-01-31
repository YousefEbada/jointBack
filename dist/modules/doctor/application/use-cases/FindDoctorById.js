export class FindDoctorById {
    doctorRepo;
    constructor(doctorRepo) {
        this.doctorRepo = doctorRepo;
    }
    async execute(id) {
        try {
            const doctor = await this.doctorRepo.findById(id);
            if (!doctor) {
                return { ok: false, error: 'Doctor Not Found' };
            }
            return { ok: true, doctor };
        }
        catch (error) {
            console.error("Error finding doctor by ID:", error.message);
            return { ok: false, error: 'Failed to find doctor by ID' };
        }
    }
}
