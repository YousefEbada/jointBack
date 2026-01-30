import { SessionRepoPort } from "../ports/SessionRepoPort.js";

export class GetSessionByTreatmentPlan {
    constructor(private sessionRepo: SessionRepoPort) {}
    async exec(patientId: string, treatmentPlanId: string) {
        try {
            const sessions = await this.sessionRepo.getSessionsByTreatmentPlan(patientId, treatmentPlanId)
            if(!sessions) {
                return {ok: false, error: 'No sessions has found for this treatment and patient'}
            }
            return {ok: true, sessions}
        } catch (error) {
            return {ok: false, error: "Something went wrong"}
        }
    }
}