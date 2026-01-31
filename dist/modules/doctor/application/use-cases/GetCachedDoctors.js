export class GetCachedPractitioners {
    doctorRepo;
    constructor(doctorRepo) {
        this.doctorRepo = doctorRepo;
    }
    async exec(branch, department) {
        try {
            const doctors = await this.doctorRepo.getAll(branch, department);
            if (!doctors.length) {
                return { ok: false, error: 'No Doctors have been found' };
            }
            return { ok: true, doctors };
        }
        catch (error) {
            console.error("Error retrieving cached doctors:", error.message);
            return { ok: false, error: 'Failed to retrieve doctors from cache' };
        }
    }
}
