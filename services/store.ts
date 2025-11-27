import { 
  Employee, 
  PayrollRecord, 
  TimeLog, 
  LeaveRequest, 
  Asset, 
  JobTask, 
  PublicHoliday,
  EmploymentType,
  Gender,
  LeaveType
} from '../types';
import { INITIAL_HOLIDAYS, MEDICAL_CLAIM_LIMIT } from '../constants';

// --- MOCK DATA ---

export const mockEmployees: Employee[] = [
  {
    id: 'EMP001',
    fullName: 'Ali bin Abu',
    email: 'ali@company.com',
    phone: '012-3456789',
    address: '123 Jalan Ampang, KL',
    icNumber: '900101-14-5566',
    gender: Gender.MALE,
    age: 34,
    bankName: 'Maybank',
    bankAccountNumber: '1122334455',
    kwspNumber: 'KWSP123456',
    socsoNumber: 'SOCSO123456',
    taxNumber: 'TAX123456',
    jobTitle: 'Senior Developer',
    department: 'IT Support',
    joinDate: '2022-03-01',
    employmentType: EmploymentType.FULL_TIME,
    basicSalary: 6500,
    status: 'Active',
    medicalClaimBalance: 850,
    medicalClaimUsed: 150,
    resignNoticePeriod: '2 Months'
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
    bankName: 'CIMB',
    bankAccountNumber: '9988776655',
    kwspNumber: 'KWSP987654',
    socsoNumber: 'SOCSO987654',
    taxNumber: 'TAX987654',
    jobTitle: 'HR Executive',
    department: 'Human Resources',
    joinDate: '2023-01-15',
    employmentType: EmploymentType.FULL_TIME,
    basicSalary: 4200,
    status: 'Active',
    medicalClaimBalance: 1000,
    medicalClaimUsed: 0,
    resignNoticePeriod: '1 Month'
  }
];

export const mockAssets: Asset[] = [
  { id: 'A001', name: 'MacBook Pro 14"', code: 'IT-MBP-001', assignedTo: 'EMP001', condition: 'Good' },
  { id: 'A002', name: 'Dell Monitor 27"', code: 'IT-MON-023', assignedTo: 'EMP001', condition: 'Good' },
  { id: 'A003', name: 'Access Card', code: 'SEC-005', assignedTo: 'EMP002', condition: 'Fair' },
];

export const mockTasks: JobTask[] = [
  { id: 'T001', title: 'Monthly Payroll Processing', description: 'Process salary for Oct 2024', status: 'Pending', dueDate: '2024-10-25', assignedTo: 'EMP002' },
  { id: 'T002', title: 'Server Maintenance', description: 'Update security patches', status: 'In Progress', dueDate: '2024-10-15', assignedTo: 'EMP001' },
];

export const mockLeaveRequests: LeaveRequest[] = [
  { id: 'L001', employeeId: 'EMP001', type: LeaveType.AL, startDate: '2024-11-01', endDate: '2024-11-03', reason: 'Family trip', status: 'Approved' }
];

// --- HELPERS ---

export const calculatePayroll = (basic: number, otHours: number, bonus: number = 0, allowance: number = 0) => {
  // 1. Calculate Gross
  // OT Calculation: (Basic / 26 / 8) * 1.5 * Hours
  const hourlyRate = (basic / 26) / 8;
  const otAmount = hourlyRate * 1.5 * otHours;
  const grossIncome = basic + allowance + otAmount + bonus;

  // 2. Calculate KWSP (EPF)
  // Employee 11%
  const kwspEmp = basic * 0.11;
  const kwspEmplr = basic * 0.13;

  // 3. Calculate SOCSO & EIS
  // Capped at 5000 wages roughly for calculation
  const socsoWage = Math.min(basic, 5000);
  const socsoEmp = socsoWage * 0.005;
  const socsoEmplr = socsoWage * 0.0175;

  const eisWage = Math.min(basic, 5000);
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
  const totalDeductions = kwspEmp + socsoEmp + eisEmp + monthlyTax;
  const netSalary = grossIncome - totalDeductions;

  return {
    grossSalary: parseFloat(grossIncome.toFixed(2)),
    otAmount: parseFloat(otAmount.toFixed(2)),
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
