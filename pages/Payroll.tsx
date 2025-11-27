import React, { useState, useEffect } from 'react';
import { mockEmployees, calculatePayroll, calculateEntitlements } from '../services/store';
import { Calculator, Download, RefreshCw, AlertCircle, Edit2 } from 'lucide-react';

const Payroll: React.FC = () => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(mockEmployees[0]?.id || '');
  
  // States for Calculator
  const [otHours, setOtHours] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [unpaidLeaveDays, setUnpaidLeaveDays] = useState(0);
  const [claimsReimbursement, setClaimsReimbursement] = useState(0);

  const selectedEmployee = mockEmployees.find(e => e.id === selectedEmployeeId);

  // Effect: Auto-load values when employee changes
  useEffect(() => {
    if (selectedEmployee) {
      // 1. Auto-Add Overtime from Tracker
      setOtHours(selectedEmployee.accumulatedOvertimeHours || 0);
      
      // 2. Auto-Add Allowances from Salary Package
      const pkg = selectedEmployee.salaryPackage;
      const totalAllowance = 
        (pkg.travelAllowance || 0) + 
        (pkg.foodAllowance || 0) + 
        (pkg.gymBenefit || 0) + 
        (pkg.facilitiesBenefit || 0) +
        (pkg.nightShiftAllowance || 0) +
        (pkg.birthdayBenefit || 0);

      setAllowance(totalAllowance);
      
      // Reset others
      setBonus(0);
      setUnpaidLeaveDays(0);
      setClaimsReimbursement(0);
    }
  }, [selectedEmployeeId]);
  
  // Auto-calculate entitlements based on join date
  const entitlements = selectedEmployee 
    ? calculateEntitlements(selectedEmployee.joinDate, selectedEmployee.salaryPackage.basic) 
    : { yearsOfService: 0, annualLeaveTotal: 0, medicalLimit: 0 };

  const result = selectedEmployee 
    ? calculatePayroll(
        selectedEmployee.salaryPackage.basic, 
        otHours, 
        bonus, 
        allowance, 
        unpaidLeaveDays, 
        claimsReimbursement
      ) 
    : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Payroll Calculation</h1>
        <button className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <Calculator className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold">Calculator Inputs</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Employee</label>
              <select 
                value={selectedEmployeeId} 
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {mockEmployees.map(e => (
                  <option key={e.id} value={e.id}>{e.fullName} ({e.id})</option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Base Info (Auto-Calculated)</p>
              
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">Tenure</span>
                <span className="text-sm font-bold text-slate-800">{entitlements.yearsOfService} Years</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">Basic Salary</span>
                <span className="text-sm font-bold text-slate-800">RM {selectedEmployee?.salaryPackage.basic.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">Annual Leave Entitlement</span>
                <span className="text-sm font-bold text-blue-600">{entitlements.annualLeaveTotal} Days</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">Medical Claim Limit</span>
                <span className="text-sm font-bold text-emerald-600">RM {entitlements.medicalLimit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1 mt-2">
                <span className="text-xs text-slate-500">Daily Rate (26 days)</span>
                <span className="text-xs font-mono">RM {((selectedEmployee?.salaryPackage.basic || 0) / 26).toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center justify-between">
                  <span>Overtime</span>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-1 rounded">Auto</span>
                </label>
                <div className="flex items-center">
                   <input 
                    type="number" 
                    min="0"
                    value={otHours}
                    onChange={(e) => setOtHours(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-none"
                    placeholder="Hrs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Unpaid Leave</label>
                <div className="flex items-center">
                   <input 
                    type="number" 
                    min="0"
                    value={unpaidLeaveDays}
                    onChange={(e) => setUnpaidLeaveDays(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-none"
                    placeholder="Days"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
                <span>Total Allowance</span>
                <span className="text-[10px] text-blue-600 bg-blue-50 px-1 rounded">Package</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">RM</span>
                <input 
                  type="number" 
                  min="0"
                  value={allowance}
                  onChange={(e) => setAllowance(Number(e.target.value))}
                  className="w-full pl-10 p-2 border border-slate-300 rounded-lg outline-none"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Includes Travel, Gym, etc. from Package</p>
            </div>

             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Claims Reimbursement</label>
               <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">RM</span>
                <input 
                  type="number" 
                  min="0"
                  value={claimsReimbursement}
                  onChange={(e) => setClaimsReimbursement(Number(e.target.value))}
                  className="w-full pl-10 p-2 border border-slate-300 rounded-lg outline-none"
                />
              </div>
               <p className="text-xs text-slate-400 mt-1">Medical/Travel (Tax Exempt)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Performance Bonus</label>
               <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">RM</span>
                <input 
                  type="number" 
                  min="0"
                  value={bonus}
                  onChange={(e) => setBonus(Number(e.target.value))}
                  className="w-full pl-10 p-2 border border-slate-300 rounded-lg outline-none"
                />
              </div>
            </div>
            
            <button 
              onClick={() => { setOtHours(0); setAllowance(0); setBonus(0); setUnpaidLeaveDays(0); setClaimsReimbursement(0); }}
              className="w-full mt-2 flex justify-center items-center py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition"
            >
              <RefreshCw className="w-3 h-3 mr-2" />
              Reset Inputs
            </button>
          </div>
        </div>

        {/* Payslip Preview */}
        {result && (
          <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
             <div className="flex justify-between border-b pb-6 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Payslip Preview</h2>
                  <p className="text-sm text-slate-500">October 2024</p>
                </div>
                <div className="text-right">
                   <h3 className="text-lg font-bold text-slate-900">{selectedEmployee?.fullName}</h3>
                   <p className="text-sm text-slate-500">{selectedEmployee?.jobTitle}</p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-8 mb-6">
               <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Earnings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Basic Salary</span>
                      <span className="font-medium">RM {selectedEmployee?.salaryPackage.basic.toLocaleString()}</span>
                    </div>
                    {unpaidLeaveDays > 0 && (
                       <div className="flex justify-between text-rose-600">
                        <span className="">Unpaid Leave ({unpaidLeaveDays} days)</span>
                        <span className="">- RM {result.unpaidLeaveDeduction.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-600">Overtime ({otHours} hrs)</span>
                      <span className="font-medium">RM {result.otAmount.toLocaleString()}</span>
                    </div>
                    {allowance > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Allowance (Package)</span>
                        <span className="font-medium">RM {allowance.toLocaleString()}</span>
                      </div>
                    )}
                    {bonus > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Bonus</span>
                        <span className="font-medium">RM {bonus.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between pt-2 border-t border-slate-100 mt-2">
                      <span className="font-bold text-slate-800">Gross Salary</span>
                      <span className="font-bold text-slate-800">RM {result.grossSalary.toLocaleString()}</span>
                    </div>
                  </div>

                  {claimsReimbursement > 0 && (
                     <div className="mt-4 p-2 bg-green-50 rounded border border-green-100">
                        <div className="flex justify-between text-green-800 text-sm">
                           <span>Medical Claims (Tax Exempt)</span>
                           <span className="font-bold">+ RM {claimsReimbursement.toLocaleString()}</span>
                        </div>
                     </div>
                  )}
               </div>

               <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Statutory Deductions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">KWSP (Employee 11%)</span>
                      <span className="text-red-500">- RM {result.kwspEmployee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">SOCSO (Employee)</span>
                      <span className="text-red-500">- RM {result.socsoEmployee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">EIS (Employee)</span>
                      <span className="text-red-500">- RM {result.eisEmployee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">PCB (Tax)</span>
                      <span className="text-red-500">- RM {result.taxDeduction.toLocaleString()}</span>
                    </div>
                     <div className="flex justify-between pt-2 border-t border-slate-100 mt-2">
                      <span className="font-bold text-slate-800">Total Deductions</span>
                      <span className="font-bold text-red-600">- RM {result.totalDeductions.toLocaleString()}</span>
                    </div>
                  </div>
               </div>
             </div>

             <div className="bg-slate-900 text-white p-6 rounded-lg flex justify-between items-center mb-6">
                <div>
                   <p className="text-sm text-slate-400">Net Payable Salary</p>
                   <p className="text-4xl font-bold">RM {result.netSalary.toLocaleString()}</p>
                </div>
                <div className="text-right text-xs text-slate-400 border-l border-slate-700 pl-6">
                  <p className="mb-1 font-semibold text-slate-300">Employer Contribution</p>
                  <p>KWSP: RM {result.kwspEmployer}</p>
                  <p>SOCSO: RM {result.socsoEmployer}</p>
                  <p>EIS: RM {result.eisEmployer}</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payroll;