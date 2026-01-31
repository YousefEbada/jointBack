import { BookingModel } from '../models/BookingModel.js';
import { startOfDay, endOfDay } from '../../../../shared/utils/date.js';
export const BookingRepoMongo = {
    async book(b, options) {
        console.log("[BookingRepoMongo.book] Creating booking:", b);
        const doc = await BookingModel.create(b);
        console.log("[BookingRepoMongo.book] Booking created:", doc);
        return doc.toObject();
    },
    async getAllBookings() {
        const docs = await BookingModel.aggregate([
            { $lookup: {
                    from: "patients",
                    localField: "patientNixpendId",
                    foreignField: "nixpendId",
                    as: "patient"
                } },
            { $unwind: { path: "$patient", preserveNullAndEmptyArrays: true } },
            { $lookup: {
                    from: "users",
                    localField: "patient.userId",
                    foreignField: "_id",
                    as: "user"
                } },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            { $addFields: {
                    patientName: "$user.fullName"
                } }
        ]);
        return docs;
    },
    async existsOverlap(doctorId, start, end) {
        const exists = await BookingModel.exists({ doctorId, slotStart: { $lt: end }, slotEnd: { $gt: start } });
        return !!exists;
    },
    async setStatus(id, status) {
        await BookingModel.updateOne({ _id: id }, { $set: { status, updatedAt: new Date() } });
    },
    async cancel(b) {
        await BookingModel.updateOne({ _id: b._id }, { $set: { status: 'cancelled', updatedAt: new Date() } });
        return true;
    },
    async reschedule(b) {
        const doc = await BookingModel.findByIdAndUpdate(b._id, { ...b, status: 'rescheduled', updatedAt: new Date() }, { new: true }).lean();
        return doc;
    },
    async findById(id) {
        const docs = await BookingModel.aggregate([
            { $match: { _id: require('mongodb').ObjectId.isValid(id) ? new (require('mongodb').ObjectId)(id) : id } },
            { $lookup: {
                    from: "patients",
                    localField: "patientNixpendId",
                    foreignField: "nixpendId",
                    as: "patient"
                } },
            { $unwind: { path: "$patient", preserveNullAndEmptyArrays: true } },
            { $lookup: {
                    from: "users",
                    localField: "patient.userId",
                    foreignField: "_id",
                    as: "user"
                } },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            { $addFields: {
                    patientName: "$user.fullName"
                } },
            { $limit: 1 }
        ]);
        if (!docs || docs.length === 0) {
            return null;
        }
        return docs[0];
    },
    async findBookingsByPatient(patientId) {
        const docs = await BookingModel.aggregate([
            { $match: { patientNixpendId: patientId } },
            { $lookup: {
                    from: "patients",
                    localField: "patientNixpendId",
                    foreignField: "nixpendId",
                    as: "patient"
                } },
            { $unwind: { path: "$patient", preserveNullAndEmptyArrays: true } },
            { $lookup: {
                    from: "users",
                    localField: "patient.userId",
                    foreignField: "_id",
                    as: "user"
                } },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            { $addFields: {
                    patientName: "$user.fullName"
                } }
        ]);
        return docs;
    },
    // // I did that to get the active patients related to a specific doctor
    // but how can i get inactive patients?
    // this one will returns the patient related to doctors 
    // but also will return the active patients only
    // i should see how to return the inactive patients and may relate it with sessions
    async findPatientsByDoctorAndStatus(doctorId, status) {
        const docs = await BookingModel.aggregate([
            { $match: { doctorId, status } },
            { $group: { _id: '$patientId' } },
            { $lookup: {
                    from: "patients",
                    localField: "_id",
                    foreignField: "_id",
                    as: "patient"
                } },
            { $unwind: "$patient" },
            { $lookup: {
                    from: "users",
                    localField: "patient.userId",
                    foreignField: "_id",
                    as: "user"
                } },
            { $unwind: "$user" },
            {
                $project: {
                    _id: "$_id",
                    name: "$user.fullName",
                    injury: "$patient.injuryDetails.affectedArea",
                    status: "$patient.status"
                }
            }
        ]);
        return docs;
    },
    async findBookingsByDoctor(doctorId) {
        const docs = await BookingModel.aggregate([
            { $match: { doctorNixpendId: doctorId } },
            { $lookup: {
                    from: "patients",
                    localField: "patientNixpendId",
                    foreignField: "nixpendId",
                    as: "patient"
                } },
            { $unwind: { path: "$patient", preserveNullAndEmptyArrays: true } },
            { $lookup: {
                    from: "users",
                    localField: "patient.userId",
                    foreignField: "_id",
                    as: "user"
                } },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            { $addFields: {
                    patientName: "$user.fullName"
                } }
        ]);
        return docs;
    },
    async findBookingsByDoctorAndDay(doctorId, day) {
        const docs = await BookingModel.aggregate([
            { $match: { doctorNixpendId: doctorId, slotStart: { $gte: startOfDay(day) }, slotEnd: { $lte: endOfDay(day) } } },
            { $lookup: {
                    from: "patients",
                    localField: "patientNixpendId",
                    foreignField: "nixpendId",
                    as: "patient"
                } },
            { $unwind: { path: "$patient", preserveNullAndEmptyArrays: true } },
            { $lookup: {
                    from: "users",
                    localField: "patient.userId",
                    foreignField: "_id",
                    as: "user"
                } },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            { $addFields: {
                    patientName: "$user.fullName"
                } }
        ]);
        return docs;
    },
    async findBookingsByDoctorAndWeek(doctorId, weekStart) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        const docs = await BookingModel.aggregate([
            { $match: {
                    doctorNixpendId: doctorId,
                    appointmentDate: { $gte: weekStart, $lt: weekEnd }
                } },
            { $lookup: {
                    from: "patients",
                    localField: "patientNixpendId",
                    foreignField: "nixpendId",
                    as: "patient"
                } },
            { $unwind: { path: "$patient", preserveNullAndEmptyArrays: true } },
            { $lookup: {
                    from: "users",
                    localField: "patient.userId",
                    foreignField: "_id",
                    as: "user"
                } },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            { $addFields: {
                    patientName: "$user.fullName"
                } }
        ]);
        return docs;
    },
    async findBookingsByDoctorAndMonth(doctorId, monthStart) {
        const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
        const docs = await BookingModel.aggregate([
            { $match: {
                    doctorNixpendId: doctorId,
                    appointmentDate: { $gte: monthStart, $lte: monthEnd }
                } },
            { $lookup: {
                    from: "patients",
                    localField: "patientNixpendId",
                    foreignField: "nixpendId",
                    as: "patient"
                } },
            { $unwind: { path: "$patient", preserveNullAndEmptyArrays: true } },
            { $lookup: {
                    from: "users",
                    localField: "patient.userId",
                    foreignField: "_id",
                    as: "user"
                } },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            { $addFields: {
                    patientName: "$user.fullName"
                } }
        ]);
        return docs;
    }
};
