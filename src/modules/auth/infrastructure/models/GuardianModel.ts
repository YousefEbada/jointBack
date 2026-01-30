import mongoose, { Schema } from "mongoose";

const GuardianSchema = new Schema({
    guardianName: { type: String, required: false },
    guardianEmail: { type: String, required: false },
    guardianPhone: { type: String, required: false },
    guardianBloodType: { type: String, required: false },
    patientCategory: { type: String, required: false },

    // add from me 
    guardianRelation: { type: String, required: false },

    guardianIdentifier: { type: String, required: false },
    guardianIdentifierType: {
        type: String,
        //   enum: ['nid', 'iqama'],
        required: false
    },
});

export const GuardianModel = mongoose.model('Guardian', GuardianSchema);