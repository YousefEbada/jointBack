import { NixpendPort } from "modules/integration/ports/NixpendPorts.js";
import { BookingRepoPort } from "../ports/BookingRepoPort.js";
import { RescheduleType } from "modules/integration/domain/Nixpend.js";
import { Booking, BookingType } from "modules/booking/domain/Booking.js";

export class RescheduleBooking {
  constructor(private repo: BookingRepoPort, private nixpendRepo: NixpendPort) { }
  async exec(bookingId: string, data: RescheduleType) {
    const booking = await this.repo.findById(bookingId);
    if (!booking) {
      return { ok: false, error: 'Booking not found' };
    }
    if (booking.status == 'cancelled') {
      return { ok: false, error: "This Booking was cancelled" }
    }
    try {
      const res = await this.nixpendRepo.rescheduleAppointment(booking.appointmentNixpendId, {
        ...data
      });
      if (!res || !res.appointment_id) {
        return { ok: false, error: 'Failed to reschedule appointment in Nixpend' };
      }

      // check the reshduling in mongo repo
      // how you will get the id of the booking to be rescheduled
      // whether from the parameter or the data
      const updatedBooking = await this.repo.reschedule({
        doctorNixpendId: data.practitioner,
        appointmentNixpendId: res.appointment_id,
        department: data.department,
        company: data.company,
        bookingType: data.appointment_type as BookingType,
        appointmentDate: new Date(data.appointment_date),
        appointmentTime: data.appointment_time,
        eventName: data.daily_practitioner_event,
        appointmentDuration: data.duration
      });
      console.log("Booking rescheduled:", updatedBooking);

      return { ok: true, booking: updatedBooking };
    } catch (error) {
      console.error("Exception during rescheduling:", (error as any).message);
      return { ok: false, error: 'Exception occurred during rescheduling' };
    }
  }
}