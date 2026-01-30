import { NixpendPort } from '../ports/NixpendPorts.js';
import { AvailableSlotReturnType, AvailableSlotType, BookType, BranchType, CancelType, DepartmentType, FetchType, RegisterType, RescheduleType, UpdateType } from "../domain/Nixpend.js";
import { env } from 'config/env.js';

export const nixpendAdapter: NixpendPort = {
  // find patient by type and value
  async findPatient(type: FetchType, value: string) {
    let data = await fetch(`${env.NIXPEND_API_URL}/nis/patient?${type}=${value}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': env.NIXPEND_TOKEN
      }
    })
      .then(res => res.json());
    if (data && data.length > 0) {
      console.log("\n======= Found Patient Data:", data);
      return data[0];
    }
    console.log("\n======= Found Patient Data: &&&&^ No data found", data);
    return null;
  },

  // register patient
  async registerPatient(value: RegisterType) {
    const url = `${env.NIXPEND_API_URL}/nis/patient`;
    const headers = {
      'Content-Type': 'application/json',
      'token': env.NIXPEND_TOKEN
    };

    console.log("\n======= [Nixpend] Registering patient =======");
    console.log("[Nixpend] URL:", url);
    console.log("[Nixpend] Token (first 20 chars):", env.NIXPEND_TOKEN?.substring(0, 20) + "...");
    console.log("[Nixpend] Request body:", JSON.stringify(value, null, 2));

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(value)
      });

      const data = await response.json();
      console.log("[Nixpend] HTTP Status:", response.status);
      console.log("[Nixpend] Response:", JSON.stringify(data, null, 2));

      if (data.status === 200) {
        console.log("[Nixpend] SUCCESS - Patient registered");
        return data.data;
      }

      console.log("[Nixpend] FAILED - Response status not 200");
      return null;
    } catch (error: any) {
      console.error("[Nixpend] EXCEPTION:", error.message);
      return null;
    }
  },

  // update patient
  async updatePatient(patient_id: string, value: UpdateType) {
    let data = await fetch(`${env.NIXPEND_API_URL}/nis/patient/${patient_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'token': env.NIXPEND_TOKEN
      },
      body: JSON.stringify(value)
    })
      .then(res => res.json()
      )
    // put the response data in the return type
    if (data.response.status === 200) {
      console.log("\n======= Update Patient Data:", data);
      return data.response.data;
    }
    console.log("\n======= Update Patient Data: &&&&^ No data found", data);
    return null;
  },

  // get practitioners by branch and department
  async getPractitioners(branch?: BranchType, department?: DepartmentType) {
    let data;
    let properties = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': env.NIXPEND_TOKEN
      }
    }
    if (!branch && !department) {
      data = await fetch(`${env.NIXPEND_API_URL}/nis/external/practitioner`, properties)
        .then(res => res.json());
    } else if (branch && !department) {
      data = await fetch(`${env.NIXPEND_API_URL}/nis/external/practitioner?branch=${branch}`, properties)
        .then(res => res.json());
    } else if (!branch && department) {
      data = await fetch(`${env.NIXPEND_API_URL}/nis/external/practitioner?department=${department}`, properties)
        .then(res => res.json());
    } else {
      data = await fetch(`${env.NIXPEND_API_URL}/nis/external/practitioner?branch=${branch}&department=${department}`, properties)
        .then(res => res.json());
    }
    if (data && data.length > 0) {
      console.log("\n======= Practitioners Data:", data.length);
      return data;
    }
    console.log("\n\n======= Practitioners Data: &&&&^ No data found", data, "\n\n");
    return null;
  },

  // book appointment
  // Don't forget the token in the header if needed
  async bookAppointment(value: BookType) {
    let data = await fetch(`${env.NIXPEND_API_URL}/nis/external/appointment-booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': env.NIXPEND_TOKEN
      },
      body: JSON.stringify(value)
    })
      .then(res => res.json()
      )
    if (typeof data.response.appointment_id === 'string') {
      console.log("\n\n======= The data is String:", data, "\n\n");
      return data.response
    }
    console.log("\n\n========= The data:", data, "\n\n");
    return data.response;
  },

  // get available slots
  async getAvailableSlots(practitionerId, company = 'Joint Clinic', fromDate, toDate) {
    let data = await fetch(`${env.NIXPEND_API_URL}/nis/external/available_slots?practitioner=${practitionerId}&company=${company} ${(fromDate ? `&from_date=${fromDate}` : '')} ${(toDate ? `&to_date=${toDate}` : '')}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': env.NIXPEND_TOKEN
        }
      }
    )
      .then(res => res.json());
    console.log("\n======= Available Slots Data:", data.response.message.length);
    if (data && data.response.message.length > 0) {
      return { data: data.response.message };
    }
    return { data: [] };
  },

  // reschedule appointment
  async rescheduleAppointment(appointment_id: string, appointment_details: RescheduleType) {
    console.log("\n\n========= Reschedule Appointment Details:", appointment_details, "\n\n");
    console.log("\n\n========= Reschedule Appointment ID:", appointment_id, "\n\n");
    let data = await fetch(`${env.NIXPEND_API_URL}/nis/external/reschedule_appointment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': env.NIXPEND_TOKEN
      },
      body: JSON.stringify({ appointment_id, ...appointment_details, service_unit: "" })
    })
      .then(res => res.json()
      )
    console.log("\n\n========= Reschedule Appointment Data:", data, "\n\n");
    if (data && data.appointment_id) {
      return data;
    }
    return null;
  },

  // cancel appointment
  async cancelAppointment(value: CancelType) {
    let data = await fetch(`${env.NIXPEND_API_URL}/nis/external/cancel_appointment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': env.NIXPEND_TOKEN
      },
      body: JSON.stringify(value)
    })
      .then(res => res.json()
      )
    console.log("\n\n========= Cancel Appointment Data:", data, "\n\n");
    if (data && data.response.message.status === 'cancelled') {
      return data.response.message;
    }
    return null;
  },
  // async ivrConfirmAppointment(confirm: '0' | '1' | '2', name: string) { return false; },
  // async ivrGetPatientAppointment(after, branch) {
  //   return { data: [] };
  // },
};
