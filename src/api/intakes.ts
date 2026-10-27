import type { IntakeLog, MarkIntakeRequest } from "../types";
import { api } from "./api";

export async function markIntake(data:MarkIntakeRequest):Promise<IntakeLog>{
   const response = await api.post<IntakeLog>('/intakes', data)
   return response.data
}
export async function unmarkIntake(intakeId: string): Promise<void> {
    await api.delete(`/intakes/${intakeId}`)
}