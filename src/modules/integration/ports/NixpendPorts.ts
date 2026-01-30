import { AvailableSlotReturnType, BookType, BranchType, CancelType, DepartmentType, FetchType, RegisterType, RescheduleType, UpdateType } from "../domain/Nixpend.js";

export interface NixpendPort {
  // patient
  findPatient(type: FetchType, value: string): Promise<any | null>;
  registerPatient(value: RegisterType): Promise<any>;
  updatePatient(patient_id: string, value: UpdateType): Promise<any>;

  // Practitioner
  getPractitioners(branch?: BranchType, department?: DepartmentType): Promise<any[] | null>;

  // Appointment
  // get the event name from get available slots
  bookAppointment(value: BookType): Promise<any>;
  getAvailableSlots(practitionerId: string, company: "Joint Clinic", fromDate?: string, toDate?: string): Promise<AvailableSlotReturnType>;
  rescheduleAppointment(appointment_id: string, appointment_details: RescheduleType): Promise<any>
  cancelAppointment(data: CancelType): Promise<any>;

  // IVR
  // still has CORS issue
  ivrConfirmAppointment?(confirm: '0' | '1' | '2', name: string): Promise<any>;
  ivrGetPatientAppointment?(after: string, branch: string): Promise<any>;

}
