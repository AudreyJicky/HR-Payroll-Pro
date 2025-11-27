import React, { useState } from 'react';
import { 
  Briefcase, 
  Calendar, 
  Monitor, 
  CheckSquare, 
  HeartPulse,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  X,
  FileText,
  UserCheck,
  UserX,
  Edit,
  Save
} from 'lucide-react';
import { 
  mockAssets, 
  mockLeaveRequests as initialLeaveRequests, 
  mockTasks, 
  mockEmployees, 
  mockClaimRecords, 
  updateClaimStatus,
  toggleInterviewAttendance,
  addAsset,
  updateAsset,
  addTask,
  updateTask,
  updateEmployee
} from '../services/store';
import { LeaveType, Asset, Employee, JobTask } from '../types';
import { INITIAL_HOLIDAYS } from '../constants';

const Administration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'leave' | 'assets' | 'jobs' | 'claims' | 'packages'>('leave');
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);
  const [claims, setClaims] = useState(mockClaimRecords);
  const [refresh, setRefresh] = useState(0);

  // --- MODAL STATES ---
  const [isClaimsModalOpen, setIsClaimsModalOpen] = useState(false);
  const [selectedClaimEmployee, setSelectedClaimEmployee] = useState<Employee | null>(null);

  // Asset Modal
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<Partial<Asset>>({});

  // Task Modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<JobTask>>({});

  // Interview Modal
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [currentInterview, setCurrentInterview] = useState<Partial<Employee>>({});

  const forceUpdate = () => setRefresh(prev => prev + 1);

  const handleLeaveAction = (id: string, status: 'Approved' | 'Rejected') => {
    setLeaveRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status } : req
    ));
  };

  const handleClaimAction = (id: string, status: 'Approved' | 'Rejected') => {
    updateClaimStatus(id, status);
    setClaims([...mockClaimRecords]);
  };
  
  const handleInterviewToggle = (id: string) => {
    toggleInterviewAttendance(id);
    forceUpdate();
  };

  const openClaimsHistory = (emp: Employee) => {
    setSelectedClaimEmployee(emp);
    setIsClaimsModalOpen(true);
  };

  // --- ASSET HANDLERS ---
  const handleEditAsset = (asset: Asset | null) => {
    if (asset) {
      setCurrentAsset({ ...asset });
    } else {
      setCurrentAsset({ id: '', name: '', code: '', assignedTo: '', condition: 'New' });
    }
    setIsAssetModalOpen(true);
  };

  const saveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAsset.id && mockAssets.find(a => a.id === currentAsset.id)) {
      updateAsset(currentAsset.id, currentAsset);
    } else {
      addAsset({
        ...currentAsset,
        id: `A${Date.now()}`
      } as Asset);
    }
    setIsAssetModalOpen(false);
    forceUpdate();
  };

  // --- TASK HANDLERS ---
  const handleEditTask = (task: JobTask | null) => {
    if (task) {
      setCurrentTask({ ...task });
    } else {
      setCurrentTask({ id: '', title: '', description: '', status: 'Pending', dueDate: '', assignedTo: '' });
    }
    setIsTaskModalOpen(true);
  };

  const saveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTask.id && mockTasks.find(t => t.id === currentTask.id)) {
      updateTask(currentTask.id, currentTask);
    } else {
      addTask({
        ...currentTask,
        id: `T${Date.now()}`
      } as JobTask);
    }
    setIsTaskModalOpen(false);
    forceUpdate();
  };

  // --- INTERVIEW HANDLERS ---
  const handleEditInterview = (emp: Employee) => {
    setCurrentInterview({ ...emp });
    setIsInterviewModalOpen(true);
  };

  const saveInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInterview.id) {
        updateEmployee(currentInterview.id, currentInterview);
    }
    setIsInterviewModalOpen(false);
    forceUpdate();
  };


  // Filter claims for selected employee
  const currentEmployeeClaims = selectedClaimEmployee 
    ? claims.filter(c => c.employeeId === selectedClaimEmployee.id)
    : [];
  
  const pendingClaims = claims.filter(c => c.status === 'Pending');
  const interviewCandidates = mockEmployees.filter(e => e.status === 'Interviewing');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Administration</h1>
      
      {/* Tabs */}
      <div className="flex space-x-1 bg-white border border-slate-200 p-1 rounded-lg w-fit overflow-x-auto max-w-full shadow-sm">
        {[
          { id: 'leave', label: 'Leave Approval', icon: Calendar },
          { id: 'assets', label: 'Assets & IT', icon: Monitor },
          { id: 'jobs', label: 'Job Scope & Hiring', icon: Briefcase },
          { id: 'claims', label: 'Medical Claims', icon: HeartPulse },
          { id: 'packages', label: 'Packages', icon: DollarSign },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap
              ${activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
            `}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[500px] p-6 relative">
        
        {/* LEAVE MANAGEMENT */}
        {activeTab === 'leave' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">Leave Requests</h3>
              </div>
              <div className="space-y-3">
                {leaveRequests.map(leave => {
                  const employeeName = mockEmployees.find(e => e.id === leave.employeeId)?.fullName || leave.employeeId;
                  return (
                    <div key={leave.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors bg-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className="font-bold text-slate-900">{employeeName}</span>
                             <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{leave.type}</span>
                          </div>
                          <p className="text-sm text-slate-500 font-medium">{leave.startDate} to {leave.endDate}</p>
                          <p className="text-xs text-slate-500 mt-1 italic">"{leave.reason}"</p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold flex items-center border ${
                            leave.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' : 
                            leave.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                             {leave.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                             {leave.status}
                          </span>
                        </div>
                      </div>

                      {/* Approval Buttons */}
                      {leave.status === 'Pending' && (
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end gap-2">
                           <button 
                            onClick={() => handleLeaveAction(leave.id, 'Rejected')}
                            className="flex items-center px-3 py-1.5 text-xs font-medium text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 rounded-lg transition-colors"
                           >
                             <XCircle className="w-3.5 h-3.5 mr-1.5" /> Reject
                           </button>
                           <button 
                            onClick={() => handleLeaveAction(leave.id, 'Approved')}
                            className="flex items-center px-3 py-1.5 text-xs font-medium text-emerald-700 bg-white border border-emerald-200 hover:bg-emerald-50 rounded-lg transition-colors"
                           >
                             <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Approve
                           </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="border-l pl-8 border-slate-100">
               <h3 className="text-lg font-bold text-slate-800 mb-4">Public Holidays</h3>
               <div className="space-y-2 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                 {INITIAL_HOLIDAYS.map(holiday => (
                   <div key={holiday.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
                      <span className="text-sm font-medium text-slate-900">{holiday.name}</span>
                      <span className="text-xs text-slate-500 font-mono">
                        {holiday.date}
                      </span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* ASSETS */}
        {activeTab === 'assets' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Company Assets (IT Support)</h3>
              <button 
                onClick={() => handleEditAsset(null)}
                className="flex items-center text-sm bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 border border-slate-900"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Asset
              </button>
            </div>
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-4 border-b border-slate-200">Asset Name</th>
                  <th className="p-4 border-b border-slate-200">Code / Tag</th>
                  <th className="p-4 border-b border-slate-200">Assigned To</th>
                  <th className="p-4 border-b border-slate-200">Condition</th>
                  <th className="p-4 border-b border-slate-200 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockAssets.map(asset => (
                  <tr key={asset.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-900">{asset.name}</td>
                    <td className="p-4 font-mono text-slate-600">
                        <span className="border border-slate-200 rounded px-2 py-0.5 bg-slate-50">{asset.code}</span>
                    </td>
                    <td className="p-4 text-slate-600">{asset.assignedTo || 'Unassigned'}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-white border border-green-200 text-green-700 rounded text-xs">
                        {asset.condition}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                       <button onClick={() => handleEditAsset(asset)} className="text-blue-600 hover:text-blue-800 p-1">
                         <Edit className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* JOBS */}
        {activeTab === 'jobs' && (
          <div className="space-y-8">
            {/* Daily Jobs */}
            <div>
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-bold text-slate-800">Daily Jobs & Waiting List</h3>
                   <button 
                      onClick={() => handleEditTask(null)}
                      className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center"
                   >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Task
                   </button>
                </div>
                <div className="space-y-3">
                {mockTasks.map(task => (
                    <div key={task.id} className="flex items-start p-4 border border-slate-200 rounded-lg bg-white relative group">
                      <CheckSquare className={`w-5 h-5 mr-4 mt-0.5 ${task.status === 'Completed' ? 'text-green-500' : 'text-slate-300'}`} />
                      <div className="flex-1">
                          <h4 className="font-bold text-slate-900">{task.title}</h4>
                          <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                          <div className="flex gap-4 mt-3 text-xs text-slate-400">
                              <span>Due: {task.dueDate}</span>
                              <span>Assignee: {task.assignedTo}</span>
                              <span className={`px-2 rounded-full border ${
                              task.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-50 border-slate-200'
                              }`}>{task.status}</span>
                          </div>
                      </div>
                      <button 
                        onClick={() => handleEditTask(task)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                         <Edit className="w-4 h-4" />
                      </button>
                    </div>
                ))}
                </div>
            </div>

            {/* Interviews */}
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 pt-6 border-t border-slate-100">Interview Schedule</h3>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-sm bg-white">
                        <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Candidate Name</th>
                                <th className="px-6 py-4">Position</th>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4 text-center">Attended?</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {interviewCandidates.map(candidate => (
                                <tr key={candidate.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-slate-900">{candidate.fullName}</p>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{candidate.jobTitle}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-slate-900 font-medium">{candidate.interviewDate}</p>
                                        <p className="text-xs text-slate-500">{candidate.interviewTime}</p>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-xs">
                                        <p>{candidate.phone}</p>
                                        <p>{candidate.email}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => handleInterviewToggle(candidate.id)}
                                            className={`
                                                inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border transition-all
                                                ${candidate.interviewAttended 
                                                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                                                    : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300'
                                                }
                                            `}
                                        >
                                            {candidate.interviewAttended ? (
                                                <><UserCheck className="w-3 h-3 mr-1" /> Yes</>
                                            ) : (
                                                <><UserX className="w-3 h-3 mr-1" /> No</>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                       <button onClick={() => handleEditInterview(candidate)} className="text-blue-600 hover:text-blue-800 p-1">
                                          <Edit className="w-4 h-4" />
                                       </button>
                                    </td>
                                </tr>
                            ))}
                            {interviewCandidates.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-6 text-slate-400">No upcoming interviews found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        )}

        {/* CLAIMS */}
        {activeTab === 'claims' && (
          <div className="space-y-8">
            {/* Pending Approvals Section with Scroll (Roller) */}
            {pendingClaims.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-amber-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Pending Approvals ({pendingClaims.length})
                </h3>
                
                {/* Scrollable Container ("Roller") */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden max-h-[400px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left text-sm relative">
                    <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th className="px-4 py-3 bg-slate-50">Date</th>
                        <th className="px-4 py-3 bg-slate-50">Employee</th>
                        <th className="px-4 py-3 bg-slate-50">Type</th>
                        <th className="px-4 py-3 bg-slate-50 w-1/3">Description</th>
                        <th className="px-4 py-3 bg-slate-50">Receipt</th>
                        <th className="px-4 py-3 bg-slate-50">Amount</th>
                        <th className="px-4 py-3 bg-slate-50 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pendingClaims.map(claim => {
                        const empName = mockEmployees.find(e => e.id === claim.employeeId)?.fullName || claim.employeeId;
                        return (
                          <tr key={claim.id} className="hover:bg-slate-50">
                             <td className="px-4 py-3 text-slate-600">{claim.date}</td>
                             <td className="px-4 py-3 font-medium text-slate-900">{empName}</td>
                             <td className="px-4 py-3">
                               <span className="bg-white text-slate-600 px-2 py-1 rounded text-xs border border-slate-200">{claim.type}</span>
                             </td>
                             <td className="px-4 py-3 text-slate-600 break-words">{claim.description}</td>
                             <td className="px-4 py-3">
                               {claim.receiptUrl && claim.receiptUrl !== '#' ? (
                                 <a href={claim.receiptUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center text-xs">
                                   <FileText className="w-3 h-3 mr-1"/> View
                                 </a>
                               ) : (
                                 <span className="text-slate-400 text-xs italic">No file</span>
                               )}
                             </td>
                             <td className="px-4 py-3 font-bold text-slate-800">RM {claim.amount.toFixed(2)}</td>
                             <td className="px-4 py-3 text-right">
                               <div className="flex justify-end gap-2">
                                 <button 
                                   onClick={() => handleClaimAction(claim.id, 'Rejected')}
                                   className="p-1.5 text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-colors"
                                   title="Reject"
                                 >
                                   <XCircle className="w-5 h-5" />
                                 </button>
                                 <button 
                                   onClick={() => handleClaimAction(claim.id, 'Approved')}
                                   className="p-1.5 text-emerald-600 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-lg transition-colors"
                                   title="Approve"
                                 >
                                   <CheckCircle className="w-5 h-5" />
                                 </button>
                               </div>
                             </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Balances Overview */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Employee Medical Balances</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockEmployees.map(emp => {
                  if (emp.status === 'Interviewing') return null; // Skip interview candidates
                  const percentage = (emp.medicalClaimUsed / 1000) * 100;
                  return (
                    <div key={emp.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-slate-900">{emp.fullName}</h4>
                          <p className="text-xs text-slate-500">{emp.id}</p>
                        </div>
                        <HeartPulse className="w-5 h-5 text-rose-500" />
                      </div>
                      
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-slate-600">Used: RM {emp.medicalClaimUsed}</span>
                        <span className="text-slate-600">Limit: RM 1000</span>
                      </div>
                      
                      <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
                        <div 
                          className={`h-2 rounded-full ${percentage > 80 ? 'bg-red-500' : 'bg-green-500'}`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                         <span className="text-slate-400">Balance: RM {emp.medicalClaimBalance}</span>
                         <button 
                           onClick={() => openClaimsHistory(emp)}
                           className="text-blue-600 font-medium hover:underline flex items-center"
                         >
                           View History
                         </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PACKAGES */}
        {activeTab === 'packages' && (
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-6">Employee Salary Packages</h3>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
               <table className="w-full text-left text-sm border-collapse bg-white">
                 <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                   <tr>
                     <th className="p-4 border-b border-slate-200">Employee</th>
                     <th className="p-4 border-b border-slate-200">Basic</th>
                     <th className="p-4 border-b border-slate-200">Allowances</th>
                     <th className="p-4 border-b border-slate-200">OT Hours (Auto)</th>
                     <th className="p-4 border-b border-slate-200">Total Package Value</th>
                   </tr>
                 </thead>
                 <tbody>
                    {mockEmployees.map(emp => {
                      if (emp.status === 'Interviewing') return null;
                      const totalAllowances = 
                        emp.salaryPackage.travelAllowance + 
                        emp.salaryPackage.foodAllowance + 
                        emp.salaryPackage.gymBenefit + 
                        emp.salaryPackage.facilitiesBenefit +
                        emp.salaryPackage.nightShiftAllowance;
                      
                      const totalValue = emp.salaryPackage.basic + totalAllowances;
                      
                      return (
                        <tr key={emp.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                          <td className="p-4">
                             <div className="font-medium text-slate-900">{emp.fullName}</div>
                             <div className="text-xs text-slate-500">{emp.jobTitle}</div>
                          </td>
                          <td className="p-4 font-mono text-slate-600">RM {emp.salaryPackage.basic.toLocaleString()}</td>
                          <td className="p-4">
                            <div className="flex flex-col text-xs space-y-1 text-slate-600">
                               {emp.salaryPackage.travelAllowance > 0 && <span>Travel: RM {emp.salaryPackage.travelAllowance}</span>}
                               {emp.salaryPackage.gymBenefit > 0 && <span>Gym: RM {emp.salaryPackage.gymBenefit}</span>}
                               {totalAllowances === 0 && <span className="text-slate-400">-</span>}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-white border border-blue-200 text-blue-700 rounded text-xs font-bold">
                              {emp.accumulatedOvertimeHours} hrs
                            </span>
                          </td>
                          <td className="p-4 font-bold text-emerald-700">RM {totalValue.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                 </tbody>
               </table>
            </div>
          </div>
        )}

        {/* --- MODALS --- */}

        {/* ASSET MODAL */}
        {isAssetModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-bold">{currentAsset.id ? 'Edit Asset' : 'Add New Asset'}</h3>
                   <button onClick={() => setIsAssetModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <form onSubmit={saveAsset} className="space-y-4">
                   <input required className="w-full p-2 border rounded" placeholder="Asset Name (e.g. MacBook)" value={currentAsset.name || ''} onChange={e => setCurrentAsset({...currentAsset, name: e.target.value})} />
                   <input required className="w-full p-2 border rounded" placeholder="Asset Code (e.g. IT-001)" value={currentAsset.code || ''} onChange={e => setCurrentAsset({...currentAsset, code: e.target.value})} />
                   <input className="w-full p-2 border rounded" placeholder="Assigned To (Emp ID)" value={currentAsset.assignedTo || ''} onChange={e => setCurrentAsset({...currentAsset, assignedTo: e.target.value})} />
                   <select className="w-full p-2 border rounded" value={currentAsset.condition || 'New'} onChange={e => setCurrentAsset({...currentAsset, condition: e.target.value as any})}>
                      <option value="New">New</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                   </select>
                   <button type="submit" className="w-full py-2 bg-slate-900 text-white rounded font-medium">Save Asset</button>
                </form>
             </div>
           </div>
        )}

        {/* TASK MODAL */}
        {isTaskModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-bold">{currentTask.id ? 'Edit Task' : 'Add Job Task'}</h3>
                   <button onClick={() => setIsTaskModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <form onSubmit={saveTask} className="space-y-4">
                   <input required className="w-full p-2 border rounded" placeholder="Task Title" value={currentTask.title || ''} onChange={e => setCurrentTask({...currentTask, title: e.target.value})} />
                   <textarea required className="w-full p-2 border rounded" placeholder="Description" rows={3} value={currentTask.description || ''} onChange={e => setCurrentTask({...currentTask, description: e.target.value})} />
                   <div className="grid grid-cols-2 gap-4">
                      <input required type="date" className="w-full p-2 border rounded" value={currentTask.dueDate || ''} onChange={e => setCurrentTask({...currentTask, dueDate: e.target.value})} />
                      <input className="w-full p-2 border rounded" placeholder="Assignee ID" value={currentTask.assignedTo || ''} onChange={e => setCurrentTask({...currentTask, assignedTo: e.target.value})} />
                   </div>
                   <select className="w-full p-2 border rounded" value={currentTask.status || 'Pending'} onChange={e => setCurrentTask({...currentTask, status: e.target.value as any})}>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                   </select>
                   <button type="submit" className="w-full py-2 bg-slate-900 text-white rounded font-medium">Save Task</button>
                </form>
             </div>
           </div>
        )}

        {/* INTERVIEW MODAL */}
        {isInterviewModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-bold">Edit Interview Details</h3>
                   <button onClick={() => setIsInterviewModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <form onSubmit={saveInterview} className="space-y-4">
                   <div>
                       <label className="text-xs text-slate-500">Candidate Name</label>
                       <input className="w-full p-2 border rounded" value={currentInterview.fullName || ''} onChange={e => setCurrentInterview({...currentInterview, fullName: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-500">Date</label>
                        <input type="date" className="w-full p-2 border rounded" value={currentInterview.interviewDate || ''} onChange={e => setCurrentInterview({...currentInterview, interviewDate: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Time</label>
                        <input type="time" className="w-full p-2 border rounded" value={currentInterview.interviewTime || ''} onChange={e => setCurrentInterview({...currentInterview, interviewTime: e.target.value})} />
                      </div>
                   </div>
                   <div>
                       <label className="text-xs text-slate-500">Phone</label>
                       <input className="w-full p-2 border rounded" value={currentInterview.phone || ''} onChange={e => setCurrentInterview({...currentInterview, phone: e.target.value})} />
                   </div>
                   <div>
                       <label className="text-xs text-slate-500">Email</label>
                       <input className="w-full p-2 border rounded" value={currentInterview.email || ''} onChange={e => setCurrentInterview({...currentInterview, email: e.target.value})} />
                   </div>
                   <button type="submit" className="w-full py-2 bg-slate-900 text-white rounded font-medium">Update Interview</button>
                </form>
             </div>
           </div>
        )}

        {/* CLAIMS HISTORY MODAL */}
        {isClaimsModalOpen && selectedClaimEmployee && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/5 rounded-xl backdrop-blur-[2px]">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-slate-200 m-4 flex flex-col max-h-[90%]">
               <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white rounded-t-xl">
                 <div>
                    <h3 className="text-xl font-bold text-slate-900">Claims History</h3>
                    <p className="text-sm text-slate-500">Records for {selectedClaimEmployee.fullName}</p>
                 </div>
                 <button onClick={() => setIsClaimsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                   <X className="w-6 h-6" />
                 </button>
               </div>
               
               <div className="p-6 overflow-y-auto bg-white">
                  {currentEmployeeClaims.length > 0 ? (
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Type</th>
                          <th className="px-4 py-3">Description</th>
                          <th className="px-4 py-3">Amount</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentEmployeeClaims.map(claim => (
                          <tr key={claim.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-slate-600">{claim.date}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs text-slate-600">{claim.type}</span>
                            </td>
                            <td className="px-4 py-3 text-slate-800 break-all">{claim.description}</td>
                            <td className="px-4 py-3 font-mono font-medium text-slate-900">RM {claim.amount}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                                claim.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                claim.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {claim.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-10 text-slate-400">
                       <p>No claim records found for this employee.</p>
                    </div>
                  )}

                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                    <button 
                      onClick={() => setIsClaimsModalOpen(false)}
                      className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      Close
                    </button>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Administration;