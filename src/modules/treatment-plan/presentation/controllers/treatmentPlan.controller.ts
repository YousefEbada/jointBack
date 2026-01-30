import { Request, Response } from "express";
import { TreatmentPlanSchema } from "../validators/treat.schemas.js";
import { CreateTreatmentPlan } from "modules/treatment-plan/application/use-cases/CreateTreatmentPlan.js";
import { resolve } from "app/container.js";
import { SESSION_REPO, TREATMENT_PLAN_REPO } from "app/container.bindings.js";

export async function createTreatmentPlan(req: Request, res: Response) {
    try {
        const treatmentPlanData = TreatmentPlanSchema.parse(req.body);
        const uc = new CreateTreatmentPlan(resolve(TREATMENT_PLAN_REPO), resolve(SESSION_REPO));
        const result = await uc.exec(treatmentPlanData as any);
        if(!result.ok) {
            return res.status(400).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in createTreatmentPlan controller:", (error as Error).message);
        res.status(500).json({ ok: false, error: 'Internal server error' });
    }
}

export async function getAllTreatmentPlans(req: Request, res: Response) {
    console.log("getAllTreatmentPlans called");
}

export async function updateTreatmentPlan(req: Request, res: Response) {
    console.log("updateTreatmentPlan called");
}

export async function deleteTreatmentPlan(req: Request, res: Response) {
    console.log("updateTreatmentPlan called");
}

export async function getTreatmentPlanById(req: Request, res: Response) {
    console.log("updateTreatmentPlan called");
}

export async function getTreatmentPlansByPatient(req: Request, res: Response) {
    console.log("updateTreatmentPlan called");
}

export async function getTreatmentPlansByDoctor(req: Request, res: Response) {
    console.log("updateTreatmentPlan called");
}

export async function addSessionToTreatmentPlan(req: Request, res: Response) {
    console.log("updateTreatmentPlan called");
}

export async function getSessionsByTreatmentPlan(req: Request, res: Response) {
    console.log("updateTreatmentPlan called");
}

export async function removeSessionFromTreatmentPlan(req: Request, res: Response) {
    console.log("updateTreatmentPlan called");
}