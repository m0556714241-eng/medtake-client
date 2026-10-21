import type { PrescriptionForm } from './prescription';

// מנה = מופע אחד של מרשם ביום ובשעה מסוימים. מחושבת בשרת, לא נשמרת במסד.
export type DoseStatus = 'pending' | 'taken' | 'missed';

export interface Dose {
  prescriptionId: string;
  drugName: string;
  dosage: string;
  form: PrescriptionForm;
  unitsPerDose: number;
  scheduledAt: string;
  status: DoseStatus;
  takenAt: string | null;
  intakeId: string | null; // קיים רק אם סומן – משמש לביטול סימון
  isLowStock: boolean;
}

// סיכום של יום אחד – לכרטיס בתצוגה השבועית
export interface DaySummary {
  date: string; // YYYY-MM-DD
  total: number;
  taken: number;
  missed: number;
  pending: number;
}

export interface DoseFilters {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  patientId?: string; // חובה כשהמשתמש מטפל
  status?: DoseStatus;
}
