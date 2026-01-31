import { TreatmentPlanSchema } from "../validators/treat.schemas.js";
import { CreateTreatmentPlan } from "../../../treatment-plan/application/use-cases/CreateTreatmentPlan.js";
import { resolve } from "../../../../app/container.js";
import { SESSION_REPO, TREATMENT_PLAN_REPO } from "../../../../app/container.bindings.js";
export async function createTreatmentPlan(req, res) {
    try {
        const treatmentPlanData = TreatmentPlanSchema.parse(req.body);
        const uc = new CreateTreatmentPlan(resolve(TREATMENT_PLAN_REPO), resolve(SESSION_REPO));
        const result = await uc.exec(treatmentPlanData);
        if (!result.ok) {
            return res.status(400).json(result);
        }
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error in createTreatmentPlan controller:", error.message);
        res.status(500).json({ ok: false, error: 'Internal server error' });
    }
}
export async function getAllTreatmentPlans(req, res) {
    console.log("getAllTreatmentPlans called");
}
export async function updateTreatmentPlan(req, res) {
    console.log("updateTreatmentPlan called");
}
export async function deleteTreatmentPlan(req, res) {
    console.log("updateTreatmentPlan called");
}
export async function getTreatmentPlanById(req, res) {
    console.log("updateTreatmentPlan called");
}
export async function getTreatmentPlansByPatient(req, res) {
    console.log("updateTreatmentPlan called");
}
export async function getTreatmentPlansByDoctor(req, res) {
    console.log("updateTreatmentPlan called");
}
export async function addSessionToTreatmentPlan(req, res) {
    console.log("updateTreatmentPlan called");
}
export async function getSessionsByTreatmentPlan(req, res) {
    console.log("updateTreatmentPlan called");
}
export async function removeSessionFromTreatmentPlan(req, res) {
    console.log("updateTreatmentPlan called");
}
