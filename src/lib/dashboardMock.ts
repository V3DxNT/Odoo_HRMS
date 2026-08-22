export interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'PRESENT' | 'LATE' | 'ABSENT' | 'ON_LEAVE';
  hoursLogged: number;
}

export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: "LV-101",
    employeeName: "Alex Mercer",
    employeeAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    department: "Engineering",
    type: "Vacation",
    startDate: "2026-08-25",
    endDate: "2026-08-29",
    days: 5,
    reason: "Annual family trip to Japan.",
    status: "PENDING",
    submittedAt: "2 hours ago"
  },
  {
    id: "LV-102",
    employeeName: "Sophia Chen",
    employeeAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    department: "Design",
    type: "Sick Leave",
    startDate: "2026-08-23",
    endDate: "2026-08-24",
    days: 2,
    reason: "Severe migraine, resting under doctor recommendation.",
    status: "PENDING",
    submittedAt: "5 hours ago"
  },
  {
    id: "LV-103",
    employeeName: "Marcus Vance",
    employeeAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    department: "Marketing",
    type: "Personal Leave",
    startDate: "2026-09-01",
    endDate: "2026-09-01",
    days: 1,
    reason: "Relocation assistance for family.",
    status: "APPROVED",
    submittedAt: "1 day ago"
  }
];

export const mockEmployeeAttendance: AttendanceRecord[] = [
  { id: "ATT-1", date: "Mon, Aug 18", checkIn: "08:55 AM", checkOut: "05:05 PM", status: "PRESENT", hoursLogged: 8.1 },
  { id: "ATT-2", date: "Tue, Aug 19", checkIn: "09:02 AM", checkOut: "05:15 PM", status: "PRESENT", hoursLogged: 8.2 },
  { id: "ATT-3", date: "Wed, Aug 20", checkIn: "09:15 AM", checkOut: "05:00 PM", status: "LATE", hoursLogged: 7.75 },
  { id: "ATT-4", date: "Thu, Aug 21", checkIn: "08:50 AM", checkOut: "05:10 PM", status: "PRESENT", hoursLogged: 8.3 },
  { id: "ATT-5", date: "Today", checkIn: "09:00 AM", status: "PRESENT", hoursLogged: 4.5 }
];

export const adminMetrics = {
  totalHeadcount: 142,
  headcountGrowth: "+12% vs last month",
  presentToday: 128,
  absentToday: 6,
  onLeaveToday: 8,
  attendanceRate: "94.2%",
  payrollRunThisMonth: "$284,500",
  pendingApprovalsCount: 2,
};
