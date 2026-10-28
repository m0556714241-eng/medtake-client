export interface Message {
  id: string;
  patientId: string;
  patientName: string;
  text: string;
  createdAt: string;
}
export interface SendMessageRequest {
  text: string;
}