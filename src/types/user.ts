export type UserRole = 'caregiver' | 'patient';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  caregiverId: string | null; // רק אצל מטופל
  birthDate: string | null; // רק אצל מטופל, הגיל מחושב ממנו
  createdAt: string; // ISO
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string; // JWT
  user: User;
}

// מטופל + סיכום של היום הנוכחי (שדות מחושבים בשרת)
export interface PatientSummary extends User {
  age: number | null;
  activePrescriptions: number;
  todayTotal: number;
  todayTaken: number;
  todayMissed: number;
  hasLowStock: boolean;
}

// גוף הבקשה ליצירת מטופל
export interface CreatePatientRequest {
  fullName: string;
  email: string;
  password: string;
  birthDate: string; // YYYY-MM-DD
}

// גוף הבקשה לעריכת מטופל – סיסמה ריקה/חסרה = ללא שינוי
export type UpdatePatientRequest = Omit<CreatePatientRequest, 'password'> & {
  password?: string;
};

export interface PatientFilters {
  search?: string; // לפי שם
  sortBy?: 'fullName' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  lowStock?: boolean;
  missedToday?: boolean;
}
