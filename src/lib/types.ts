export type Role = 'ADMIN' | 'EMPLOYEE';

export type UserStatus = 'INVITED' | 'ACTIVE' | 'SUSPENDED';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';

export type LeaveType = 'PAID' | 'SICK' | 'UNPAID';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  employeeId: string;
  email: string;
  role: Role;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: Profile;
}

export interface Profile {
  id: string;
  userId: string;
  fullName: string;
  phone?: string;
  address?: string;
  department?: string;
  designation?: string;
  dateOfJoining?: string;
  profileImageUrl?: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName?: string;
  userDepartment?: string;
  date: string; // YYYY-MM-DD
  checkIn?: string; // ISO string
  checkOut?: string; // ISO string
  status: AttendanceStatus;
  workHours?: number;
  createdAt: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName?: string;
  userDepartment?: string;
  userAvatar?: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  remarks: string;
  aiSummary?: string;
  status: LeaveStatus;
  reviewedBy?: string;
  reviewComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayrollRecord {
  id: string;
  userId: string;
  userName?: string;
  employeeId?: string;
  department?: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  currency: string;
  effectiveFrom: string;
  updatedAt: string;
}

export interface DocumentRecord {
  id: string;
  userId: string;
  name: string;
  type: 'ID_PROOF' | 'OFFER_LETTER' | 'TAX_DOC' | 'OTHER';
  url: string;
  uploadedAt: string;
  size?: string;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: 'LEAVE' | 'PAYROLL' | 'ATTENDANCE' | 'SYSTEM';
  createdAt: string;
}

export interface AuditLogRecord {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  createdAt: string;
}

export interface OnboardingStepProgress {
  step: number; // 1 to 6
  passwordSet?: boolean;
  personalData?: {
    phone?: string;
    address?: string;
    dob?: string;
    emergencyContact?: string;
  };
  jobDataConfirmed?: boolean;
  profileImage?: string;
  documentsUploaded?: Array<{ name: string; type: string; url: string }>;
  completed?: boolean;
}

export interface LeaveBalance {
  PAID: { total: number; used: number; remaining: number };
  SICK: { total: number; used: number; remaining: number };
  UNPAID: { total: number; used: number; remaining: number };
}
