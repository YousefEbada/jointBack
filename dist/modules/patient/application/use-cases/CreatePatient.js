export class CreatePatient {
    patientRepo;
    nixpendAdapter;
    userRepo;
    constructor(patientRepo, nixpendAdapter, userRepo) {
        this.patientRepo = patientRepo;
        this.nixpendAdapter = nixpendAdapter;
        this.userRepo = userRepo;
    }
    async exec(userId, createData) {
        try {
            // First, check if patient already exists for this user
            const existingPatient = await this.patientRepo.getPatient(userId);
            console.log("Existing patient check:", existingPatient);
            if (existingPatient) {
                return { ok: false, error: "Patient already exists for this user" };
            }
            // Then, fetch user details
            const user = await this.userRepo.findById(userId);
            if (!user) {
                return { ok: false, error: "User not found" };
            }
            const { fullName, gender, nationality, phone, email } = user;
            let [firstName, ...lastName] = fullName.split(" ");
            let sex = gender;
            // check this in the frontend and the DB and frontend
            let mobile = phone?.replace('+', '').trim();
            console.log("Creating patient for user:", { firstName, lastName: lastName[0], nationality, sex, mobile, email });
            // Then, create patient in Nixpend
            const nixpendPatient = await this.nixpendAdapter.registerPatient({
                first_name: firstName,
                last_name: lastName[0],
                // Handle this from the frontend later
                nationality: nationality == 'Egyptian' ? 'Egypt' : nationality == 'Saudi' ? 'Saudi Arabia' : "France",
                mobile,
                sex
            });
            if (!nixpendPatient) {
                return { ok: false, error: "Failed to register patient in Nixpend" };
            }
            // Then, create patient in local DB with only essential fields
            const patientData = {
                userId: userId,
                nixpendId: nixpendPatient.name
            };
            console.log("CreatePatient.exec] Creating patient with data:", patientData);
            console.log("CreatePatient.exec] Additional createData:", createData);
            // Add optional fields only if they exist
            // if (createData && createData.medicalRecordNumber) patientData.medicalRecordNumber = createData.medicalRecordNumber;
            // if (createData && createData.insuranceId) patientData.insuranceId = createData.insuranceId;
            // if (createData && createData.bloodGroup) patientData.bloodGroup = createData.bloodGroup;
            // if (createData && createData.allergies?.length) patientData.allergies = createData.allergies;
            // if (createData && createData.medicalHistory?.length) patientData.medicalHistory = createData.medicalHistory;
            if (createData && createData.injuryDetails)
                patientData.injuryDetails = createData.injuryDetails;
            if (createData && createData.notes)
                patientData.notes = createData.notes;
            const newPatient = await this.patientRepo.createPatient(patientData);
            return { ok: true, patient: newPatient };
        }
        catch (error) {
            console.error("[CreatePatient.exec] Error:", error.message);
            return { ok: false, error: "Internal error" };
        }
    }
}
