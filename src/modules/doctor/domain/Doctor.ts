export interface PractitionerCompany {
  company: string;
  branch: string;
}

export interface Doctor {
  _id?: string; // MongoDB ObjectId as string
  nixpendId: string; // maps to Nixpend "name" field
  practitionerName: string; // maps to "practitioner_name"
  fullNameArabic?: string; // maps to "full_name_arabic"
  gender: 'Male' | 'Female' | string;
  status: string; // Active / Inactive
  practitionerType?: string; // Practitioner / Specialist etc.
  department?: string;
  designation?: string | null;
  practitionerCompany: PractitionerCompany[];
  priceList?: string;
}
