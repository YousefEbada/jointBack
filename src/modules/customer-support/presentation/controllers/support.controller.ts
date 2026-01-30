import { SUPPORT_REPO } from "app/container.bindings.js";
import { resolve } from "app/container.js";
import { Request, Response } from "express";
import { CreateTicket } from "modules/customer-support/application/use-cases/CreateTicket.js";
import { DeleteTicket } from "modules/customer-support/application/use-cases/DeleteTicket.js";
import { GetTicketById } from "modules/customer-support/application/use-cases/GetTicketById.js";
import { GetTickets } from "modules/customer-support/application/use-cases/GetTickets.js";
import { GetTicketsByPatient } from "modules/customer-support/application/use-cases/GetTicketsByPatient.js";
import { UpdateTicket } from "modules/customer-support/application/use-cases/UpdateTicket.js";

export async function createSupportTicket(req: Request, res: Response) {
    try {
        const body = req.body;
        console.log("DEBUG SupportController received body:", JSON.stringify(body, null, 2));
        const uc = new CreateTicket(resolve(SUPPORT_REPO));
        const result = await uc.exec(body);
        if (!result.ok) {
            return res.status(400).json(result);
        }
        return res.status(201).json(result);
    } catch (error) {
        console.error("Error in createSupportTicket controller:", (error as Error).message);
        return res.status(500).json({ ok: false, message: 'Internal Server Error.' });
    }
}

export async function getAllSupportTickets(req: Request, res: Response) {
    try {
        const uc = new GetTickets(resolve(SUPPORT_REPO));
        const result = await uc.exec();
        if (!result.ok) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in getAllSupportTickets controller:", (error as Error).message);
        return res.status(500).json({ ok: false, message: 'Internal Server Error.' });
    }
}

export async function getSupportTicketsByPatient(req: Request, res: Response) {
    try {
        const patientId = req.params.patientId;
        const uc = new GetTicketsByPatient(resolve(SUPPORT_REPO));
        const result = await uc.execute(patientId);
        if (!result.ok) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in getSupportTicketsByPatient controller:", (error as Error).message);
        return res.status(500).json({ ok: false, message: 'Internal Server Error.' });
    }
}

export async function getSupportTicket(req: Request, res: Response) {
    try {
        const ticketId = req.params.ticketId;
        const uc = new GetTicketById(resolve(SUPPORT_REPO));
        const result = await uc.exec(ticketId);
        if (!result.ok) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in getSupportTicket controller:", (error as Error).message);
        return res.status(500).json({ ok: false, message: 'Internal Server Error.' });
    }
}

export async function updateSupportTicketStatus(req: Request, res: Response) {
    try {
        const { ticketId } = req.params;
        const { completed } = req.body;
        const uc = new UpdateTicket(resolve(SUPPORT_REPO));
        const result = await uc.exec(ticketId, completed);
        if (!result.ok) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in updateSupportTicketStatus controller:", (error as Error).message);
        return res.status(500).json({ ok: false, message: 'Internal Server Error.' });
    }
}

export async function deleteSupportTicket(req: Request, res: Response) {
    try {
        const { ticketId } = req.params;
        const uc = new DeleteTicket(resolve(SUPPORT_REPO));
        const result = await uc.exec(ticketId);
        if (!result.ok) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in deleteSupportTicket controller:", (error as Error).message);
        return res.status(500).json({ ok: false, message: 'Internal Server Error.' });
    }
}