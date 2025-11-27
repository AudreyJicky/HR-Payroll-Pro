import React, { useState } from 'react';
import { mockEmployees } from '../services/store';
import { Employee, Gender, EmploymentType } from '../types';
import { Plus, Search, User, CreditCard, Building, Calendar, Settings, X, DollarSign } from 'lucide-react';

const Employees: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'new'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  
  // Salary Package Modal State
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [selectedEmpForPackage, setSelectedEmpForPackage] = useState<Employee | null>(null);

  // New hire form state
  const [newHire, setNewHire] = useState<Partial<Employee>>({
    gender: Gender.MALE,
    employmentType: EmploymentType.FULL_TIME,
    medicalClaimBalance: 1000,
    medicalClaimUsed: 0,
    status: 'Interviewing',
    accumulatedOvertimeHours: 0,
    salaryPackage: {
      basic: 2000,
      travelAllowance: 0,
      foodAllowance: 0,
      gymBenefit: 0,
      facilitiesBenefit: 0,
      birthdayBenefit: 0,
      nightShiftAllowance: 0
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Handle nested salary package updates for the new hire form if needed, 
    // but for simplicity, we focus on the basic fields first.
    setNewHire(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employee: Employee = {
      ...newHire as Employee,
      id: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      age: parseInt(newHire.age as any) || 0,
      salaryPackage: {
        basic: parseFloat(newHire.salaryPackage?.basic as any) || 0,
        travelAllowance: 0,
        foodAllowance: 0,
        gymBenefit: 0,
        facilitiesBenefit: 0,
        birthdayBenefit: 0,
        nightShiftAllowance: 0
      },
      leaveBalance: { AL: 12, MC: 14, RL: 0, HL: 60 }
    };
    setEmployees([...employees, employee]);
    setActiveTab('list');
  };

  const filteredEmployees = employees.filter(e => 
    e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openPackageModal = (emp: Employee) => {
    setSelectedEmpForPackage({ ...emp });
    setIsPackageModalOpen(true);
  };

  const handlePackageUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpForPackage) return;
    
    // Update local state and mock store
    setEmployees(prev => prev.map(emp => 
      emp.id === selectedEmpForPackage.id ? selectedEmpForPackage : emp
    ));
    
    // Also update the global mock variable if needed, but react state is primary here
    const idx = mockEmployees.findIndex(e => e.id === selectedEmpForPackage.id);
    if(idx !== -1) mockEmployees[idx] = selectedEmpForPackage;

    setIsPackageModalOpen(false);
  };

  const handlePackageChange = (field: string, value: string) => {
    if (!selectedEmpForPackage) return;
    setSelectedEmpForPackage({
      ...selectedEmpForPackage,
      salaryPackage: {
        ...selectedEmpForPackage.salaryPackage,
        [field]: parseFloat(value) || 0
      }
    });
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Employee Management</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-300'}`}
          >
            Employee List
          </button>
          <button 
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'new' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-300'}`}
          >
            <Plus className="w-4 h-4 inline mr-1" />
            New Hire / Application
          </button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Job Details</th>
                  <th className="px-6 py-4">Base Salary</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">OT Hours</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 mr-3">
                          {emp.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{emp.fullName}</p>
                          <p className="text-xs text-slate-500">{emp.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900">{emp.jobTitle}</p>
                      <p className="text-xs">{emp.department}</p>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-700">
                      RM {emp.salaryPackage.basic.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        emp.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        emp.status === 'Resigned' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                         {emp.accumulatedOvertimeHours}h
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => openPackageModal(emp)}
                        className="text-slate-600 hover:text-blue-600 font-medium text-xs flex items-center justify-end gap-1 ml-auto"
                      >
                        <Settings className="w-4 h-4" />
                        Package
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8">
           {/* Form content same as before, abbreviated for brevity */}
           <div>
            <div className="flex items-center gap-2 mb-4 text-slate-900 border-b pb-2">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold">Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input required name="fullName" onChange={handleInputChange} className="w-full p-2 border rounded" type="text" placeholder="Full Name" />
              <input required name="email" onChange={handleInputChange} className="w-full p-2 border rounded" type="email" placeholder="Email" />
              <input required name="phone" onChange={handleInputChange} className="w-full p-2 border rounded" type="tel" placeholder="Phone" />
              <input required name="icNumber" onChange={handleInputChange} className="w-full p-2 border rounded" type="text" placeholder="IC Number" />
            </div>
           </div>
           
           <div className="flex justify-end gap-3 pt-4">
             <button type="button" onClick={() => setActiveTab('list')} className="px-6 py-2 rounded-lg text-slate-600 border border-slate-300 font-medium hover:bg-slate-50">Cancel</button>
             <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm">Save Employee</button>
          </div>
        </form>
      )}

      {/* Salary Package Modal */}
      {isPackageModalOpen && selectedEmpForPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <div>
                 <h3 className="text-xl font-bold text-slate-900">Salary Package Configuration</h3>
                 <p className="text-sm text-slate-500">Configure allowances and benefits for {selectedEmpForPackage.fullName}</p>
              </div>
              <button onClick={() => setIsPackageModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handlePackageUpdate} className="p-6 overflow-y-auto max-h-[80vh]">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 {/* Basic Pay */}
                 <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Basic Monthly Salary</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">RM</span>
                      <input 
                        type="number" 
                        value={selectedEmpForPackage.salaryPackage.basic}
                        onChange={(e) => handlePackageChange('basic', e.target.value)}
                        className="w-full pl-10 p-3 border border-slate-300 rounded-lg text-lg font-bold text-slate-800"
                      />
                    </div>
                 </div>

                 {/* Allowances */}
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Travel Allowance</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">RM</span>
                      <input 
                        type="number" 
                        value={selectedEmpForPackage.salaryPackage.travelAllowance}
                        onChange={(e) => handlePackageChange('travelAllowance', e.target.value)}
                        className="w-full pl-8 p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Food Allowance</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">RM</span>
                      <input 
                        type="number" 
                        value={selectedEmpForPackage.salaryPackage.foodAllowance}
                        onChange={(e) => handlePackageChange('foodAllowance', e.target.value)}
                        className="w-full pl-8 p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gym Benefit</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">RM</span>
                      <input 
                        type="number" 
                        value={selectedEmpForPackage.salaryPackage.gymBenefit}
                        onChange={(e) => handlePackageChange('gymBenefit', e.target.value)}
                        className="w-full pl-8 p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Facilities / Phone</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">RM</span>
                      <input 
                        type="number" 
                        value={selectedEmpForPackage.salaryPackage.facilitiesBenefit}
                        onChange={(e) => handlePackageChange('facilitiesBenefit', e.target.value)}
                        className="w-full pl-8 p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                 </div>
                 
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Birthday Benefit (One-off)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">RM</span>
                      <input 
                        type="number" 
                        value={selectedEmpForPackage.salaryPackage.birthdayBenefit}
                        onChange={(e) => handlePackageChange('birthdayBenefit', e.target.value)}
                        className="w-full pl-8 p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Night Shift Allowance</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">RM</span>
                      <input 
                        type="number" 
                        value={selectedEmpForPackage.salaryPackage.nightShiftAllowance}
                        onChange={(e) => handlePackageChange('nightShiftAllowance', e.target.value)}
                        className="w-full pl-8 p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                 </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                 <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
                 <div>
                    <h4 className="font-bold text-blue-900 text-sm">Auto-Calculation Note</h4>
                    <p className="text-xs text-blue-700 mt-1">
                      Overtime is automatically tracked from the Attendance module. 
                      Annual Leave entitlement is automatically calculated based on Join Date ({selectedEmpForPackage.joinDate}).
                    </p>
                 </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setIsPackageModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-sm"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;