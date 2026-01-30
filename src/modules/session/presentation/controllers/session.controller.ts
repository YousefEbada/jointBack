import { resolve } from "app/container.js";
import { SESSION_REPO } from "app/container.bindings.js";
import { Request, Response } from "express";
import { GetSessionByTreatmentPlan } from "modules/session/application/use-cases/GetSessionByTreatmentPlan.js";

export async function getSessionsByTreatmentPlan(req: Request, res: Response) {
  const { patientId, treatmentPlanId } = req.params

  try {
    const uc = new GetSessionByTreatmentPlan(resolve(SESSION_REPO))
    const result = await uc.exec(patientId, treatmentPlanId)
    if (!result.ok) {
      return res.status(404).json(result)
    }
    return res.status(200).json(result)
  } catch (error) {
    console.error("[Error getSessionByTreatment] There is an error in the session controller")
    return res.status(500).json({ok: false, error: "Something Went Wrong"})
  }
}