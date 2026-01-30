import { DOCTOR_REPO, NIXPEND_ADAPTER } from "app/container.bindings.js";
import { SyncDoctorJob } from "./syncDoctors.job.js";
import { resolve } from "app/container.js"

export function StartJobs() {
    const doctorSyncJob = new SyncDoctorJob(resolve(NIXPEND_ADAPTER), resolve(DOCTOR_REPO));
    doctorSyncJob.schedule("*/10 * * * *"); // every 10 minutes

    // another jobs can be started here
}