import { 
  Employee, 
  PayrollRecord, 
  TimeLog, 
  LeaveRequest, 
  ClaimRecord,
  Asset, 
  JobTask, 
  PublicHoliday,
  EmploymentType,
  Gender,
  LeaveType
} from '../types';
import { INITIAL_HOLIDAYS, MEDICAL_CLAIM_LIMIT } from '../constants';

// --- HELPERS FOR AUTO CALCULATION ---

export const calculateEntitlements = (joinDate: string, basicSalary: number) => {
  const start = new Date(joinDate);
  const now = new Date();
  
  // Calculate Tenure in Years
  let yearsOfService = now.getFullYear() - start.getFullYear();
  const m = now.getMonth() - start.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < start.getDate())) {
      yearsOfService--;
  }
  yearsOfService = Math.max(0, yearsOfService);

  // 1. Calculate Annual Leave (AL) based on Tenure
  // < 2 years: 12 days
  // 2 - 5 years: 16 days
  // > 5 years: 20 days
  let annualLeaveTotal = 12;
  if (yearsOfService >= 5) annualLeaveTotal = 20;
  else if (yearsOfService >= 2) annualLeaveTotal = 16;

  // 2. Calculate Medical Claim Limit
  // Logic: Base RM 500 + (1% of Annual Salary), capped at RM 3000
  const annualSalary = basicSalary * 12;
  let medicalLimit = 500 + (annualSalary * 0.01);
  medicalLimit = Math.min(Math.floor(medicalLimit), 3000); // Round down, max 3000

  return {
    yearsOfService,
    annualLeaveTotal,
    medicalLimit
  };
};

// --- MOCK DATA ---

export let mockEmployees: Employee[] = [
  {
    id: 'EMP001',
    fullName: 'Ali bin Abu',
    email: 'ali@company.com',
    phone: '012-3456789',
    address: '123 Jalan Ampang, KL',
    icNumber: '900101-14-5566',
    gender: Gender.MALE,
    age: 34,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bankName: 'Maybank',
    bankAccountNumber: '1122334455',
    kwspNumber: 'KWSP123456',
    socsoNumber: 'SOCSO123456',
    taxNumber: 'TAX123456',
    jobTitle: 'Senior Developer',
    department: 'IT Support',
    joinDate: '2020-03-01', // 4+ Years tenure
    employmentType: EmploymentType.FULL_TIME,
    
    // New Salary Package Structure
    salaryPackage: {
      basic: 6500,
      travelAllowance: 200,
      foodAllowance: 150,
      gymBenefit: 100,
      facilitiesBenefit: 50,
      birthdayBenefit: 0,
      nightShiftAllowance: 0
    },

    status: 'Active',
    medicalClaimBalance: 850,
    medicalClaimUsed: 150,
    resignNoticePeriod: '2 Months',
    leaveBalance: { AL: 12, MC: 14, RL: 2, HL: 60 },
    accumulatedOvertimeHours: 12.5, // Auto-tracked from attendance
  },
  {
    id: 'EMP002',
    fullName: 'Siti Sarah',
    email: 'siti@company.com',
    phone: '019-8765432',
    address: '456 Jalan Tun Razak, KL',
    icNumber: '950505-10-8899',
    gender: Gender.FEMALE,
    age: 29,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bankName: 'CIMB',
    bankAccountNumber: '9988776655',
    kwspNumber: 'KWSP987654',
    socsoNumber: 'SOCSO987654',
    taxNumber: 'TAX987654',
    jobTitle: 'HR Executive',
    department: 'Human Resources',
    joinDate: '2023-01-15', // < 2 Years tenure
    employmentType: EmploymentType.FULL_TIME,
    
    salaryPackage: {
      basic: 4200,
      travelAllowance: 100,
      foodAllowance: 0,
      gymBenefit: 0,
      facilitiesBenefit: 50,
      birthdayBenefit: 200, // Birthday month
      nightShiftAllowance: 0
    },

    status: 'Active',
    medicalClaimBalance: 1000,
    medicalClaimUsed: 0,
    resignNoticePeriod: '1 Month',
    leaveBalance: { AL: 10, MC: 14, RL: 0, HL: 60 },
    accumulatedOvertimeHours: 4.0, 
  },
  // Interview Candidate 1
  {
    id: 'APP001',
    fullName: 'Jason Lee',
    email: 'jason.lee@email.com',
    phone: '017-5554444',
    address: 'Cheras, KL',
    icNumber: '980101-10-1234',
    gender: Gender.MALE,
    age: 26,
    bankName: '',
    bankAccountNumber: '',
    kwspNumber: '',
    socsoNumber: '',
    taxNumber: '',
    jobTitle: 'Frontend Developer',
    department: 'IT',
    joinDate: '',
    employmentType: EmploymentType.FULL_TIME,
    salaryPackage: { basic: 0, travelAllowance: 0, foodAllowance: 0, gymBenefit: 0, facilitiesBenefit: 0, birthdayBenefit: 0, nightShiftAllowance: 0 },
    status: 'Interviewing',
    interviewDate: '2024-10-25',
    interviewTime: '10:00 AM',
    interviewAttended: false,
    medicalClaimBalance: 0,
    medicalClaimUsed: 0,
    leaveBalance: { AL: 0, MC: 0, RL: 0, HL: 0 },
    accumulatedOvertimeHours: 0
  },
  // Interview Candidate 2
  {
    id: 'APP002',
    fullName: 'Amina Rose',
    email: 'amina@email.com',
    phone: '012-9988776',
    address: 'PJ, Selangor',
    icNumber: '990202-14-5678',
    gender: Gender.FEMALE,
    age: 25,
    bankName: '',
    bankAccountNumber: '',
    kwspNumber: '',
    socsoNumber: '',
    taxNumber: '',
    jobTitle: 'Sales Executive',
    department: 'Sales',
    joinDate: '',
    employmentType: EmploymentType.FULL_TIME,
    salaryPackage: { basic: 0, travelAllowance: 0, foodAllowance: 0, gymBenefit: 0, facilitiesBenefit: 0, birthdayBenefit: 0, nightShiftAllowance: 0 },
    status: 'Interviewing',
    interviewDate: '2024-10-26',
    interviewTime: '02:00 PM',
    interviewAttended: true,
    medicalClaimBalance: 0,
    medicalClaimUsed: 0,
    leaveBalance: { AL: 0, MC: 0, RL: 0, HL: 0 },
    accumulatedOvertimeHours: 0
  }
];

export const updateEmployee = (id: string, updates: Partial<Employee>) => {
  const index = mockEmployees.findIndex(e => e.id === id);
  if (index !== -1) {
    mockEmployees[index] = { ...mockEmployees[index], ...updates };
  }
};

export const toggleInterviewAttendance = (id: string) => {
  const index = mockEmployees.findIndex(e => e.id === id);
  if (index !== -1) {
    mockEmployees[index].interviewAttended = !mockEmployees[index].interviewAttended;
  }
};

export let mockAssets: Asset[] = [
  { id: 'A001', name: 'MacBook Pro 14"', code: 'IT-MBP-001', assignedTo: 'EMP001', condition: 'Good' },
  { id: 'A002', name: 'Dell Monitor 27"', code: 'IT-MON-023', assignedTo: 'EMP001', condition: 'Good' },
  { id: 'A003', name: 'Access Card', code: 'SEC-005', assignedTo: 'EMP002', condition: 'Fair' },
];

export const addAsset = (asset: Asset) => {
  mockAssets.push(asset);
};

export const updateAsset = (id: string, updates: Partial<Asset>) => {
  const index = mockAssets.findIndex(a => a.id === id);
  if (index !== -1) {
    mockAssets[index] = { ...mockAssets[index], ...updates };
  }
};

export let mockTasks: JobTask[] = [
  { id: 'T001', title: 'Monthly Payroll Processing', description: 'Process salary for Oct 2024', status: 'Pending', dueDate: '2024-10-25', assignedTo: 'EMP002' },
  { id: 'T002', title: 'Server Maintenance', description: 'Update security patches', status: 'In Progress', dueDate: '2024-10-15', assignedTo: 'EMP001' },
];

export const addTask = (task: JobTask) => {
  mockTasks.push(task);
};

export const updateTask = (id: string, updates: Partial<JobTask>) => {
  const index = mockTasks.findIndex(t => t.id === id);
  if (index !== -1) {
    mockTasks[index] = { ...mockTasks[index], ...updates };
  }
};


export const mockLeaveRequests: LeaveRequest[] = [
  { id: 'L001', employeeId: 'EMP001', type: LeaveType.AL, startDate: '2024-11-01', endDate: '2024-11-03', reason: 'Family trip', status: 'Approved' },
  { id: 'L002', employeeId: 'EMP002', type: LeaveType.MC, startDate: '2024-10-12', endDate: '2024-10-12', reason: 'Fever', status: 'Pending' }
];

// Mutable store for claims to support add/update in demo
export let mockClaimRecords: ClaimRecord[] = [
  { id: 'C001', employeeId: 'EMP001', date: '2024-09-15', type: 'Medical', amount: 50, description: 'Klinik Mediviron - Flu', status: 'Approved', receiptUrl: '#' },
  { id: 'C002', employeeId: 'EMP001', date: '2024-10-02', type: 'Medical', amount: 100, description: 'Dental Checkup', status: 'Approved', receiptUrl: '#' },
  { id: 'C003', employeeId: 'EMP001', date: '2024-10-10', type: 'Travel', amount: 45, description: 'Grab to Client Meeting', status: 'Pending', receiptUrl: '#' },
  { id: 'C004', employeeId: 'EMP002', date: '2024-10-14', type: 'Medical', amount: 85, description: 'Consultation Fee', status: 'Pending', receiptUrl: '#' },
];

export const addClaim = (claim: ClaimRecord) => {
  mockClaimRecords.unshift(claim);
};

export const updateClaimStatus = (id: string, status: 'Approved' | 'Rejected') => {
  const index = mockClaimRecords.findIndex(c => c.id === id);
  if (index !== -1) {
    mockClaimRecords[index].status = status;
    
    // Update employee balance if approved
    if (status === 'Approved') {
        const claim = mockClaimRecords[index];
        const empIndex = mockEmployees.findIndex(e => e.id === claim.employeeId);
        if (empIndex !== -1 && claim.type === 'Medical') {
            mockEmployees[empIndex].medicalClaimUsed += claim.amount;
            mockEmployees[empIndex].medicalClaimBalance -= claim.amount;
        }
    }
  }
};

// --- PAYROLL CALCULATION ---

export const calculatePayroll = (
  basic: number, 
  otHours: number, 
  bonus: number = 0, 
  allowance: number = 0,
  unpaidLeaveDays: number = 0,
  claimsReimbursement: number = 0
) => {
  // 1. Calculate Gross
  
  // Unpaid Leave Deduction (Basic / 26 days * days)
  const dailyRate = basic / 26;
  const unpaidLeaveDeduction = dailyRate * unpaidLeaveDays;
  const adjustedBasic = Math.max(0, basic - unpaidLeaveDeduction);

  // OT Calculation: (Basic / 26 / 8) * 1.5 * Hours
  // Default labor law calculation
  const hourlyRate = dailyRate / 8;
  const otAmount = hourlyRate * 1.5 * otHours;
  
  // Gross for EPF/Tax calculation (excludes non-taxable claims usually, but includes bonus/allowance)
  const grossIncome = adjustedBasic + allowance + otAmount + bonus;

  // 2. Calculate KWSP (EPF)
  // Employee 11%
  const kwspEmp = grossIncome * 0.11;
  const kwspEmplr = grossIncome * 0.13;

  // 3. Calculate SOCSO & EIS
  // Capped at 5000 wages roughly for calculation
  const socsoWage = Math.min(grossIncome, 5000);
  const socsoEmp = socsoWage * 0.005;
  const socsoEmplr = socsoWage * 0.0175;

  const eisWage = Math.min(grossIncome, 5000);
  const eisEmp = eisWage * 0.002;
  const eisEmplr = eisWage * 0.002;

  // 4. Calculate Tax (PCB) - Very simplified progressive mock
  // Assume taxable income = gross - kwsp (up to 4000) - 9000 personal relief
  const taxableIncome = (grossIncome * 12) - (Math.min(kwspEmp * 12, 4000)) - 9000;
  let annualTax = 0;
  if (taxableIncome > 100000) annualTax = taxableIncome * 0.21;
  else if (taxableIncome > 50000) annualTax = taxableIncome * 0.13;
  else if (taxableIncome > 35000) annualTax = taxableIncome * 0.08;
  
  const monthlyTax = Math.max(0, annualTax / 12);

  // 5. Net Salary
  // Claims are usually added back as Net Pay (reimbursement) and are tax exempt if for medical
  const totalDeductions = kwspEmp + socsoEmp + eisEmp + monthlyTax;
  const netSalary = (grossIncome + claimsReimbursement) - totalDeductions;

  return {
    grossSalary: parseFloat(grossIncome.toFixed(2)),
    otAmount: parseFloat(otAmount.toFixed(2)),
    unpaidLeaveDeduction: parseFloat(unpaidLeaveDeduction.toFixed(2)),
    claimsReimbursement: parseFloat(claimsReimbursement.toFixed(2)),
    kwspEmployee: parseFloat(kwspEmp.toFixed(2)),
    kwspEmployer: parseFloat(kwspEmplr.toFixed(2)),
    socsoEmployee: parseFloat(socsoEmp.toFixed(2)),
    socsoEmployer: parseFloat(socsoEmplr.toFixed(2)),
    eisEmployee: parseFloat(eisEmp.toFixed(2)),
    eisEmployer: parseFloat(eisEmplr.toFixed(2)),
    taxDeduction: parseFloat(monthlyTax.toFixed(2)),
    netSalary: parseFloat(netSalary.toFixed(2)),
    totalDeductions: parseFloat(totalDeductions.toFixed(2))
  };
};