import {
  User,
  Profile,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  DocumentRecord,
  NotificationRecord,
  AuditLogRecord,
  LeaveBalance,
  OnboardingStepProgress,
} from './types';
import {
  INITIAL_USERS,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_PAYROLL,
  INITIAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from './seed-data';

// In-Memory Global State to ensure reactive live updates across API calls
class DatabaseStore {
  private users: User[] = [...INITIAL_USERS];
  private attendance: AttendanceRecord[] = [...INITIAL_ATTENDANCE];
  private leaves: LeaveRequest[] = [...INITIAL_LEAVES];
  private payroll: PayrollRecord[] = [...INITIAL_PAYROLL];
  private documents: DocumentRecord[] = [...INITIAL_DOCUMENTS];
  private notifications: NotificationRecord[] = [...INITIAL_NOTIFICATIONS];
  private auditLogs: AuditLogRecord[] = [...INITIAL_AUDIT_LOGS];
  private onboardingProgress: Record<string, OnboardingStepProgress> = {};

  // Users & Profiles
  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id || u.email === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: User): User {
    this.users.push(user);
    return user;
  }

  updateProfile(userId: string, profileData: Partial<Profile>): Profile | undefined {
    const user = this.getUserById(userId);
    if (!user) return undefined;

    if (!user.profile) {
      user.profile = {
        id: `prof_${Date.now()}`,
        userId,
        fullName: profileData.fullName || user.email.split('@')[0],
        updatedAt: new Date().toISOString(),
      };
    }

    user.profile = {
      ...user.profile,
      ...profileData,
      updatedAt: new Date().toISOString(),
    };

    return user.profile;
  }

  updateUserStatus(userId: string, status: 'INVITED' | 'ACTIVE' | 'SUSPENDED'): User | undefined {
    const user = this.getUserById(userId);
    if (user) {
      user.status = status;
      user.updatedAt = new Date().toISOString();
    }
    return user;
  }

  // Attendance
  getAttendance(userId?: string): AttendanceRecord[] {
    if (userId) {
      return this.attendance.filter((a) => a.userId === userId);
    }
    return this.attendance;
  }

  getTodayAttendance(userId: string): AttendanceRecord | undefined {
    const today = new Date().toISOString().split('T')[0];
    return this.attendance.find((a) => a.userId === userId && a.date === today);
  }

  checkIn(userId: string): AttendanceRecord {
    const user = this.getUserById(userId);
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    let record = this.getTodayAttendance(userId);
    if (record) {
      record.checkIn = now;
      record.status = 'PRESENT';
    } else {
      record = {
        id: `att_${Date.now()}`,
        userId,
        userName: user?.profile?.fullName || user?.email || 'Employee',
        userDepartment: user?.profile?.department || 'General',
        date: today,
        checkIn: now,
        status: 'PRESENT',
        workHours: 0,
        createdAt: now,
      };
      this.attendance.unshift(record);
    }

    this.createAuditLog(
      userId,
      user?.profile?.fullName || 'User',
      'CHECK_IN',
      'Attendance',
      record.id,
      `Checked in at ${new Date(now).toLocaleTimeString()}`
    );

    return record;
  }

  checkOut(userId: string): AttendanceRecord | undefined {
    const user = this.getUserById(userId);
    const record = this.getTodayAttendance(userId);
    if (!record || !record.checkIn) return undefined;

    const now = new Date().toISOString();
    record.checkOut = now;

    const startMs = new Date(record.checkIn).getTime();
    const endMs = new Date(now).getTime();
    const hours = Math.max(0.1, Number(((endMs - startMs) / (1000 * 60 * 60)).toFixed(1)));
    record.workHours = hours;

    this.createAuditLog(
      userId,
      user?.profile?.fullName || 'User',
      'CHECK_OUT',
      'Attendance',
      record.id,
      `Checked out at ${new Date(now).toLocaleTimeString()} (${hours} hrs logged)`
    );

    return record;
  }

  // Leaves
  getLeaves(userId?: string): LeaveRequest[] {
    if (userId) {
      return this.leaves.filter((l) => l.userId === userId);
    }
    return this.leaves;
  }

  createLeaveRequest(request: Omit<LeaveRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): LeaveRequest {
    const newLeave: LeaveRequest = {
      ...request,
      id: `lv_${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.leaves.unshift(newLeave);

    // Notify HR Managers
    const hrs = this.users.filter((u) => u.role === 'HR');
    hrs.forEach((hr) => {
      this.notifications.unshift({
        id: `notif_${Date.now()}_${Math.random()}`,
        userId: hr.id,
        title: 'New Leave Request',
        message: `${newLeave.userName} requested ${newLeave.daysCount} days of ${newLeave.type} leave.`,
        read: false,
        type: 'LEAVE',
        createdAt: new Date().toISOString(),
      });
    });

    return newLeave;
  }

  approveLeaveRequest(
    leaveId: string,
    adminId: string,
    approved: boolean,
    reviewComment?: string
  ): LeaveRequest | undefined {
    const leave = this.leaves.find((l) => l.id === leaveId);
    const admin = this.getUserById(adminId);

    if (!leave) return undefined;

    leave.status = approved ? 'APPROVED' : 'REJECTED';
    leave.reviewedBy = admin?.profile?.fullName || 'Admin';
    leave.reviewComment = reviewComment || (approved ? 'Approved by HR' : 'Rejected by HR');
    leave.updatedAt = new Date().toISOString();

    // Notify Employee
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: leave.userId,
      title: `Leave ${approved ? 'Approved' : 'Rejected'}`,
      message: `Your leave request for ${leave.startDate} to ${leave.endDate} was ${approved ? 'approved' : 'rejected'}.`,
      read: false,
      type: 'LEAVE',
      createdAt: new Date().toISOString(),
    });

    this.createAuditLog(
      adminId,
      admin?.profile?.fullName || 'Admin',
      approved ? 'LEAVE_APPROVED' : 'LEAVE_REJECTED',
      'LeaveRequest',
      leaveId,
      `${approved ? 'Approved' : 'Rejected'} leave for ${leave.userName}`
    );

    return leave;
  }

  getLeaveBalance(userId: string): LeaveBalance {
    const userLeaves = this.leaves.filter((l) => l.userId === userId && l.status === 'APPROVED');
    
    const usedPaid = userLeaves.filter((l) => l.type === 'PAID').reduce((acc, l) => acc + l.daysCount, 0);
    const usedSick = userLeaves.filter((l) => l.type === 'SICK').reduce((acc, l) => acc + l.daysCount, 0);
    const usedUnpaid = userLeaves.filter((l) => l.type === 'UNPAID').reduce((acc, l) => acc + l.daysCount, 0);

    return {
      PAID: { total: 18, used: usedPaid, remaining: Math.max(0, 18 - usedPaid) },
      SICK: { total: 12, used: usedSick, remaining: Math.max(0, 12 - usedSick) },
      UNPAID: { total: 30, used: usedUnpaid, remaining: Math.max(0, 30 - usedUnpaid) },
    };
  }

  // Payroll
  getPayroll(userId?: string): PayrollRecord[] {
    if (userId) {
      return this.payroll.filter((p) => p.userId === userId);
    }
    return this.payroll;
  }

  getPayrollByUserId(userId: string): PayrollRecord | undefined {
    return this.payroll.find((p) => p.userId === userId);
  }

  updatePayroll(userId: string, adminId: string, baseSalary: number, allowances: number, deductions: number): PayrollRecord {
    let rec = this.getPayrollByUserId(userId);
    const user = this.getUserById(userId);
    const admin = this.getUserById(adminId);

    const netSalary = Math.max(0, baseSalary + allowances - deductions);
    const now = new Date().toISOString();

    if (rec) {
      rec.baseSalary = baseSalary;
      rec.allowances = allowances;
      rec.deductions = deductions;
      rec.netSalary = netSalary;
      rec.updatedAt = now;
    } else {
      rec = {
        id: `pay_${Date.now()}`,
        userId,
        userName: user?.profile?.fullName || 'Employee',
        employeeId: user?.employeeId || 'EMP',
        department: user?.profile?.department || 'General',
        baseSalary,
        allowances,
        deductions,
        netSalary,
        currency: '₹',
        effectiveFrom: now.split('T')[0],
        updatedAt: now,
      };
      this.payroll.push(rec);
    }

    this.createAuditLog(
      adminId,
      admin?.profile?.fullName || 'Admin',
      'PAYROLL_UPDATED',
      'Payroll',
      rec.id,
      `Updated salary for ${user?.profile?.fullName || userId}: Net Pay ₹${netSalary.toLocaleString()}`
    );

    return rec;
  }

  // Documents
  getDocuments(userId: string): DocumentRecord[] {
    return this.documents.filter((d) => d.userId === userId);
  }

  addDocument(doc: Omit<DocumentRecord, 'id' | 'uploadedAt'>): DocumentRecord {
    const newDoc: DocumentRecord = {
      ...doc,
      id: `doc_${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    this.documents.push(newDoc);
    return newDoc;
  }

  // Notifications
  getNotifications(userId: string): NotificationRecord[] {
    return this.notifications.filter((n) => n.userId === userId);
  }

  markNotificationRead(id: string): void {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
    }
  }

  // Audit Logs
  getAuditLogs(): AuditLogRecord[] {
    return this.auditLogs;
  }

  createAuditLog(
    actorId: string,
    actorName: string,
    action: string,
    entityType: string,
    entityId: string,
    details: string
  ): AuditLogRecord {
    const log: AuditLogRecord = {
      id: `audit_${Date.now()}`,
      actorId,
      actorName,
      action,
      entityType,
      entityId,
      details,
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    return log;
  }

  // Onboarding
  getOnboardingProgress(userId: string): OnboardingStepProgress {
    if (!this.onboardingProgress[userId]) {
      this.onboardingProgress[userId] = { step: 1 };
    }
    return this.onboardingProgress[userId];
  }

  saveOnboardingProgress(userId: string, data: Partial<OnboardingStepProgress>): OnboardingStepProgress {
    const current = this.getOnboardingProgress(userId);
    this.onboardingProgress[userId] = {
      ...current,
      ...data,
    };
    return this.onboardingProgress[userId];
  }
}

export const db = new DatabaseStore();
