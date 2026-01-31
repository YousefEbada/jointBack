import cron from "node-cron";
export class SyncDoctorJob {
    nixpendAdapter;
    doctorRepo;
    constructor(nixpendAdapter, doctorRepo) {
        this.nixpendAdapter = nixpendAdapter;
        this.doctorRepo = doctorRepo;
    }
    async run() {
        try {
            console.log("[SyncDoctorsJob] Starting doctor sync...");
            // Fetch all practitioners from Nixpend
            const practitioners = await this.nixpendAdapter.getPractitioners();
            if (!practitioners || practitioners.length === 0) {
                console.log("[SyncDoctorsJob] No practitioners found.");
                return;
            }
            const modifiedPracs = practitioners.map((prac) => {
                return {
                    nixpendId: prac.name,
                    practitionerName: prac.practitioner_name,
                    fullNameArabic: prac.full_name_arabic,
                    gender: prac.gender,
                    status: prac.status,
                    practitionerType: prac.practitioner_type,
                    department: prac.department,
                    designation: prac.designation,
                    practitionerCompany: prac.practitioner_company,
                    priceList: prac.price_list
                };
            });
            // Clear existing cached doctors and save the new ones
            await this.doctorRepo.clear();
            await this.doctorRepo.saveMany(modifiedPracs);
            console.log(`[SyncDoctorsJob] Synced ${practitioners.length} doctors successfully.`);
        }
        catch (err) {
            console.error("[SyncDoctorsJob] Error syncing doctors:", err.message);
        }
    }
    schedule(expression = "*/10 * * * *") {
        // Schedule the job to run every day at 2 AM
        // or
        // Schedule the job based on the provided cron expression every 10 minutes
        cron.schedule(expression, () => {
            this.run();
        });
        console.log(`[SyncDoctorsJob] Scheduled to run every 10 minutes.`);
    }
}
