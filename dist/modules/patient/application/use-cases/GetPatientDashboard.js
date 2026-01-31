export class GetPatientDashboard {
    repo;
    treatmentPlanRepo;
    constructor(repo, treatmentPlanRepo) {
        this.repo = repo;
        this.treatmentPlanRepo = treatmentPlanRepo;
    }
    async exec(patientId) {
        try {
            // Get patient progress
            const progress = await this.getPatientProgress(patientId);
            if (!progress) {
                return {
                    ok: false,
                    data: {
                        hasActiveTreatment: false,
                        message: 'No active treatment plan found'
                    }
                };
            }
            // // Get upcoming sessions
            // const upcomingSessions = await this.repo.findUpcomingSessionsByPatient(patientId);
            // // Get recent completed sessions
            // const completedSessions = await this.repo.findCompletedSessionsByPatient(patientId);
            // const recentSessions = completedSessions.slice(0, 5); // Last 5 sessions
            return {
                ok: true,
                data: {
                    hasActiveTreatment: true,
                    progress,
                    // upcomingSessions,
                    // recentSessions,
                    summary: {
                        totalSessions: progress.totalSessions,
                        completedSessions: progress.completedSessions,
                        remainingSessions: progress.remainingSessions,
                        progressPercentage: Math.round(progress.progressPercentage),
                        nextSessionDate: progress.nextSession?.date,
                        treatmentStatus: progress.treatmentStatus
                    }
                }
            };
        }
        catch (error) {
            console.error('Error getting patient dashboard:', error);
            return { ok: false, error: 'Failed to get patient dashboard data' };
        }
    }
    async getPatientProgress(patientId) {
        const treatmentPlan = await this.treatmentPlanRepo.findActiveTreatmentPlanByPatient(patientId);
        if (!treatmentPlan)
            return null;
        const completedSessions = await this.repo.getCompletedSessionsByTreatmentPlan(patientId, treatmentPlan._id);
        const nextSession = await this.repo.findNextUpcomingSessionByPatientAndTreatmentPlan(patientId, treatmentPlan._id);
        const weekNumber = Math.ceil((completedSessions + 1) / treatmentPlan.sessionsPerWeek);
        const progress = {
            patientId,
            totalSessions: treatmentPlan.totalSessions,
            completedSessions,
            remainingSessions: treatmentPlan.totalSessions - completedSessions,
            progressPercentage: (completedSessions / treatmentPlan.totalSessions) * 100,
            weekNumber,
            treatmentStatus: treatmentPlan.status
        };
        if (nextSession) {
            progress.nextSession = {
                date: nextSession.scheduledDate || new Date(),
                time: nextSession.scheduledDate?.toISOString().split('T')[1]?.substring(0, 8) || '00:00:00',
                doctorName: nextSession.doctorId?.name || 'Unknown'
            };
        }
        return progress;
    }
}
