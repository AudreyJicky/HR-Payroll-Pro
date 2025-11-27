import React, { useState, createContext, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calculator, 
  Clock, 
  Briefcase, 
  FileText,
  UserCircle,
  Settings,
  LogOut,
  Camera
} from 'lucide-react';
import { Role } from '../types';

// Simple Context for User State
interface UserState {
  name: string;
  avatar: string;
  role: Role;
  updateUser: (name: string, avatar: string) => void;
  switchRole: () => void;
}

export const UserContext = createContext<UserState>({
  name: 'Admin User',
  avatar: '',
  role: 'Admin',
  updateUser: () => {},
  switchRole: () => {},
});

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [name, setName] = useState('Ali bin Abu');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80');
  const [role, setRole] = useState<Role>('Admin');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const updateUser = (newName: string, newAvatar: string) => {
    setName(newName);
    setAvatar(newAvatar);
  };

  const switchRole = () => {
    setRole(prev => prev === 'Admin' ? 'Staff' : 'Admin');
  };

  // Define nav items with role access
  const allNavItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard", roles: ['Admin', 'Staff'] },
    { to: "/employees", icon: Users, label: "Employees", roles: ['Admin'] },
    { to: "/payroll", icon: Calculator, label: "Payroll", roles: ['Admin'] },
    { to: "/attendance", icon: Clock, label: "Attendance", roles: ['Admin', 'Staff'] },
    { to: "/profile", icon: UserCircle, label: "My Profile", roles: ['Staff'] },
    { to: "/admin", icon: Briefcase, label: "Admin & Assets", roles: ['Admin'] },
  ];

  const filteredNavItems = allNavItems.filter(item => item.roles.includes(role));

  return (
    <UserContext.Provider value={{ name, avatar, role, updateUser, switchRole }}>
      <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 transition-all shadow-xl">
          <div className="h-16 flex items-center px-6 border-b border-slate-800">
            <FileText className="w-6 h-6 text-blue-500 mr-2" />
            <span className="font-bold text-lg text-white">HR Pro</span>
            <span className="ml-2 text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{role}</span>
          </div>

          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg transition-colors group ${
                    isActive 
                      ? "bg-blue-600 text-white" 
                      : "hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center justify-between group cursor-pointer" onClick={() => setIsSettingsOpen(true)}>
              <div className="flex items-center">
                <div className="relative">
                   <img src={avatar} alt="User" className="w-9 h-9 rounded-full object-cover border-2 border-slate-700" />
                   <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-bold text-white truncate max-w-[100px]">{name}</p>
                  <p className="text-xs text-slate-500 flex items-center hover:text-blue-400">
                    <Settings className="w-3 h-3 mr-1" /> Settings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative">
          <div className="max-w-7xl mx-auto p-8">
            {children}
          </div>
        </main>

        {/* Settings Modal */}
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-96 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">User Settings</h3>
                <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col items-center mb-4">
                   <div className="relative group cursor-pointer">
                      <img src={avatar} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-slate-100" />
                      <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Camera className="w-6 h-6 text-white" />
                      </div>
                   </div>
                   <p className="text-xs text-slate-500 mt-2">Click to upload new photo</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Avatar URL</label>
                  <input 
                    type="text" 
                    value={avatar} 
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs" 
                  />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Access Role (Demo Mode)</label>
                  <button 
                    onClick={switchRole}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                      role === 'Admin' 
                        ? 'bg-slate-900 text-white hover:bg-slate-800' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Current: {role} (Click to Switch)
                  </button>
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    Switch to {role === 'Admin' ? 'Staff' : 'Admin'} view to see permissions.
                  </p>
                </div>

                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-full mt-2 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserContext.Provider>
  );
};

export default Layout;