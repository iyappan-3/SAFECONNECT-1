import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import FlutterSimulator from './components/FlutterSimulator';
import CitizenPortal from './components/CitizenPortal';
import PolicePortal from './components/PolicePortal';
import AdminPortal from './components/AdminPortal';
import {
  Shield,
  Smartphone,
  Lock,
  User,
  LogOut,
  Bell,
  Sparkles,
  ChevronDown,
  Info,
  Laptop,
  PlusCircle,
  UserPlus,
  Building,
  CheckCircle2,
  Users,
  Database,
  Inbox,
  AlertTriangle,
  Compass,
  Briefcase,
  X
} from 'lucide-react';

function AppContent() {
  const { 
    currentUser, 
    loginWithCredentials, 
    registerUser,
    logout, 
    notifications, 
    clearNotification,
    stations,
    users,
    reports,
    cases
  } = useApp();
  
  // Platform Selector: 'web' (Official Web Portals) vs 'app' (Mobile Application Simulator)
  const [platformMode, setPlatformMode] = useState<'web' | 'app'>('web');

  // Login & Registration Dropdown States
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [dropdownMode, setDropdownMode] = useState<'signin' | 'signup'>('signin');
  const [loginRole, setLoginRole] = useState<'CITIZEN' | 'POLICE'>('CITIZEN');
  const [regRole, setRegRole] = useState<'CITIZEN' | 'POLICE'>('CITIZEN');

  // Sign In Form States
  const [phoneInput, setPhoneInput] = useState('');
  const [stationInput, setStationInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState<string | null>(null);

  // Sign Up (Create New ID) Form States
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBadge, setRegBadge] = useState('');
  const [regRank, setRegRank] = useState('Officer');
  const [regStationId, setRegStationId] = useState('');
  const [regSuccess, setRegSuccess] = useState<string | null>(null);
  const [regError, setRegError] = useState<string | null>(null);

  // App notification dropdown
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadNotifications = notifications.filter(n => !n.read);

  // Clear inputs when toggling login roles or dropdown mode
  useEffect(() => {
    setPhoneInput('');
    setStationInput('');
    setPasswordInput('');
    setLoginError(null);
  }, [loginRole, dropdownMode]);

  useEffect(() => {
    setRegFullName('');
    setRegPhone('');
    setRegEmail('');
    setRegPassword('');
    setRegBadge('');
    setRegRank('Officer');
    setRegStationId(stations[0]?.id || '');
    setRegError(null);
    setRegSuccess(null);
  }, [regRole, dropdownMode, stations]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccessMessage(null);

    const identifier = loginRole === 'CITIZEN' ? phoneInput : stationInput;
    const result = loginWithCredentials(loginRole, identifier, passwordInput);

    if (result.success) {
      setLoginSuccessMessage('Authenticated successfully!');
      setTimeout(() => {
        setLoginSuccessMessage(null);
        setShowLoginDropdown(false);
        // Reset form
        setPhoneInput('');
        setStationInput('');
        setPasswordInput('');
      }, 1000);
    } else {
      setLoginError(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    const userData: any = {
      username: regRole === 'CITIZEN' ? `citizen_${regPhone.replace(/[^0-9]/g, '')}` : `officer_${regBadge}`,
      role: regRole,
      fullName: regFullName,
      email: regEmail,
      password: regPassword,
    };

    if (regRole === 'CITIZEN') {
      userData.phone = regPhone;
    } else {
      userData.badgeNumber = regBadge;
      userData.rankTitle = regRank;
      userData.stationId = regStationId;
    }

    const result = registerUser(userData);
    if (result.success) {
      setRegSuccess('ID Created Successfully!');
      setTimeout(() => {
        // Automatically switch to sign-in tab with populated credentials
        setDropdownMode('signin');
        setLoginRole(regRole);
        if (regRole === 'CITIZEN') {
          setPhoneInput(regPhone);
        } else {
          const stationObj = stations.find(s => s.id === regStationId);
          setStationInput(stationObj?.code || regStationId);
        }
        setPasswordInput(regPassword);
        setRegSuccess(null);
      }, 1500);
    } else {
      setRegError(result.error || 'Failed to create account.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800 font-sans" id="safeconnect-root-view">
      
      {/* Top Header Bar */}
      <header className="bg-[#0F3D91] text-white border-b border-white/10 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#2563EB] rounded-lg text-white shadow-xs flex items-center justify-center">
              <Shield className="w-5.5 h-5.5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-wider uppercase font-sans">SAFECONNECT</span>
                <span className="text-[9px] bg-emerald-500 text-white font-extrabold px-1.5 py-0.2 rounded uppercase">V2.0 PROD</span>
              </div>
              <span className="text-[10px] text-blue-200 font-medium block">Secured Emergency & Response Link</span>
            </div>
          </div>

          {/* Center Platform Toggle - Web vs Mobile App */}
          <div className="hidden md:flex items-center bg-black/20 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setPlatformMode('web')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                platformMode === 'web'
                  ? 'bg-white text-[#0F3D91] shadow-xs'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>💻 Web Portals</span>
            </button>
            <button
              onClick={() => setPlatformMode('app')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                platformMode === 'app'
                  ? 'bg-white text-[#0F3D91] shadow-xs'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>📱 Mobile App</span>
            </button>
          </div>

          {/* Right Header Corner - Notifications & Authentication Portals */}
          <div className="flex items-center gap-3">
            
            {/* Notification Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowLoginDropdown(false);
                }}
                className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 text-blue-100 hover:text-white border border-white/5 transition cursor-pointer"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0F3D91]" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2.5 w-72 bg-white border border-slate-200 rounded-xl shadow-lg z-50 text-slate-800 p-2 space-y-2 animate-fade-in">
                  <div className="px-3 py-1.5 border-b border-slate-100 flex justify-between items-center text-xs font-semibold text-slate-400">
                    <span>App Alerts & Updates</span>
                    <span>{unreadNotifications.length} New</span>
                  </div>
                  <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-xs text-slate-400">No new alerts.</p>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className="p-2.5 hover:bg-slate-50 transition text-xs space-y-0.5 rounded-lg">
                          <div className="flex justify-between items-start gap-1">
                            <span className="font-bold text-slate-900">{notif.title}</span>
                            {!notif.read && (
                              <button
                                onClick={() => clearNotification(notif.id)}
                                className="text-[9px] font-bold text-[#2563EB] hover:underline cursor-pointer"
                              >
                                Read
                              </button>
                            )}
                          </div>
                          <p className="text-slate-500 leading-relaxed text-[11px]">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Top Corner Login Section */}
            <div className="relative">
              {currentUser ? (
                /* Authenticated User state */
                <button
                  onClick={() => {
                    setShowLoginDropdown(!showLoginDropdown);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 transition cursor-pointer"
                >
                  {currentUser.role === 'POLICE' ? (
                    <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : currentUser.role === 'ADMIN' ? (
                    <Database className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                  )}
                  <span className="max-w-[120px] truncate">{currentUser.fullName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-blue-200" />
                </button>
              ) : (
                /* Unauthenticated Sign-In button */
                <button
                  onClick={() => {
                    setShowLoginDropdown(!showLoginDropdown);
                    setShowNotifications(false);
                    setDropdownMode('signin');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm hover:shadow-md transition duration-150 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" /> Secure Sign-In
                </button>
              )}

              {/* Login, Registration & Identity Dropdown Menu */}
              {showLoginDropdown && (
                <div className="absolute right-0 mt-2.5 w-85 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 text-slate-800 p-4.5 space-y-4 animate-fade-in">
                  
                  {currentUser ? (
                    /* Authenticated user menu details */
                    <div className="space-y-3">
                      <div className="border-b border-slate-100 pb-2.5">
                        <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider block">Active Identity</span>
                        <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">{currentUser.fullName}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{currentUser.email || 'No email registered'}</p>
                        <div className="flex gap-1.5 mt-2">
                          <span className="inline-block text-[9px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full uppercase border border-blue-100">
                            Role: {currentUser.role}
                          </span>
                          {currentUser.badgeNumber && (
                            <span className="inline-block text-[9px] font-bold bg-slate-50 text-slate-700 px-2 py-0.5 rounded-full uppercase border border-slate-200">
                              Badge: {currentUser.badgeNumber}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          logout();
                          setShowLoginDropdown(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out Identity
                      </button>
                    </div>
                  ) : (
                    /* Multi-mode Form: Sign In vs Sign Up */
                    <div className="space-y-3.5">
                      <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
                        <div className="flex gap-3">
                          <button
                            onClick={() => setDropdownMode('signin')}
                            className={`font-black text-xs uppercase tracking-wide transition ${
                              dropdownMode === 'signin' ? 'text-blue-900 border-b-2 border-blue-600 pb-1' : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            Sign In
                          </button>
                          <button
                            onClick={() => setDropdownMode('signup')}
                            className={`font-black text-xs uppercase tracking-wide transition ${
                              dropdownMode === 'signup' ? 'text-blue-900 border-b-2 border-blue-600 pb-1' : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            Create New ID
                          </button>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono">v2.0 (LIVE)</span>
                      </div>

                      {/* SIGN IN VIEW */}
                      {dropdownMode === 'signin' && (
                        <div className="space-y-3">
                          {/* Tab toggler for User and Police login */}
                          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg">
                            <button
                              onClick={() => setLoginRole('CITIZEN')}
                              className={`py-1 text-center text-xs font-bold rounded-md transition cursor-pointer ${
                                loginRole === 'CITIZEN' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-400 hover:text-slate-600'
                              }`}
                            >
                              User Login
                            </button>
                            <button
                              onClick={() => setLoginRole('POLICE')}
                              className={`py-1 text-center text-xs font-bold rounded-md transition cursor-pointer ${
                                loginRole === 'POLICE' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-400 hover:text-slate-600'
                              }`}
                            >
                              Police Login
                            </button>
                          </div>

                          <form onSubmit={handleLoginSubmit} className="space-y-2.5">
                            {loginRole === 'CITIZEN' ? (
                              <div className="space-y-2">
                                <div>
                                  <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Mobile Number</label>
                                  <input
                                    type="text"
                                    value={phoneInput}
                                    onChange={e => setPhoneInput(e.target.value)}
                                    placeholder="e.g. 555-012-3456"
                                    required
                                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:outline-hidden focus:border-blue-500 bg-slate-50"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Password</label>
                                  <input
                                    type="password"
                                    value={passwordInput}
                                    onChange={e => setPasswordInput(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:outline-hidden focus:border-blue-500 bg-slate-50"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div>
                                  <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Police Station ID / Code</label>
                                  <input
                                    type="text"
                                    value={stationInput}
                                    onChange={e => setStationInput(e.target.value)}
                                    placeholder="e.g. PS-HQ-001 or st-1"
                                    required
                                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:outline-hidden focus:border-blue-500 bg-slate-50"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Password</label>
                                  <input
                                    type="password"
                                    value={passwordInput}
                                    onChange={e => setPasswordInput(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:outline-hidden focus:border-blue-500 bg-slate-50"
                                  />
                                </div>
                              </div>
                            )}

                            {loginError && (
                              <p className="text-[10px] text-red-600 font-bold bg-red-50 p-1.5 rounded border border-red-100">{loginError}</p>
                            )}

                            {loginSuccessMessage && (
                              <p className="text-[10px] text-emerald-600 font-bold bg-emerald-50 p-1.5 rounded border border-emerald-100">{loginSuccessMessage}</p>
                            )}

                            <button
                              type="submit"
                              className="w-full py-2 bg-[#0F3D91] hover:bg-[#2563EB] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                            >
                              Sign In Securely
                            </button>
                          </form>

                          {/* Help/Demo Box */}
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                            <span className="text-[9px] font-extrabold text-slate-400 flex items-center gap-1">
                              <Info className="w-3 h-3 text-blue-500" /> Demo Credentials
                            </span>
                            <div className="text-[9px] text-slate-500 leading-relaxed font-medium">
                              {loginRole === 'CITIZEN' ? (
                                <p>Mobile: <strong className="text-slate-700">555-012-3456</strong><br />Password: <strong className="text-slate-700">citizen123</strong></p>
                              ) : (
                                <p>Station ID: <strong className="text-slate-700">PS-HQ-001</strong> or <strong className="text-slate-700">st-1</strong><br />Password: <strong className="text-slate-700">police123</strong></p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CREATE NEW ID (SIGN UP) VIEW */}
                      {dropdownMode === 'signup' && (
                        <div className="space-y-3">
                          {/* Role toggler for new user registration */}
                          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg">
                            <button
                              onClick={() => setRegRole('CITIZEN')}
                              className={`py-1 text-center text-xs font-bold rounded-md transition cursor-pointer ${
                                regRole === 'CITIZEN' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-400 hover:text-slate-600'
                              }`}
                            >
                              User Sign Up
                            </button>
                            <button
                              onClick={() => setRegRole('POLICE')}
                              className={`py-1 text-center text-xs font-bold rounded-md transition cursor-pointer ${
                                regRole === 'POLICE' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-400 hover:text-slate-600'
                              }`}
                            >
                              Police Sign Up
                            </button>
                          </div>

                          <form onSubmit={handleRegisterSubmit} className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                            <div>
                              <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Full Name</label>
                              <input
                                type="text"
                                value={regFullName}
                                onChange={e => setRegFullName(e.target.value)}
                                placeholder="e.g. Jane Doe"
                                required
                                className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:outline-hidden focus:border-blue-500 bg-slate-50"
                              />
                            </div>

                            {regRole === 'CITIZEN' ? (
                              <div>
                                <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Mobile Number</label>
                                <input
                                  type="text"
                                  value={regPhone}
                                  onChange={e => setRegPhone(e.target.value)}
                                  placeholder="e.g. 555-987-6543"
                                  required
                                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:outline-hidden focus:border-blue-500 bg-slate-50"
                                />
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Badge Number</label>
                                  <input
                                    type="text"
                                    value={regBadge}
                                    onChange={e => setRegBadge(e.target.value)}
                                    placeholder="e.g. 8051"
                                    required
                                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:outline-hidden focus:border-blue-500 bg-slate-50"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Rank</label>
                                  <select
                                    value={regRank}
                                    onChange={e => setRegRank(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:outline-hidden focus:border-blue-500 bg-slate-50"
                                  >
                                    <option value="Officer">Officer</option>
                                    <option value="Sergeant">Sergeant</option>
                                    <option value="Inspector">Inspector</option>
                                    <option value="Lieutenant">Lieutenant</option>
                                  </select>
                                </div>
                              </div>
                            )}

                            {regRole === 'POLICE' && (
                              <div>
                                <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Assigned Station</label>
                                <select
                                  value={regStationId}
                                  onChange={e => setRegStationId(e.target.value)}
                                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:outline-hidden focus:border-blue-500 bg-slate-50"
                                >
                                  {stations.map(st => (
                                    <option key={st.id} value={st.id}>
                                      {st.name} ({st.code})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            <div>
                              <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Email Address</label>
                              <input
                                type="email"
                                value={regEmail}
                                onChange={e => setRegEmail(e.target.value)}
                                placeholder="e.g. jane@safeconnect.gov"
                                required
                                className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:outline-hidden focus:border-blue-500 bg-slate-50"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Secure Password</label>
                              <input
                                type="password"
                                value={regPassword}
                                onChange={e => setRegPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:outline-hidden focus:border-blue-500 bg-slate-50"
                              />
                            </div>

                            {regError && (
                              <p className="text-[10px] text-red-600 font-bold bg-red-50 p-1.5 rounded border border-red-100">{regError}</p>
                            )}

                            {regSuccess && (
                              <p className="text-[10px] text-emerald-600 font-bold bg-emerald-50 p-1.5 rounded border border-emerald-100">{regSuccess}</p>
                            )}

                            <button
                              type="submit"
                              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1"
                            >
                              <UserPlus className="w-3.5 h-3.5" /> Create Account Identity
                            </button>
                          </form>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Quick Mobile/Tablet Platform Toggle Switch (Only on smaller viewports) */}
      <div className="md:hidden bg-slate-100 border-b border-slate-200 p-2 flex justify-center gap-2">
        <button
          onClick={() => setPlatformMode('web')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
            platformMode === 'web'
              ? 'bg-[#0F3D91] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <Laptop className="w-3.5 h-3.5" />
          <span>Web Portals</span>
        </button>
        <button
          onClick={() => setPlatformMode('app')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
            platformMode === 'app'
              ? 'bg-[#0F3D91] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile App</span>
        </button>
      </div>

      {/* Environment Notification Band */}
      <div className="bg-blue-50 border-b border-blue-100/50 py-2.5 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
          <div className="flex items-center gap-2 text-blue-800 font-medium">
            <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
            <span>
              {platformMode === 'web' ? (
                <span>
                  Viewing the <strong>SAFECONNECT State Web Portal</strong>. Switch platforms or log in to manage state alerts.
                </span>
              ) : (
                <span>
                  Viewing the <strong>SAFECONNECT Smartphone Application Simulator</strong>. Tap the dynamic screen elements below.
                </span>
              )}
            </span>
          </div>
          <div className="text-slate-400 text-[10px] font-bold uppercase font-mono bg-white px-2 py-0.5 rounded border border-slate-200 shadow-3xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            <span>DB Size: {users.length} Identities</span>
          </div>
        </div>
      </div>

      {/* Main Dynamic Viewport Container */}
      <main className="flex-1 flex flex-col">
        {platformMode === 'app' ? (
          /* MOBILE APPLICATION SIMULATOR MODE */
          <div className="flex-1 flex items-center justify-center py-8 px-4">
            <div className="w-full max-w-sm">
              <FlutterSimulator />
            </div>
          </div>
        ) : (
          /* WEB PORTAL SYSTEM MODE */
          <div className="flex-1 flex flex-col">
            {currentUser ? (
              /* Dynamically display appropriate workspace based on user role */
              <div className="flex-1 animate-fade-in">
                {currentUser.role === 'CITIZEN' ? (
                  <CitizenPortal />
                ) : currentUser.role === 'POLICE' ? (
                  <PolicePortal />
                ) : (
                  <AdminPortal />
                )}
              </div>
            ) : (
              /* Professional Municipal Landing Page for Guest Web Users */
              <div className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-12 space-y-12">
                
                {/* Hero section */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-[#0F3D91] rounded-full text-[10px] font-black uppercase tracking-wider">
                    Official Government Communications System
                  </span>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-sans">
                    State Security & Emergency Response Hub
                  </h1>
                  <p className="text-slate-500 text-base leading-relaxed">
                    Connecting civilian citizens with police stations, active investigators, and emergency dispatch teams. File incident reports, monitor cases, and coordinate community security in real-time.
                  </p>
                  
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setShowLoginDropdown(true);
                        setDropdownMode('signin');
                      }}
                      className="px-6 py-3 bg-[#0F3D91] hover:bg-[#2563EB] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition duration-150 cursor-pointer flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" /> Secure Sign-In
                    </button>
                    <button
                      onClick={() => {
                        setShowLoginDropdown(true);
                        setDropdownMode('signup');
                      }}
                      className="px-6 py-3 bg-white hover:bg-slate-50 text-[#0F3D91] border border-slate-200 rounded-xl text-sm font-bold shadow-xs hover:shadow-sm transition duration-150 cursor-pointer flex items-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4" /> Register New ID
                    </button>
                  </div>
                </div>

                {/* Real-time System Statistics Dashboard */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-3xs flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <Inbox className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Secure Reports</span>
                      <span className="block text-2xl font-black text-slate-900">{reports.length} Filed</span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-3xs flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Active Cases</span>
                      <span className="block text-2xl font-black text-slate-900">
                        {cases.filter(c => c.status !== 'CLOSED').length} Live
                      </span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-3xs flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                      <Building className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Precincts</span>
                      <span className="block text-2xl font-black text-slate-900">{stations.length} Active</span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-3xs flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">System Users</span>
                      <span className="block text-2xl font-black text-slate-900">{users.length} Active</span>
                    </div>
                  </div>
                </div>

                {/* Info Cards Grid */}
                <div className="grid md:grid-cols-3 gap-6 pt-4">
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="p-3 bg-blue-50 text-[#0F3D91] rounded-xl w-fit">
                      <User className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900">Citizen Reporting Command</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Submit anonymous or identified intelligence regarding ongoing situations. Safely upload media evidence, record vehicle theft logs, or submit missing person descriptions directly to the state dispatch queue.
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
                      <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900">Officer Investigation Suite</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Assigned precinct officers and specialized detectives can initiate criminal case files, write timeline logs, set security status levels, and update citizens dynamically without compromising case security.
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit">
                      <Database className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900">Dispatch Administration</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Full administrative control over state resources. Register police stations and codes, audit system logs, activate or lock badge access credentials, and download complete encrypted SQL data backups.
                    </p>
                  </div>
                </div>

                {/* Interactive Simulation Callout */}
                <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold tracking-tight">Prefer the Companion Smartphone Experience?</h3>
                    <p className="text-blue-200 text-sm max-w-xl leading-relaxed">
                      SafeConnect also features a fully interactive mobile application simulator! Test SOS alert broadcasts, direct GPS incident reporting, and real-time push alerts.
                    </p>
                  </div>
                  <button
                    onClick={() => setPlatformMode('app')}
                    className="bg-white text-slate-900 hover:bg-blue-50 px-5 py-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 shrink-0 shadow-sm"
                  >
                    <Smartphone className="w-4 h-4 text-[#0F3D91]" />
                    <span>Launch Mobile Simulator</span>
                  </button>
                </div>

              </div>
            )}
          </div>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>&copy; 2026 State Justice Directorate. SAFECONNECT Security Communications. All rights reserved.</span>
          <div className="flex gap-4 font-mono text-[10px] font-bold">
            <span>SEC-ID: 0x90281F</span>
            <span>STATUS: CERTIFIED</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
