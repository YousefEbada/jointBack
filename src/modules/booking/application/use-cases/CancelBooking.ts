import { NixpendPort } from "modules/integration/ports/NixpendPorts.js";
import { BookingRepoPort } from "../ports/BookingRepoPort.js";
import { CancelType } from "modules/integration/domain/Nixpend.js";

export class CancelBooking {
  constructor(private repo: BookingRepoPort, private nixpendAdapter: NixpendPort) {}
    async exec(bookingId: string, data: CancelType) {
        const booking =  await this.repo.findById(bookingId);
        if(!booking) {
          return { ok: false, error: 'Booking not found' };
        }
        try {
          const res = await this.nixpendAdapter.cancelAppointment(data);
            if(!res || !res.success) {
                return { ok: false, error: 'Failed to cancel appointment in Nixpend' };
            }
            const canceled = await this.repo.cancel(booking);
            console.log("Booking canceled:", canceled);
            return { ok: true, booking: canceled };
        } catch (error) {
            console.error("Exception during cancellation:", (error as any).message);
            return { ok: false, error: 'Exception occurred during cancellation' };
        }
    }
}
