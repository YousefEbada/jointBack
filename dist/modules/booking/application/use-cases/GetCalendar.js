export class GetCalendar {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async exec(doctorId, day) {
        return this.repo.findBookingsByDoctorAndDay(doctorId, day);
    }
}
