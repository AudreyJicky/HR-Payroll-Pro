import React, { useState } from 'react';
import { mockEmployees, calculatePayroll } from '../services/store';
import { Calculator, Download, RefreshCw } from 'lucide-react';

const Payroll: React.FC = () => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(mockEmployees[0]?.id || '');
  const [otHours, setOtHours] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [bonus, setBonus] = useState(0);

  const selectedEmployee = mockEmployees.find(e => e.id === selectedEmployeeId);
  const result = selectedEmployee 
    ? calculatePayroll(selectedEmployee.basicSalary, otHours, bonus, allowance) 
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

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Base Info</p>
              <div className="flex justify-between mt-2">
                <span className="text-sm text-slate-600">Basic Salary</span>
                <span className="text-sm font-bold">RM {selectedEmployee?.basicSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-sm text-slate-600">Hourly Rate (Est)</span>
                <span className="text-sm">RM {((selectedEmployee?.basicSalary || 0) / 26 / 8).toFixed(2)}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Overtime Hours</label>
              <div className="flex items-center">
                 <input 
                  type="number" 
                  min="0"
                  value={otHours}
                  onChange={(e) => setOtHours(Number(e.target.value))}
                  className="flex-1 p-2 border border-slate-300 rounded-lg outline-none"
                />
                <span className="ml-2 text-slate-500 text-sm">hrs</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Allowance</label>
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
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bonus / Claims</label>
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
              onClick={() => { setOtHours(0); setAllowance(0); setBonus(0); }}
              className="w-full mt-2 flex justify-center items-center py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition"
            >
              <RefreshCw className="w-3 h-3 mr-2" />
              Reset
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
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Basic Salary</span>
                      <span className="font-medium">RM {selectedEmployee?.basicSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Overtime ({otHours} hrs)</span>
                      <span className="font-medium">RM {result.otAmount.toLocaleString()}</span>
                    </div>
                    {allowance > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Allowance</span>
                        <span className="font-medium">RM {allowance.toLocaleString()}</span>
                      </div>
                    )}
                    {bonus > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Bonus/Claims</span>
                        <span className="font-medium">RM {bonus.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-slate-100 mt-2">
                      <span className="font-bold text-slate-800">Gross Salary</span>
                      <span className="font-bold text-slate-800">RM {result.grossSalary.toLocaleString()}</span>
                    </div>
                  </div>
               </div>

               <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Deductions</h4>
                  <div className="space-y-2">
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

             <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center mb-6">
                <div>
                   <p className="text-sm text-slate-500">Net Salary</p>
                   <p className="text-3xl font-bold text-blue-600">RM {result.netSalary.toLocaleString()}</p>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <p>Employer KWSP: RM {result.kwspEmployer}</p>
                  <p>Employer SOCSO: RM {result.socsoEmployer}</p>
                  <p>Employer EIS: RM {result.eisEmployer}</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payroll;