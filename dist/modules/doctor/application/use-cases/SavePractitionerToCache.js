// may i need to use it when i implement the queue for syncing doctors
export class SavePractitionerToCache {
    doctorRepo;
    constructor(doctorRepo) {
        this.doctorRepo = doctorRepo;
    }
    async execute(practitioners) {
        await this.doctorRepo.clear();
        await this.doctorRepo.saveMany(practitioners);
    }
}
