import React, { useState, useEffect } from 'react';
import { Clock, LogIn, LogOut, Coffee, MapPin, Wifi } from 'lucide-react';
import { mockEmployees } from '../services/store';

const Attendance: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [ipAddress, setIpAddress] = useState<string>('Detecting...');
  
  // Mock live clock & IP Fetch
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Simulate detecting IP for location stress
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setIpAddress(data.ip))
      .catch(() => setIpAddress('192.168.0.105 (Local)'));

    return () => clearInterval(timer);
  }, []);

  const [activeEmployee, setActiveEmployee] = useState(mockEmployees[0]?.id || '');
  const [status, setStatus] = useState<'Clocked Out' | 'Clocked In'>('Clocked Out');
  const [logs, setLogs] = useState([
    { id: 1, type: 'In', time: '08:55 AM', date: '2024-10-14', ip: '203.106.55.12' },
    { id: 2, type: 'Out', time: '06:15 PM', date: '2024-10-13', ip: '203.106.55.12' },
    { id: 3, type: 'In', time: '09:00 AM', date: '2024-10-13', ip: '115.132.44.21' },
  ]);

  const handleClockAction = () => {
    const type = status === 'Clocked Out' ? 'In' : 'Out';
    const newLog = {
      id: Date.now(),
      type,
      time: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: currentTime.toLocaleDateString(),
      ip: ipAddress
    };
    setLogs([newLog, ...logs]);
    setStatus(status === 'Clocked Out' ? 'Clocked In' : 'Clocked Out');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Time & Attendance</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Clock In Module */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          
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
              w-48 h-48 rounded-full flex flex-col items-center justify-center mx-auto transition-all transform hover:scale-105 active:scale-95 shadow-xl
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
          
          <div className="mt-6 flex flex-col items-center gap-1 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
             <div className="flex items-center gap-2">
               <Wifi className="w-4 h-4 text-blue-500" />
               <span className="font-mono">{ipAddress}</span>
             </div>
             <div className="flex items-center gap-2 text-xs">
               <MapPin className="w-3 h-3 text-slate-400" />
               <span>Detected Location: Kuala Lumpur, MY</span>
             </div>
          </div>
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
                <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${log.type === 'In' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Clock {log.type}</p>
                      <p className="text-xs text-slate-500">{log.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-medium text-slate-600 block">{log.time}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">IP: {log.ip}</span>
                  </div>
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