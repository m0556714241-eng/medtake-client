// התראת מלאי נמוך
export interface LowStockAlert {
  prescriptionId: string;
  drugName: string;
  patientId: string;
  patientName: string;
  stockQuantity: number;
  lowStockThreshold: number;
}
