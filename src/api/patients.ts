import type { CreatePatientRequest, PatientFilters, PatientSummary, UpdatePatientRequest, User } from "../types";
import { api } from "./api";

export async function createPatient(data:CreatePatientRequest):Promise<User>{
    const response= await api.post<User>('/patients',data);
    return response.data

}
export async function getPatient(id:string):Promise<PatientSummary>{
    const response=await api.get<PatientSummary>(`/patients/${id}`)
    return response.data
}
export async function updatePatient(id:string,data:UpdatePatientRequest):Promise<User>{
    const response=await api.put<User>(`/patients/${id}`,data)
    return response.data
}
export async function deletePatient(id:string):Promise<void>{
    await api.delete(`/patients/${id}`)
}
export async function getPatients(filters:PatientFilters):Promise<PatientSummary[]>{
    const response=await api.get<PatientSummary[]>('/patients',{params:filters})
    return response.data
}