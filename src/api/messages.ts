import type { Message, SendMessageRequest } from "../types/message";
import { api } from "./api";

export async function getMessages(): Promise<Message[]> {
    const response = await api.get<Message[]>('/messages')
    return response.data
}
export async function sendMessage(data: SendMessageRequest): Promise<Message> {
    const response = await api.post<Message>('/messages', data)
    return response.data
}
export async function deleteMessage(id: string): Promise<void> {
   await api.delete(`/messages/${id}`)

}