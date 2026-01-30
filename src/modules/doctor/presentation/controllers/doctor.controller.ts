import { BOOKING_REPO, DOCTOR_REPO, EXERCISE_REPO, PATIENT_REPO, SESSION_REPO } from "app/container.bindings.js";
import { Request, Response } from "express";
import { FindDoctorById } from "modules/doctor/application/use-cases/FindDoctorById.js";
import { FindDoctorByNixpendId } from "modules/doctor/application/use-cases/FindDoctorByNixpendId.js";
import { resolve } from "app/container.js";
import { GetCachedPractitioners } from "modules/doctor/application/use-cases/GetCachedDoctors.js";
import { GetDoctorBookings } from "modules/doctor/application/use-cases/GetDoctorBookings.js";
import { GetDoctorSessions } from "modules/doctor/application/use-cases/GetDoctorSessions.js";
import { GetPatientsByDoctorAndStatus } from "modules/doctor/application/use-cases/GetPatientsByDoctorAndStatus.js";
import { AssignExercisesToPatient } from "modules/doctor/application/use-cases/AssignExercisesToPatient.js";
import { GetAssignedExercises } from "modules/doctor/application/use-cases/GetAssignedExercises.js";

export async function assignExercisesToPatient(req: Request, res: Response) {
    const { doctorNixpendId, patientNixpendId, exerciseId, dueDate } = req.body;
    try {
        const uc = new AssignExercisesToPatient(resolve(DOCTOR_REPO));
        const result = await uc.exec(doctorNixpendId, patientNixpendId, exerciseId, dueDate ? new Date(dueDate) : undefined);
        if (!result.ok) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in assignExercisesToPatient controller:", (error as Error).message);
        return res.status(500).json({ ok: false, message: "Assign Exercises to Patient controller Internal server error" });
    }
}

export async function getAssignedExercises(req: Request, res: Response) {
    const { doctorNixpendId, patientNixpendId } = req.params;
    try {
        const uc = new GetAssignedExercises(resolve(DOCTOR_REPO));
        const result = await uc.exec(doctorNixpendId, patientNixpendId);
        if (!result.ok) {
            return res.status(404).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in getAssignedExercises controller:", (error as Error).message);
        return res.status(500).json({ ok: false, message: "Get Assigned Exercises controller Internal server error" });
    }
}

export async function findDoctorById(req: Request, res: Response) {
    const doctorId = req.params.id as string;
    try {
        const uc = new FindDoctorById(resolve(DOCTOR_REPO))
        const result = await uc.execute(doctorId);
        if (!result.ok) {
            return res.status(404).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in findDoctorById controller:", (error as Error).message);
        return res.status(500).json({ ok: false, message: "Find DoctorById controller Internal server error" });
    }
}

export async function findDoctors(req: Request, res: Response) {
    try {
        const { id, nixpendId } = req.query;

        if (id) {
            const uc = new FindDoctorById(resolve(DOCTOR_REPO));
            const result = await uc.execute(id as string);
            if (!result.ok) {
                return res.status(404).json(result);
            }
            return res.status(200).json(result);
        }

        if (nixpendId) {
            const uc = new FindDoctorByNixpendId(resolve(DOCTOR_REPO));
            const result = await uc.execute(nixpendId as string);
            if (!result.ok) {
                return res.status(404).json(result);
            }
            return res.status(200).json(result);
        }

        const uc = new GetCachedPractitioners(resolve(DOCTOR_REPO));
        const result = await uc.exec();

        if (!result.ok) {
            return res.status(404).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in findDoctors controller:", (error as Error).message);
        return res.status(500).json({ ok: false, message: "Find Doctors controller Internal server error" });
    }
}

export async function findDoctorByNixpendId(req: Request, res: Response) {
    const nixpendId = (req.params.nixpendId || req.query.nixpendId) as string;

    if (!nixpendId) {
        return res.status(400).json({ ok: false, error: "Nixpend ID is required" });
    }

    try {
        const uc = new FindDoctorByNixpendId(resolve(DOCTOR_REPO))
        const result = await uc.execute(nixpendId);
        if (!result.ok) {
            return res.status(404).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in findDoctorByNixpendId controller:", (error as Error).message);
        return res.status(500).json({ ok: false, message: "Find DoctorByNixpendId controller Internal server error" });
    }
}

export async function getDoctorBookings(req: Request, res: Response) {
    try {
        const { doctorId } = req.params;
        const { period, date } = req.query;
        const uc = new GetDoctorBookings(resolve(BOOKING_REPO), resolve(SESSION_REPO));
        const result = await uc.exec(doctorId, period ? period as 'day' | 'week' | 'month' : undefined, date ? new Date(date as string) : new Date());

        if (!result.ok) {
            return res.status(400).json(result);
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Error in getDoctorBookings controller:", (error as Error).message);
        res.status(500).json({ ok: false, error: 'Internal server error' });
    }
}

export async function getDoctorSessions(req: Request, res: Response) {
    try {
        const { doctorId } = req.params;
        const { period, date } = req.query;
        const uc = new GetDoctorSessions(resolve(BOOKING_REPO), resolve(SESSION_REPO));
        const result = await uc.exec(doctorId, period ? period as 'day' | 'week' | 'month' : undefined, date ? new Date(date as string) : new Date());

        if (!result.ok) {
            return res.status(400).json(result);
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Error in getDoctorSessions controller:", (error as Error).message);
        res.status(500).json({ ok: false, error: 'Internal server error' });
    }
}

export async function getPatients(req: Request, res: Response) {
    try {
        const { doctorId } = req.params;
        const { status } = req.query;
        const uc = new GetPatientsByDoctorAndStatus(resolve(BOOKING_REPO));
        const result = await uc.exec(doctorId, status as 'active' | 'inactive');
        if (!result.ok) {
            return res.status(400).json(result);
        }
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in getPatients controller:", (error as Error).message);
        res.status(500).json({ ok: false, error: 'Internal server error' });
    }
}