import { DoctorRepoPort } from "modules/doctor/application/ports/DoctorRepoPort.js";
import { NixpendPort } from "modules/integration/ports/NixpendPorts.js";

export class GetAvailableSlots {
  constructor(private repo: NixpendPort, private doctorRepo: DoctorRepoPort) { }
  async exec(doctorId: string) {
    try {
      let doctor;
      if (doctorId.startsWith('HLC')) {
        doctor = await this.doctorRepo.findByNixpendId(doctorId);
      } else {
        doctor = await this.doctorRepo.findById(doctorId);
      }
      console.log("===== doctor ======= ", doctor)
      if (!doctor || !doctor.nixpendId) {
        return { ok: false, error: 'Doctor not found or missing Nixpend ID' };
      }
      const slots = await this.repo.getAvailableSlots(doctor.nixpendId, 'Joint Clinic');
      console.log("===== slots ======= ", slots.data.length)
      if (!slots.data || slots.data.length === 0) {
        return { ok: false, error: 'No slots available from Nixpend' };
      }
      return { ok: true, slots: slots.data };
    } catch (error) {
      return { ok: false, error: 'Error fetching slots from Nixpend' };
    }
  }
}