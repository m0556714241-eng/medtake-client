import type { DaySummary, Dose, DoseFilters } from "../types"
import { api } from "./api"

export async function getDoses(filters:DoseFilters): Promise<Dose[]> {
    const response = await api.get<Dose[]>('/doses', { params: filters })
    return response.data
}
export async function getDosesSummary(filters:DoseFilters): Promise<DaySummary[]> {
    const response = await api.get<DaySummary[]>('/doses/summary', { params: filters })
    return response.data
}