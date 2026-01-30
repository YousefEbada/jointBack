import { DoctorRepoPort } from "../ports/DoctorRepoPort.js";

export class GetCachedPractitioners {
  constructor(private doctorRepo: DoctorRepoPort) {}
    async exec(branch?: string, department?: string) {
      try {
        const doctors = await this.doctorRepo.getAll(branch, department);
        if(!doctors.length) {
          return {ok: false, error: 'No Doctors have been found'}
        }
        return {ok: true, doctors};
      } catch (error) {
        console.error("Error retrieving cached doctors:", (error as Error).message);
        return {ok: false, error: 'Failed to retrieve doctors from cache'};
      }
    }
}