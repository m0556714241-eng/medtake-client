import type { Prescription, PrescriptionFilters, PrescriptionFormValues, PrescriptionStatus } from "../types";
import { api } from "./api";

export async function getPrescriptions(filters: PrescriptionFilters): Promise<Prescription[]> {
    const response = await api.get<Prescription[]>('/prescriptions', { params: filters })
    return response.data
}
export async function getPrescription(id: string): Promise<Prescription> {
    const response = await api.get<Prescription>(`/prescriptions/${id}`)
    return response.data
}
export async function createPrescription(data: PrescriptionFormValues): Promise<Prescription> {
    const response = await api.post<Prescription>('/prescriptions', data)
    return response.data
}
export async function updatePrescription(id: string, data: PrescriptionFormValues): Promise<Prescription> {
    const response = await api.put<Prescription>(`/prescriptions/${id}`, data)
    return response.data
}
export async function changeStatus(id: string, status: PrescriptionStatus): Promise<Prescription> {
    const response = await api.patch<Prescription>(`/prescriptions/${id}/status`, { status })
    return response.data

}
export async function refillStock(id: string, quantity: number): Promise<Prescription> {
    const response = await api.post<Prescription>(`/prescriptions/${id}/refill`, { quantity })
    return response.data

}
export async function deletePrescription(id: string): Promise<void> {
    await api.delete(`/prescriptions/${id}`)
}