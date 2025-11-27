export enum EmploymentType {
  FULL_TIME = 'Full Time',
  PART_TIME = 'Part Time',
  CONTRACT = 'Contract',
  INTERN = 'Intern'
}

export enum LeaveType {
  AL = 'Annual Leave',
  MC = 'Medical Leave',
  RL = 'Replacement Leave',
  EL = 'Emergency Leave',
  HL = 'Hospitalization Leave'
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female'
}

export type Role = 'Admin' | 'Staff';

export interface LeaveBalance {
  AL: number; // Annual
  MC: number; // Medical
  RL: number; // Replacement
  HL: number; // Hospitalization
}

export interface SalaryPackage {
  basic: number;
  travelAllowance: number;
  foodAllowance: number;
  gymBenefit: number;
  facilitiesBenefit: number;
  birthdayBenefit: number;
  nightShiftAllowance: number;
  fixedOtRate?: number; // Optional custom rate, otherwise uses standard calc
}

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  icNumber: string; // Identity Card
  gender: Gender;
  age: number;
  avatarUrl?: string;
  
  // Banking & Statutory
  bankName: string;
  bankAccountNumber: string;
  kwspNumber: string;
  socsoNumber: string;
  taxNumber: string;
  
  // Job Details
  jobTitle: string;
  department: string;
  joinDate: string;
  employmentType: EmploymentType;
  
  // Salary Package
  salaryPackage: SalaryPackage;
  
  // Status
  status: 'Active' | 'Resigned' | 'Interviewing';
  interviewDate?: string;
  interviewTime?: string;
  interviewAttended?: boolean; // New field for tracker
  resignNoticePeriod?: string; // e.g. "2 Months"
  
  // Claims & Leave & Time
  medicalClaimBalance: number;
  medicalClaimUsed: number;
  leaveBalance: LeaveBalance;
  accumulatedOvertimeHours: number; // From Attendance Tracker
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string; // YYYY-MM
  basicSalary: number;
  allowance: number;
  overtimeHours: number;
  overtimeAmount: number;
  bonus: number;
  claimsReimbursement: number;
  unpaidLeaveDays: number;
  unpaidLeaveDeduction: number;
  
  // Deductions
  kwspEmployee: number;
  socsoEmployee: number;
  eisEmployee: number;
  taxDeduction: number; // PCB
  
  // Employer Contributions (for reference)
  kwspEmployer: number;
  socsoEmployer: number;
  eisEmployer: number;
  
  netSalary: number;
  grossSalary: number;
}

export interface TimeLog {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string; // HH:mm
  clockOut: string | null; // HH:mm
  ipAddress?: string;
  locationNote?: string;
  overtimeHours: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface ClaimRecord {
  id: string;
  employeeId: string;
  date: string;
  type: 'Medical' | 'Travel' | 'Other';
  amount: number;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  receiptUrl?: string;
}

export interface Asset {
  id: string;
  name: string;
  code: string; // IT support electron code/number
  assignedTo?: string; // Employee ID
  condition: 'New' | 'Good' | 'Fair' | 'Poor';
}

export interface JobTask {
  id: string;
  title: string;
  description: string;
  assignedTo?: string; // Employee ID
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate: string;
}

export interface PublicHoliday {
  id: string;
  name: string;
  date: string;
}