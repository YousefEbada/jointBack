import { DoctorRepoPort } from "../ports/DoctorRepoPort.js";

// may i need to use it when i implement the queue for syncing doctors
export class SavePractitionerToCache {
  constructor(private doctorRepo: DoctorRepoPort) {}
    async execute(practitioners: any[]) {
        await this.doctorRepo.clear();
        await this.doctorRepo.saveMany(practitioners);
    }
}