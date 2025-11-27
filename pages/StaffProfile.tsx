import React, { useState, useContext } from 'react';
import { UserContext } from '../components/Layout';
import { mockEmployees, mockClaimRecords, addClaim } from '../services/store';
import { User, Briefcase, HeartPulse, Calendar, Send, DollarSign, Upload, FileText, Download } from 'lucide-react';
import { LeaveType, ClaimRecord } from '../types';

const StaffProfile: React.FC = () => {
  const { name, avatar } = useContext(UserContext);
  // In a real app, we would fetch the employee data based on the logged-in user ID
  // For this demo, we'll use the first mock employee or fallback
  const employeeData = mockEmployees[0];

  const [activeTab, setActiveTab] = useState<'leave' | 'claim'>('leave');

  // Leave State
  const [leaveType, setLeaveType] = useState<LeaveType>(LeaveType.AL);
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  // Claim State
  const [claimType, setClaimType] = useState<'Medical' | 'Travel' | 'Other'>('Medical');
  const [claimDate, setClaimDate] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [claimDescription, setClaimDescription] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [claimSubmitted, setClaimSubmitted] = useState(false);

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    setLeaveSubmitted(true);
    setTimeout(() => {
        setLeaveSubmitted(false);
        setLeaveReason('');
        setLeaveStartDate('');
        setLeaveEndDate('');
        alert("Leave application submitted to manager!");
    }, 1500);
  };

  const handleApplyClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimSubmitted(true);
    
    // Simulate API call and store update
    setTimeout(() => {
        const newClaim: ClaimRecord = {
          id: `C${Date.now()}`,
          employeeId: employeeData.id,
          date: claimDate,
          type: claimType,
          amount: parseFloat(claimAmount),
          description: claimDescription,
          status: 'Pending',
          receiptUrl: receiptFile ? URL.createObjectURL(receiptFile) : '#'
        };
        addClaim(newClaim);
        
        setClaimSubmitted(false);
        setClaimAmount('');
        setClaimDescription('');
        setClaimDate('');
        setReceiptFile(null);
        alert("Claim submitted successfully!");
    }, 1500);
  };

  const downloadPayslip = (month: string) => {
    alert(`Downloading Payslip for ${month}...`);
    // In a real app, this would trigger a PDF generation or file fetch
  };

  const pkg = employeeData.salaryPackage;
  const totalAllowances = 
        (pkg.travelAllowance || 0) + 
        (pkg.foodAllowance || 0) + 
        (pkg.gymBenefit || 0) + 
        (pkg.facilitiesBenefit || 0) +
        (pkg.nightShiftAllowance || 0) +
        (pkg.birthdayBenefit || 0);

  // Get user's recent claims
  const myClaims = mockClaimRecords.filter(c => c.employeeId === employeeData.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
                <img src={avatar} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-slate-100 mb-4" />
                <h2 className="text-xl font-bold text-slate-900">{name}</h2>
                <p className="text-slate-500">{employeeData.jobTitle}</p>
                <div className="mt-4 flex gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {employeeData.department}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {employeeData.status}
                    </span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Personal Details
                </h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-slate-500">Age</span>
                        <span className="font-medium">{employeeData.age} Years</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-slate-500">Gender</span>
                        <span className="font-medium">{employeeData.gender}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-slate-500">Join Date</span>
                        <span className="font-medium">{employeeData.joinDate}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-slate-500">Phone</span>
                        <span className="font-medium">{employeeData.phone}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-slate-500">Email</span>
                        <span className="font-medium">{employeeData.email}</span>
                    </div>
                </div>
            </div>
            
            {/* My Package Summary */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-lg border border-slate-700">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-amber-400" />
                    My Package
                </h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-slate-700 pb-2">
                        <span className="text-slate-400">Basic Salary</span>
                        <span className="font-mono font-bold text-amber-400">RM {pkg.basic.toLocaleString()}</span>
                    </div>
                    {pkg.travelAllowance > 0 && (
                        <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">Travel Allowance</span>
                            <span className="font-mono">RM {pkg.travelAllowance}</span>
                        </div>
                    )}
                    {pkg.gymBenefit > 0 && (
                        <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span className="text-slate-400">Gym Benefit</span>
                            <span className="font-mono">RM {pkg.gymBenefit}</span>
                        </div>
                    )}
                     <div className="flex justify-between pt-2">
                        <span className="text-slate-300">Est. Total Monthly</span>
                        <span className="font-mono font-bold">RM {(pkg.basic + totalAllowances).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Monthly Payslips */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                    Monthly Payslips
                </h3>
                <div className="space-y-2">
                    {['October 2024', 'September 2024', 'August 2024'].map((month, idx) => (
                         <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors">
                            <span className="text-sm font-medium text-slate-700">{month}</span>
                            <button 
                                onClick={() => downloadPayslip(month)}
                                className="text-indigo-600 hover:text-indigo-800"
                                title="Download PDF"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Balances & Application Forms */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Balances Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 mb-1">Annual Leave</p>
                    <p className="text-2xl font-bold text-blue-600">{employeeData.leaveBalance.AL} <span className="text-xs text-slate-400 font-normal">days</span></p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 mb-1">Medical Leave</p>
                    <p className="text-2xl font-bold text-emerald-600">{employeeData.leaveBalance.MC} <span className="text-xs text-slate-400 font-normal">days</span></p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 mb-1">Overtime</p>
                    <p className="text-2xl font-bold text-amber-600">{employeeData.accumulatedOvertimeHours} <span className="text-xs text-slate-400 font-normal">hrs</span></p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 mb-1">Medical Claim</p>
                    <p className="text-2xl font-bold text-rose-600">RM {employeeData.medicalClaimBalance}</p>
                    <p className="text-[10px] text-slate-400">Balance available</p>
                </div>
            </div>

            {/* Application Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex border-b border-slate-200">
                    <button 
                        onClick={() => setActiveTab('leave')}
                        className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'leave' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-slate-50 text-slate-500 hover:text-slate-700'}`}
                    >
                        Apply for Leave
                    </button>
                    <button 
                        onClick={() => setActiveTab('claim')}
                        className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'claim' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-slate-50 text-slate-500 hover:text-slate-700'}`}
                    >
                        Medical / Expenses Claim
                    </button>
                </div>

                <div className="p-8">
                    {activeTab === 'leave' ? (
                        <form onSubmit={handleApplyLeave} className="space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                <h3 className="text-lg font-bold text-slate-900">Leave Application</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
                                    <select 
                                        value={leaveType}
                                        onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {Object.values(LeaveType).map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Supporting Document</label>
                                    <input type="file" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                                    <input 
                                        required
                                        type="date" 
                                        value={leaveStartDate}
                                        onChange={(e) => setLeaveStartDate(e.target.value)}
                                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                                    <input 
                                        required
                                        type="date" 
                                        value={leaveEndDate}
                                        onChange={(e) => setLeaveEndDate(e.target.value)}
                                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
                                <textarea 
                                    required
                                    rows={3}
                                    value={leaveReason}
                                    onChange={(e) => setLeaveReason(e.target.value)}
                                    placeholder="Please describe the reason for your leave..."
                                    className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={leaveSubmitted}
                                    className={`flex items-center px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm ${leaveSubmitted ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    {leaveSubmitted ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleApplyClaim} className="space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <HeartPulse className="w-5 h-5 text-rose-600" />
                                <h3 className="text-lg font-bold text-slate-900">New Expense Claim</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Claim Type</label>
                                    <select 
                                        value={claimType}
                                        onChange={(e) => setClaimType(e.target.value as any)}
                                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Medical">Medical (Clinic/Dental)</option>
                                        <option value="Travel">Travel (Mileage/Transport)</option>
                                        <option value="Other">Other Expenses</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Date of Receipt</label>
                                    <input 
                                        required
                                        type="date" 
                                        value={claimDate}
                                        onChange={(e) => setClaimDate(e.target.value)}
                                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Amount (RM)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">RM</span>
                                        <input 
                                            required
                                            type="number"
                                            step="0.01" 
                                            value={claimAmount}
                                            onChange={(e) => setClaimAmount(e.target.value)}
                                            className="w-full pl-10 p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Upload Receipt</label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-6 h-6 mb-2 text-slate-400" />
                                                <p className="text-sm text-slate-500 text-center"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-slate-400">PDF, PNG, JPG (MAX. 2MB)</p>
                                            </div>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*,.pdf"
                                                onChange={(e) => setReceiptFile(e.target.files ? e.target.files[0] : null)}
                                            />
                                        </label>
                                    </div>
                                    {receiptFile && <p className="text-xs text-green-600 mt-1 flex items-center"><FileText className="w-3 h-3 mr-1"/> {receiptFile.name}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea 
                                    required
                                    rows={2}
                                    value={claimDescription}
                                    onChange={(e) => setClaimDescription(e.target.value)}
                                    placeholder="Details about the expense (e.g. Clinic name, Client meeting loc)"
                                    className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={claimSubmitted}
                                    className={`flex items-center px-6 py-2.5 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition shadow-sm ${claimSubmitted ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    {claimSubmitted ? 'Submitting...' : 'Submit Claim'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Recent History Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <h3 className="text-md font-bold text-slate-900 mb-4">My Recent History</h3>
                 {activeTab === 'leave' ? (
                     <p className="text-sm text-slate-500 italic">No recent leave applications.</p>
                 ) : (
                     <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Type</th>
                                    <th className="px-4 py-2">Amount</th>
                                    <th className="px-4 py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {myClaims.map(c => (
                                    <tr key={c.id}>
                                        <td className="px-4 py-2">{c.date}</td>
                                        <td className="px-4 py-2">{c.type}</td>
                                        <td className="px-4 py-2">RM {c.amount}</td>
                                        <td className="px-4 py-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                                                c.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                c.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                                {c.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {myClaims.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-4 text-center text-slate-500">No claims found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                     </div>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;