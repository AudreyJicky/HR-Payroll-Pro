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

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  icNumber: string; // Identity Card
  gender: Gender;
  age: number;
  
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
  basicSalary: number;
  
  // Status
  status: 'Active' | 'Resigned' | 'Interviewing';
  interviewDate?: string;
  interviewTime?: string;
  resignNoticePeriod?: string; // e.g. "2 Months"
  
  // Claims
  medicalClaimBalance: number;
  medicalClaimUsed: number;
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