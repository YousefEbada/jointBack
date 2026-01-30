import { Request, Response } from 'express';
import { CreateBookingSchema, CalendarQuerySchema } from '../validators/booking.schemas.js';
import { resolve, token } from '../../../../app/container.js';
import { CreateBooking } from '../../application/use-cases/CreateBooking.js';
import { GetCalendar } from '../../application/use-cases/GetCalendar.js';
import { CancelBooking } from '../../application/use-cases/CancelBooking.js';
import { RescheduleBooking } from '../../application/use-cases/RescheduleBooking.js';
import { BookingRepoPort } from '../../application/ports/BookingRepoPort.js';
import { NixpendPort } from '../../../integration/ports/NixpendPorts.js';
import { GetAvailableSlots } from '../../application/use-cases/GetAvailableSlots.js';
import { BookType } from '../../../integration/domain/Nixpend.js';
import { DOCTOR_REPO, NIXPEND_ADAPTER, PATIENT_REPO, SESSION_REPO } from 'app/container.bindings.js';
import { FindBookingById } from '../../application/use-cases/FindBookingById.js';
import { UpdateBookingStatus } from '../../application/use-cases/UpdateBookingStatus.js';
import { GetAllBookings } from 'modules/booking/application/use-cases/GetAllBookings.js';
import { GetAllPatientBookings } from 'modules/booking/application/use-cases/GetAllPatientBookings.js';

const BOOKING_REPO = token<BookingRepoPort>('BOOKING_REPO');

export async function createBooking(req: Request, res: Response) {
  try {
    const input = CreateBookingSchema.parse(req.body);
    const uc = new CreateBooking(resolve(BOOKING_REPO), resolve(NIXPEND_ADAPTER), resolve(SESSION_REPO), resolve(PATIENT_REPO));

    // Transform schema fields to match BookType expected by Nixpend
    const bookData: BookType = {
      patient: input.patient,
      practitioner: input.practitioner,
      company: "Joint Clinic",
      department: input.department as BookType['department'],
      duration: input.duration,
      daily_practitioner_event: input.daily_practitioner_event,
      appointment_date: input.appointment_date,
      appointment_time: input.appointment_time,
      appointment_type: input.appointment_type,
      branch: input.branch as BookType['branch'],
    };

    const result = await uc.exec(bookData);

    if (!result.ok) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.log("===== createBooking ERROR: ", error);
    res.status(500).json({ ok: false, error: (error as any) || 'Create Booking internal server error' });
  }
};

export async function getAllBookings(req: Request, res: Response) {
  try {
    const uc = new GetAllBookings(resolve(BOOKING_REPO));
    const result = await uc.exec();
    if (!result.ok) {
      return res.status(404).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log("===== getAllBookings ERROR: ", error);
    res.status(500).json({ ok: false, error: (error as any) || 'Get All Bookings internal server error' });
  }
}

export async function getPatientBookings(req: Request, res: Response) {
  try {
    const { patientId } = req.params;
    const uc = new GetAllPatientBookings(resolve(BOOKING_REPO), resolve(PATIENT_REPO));
    const result = await uc.exec(patientId);
    if (!result.ok) {
      return res.status(404).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("===== getPatientBookings ERROR: ", error);
    res.status(500).json({ ok: false, error: (error as any) || 'Get Patient Bookings internal server error' });
  }
}

// export async function getCalendar(req: Request, res: Response) {
//   try {
//     const { doctorId, day } = CalendarQuerySchema.parse(req.query);
//     const targetDay = day || new Date();
//     const uc = new GetCalendar(resolve(BOOKING_REPO));
//     const items = await uc.exec(doctorId, targetDay);
//     res.json({ ok: true, data: items });
//   } catch (error) {
//     res.status(400).json({ ok: false, error: 'Invalid query parameters' });
//   }
// }

export async function cancelBooking(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const cancelData = req.body;
    const uc = new CancelBooking(resolve(BOOKING_REPO), resolve(NIXPEND_ADAPTER));
    const result = await uc.exec(id, cancelData);

    if (!result.ok) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);

  } catch (error) {
    console.log("===== cancelBooking ERROR: ", error);
    res.status(500).json({ ok: false, error: (error as any) || 'Cancel Booking internal server error' });
  }
}

export async function rescheduleBooking(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const rescheduleData = req.body;
    const uc = new RescheduleBooking(resolve(BOOKING_REPO), resolve(NIXPEND_ADAPTER));
    const result = await uc.exec(id, rescheduleData);

    if (!result.ok) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log("===== rescheduleBooking ERROR: ", error);
    res.status(500).json({ ok: false, error: (error as any) || 'Reschedule Booking internal server error' });
  }
}

// i should make this real time
export async function getAvailableSlots(req: Request, res: Response) {
  try {
    const { doctorId } = req.params;
    console.log("===== getAvailableSlots Controller =====");
    console.log("===== doctorId from params: ", doctorId);
    console.log("===== doctorId type: ", typeof doctorId);

    const uc = new GetAvailableSlots(resolve(NIXPEND_ADAPTER), resolve(DOCTOR_REPO));
    const result = await uc.exec(doctorId);

    // console.log("===== GetAvailableSlots result: ", JSON.stringify(result, null, 2));

    if (!result.ok) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("===== getAvailableSlots ERROR: ", error);
    res.status(500).json({ ok: false, error: (error as any) || 'Get Available Slots internal server error' });
  }
}

export async function getBookingById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const uc = new FindBookingById(resolve(BOOKING_REPO));
    const result = await uc.exec(id);

    if (!result.ok) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.log("===== getBookingById ERROR: ", error);
    res.status(500).json({ ok: false, error: (error as any) || 'Get Booking internal server error' });
  }
}

export async function updateBookingStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    // validate status from ZOD
    const { status } = req.body;
    const uc = new UpdateBookingStatus(resolve(BOOKING_REPO));
    const result = await uc.exec(id, status);
    if (!result.ok) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log("===== updateBookingStatus ERROR: ", error);
    res.status(500).json({ ok: false, error: (error as any) || 'Internal server error' });
  }
}
