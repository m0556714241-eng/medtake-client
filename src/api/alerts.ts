import type { LowStockAlert } from "../types";
import { api } from "./api";

export async function getLowStockAlerts():Promise<LowStockAlert[]>{
    const response=await api.get<LowStockAlert[]>('/alerts/low-stock')
    return response.data
}