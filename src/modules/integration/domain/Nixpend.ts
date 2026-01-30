export type RegisterType = {
  first_name: string,
  last_name: string,
  nationality: string | undefined,
  mobile: string | undefined,
  sex: string
  middle_name?: string,
  patient_name?: string,
  dob?: string,
  verified?: number,
  first_name_a?: string,
  middle_name_a?: string,
  last_name_a?: string,
  full_name_in_arabic?: string,
  hijri_date_of_birth?: string,
  nid_or_iqama_id?: string,
  country?: string,
  occupation?: string,
  id_type?: string,
  patient_source?: string,
  second_mobile_number?: string,
  marital_status_2?: string,
  city?: string,
  address?: string,
  email?: string,
  speaking_language?: string,
  patient_category?: string,
  patient_religion?: string,
  blood_group?: string
};

type Occupation =
  "Unknown" |
  "Others" |
  "Unemployed" |
  "Oil Industries" |
  "Student" |
  "Skilled Worker" |
  "Military" |
  "Medical Field" |
  "Marine" |
  "Housewife" |
  "Education" |
  "Business" |
  "Agriculture" |
  "Administration"

export type UpdateType = {
  occupation?: Occupation,
  email?: string,
  speaking_language?: string,
  country?: string,
  city?: string,
  address?: string,
  marital_status_2?: 'Single' | 'Married' | 'Divorced' | 'Widow',
  mobile?: string,
  second_mobile_number?: string
}

export type BookType = {
  practitioner: string,
  appointment_type: string,
  department: DepartmentType,
  duration: number,
  daily_practitioner_event: string,
  appointment_date: string,
  appointment_time: string,
  patient: string,
  company: "Joint Clinic"
  branch?: BranchType,
  package_service_item?: string,
  package_subscription?: string,
  package_item_id?: string,
  service_unit?: string,
  actual_duration?: string
};

export type CancelType = {
  appointment_id: string,
  cancellation_source: string,
  cancellation_date: string,
  cancellation_reason: string,
  cancelled_by: string
};

export type DepartmentType =
  "Physiotherapy" |
  "Occupational Therapy" |
  "Nutrition Therapy" |
  "Orthotics & Prosthetics" |
  "others";


// i will check later
export type AvailableSlotType = {
  appointment_type_appointment: string | null,
  patient_confirmed: number | null,
  no_reply: number | null,
  patient_name: string | null,
  status: string | null,
  event_name: string | null,
  present: number | null,
  block_start: string | null,
  block_end: string | null,
  block_event_id: string | null,
  block_event_type: string | null,
  block_event_color: string | null,
  end: string | null,
  start: string | null,
  is_locked: number | null,
  appointment_count: number | null,
  event_capacity: number | null,
  color: string | null,
  title: string | null,
  practitioner: string | null,
  practitioner_name: string | null,
  company: "Joint Clinic" | string | null,
  branch: BranchType | null,
  slot_duration: number | null,
  department: DepartmentType | null,
  service_unit: string | null,
  appointment_service_unit: string | null,
  appointment_name: string | null,
  appointment_desk_comment: string | null,
  price_list: string | null,
  appointment_type: string | null
}

export type AvailableSlotReturnType = {
  data: AvailableSlotType[]
}

export type RescheduleType = {
    practitioner: string,
    department: DepartmentType,
    company: string,
    appointment_type: string,
    // "mm-dd-yyyy"
    appointment_date: string,
    // "HH:MM"
    appointment_time: string,
    daily_practitioner_event: string,
    service_unit?: string,
    duration: number,
    actual_duration: number
  }

export type BranchType = "Alaqiq" | "King Salman" | "others"

export type FetchType = 'nid_or_iqama_id' | 'mobile';