import React, { useContext } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Users, Clock, CalendarDays, DollarSign, Briefcase, FileText, CheckCircle, XCircle } from 'lucide-react';
import { mockEmployees, mockTasks, mockLeaveRequests, mockClaimRecords } from '../services/store';
import { INITIAL_HOLIDAYS } from '../constants';
import { UserContext } from '../components/Layout';

const Dashboard: React.FC = () => {
  const { role } = useContext(UserContext);
  
  // Shared Data
  const totalStaff = mockEmployees.length;
  const activeStaff = mockEmployees.filter(e => e.status === 'Active').length;
  
  // ADMIN DASHBOARD
  if (role === 'Admin') {
    const pendingTasks = mockTasks.filter(t => t.status !== 'Completed').length;
    // Mock data for charts
    const salaryData = [
      { name: 'IT', amount: 12000 },
      { name: 'HR', amount: 8000 },
      { name: 'Sales', amount: 15000 },
      { name: 'Ops', amount: 9000 },
    ];

    const attendanceData = [
      { name: 'Present', value: 85 },
      { name: 'Late', value: 5 },
      { name: 'Absent', value: 2 },
      { name: 'On Leave', value: 8 },
    ];
    
    const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981'];

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        
        {/* Stats Grid - High Contrast White Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Staff</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{totalStaff}</h3>
              </div>
              <div className="p-3 border border-slate-100 rounded-lg">
                <Users className="w-6 h-6 text-slate-900" />
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2 font-medium">
              {activeStaff} Active Employees
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Pending Tasks</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{pendingTasks}</h3>
              </div>
              <div className="p-3 border border-slate-100 rounded-lg">
                <Clock className="w-6 h-6 text-slate-900" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Job Scope Items
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Upcoming Holiday</p>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Deepavali</h3>
              </div>
              <div className="p-3 border border-slate-100 rounded-lg">
                <CalendarDays className="w-6 h-6 text-slate-900" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              31 Oct 2024
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Payroll (Est)</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">RM 48.5k</h3>
              </div>
              <div className="p-3 border border-slate-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-slate-900" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              This Month
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 h-[400px]">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Salary Distribution by Department</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{backgroundColor: '#fff', borderColor: '#e2e8f0', color: '#0f172a'}} itemStyle={{color: '#0f172a'}} />
                <Bar dataKey="amount" fill="#0f172a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 h-[400px]">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Today's Attendance</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#fff', borderColor: '#e2e8f0', color: '#0f172a'}} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {attendanceData.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-xs text-slate-600">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STAFF DASHBOARD
  const empId = mockEmployees[0].id; // Mock current user
  const myLeaves = mockLeaveRequests.filter(l => l.employeeId === empId);
  const myClaims = mockClaimRecords.filter(c => c.employeeId === empId);
  const pendingRequests = [
    ...myLeaves.filter(l => l.status === 'Pending').map(l => ({...l, category: 'Leave', desc: l.type})),
    ...myClaims.filter(c => c.status === 'Pending').map(c => ({...c, category: 'Claim', desc: c.type}))
  ];
  const history = [
     ...myLeaves.filter(l => l.status !== 'Pending').map(l => ({...l, category: 'Leave', desc: l.type, date: l.startDate})),
     ...myClaims.filter(c => c.status !== 'Pending').map(c => ({...c, category: 'Claim', desc: c.type, date: c.date}))
  ].slice(0, 5); // Last 5

  const employee = mockEmployees[0];
  const ytdSalary = (employee.salaryPackage.basic * 10) + 1500; // Mock calculation
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Widget 1: Public Holidays */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col h-64">
           <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
             <CalendarDays className="w-5 h-5 mr-2" />
             Upcoming Holidays
           </h3>
           <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
             {INITIAL_HOLIDAYS.filter(h => new Date(h.date) >= new Date('2024-10-01')).slice(0, 4).map(h => (
               <div key={h.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-0">
                 <span className="text-slate-900 font-medium">{h.name}</span>
                 <span className="text-slate-500 text-xs">{h.date}</span>
               </div>
             ))}
           </div>
        </div>

        {/* Widget 2: Pending Requests */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col h-64">
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-slate-900 flex items-center">
               <Clock className="w-5 h-5 mr-2" />
               Pending
             </h3>
             <span className="bg-slate-100 text-slate-900 text-xs px-2 py-1 rounded-full font-bold">{pendingRequests.length}</span>
           </div>
           <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
             {pendingRequests.length > 0 ? pendingRequests.map((req, idx) => (
               <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                 <div className="flex flex-col">
                   <span className="text-slate-900 font-medium">{req.category}</span>
                   <span className="text-slate-500 text-xs">{req.desc}</span>
                 </div>
                 <span className="text-amber-600 text-xs font-semibold">Waiting</span>
               </div>
             )) : (
               <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                 No pending requests
               </div>
             )}
           </div>
        </div>

        {/* Widget 3: Approval History */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col h-64">
           <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
             <FileText className="w-5 h-5 mr-2" />
             Recent Status
           </h3>
           <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
             {history.map((item, idx) => (
               <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                 <div className="flex flex-col">
                   <span className="text-slate-900 font-medium">{item.category} - {item.desc}</span>
                   <span className="text-slate-400 text-[10px]">{item.date}</span>
                 </div>
                 {item.status === 'Approved' ? (
                   <CheckCircle className="w-4 h-4 text-green-600" />
                 ) : (
                   <XCircle className="w-4 h-4 text-red-600" />
                 )}
               </div>
             ))}
             {history.length === 0 && <p className="text-slate-400 text-sm">No history yet.</p>}
           </div>
        </div>

        {/* Widget 4: Stats (Salary & Attendance) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col h-64 justify-between">
           <div>
             <h3 className="text-sm font-medium text-slate-500 mb-1">Yearly Salary (YTD)</h3>
             <p className="text-3xl font-bold text-slate-900">RM {ytdSalary.toLocaleString()}</p>
             <p className="text-xs text-slate-400 mt-1">Includes allowances & claims</p>
           </div>
           
           <div className="border-t border-slate-100 pt-4">
             <div className="flex justify-between items-end mb-1">
               <h3 className="text-sm font-medium text-slate-500">Attendance Rate</h3>
               <span className="text-xl font-bold text-green-600">98%</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2">
               <div className="bg-slate-900 h-2 rounded-full" style={{ width: '98%' }}></div>
             </div>
             <p className="text-xs text-slate-400 mt-1 text-right">Excellent</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;