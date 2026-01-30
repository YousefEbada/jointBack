import { resolve } from "app/container.js";
import { NIXPEND_ADAPTER, PATIENT_REPO } from "app/container.bindings.js";
import { Request, Response } from "express";
import { FetchType, UpdateType } from "../domain/Nixpend.js";
import { GetPatient } from "../use-cases/GetPatient.js";
import { GetPractitioners } from "../use-cases/GetPractitioners.js";
import { RegisterPatient } from "../use-cases/RegisterPatient.js";
import { UpdatePatient } from "../use-cases/UpdatePatient.js";

export async function getPatient(req: Request, res: Response) {
    const { type, value } = req.query;
    const uc = new GetPatient(resolve(PATIENT_REPO), resolve(NIXPEND_ADAPTER));
    const result = await uc.exec(type as FetchType, value as string);
    if (result.ok) {
        res.status(200).json(result);
    } else {
        console.error("[getPatient] Error:", result.error);
        res.status(404).json({ error: result.error });
    }
}

export async function updatePatient (req: Request, res: Response) {
    const patientId = req.query.nixpendName as string;
    const updateData = req.body as UpdateType;
    const uc = new UpdatePatient(resolve(PATIENT_REPO), resolve(NIXPEND_ADAPTER));
    const result = await uc.exec(patientId, updateData);
    if (result.ok) {
        res.status(200).json(result);
    } else {
        console.error("[updatePatient] Error:", result.error);
        res.status(400).json({ error: result.error });
    }
}

export async function createPatient(req: Request, res: Response) {
    // const id = req.params.userId;
    const data = req.body;
    const uc = new RegisterPatient(resolve(PATIENT_REPO), resolve(NIXPEND_ADAPTER));
    const result = await uc.exec(data);
    if (result.ok) {
        res.status(201).json(result);
    } else {
        console.error("[createPatient] Error:", result.error);
        res.status(400).json({ error: result.error });
    }
}

// move it to doctor later
export async function getPractitioners(req: Request, res: Response) {
    const { branch, department } = req.query;
    const uc = new GetPractitioners(resolve(NIXPEND_ADAPTER));
    const result = await uc.exec(branch as any, department as any);
    if (result.ok) {
        res.status(200).json(result);
    } else {
        console.error("[getPractitioners] Error:", result.error);
        res.status(500).json({ error: result.error });
    }
}
