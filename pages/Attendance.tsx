import React, { useState } from 'react';
import { Clock, LogIn, LogOut, Coffee } from 'lucide-react';
import { mockEmployees } from '../services/store';

const Attendance: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Mock live clock
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [activeEmployee, setActiveEmployee] = useState(mockEmployees[0]?.id || '');
  const [status, setStatus] = useState<'Clocked Out' | 'Clocked In'>('Clocked Out');
  const [logs, setLogs] = useState([
    { id: 1, type: 'In', time: '08:55 AM', date: '2024-10-14' },
    { id: 2, type: 'Out', time: '06:15 PM', date: '2024-10-13' },
    { id: 3, type: 'In', time: '09:00 AM', date: '2024-10-13' },
  ]);

  const handleClockAction = () => {
    const type = status === 'Clocked Out' ? 'In' : 'Out';
    const newLog = {
      id: Date.now(),
      type,
      time: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: currentTime.toLocaleDateString()
    };
    setLogs([newLog, ...logs]);
    setStatus(status === 'Clocked Out' ? 'Clocked In' : 'Clocked Out');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Time & Attendance</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Clock In Module */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="mb-6">
            <h2 className="text-6xl font-black text-slate-900 tracking-tight">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </h2>
            <p className="text-slate-500 mt-2 font-medium">
              {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="mb-6">
            <select 
              value={activeEmployee}
              onChange={(e) => setActiveEmployee(e.target.value)}
              className="w-full md:w-2/3 mx-auto p-2 text-center border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {mockEmployees.map(e => <option key={e.id} value={e.id}>{e.fullName}</option>)}
            </select>
          </div>

          <button
            onClick={handleClockAction}
            className={`
              w-48 h-48 rounded-full flex flex-col items-center justify-center mx-auto transition-all transform hover:scale-105 active:scale-95 shadow-lg
              ${status === 'Clocked Out' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200' 
                : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200'}
            `}
          >
            {status === 'Clocked Out' ? (
              <>
                <LogIn className="w-12 h-12 mb-2" />
                <span className="text-xl font-bold">CLOCK IN</span>
              </>
            ) : (
              <>
                <LogOut className="w-12 h-12 mb-2" />
                <span className="text-xl font-bold">CLOCK OUT</span>
              </>
            )}
          </button>
          
          <p className="mt-6 text-sm text-slate-400">
            Current Status: <span className="font-bold text-slate-700">{status}</span>
          </p>
        </div>

        {/* Recent Logs & Overtime */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-slate-500" />
              Recent Logs
            </h3>
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${log.type === 'In' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Clock {log.type}</p>
                      <p className="text-xs text-slate-500">{log.date}</p>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-medium text-slate-600">{log.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center">
              <Coffee className="w-5 h-5 mr-2" />
              Overtime Tracker
            </h3>
            <p className="text-sm text-blue-700 mb-4">You have accumulated <span className="font-bold">12.5 hours</span> of OT this month.</p>
            <div className="w-full bg-blue-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <p className="text-xs text-blue-600 mt-2 text-right">45% of max allowed OT</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;