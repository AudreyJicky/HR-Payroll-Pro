import React from 'react';
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
import { Users, Clock, CalendarDays, DollarSign } from 'lucide-react';
import { mockEmployees, mockTasks } from '../services/store';

const Dashboard: React.FC = () => {
  const totalStaff = mockEmployees.length;
  const activeStaff = mockEmployees.filter(e => e.status === 'Active').length;
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
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Staff</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{totalStaff}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2 font-medium">
            {activeStaff} Active Employees
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Tasks</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{pendingTasks}</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Job Scope Items
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Upcoming Holiday</p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Deepavali</h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <CalendarDays className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            31 Oct 2024
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Payroll (Est)</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">RM 48.5k</h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            This Month
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[400px]">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Salary Distribution by Department</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salaryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[400px]">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Today's Attendance</h3>
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
              <Tooltip />
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
};

export default Dashboard;