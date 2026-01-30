import { SessionRepoPort } from "modules/session/application/ports/SessionRepoPort.js";
import { TreatmentRepoPort } from "../ports/TreatmentRepoPort.js";
import { TreatmentPlan } from "modules/treatment-plan/domain/TreatmentPlan.js";

type CreateTreatmentPlanResult = {
  ok: boolean,
  newPlan?: TreatmentPlan,
  error?: string
}

export class CreateTreatmentPlan {
  constructor(
    private treatmentRepo: TreatmentRepoPort,
    private sessionRepo: SessionRepoPort
  ) {}

  async exec(
    planData: Omit<TreatmentPlan, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<CreateTreatmentPlanResult> {

    // can patient have multiple active plans?

    // const existingPlan =
    //   await this.treatmentRepo.findActiveTreatmentPlanByPatient(planData.patientId);

    // if (existingPlan) {
    //   throw new Error('An active treatment plan already exists for this patient.');
    // }

    
    const tx = await this.sessionRepo.startTransaction();

    try {
      const newPlan = await this.treatmentRepo.createTreatmentPlan(
        planData,
        { tx: tx.session }
      );

      const sessions = Array.from(
        { length: planData.totalSessions },
        (_, index) => {
          const sessionNumber = index + 1;
          const weekNumber = Math.ceil(
            sessionNumber / planData.sessionsPerWeek
          );

          return {
            treatmentPlanId: newPlan._id,
            patientId: planData.patientId,
            doctorId: planData.doctorId,
            sessionNumber,
            weekNumber,
            status: 'pending'
          };
        }
      );

      await this.sessionRepo.createSessionsBatch(
        sessions as any,
        { tx: tx.session }
      );

      await tx.commit();

      return {ok: true, newPlan};

    } catch (error) {
      await tx.abort();
      console.error('Error creating treatment plan:', (error as Error).message);
      return {ok: false, error: (error as Error).message};
    }
  }
}
