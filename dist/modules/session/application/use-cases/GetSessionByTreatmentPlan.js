export class GetSessionByTreatmentPlan {
    sessionRepo;
    constructor(sessionRepo) {
        this.sessionRepo = sessionRepo;
    }
    async exec(patientId, treatmentPlanId) {
        try {
            const sessions = await this.sessionRepo.getSessionsByTreatmentPlan(patientId, treatmentPlanId);
            if (!sessions) {
                return { ok: false, error: 'No sessions has found for this treatment and patient' };
            }
            return { ok: true, sessions };
        }
        catch (error) {
            return { ok: false, error: "Something went wrong" };
        }
    }
}
