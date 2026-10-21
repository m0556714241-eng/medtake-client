// ===== לוח זמנים =====

export interface Schedule {
  days: number[]; // 0 = ראשון ... 6 = שבת; כל השבעה = כל יום
  times: string[]; // שעות קבועות, למשל ["08:00", "20:00"]
}

// ===== מרשם =====

export type PrescriptionForm =
  | 'tablet'
  | 'capsule'
  | 'syrup'
  | 'drops'
  | 'injection'
  | 'cream'
  | 'other';

export type PrescriptionStatus = 'active' | 'paused' | 'finished';

export interface Prescription {
  id: string;
  patientId: string;
  createdBy: string; // מזהה המטפל
  drugName: string;
  dosage: string; // למשל 500 מ"ג
  form: PrescriptionForm;
  unitsPerDose: number; // כמה יחידות יורדות מהמלאי בכל נטילה
  schedule: Schedule;
  startDate: string;
  endDate: string | null;
  instructions: string;
  missedAfterMinutes: number; // אחרי כמה זמן נטילה נחשבת כפוספסה
  stockQuantity: number;
  lowStockThreshold: number;
  status: PrescriptionStatus;
  isLowStock: boolean; // מחושב בשרת: stockQuantity <= lowStockThreshold
  createdAt: string;
  updatedAt: string;
}

// ערכי הטופס, בלי שדות שהשרת קובע
export type PrescriptionFormValues = Omit<
  Prescription,
  'id' | 'createdBy' | 'isLowStock' | 'createdAt' | 'updatedAt'
>;

export interface PrescriptionFilters {
  patientId?: string; // חובה כשהמשתמש מטפל
  search?: string; // לפי שם תרופה
  status?: PrescriptionStatus;
  form?: PrescriptionForm;
  sortBy?: 'drugName' | 'startDate' | 'stockQuantity';
  sortOrder?: 'asc' | 'desc';
}

// חידוש מלאי – כמה יחידות להוסיף
export interface RefillRequest {
  quantity: number;
}
