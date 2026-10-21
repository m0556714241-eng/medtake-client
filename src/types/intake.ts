// רשומת נטילה – נשמרת במסד רק כשהמטופל מסמן "נלקח"
export interface IntakeLog {
  id: string;
  prescriptionId: string;
  patientId: string;
  scheduledAt: string; // ייחודי יחד עם prescriptionId
  takenAt: string;
  note: string | null;
}

// גוף הבקשה לסימון "נלקח"
export interface MarkIntakeRequest {
  prescriptionId: string;
  scheduledAt: string;
  note?: string;
}
