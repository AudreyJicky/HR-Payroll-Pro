import React, { useState } from 'react';
import { mockEmployees } from '../services/store';
import { Employee, Gender, EmploymentType } from '../types';
import { Plus, Search, User, CreditCard, Building, Calendar } from 'lucide-react';

const Employees: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'new'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);

  // New hire form state (simplified for demo)
  const [newHire, setNewHire] = useState<Partial<Employee>>({
    gender: Gender.MALE,
    employmentType: EmploymentType.FULL_TIME,
    medicalClaimBalance: 1000,
    medicalClaimUsed: 0,
    status: 'Interviewing'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewHire(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employee: Employee = {
      ...newHire as Employee,
      id: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      age: parseInt(newHire.age as any) || 0,
      basicSalary: parseFloat(newHire.basicSalary as any) || 0,
    };
    setEmployees([...employees, employee]);
    setActiveTab('list');
    setNewHire({ gender: Gender.MALE, employmentType: EmploymentType.FULL_TIME, status: 'Interviewing' });
  };

  const filteredEmployees = employees.filter(e => 
    e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
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
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Join Date</th>
                  <th className="px-6 py-4">Action</th>
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
                    <td className="px-6 py-4">
                      <p>{emp.email}</p>
                      <p className="text-xs">{emp.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        emp.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        emp.status === 'Resigned' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {emp.status}
                      </span>
                      {emp.status === 'Interviewing' && emp.interviewDate && (
                        <p className="text-xs mt-1 text-amber-700">Int: {emp.interviewDate} {emp.interviewTime}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">{emp.joinDate}</td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8">
          
          {/* Section: Personal Info */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-slate-900 border-b pb-2">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold">Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input required name="fullName" onChange={handleInputChange} className="w-full p-2 border rounded" type="text" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">IC Number</label>
                <input required name="icNumber" onChange={handleInputChange} className="w-full p-2 border rounded" type="text" placeholder="900101-14-1234" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <select name="gender" onChange={handleInputChange} className="w-full p-2 border rounded">
                  <option value={Gender.MALE}>Male</option>
                  <option value={Gender.FEMALE}>Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input required name="phone" onChange={handleInputChange} className="w-full p-2 border rounded" type="tel" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input required name="email" onChange={handleInputChange} className="w-full p-2 border rounded" type="email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input name="address" onChange={handleInputChange} className="w-full p-2 border rounded" type="text" />
              </div>
            </div>
          </div>

          {/* Section: Job Info */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-slate-900 border-b pb-2">
              <Building className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold">Job & Application</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                <input required name="jobTitle" onChange={handleInputChange} className="w-full p-2 border rounded" type="text" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                <input required name="department" onChange={handleInputChange} className="w-full p-2 border rounded" type="text" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Basic Salary (RM)</label>
                <input required name="basicSalary" onChange={handleInputChange} className="w-full p-2 border rounded" type="number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
                <select name="employmentType" onChange={handleInputChange} className="w-full p-2 border rounded">
                  {Object.values(EmploymentType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Application Status</label>
                <select name="status" value={newHire.status} onChange={handleInputChange} className="w-full p-2 border rounded">
                  <option value="Interviewing">Interviewing</option>
                  <option value="Active">Active (Hired)</option>
                </select>
              </div>
              {newHire.status === 'Interviewing' && (
                <>
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Interview Date</label>
                    <input name="interviewDate" onChange={handleInputChange} className="w-full p-2 border rounded" type="date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Interview Time</label>
                    <input name="interviewTime" onChange={handleInputChange} className="w-full p-2 border rounded" type="time" />
                  </div>
                </>
              )}
               {newHire.status === 'Active' && (
                 <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Join Date</label>
                    <input name="joinDate" onChange={handleInputChange} className="w-full p-2 border rounded" type="date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Resign Notice Period</label>
                    <input name="resignNoticePeriod" onChange={handleInputChange} placeholder="e.g. 2 Months" className="w-full p-2 border rounded" type="text" />
                  </div>
                 </>
               )}
            </div>
          </div>

          {/* Section: Banking & Statutory */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-slate-900 border-b pb-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold">Banking & Statutory</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label>
                <input name="bankName" onChange={handleInputChange} className="w-full p-2 border rounded" type="text" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
                <input name="bankAccountNumber" onChange={handleInputChange} className="w-full p-2 border rounded" type="text" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">KWSP Number</label>
                <input name="kwspNumber" onChange={handleInputChange} className="w-full p-2 border rounded" type="text" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SOCSO Number</label>
                <input name="socsoNumber" onChange={handleInputChange} className="w-full p-2 border rounded" type="text" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tax Number (LHDN)</label>
                <input name="taxNumber" onChange={handleInputChange} className="w-full p-2 border rounded" type="text" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
             <button type="button" onClick={() => setActiveTab('list')} className="px-6 py-2 rounded-lg text-slate-600 border border-slate-300 font-medium hover:bg-slate-50">Cancel</button>
             <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm">Save Employee</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Employees;