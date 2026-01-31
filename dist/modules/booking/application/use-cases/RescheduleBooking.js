export class RescheduleBooking {
    repo;
    nixpendRepo;
    constructor(repo, nixpendRepo) {
        this.repo = repo;
        this.nixpendRepo = nixpendRepo;
    }
    async exec(bookingId, data) {
        const booking = await this.repo.findById(bookingId);
        if (!booking) {
            return { ok: false, error: 'Booking not found' };
        }
        if (booking.status == 'cancelled') {
            return { ok: false, error: "This Booking was cancelled" };
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
                bookingType: data.appointment_type,
                appointmentDate: new Date(data.appointment_date),
                appointmentTime: data.appointment_time,
                eventName: data.daily_practitioner_event,
                appointmentDuration: data.duration
            });
            console.log("Booking rescheduled:", updatedBooking);
            return { ok: true, booking: updatedBooking };
        }
        catch (error) {
            console.error("Exception during rescheduling:", error.message);
            return { ok: false, error: 'Exception occurred during rescheduling' };
        }
    }
}
