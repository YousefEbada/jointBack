import { resolve } from "app/container.js";
import { NIXPEND_ADAPTER, PATIENT_REPO, SESSION_REPO, TREATMENT_PLAN_REPO, USER_AUTH_REPO } from "app/container.bindings.js";
import { Request, Response } from "express";
import { UpdateType } from "modules/integration/domain/Nixpend.js";
import { CreatePatient } from "modules/patient/application/use-cases/CreatePatient.js";
import { GetPatient } from "modules/patient/application/use-cases/GetPatient.js";
import { GetPatientByUser } from "modules/patient/application/use-cases/GetPatientByUser.js";
import { GetPatientDashboard } from "modules/patient/application/use-cases/GetPatientDashboard.js";
import { UpdatePatient } from "modules/patient/application/use-cases/UpdatePatient.js";
import { GetAllPatients } from "modules/patient/application/use-cases/GetAllPatients.js";

export async function getPatientById(req: Request, res: Response) {
    const { patientId } = req.params;
    console.log("Getting patient for patientId:", patientId);
    try {
        const uc = new GetPatient(resolve(PATIENT_REPO));
        const result = await uc.exec(patientId as string);
        if (result.ok) {
            res.status(200).json(result);
        } else {
            console.error("[getPatient] Error:", result.error);
            res.status(404).json({ ok: false, error: result.error });
        }
    } catch (error) {
        console.error("[getPatient] There is an error in the patient controller", error);
        res.status(500).json({ ok: false, error: "Something Went Wrong" });
    }
}

export async function getAllPatients(req: Request, res: Response) {
    try {
        const uc = new GetAllPatients(resolve(PATIENT_REPO));
        const result = await uc.exec();
        if (!result.ok) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("[getAllPatients] There is an error in the patient controller", error);
        return res.status(500).json({ ok: false, error: "Something Went Wrong" });
    }
}

export async function getPatientByUserId(req: Request, res: Response) {
    const userId = req.params.userId;
    try {
        const uc = new GetPatientByUser(resolve(PATIENT_REPO));
        const result = await uc.exec(userId);
        if (result.ok) {
            res.status(200).json(result);
        } else {
            console.error("[getPatient] Error:", result.error);
            res.status(404).json(result);
        }
    } catch (error) {
        console.error("[getPatient] There is an error in the patient controller", error);
        res.status(500).json({ ok: false, error: "Something Went Wrong" });
    }
}

export async function getPatientDashboard(req: Request, res: Response) {
    const patientId = req.params.patientId;
    try {
        const uc = new GetPatientDashboard(resolve(SESSION_REPO), resolve(TREATMENT_PLAN_REPO));
        const result = await uc.exec(patientId);
        if (result.ok) {
            res.status(200).json(result);
        } else {
            console.error("[getPatientDashboard] Error:", result.error);
            res.status(404).json(result);
        }
    } catch (error) {
        console.error("[getPatientDashboard] There is an error in the patient controller", error);
        res.status(500).json({ ok: false, error: "Something Went Wrong" });
    }
}

export async function updatePatient(req: Request, res: Response) {
    const { patientId } = req.params;
    const updateData = req.body as UpdateType;
    const uc = new UpdatePatient(resolve(PATIENT_REPO), resolve(USER_AUTH_REPO), resolve(NIXPEND_ADAPTER));
    const result = await uc.exec(patientId, updateData);
    if (result.ok) {
        res.status(200).json(result);
    } else {
        console.error("[updatePatient] Error:", result.error);
        res.status(400).json({ error: result.error });
    }
}

export async function createPatient(req: Request, res: Response) {
    const { userId, injuryDetails } = req.body;
    const uc = new CreatePatient(resolve(PATIENT_REPO), resolve(NIXPEND_ADAPTER), resolve(USER_AUTH_REPO));
    try {
        const result = await uc.exec(userId, {injuryDetails});
        if (!result.ok) {
            return res.status(400).json(result);
        }
        return res.status(201).json(result);
    } catch (error) {
        console.error("[createPatient] There is an error in the patient controller", error);
        return res.status(500).json({ ok: false, error: "Something Went Wrong" });
    }
}