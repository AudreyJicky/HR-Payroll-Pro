import React, { useState } from 'react';
import { 
  Briefcase, 
  Calendar, 
  Monitor, 
  CheckSquare, 
  HeartPulse,
  Plus
} from 'lucide-react';
import { mockAssets, mockLeaveRequests, mockTasks, mockEmployees } from '../services/store';
import { LeaveType, Asset } from '../types';
import { INITIAL_HOLIDAYS } from '../constants';

const Administration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'leave' | 'assets' | 'jobs' | 'claims'>('leave');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Administration</h1>
      
      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
        {[
          { id: 'leave', label: 'Leave & Holidays', icon: Calendar },
          { id: 'assets', label: 'Assets & IT', icon: Monitor },
          { id: 'jobs', label: 'Job Scope', icon: Briefcase },
          { id: 'claims', label: 'Medical Claims', icon: HeartPulse },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all
              ${activeTab === tab.id 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'}
            `}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[500px] p-6">
        
        {/* LEAVE MANAGEMENT */}
        {activeTab === 'leave' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">Leave Applications</h3>
                <button className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-medium hover:bg-blue-100">
                  + Apply Leave
                </button>
              </div>
              <div className="space-y-3">
                {mockLeaveRequests.map(leave => (
                  <div key={leave.id} className="border border-slate-100 rounded-lg p-4 hover:bg-slate-50">
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-700">{leave.type}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        leave.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>{leave.status}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{leave.startDate} to {leave.endDate}</p>
                    <p className="text-xs text-slate-400 mt-2">Reason: {leave.reason}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-l pl-8 border-slate-100">
               <h3 className="text-lg font-bold text-slate-800 mb-4">Public Holidays</h3>
               <div className="space-y-2 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                 {INITIAL_HOLIDAYS.map(holiday => (
                   <div key={holiday.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-700">{holiday.name}</span>
                      <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
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
              <button className="flex items-center text-sm bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800">
                <Plus className="w-4 h-4 mr-2" /> Add Asset
              </button>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                <tr>
                  <th className="p-4">Asset Name</th>
                  <th className="p-4">Code / Tag</th>
                  <th className="p-4">Assigned To</th>
                  <th className="p-4">Condition</th>
                </tr>
              </thead>
              <tbody>
                {mockAssets.map(asset => (
                  <tr key={asset.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-900">{asset.name}</td>
                    <td className="p-4 font-mono text-slate-600 bg-slate-50 inline-block m-2 rounded px-2">{asset.code}</td>
                    <td className="p-4 text-slate-600">{asset.assignedTo || 'Unassigned'}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        {asset.condition}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* JOBS */}
        {activeTab === 'jobs' && (
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-6">Daily Jobs & Waiting List</h3>
            <div className="space-y-4">
              {mockTasks.map(task => (
                <div key={task.id} className="flex items-start p-4 border border-slate-200 rounded-lg">
                   <CheckSquare className={`w-5 h-5 mr-4 mt-0.5 ${task.status === 'Completed' ? 'text-green-500' : 'text-slate-300'}`} />
                   <div className="flex-1">
                      <h4 className="font-bold text-slate-900">{task.title}</h4>
                      <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                      <div className="flex gap-4 mt-3 text-xs text-slate-400">
                        <span>Due: {task.dueDate}</span>
                        <span>Assignee: {task.assignedTo}</span>
                        <span className={`px-2 rounded-full ${
                          task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100'
                        }`}>{task.status}</span>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CLAIMS */}
        {activeTab === 'claims' && (
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-6">Medical Claims Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockEmployees.map(emp => {
                const percentage = (emp.medicalClaimUsed / 1000) * 100;
                return (
                  <div key={emp.id} className="border border-slate-200 rounded-xl p-6">
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
                       <button className="text-blue-600 font-medium hover:underline">View History</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Administration;