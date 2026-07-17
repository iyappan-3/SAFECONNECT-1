import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserAccount, PoliceStation, UserRole } from '../types';
import {
  Settings,
  Users,
  Building,
  History,
  Database,
  UserPlus,
  ToggleLeft,
  ToggleRight,
  Shield,
  Trash2,
  Lock,
  Compass,
  CheckCircle,
  FileText,
  Activity,
  Plus
} from 'lucide-react';

export default function AdminPortal() {
  const {
    users,
    stations,
    districts,
    auditLogs,
    addPoliceAccount,
    toggleUserStatus,
    addStation,
    backupDatabase,
    restoreDatabase,
    logAction
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'users' | 'stations' | 'backup' | 'audit'>('users');

  // Form states: Police Accounts
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [newRank, setNewRank] = useState('Deputy Officer');
  const [newStationId, setNewStationId] = useState('st-1');

  // Form states: Stations
  const [stationName, setStationName] = useState('');
  const [stationCode, setStationCode] = useState('');
  const [stationDistrict, setStationDistrict] = useState('1');
  const [stationAddress, setStationAddress] = useState('');
  const [stationPhone, setStationPhone] = useState('');

  // Backup States
  const [backups, setBackups] = useState<{ fileName: string; size: string; timestamp: string }[]>([
    { fileName: 'govfind_prod_backup_20260710_1200.sql', size: '2.14 MB', timestamp: '2026-07-10T12:00:00.000Z' }
  ]);
  const [backingUp, setBackingUp] = useState(false);
  const [restoringFile, setRestoringFile] = useState<string | null>(null);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newEmail || !newFullName || !newBadge) return;

    addPoliceAccount({
      username: newUsername,
      email: newEmail,
      fullName: newFullName,
      role: 'POLICE',
      badgeNumber: newBadge,
      rankTitle: newRank,
      stationId: newStationId,
    });

    setNewUsername('');
    setNewEmail('');
    setNewFullName('');
    setNewBadge('');
  };

  const handleCreateStation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stationName || !stationCode || !stationAddress || !stationPhone) return;

    const matchedDist = districts.find(d => d.id === stationDistrict);

    addStation({
      name: stationName,
      code: stationCode,
      districtId: stationDistrict,
      districtName: matchedDist ? matchedDist.name : 'Unknown District',
      address: stationAddress,
      phone: stationPhone,
      lat: 37.7749 + (Math.random() - 0.5) * 0.1,
      lng: -122.4194 + (Math.random() - 0.5) * 0.1,
    });

    setStationName('');
    setStationCode('');
    setStationAddress('');
    setStationPhone('');
  };

  const triggerBackup = () => {
    setBackingUp(true);
    setTimeout(() => {
      const backupInfo = backupDatabase();
      setBackups(prev => [backupInfo, ...prev]);
      setBackingUp(false);
    }, 1500);
  };

  const triggerRestore = (file: typeof backups[0]) => {
    setRestoringFile(file.fileName);
    setTimeout(() => {
      restoreDatabase(file.fileName);
      setRestoringFile(null);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6" id="admin-portal-view">
      {/* Top Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Admin Navigation Sidebar */}
        <div className="lg:col-span-1 bg-[#0F3D91] text-white rounded-xl p-4 space-y-4 shadow-sm border border-slate-200/10">
          <div className="border-b border-white/10 pb-3">
            <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider block">Security Command Console</span>
            <h3 className="font-extrabold text-slate-100 font-sans text-sm flex items-center gap-1.5 mt-0.5">
              <Settings className="w-4.5 h-4.5 text-blue-400" /> Admin Controller
            </h3>
          </div>

          <div className="space-y-1">
            {[
              { id: 'users', label: 'Precinct Accounts', icon: Users },
              { id: 'stations', label: 'Station Management', icon: Building },
              { id: 'backup', label: 'Data Backups', icon: Database },
              { id: 'audit', label: 'Audit Logs', icon: History }
            ].map(subTab => (
              <button
                key={subTab.id}
                onClick={() => setActiveSubTab(subTab.id as any)}
                className={`w-full text-left rounded-lg p-2.5 text-xs font-semibold tracking-wide transition flex items-center gap-2 cursor-pointer ${
                  activeSubTab === subTab.id
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <subTab.icon className="w-4 h-4" /> {subTab.label}
              </button>
            ))}
          </div>

          <div className="bg-white/10 p-3 rounded-lg border border-white/5 text-[10px] text-blue-100 leading-relaxed">
            <Shield className="w-4 h-4 text-amber-400 mb-1.5" />
            <p className="font-medium">Administrator level permissions verified. All actions performed are logged to the federal audit trail.</p>
          </div>
        </div>

        {/* Dynamic Detail Content Pane */}
        <div className="lg:col-span-3">
          {/* USER MANAGEMENT */}
          {activeSubTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs space-y-5">
                <div className="border-b border-slate-50 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-slate-900 font-sans text-sm">Police Accounts Registry</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Toggle active states or register authorized investigators.</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">Total Users: {users.length}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Create Account Form */}
                  <form onSubmit={handleCreateUser} className="border border-slate-100 p-4 rounded-xl space-y-3 bg-slate-50/50">
                    <span className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <UserPlus className="w-4 h-4 text-blue-600" /> Register Investigator
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Username</label>
                        <input
                          type="text"
                          value={newUsername}
                          onChange={e => setNewUsername(e.target.value)}
                          placeholder="officer_sam"
                          required
                          className="w-full rounded border border-slate-200 p-1.5 text-xs focus:border-blue-500 focus:outline-hidden bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Badge Number</label>
                        <input
                          type="text"
                          value={newBadge}
                          onChange={e => setNewBadge(e.target.value)}
                          placeholder="e.g. 5819"
                          required
                          className="w-full rounded border border-slate-200 p-1.5 text-xs focus:border-blue-500 focus:outline-hidden bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        value={newFullName}
                        onChange={e => setNewFullName(e.target.value)}
                        placeholder="Samuel Carter"
                        required
                        className="w-full rounded border border-slate-200 p-1.5 text-xs focus:border-blue-500 focus:outline-hidden bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={e => setNewEmail(e.target.value)}
                        placeholder="sam.carter@police.gov"
                        required
                        className="w-full rounded border border-slate-200 p-1.5 text-xs focus:border-blue-500 focus:outline-hidden bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Rank Title</label>
                        <select
                          value={newRank}
                          onChange={e => setNewRank(e.target.value)}
                          className="w-full rounded border border-slate-200 p-1.5 text-xs focus:border-blue-500 focus:outline-hidden bg-white"
                        >
                          <option value="Deputy Officer">Deputy Officer</option>
                          <option value="Detective Sergeant">Detective Sergeant</option>
                          <option value="Senior Investigator">Senior Investigator</option>
                          <option value="Station Captain">Station Captain</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Station Precinct</label>
                        <select
                          value={newStationId}
                          onChange={e => setNewStationId(e.target.value)}
                          className="w-full rounded border border-slate-200 p-1.5 text-xs focus:border-blue-500 focus:outline-hidden bg-white"
                        >
                          {stations.map(st => (
                            <option key={st.id} value={st.id}>{st.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 rounded-lg shadow-sm transition flex items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Authorize Account
                    </button>
                  </form>

                  {/* Users List with Status toggler */}
                  <div className="border border-slate-100 rounded-xl p-4 overflow-y-auto max-h-[380px] space-y-2.5">
                    <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Authorized Accounts</span>
                    {users.map(user => (
                      <div key={user.id} className="border border-slate-50 bg-white p-3 rounded-lg flex items-center justify-between text-xs shadow-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{user.fullName}</span>
                            <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                              user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                              user.role === 'POLICE' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{user.email}</span>
                          {user.badgeNumber && (
                            <span className="text-[10px] text-slate-500 font-mono block">Badge: {user.badgeNumber} | Rank: {user.rankTitle}</span>
                          )}
                        </div>

                        {user.role !== 'ADMIN' && (
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className="text-slate-400 hover:text-blue-600 shrink-0 transition"
                          >
                            {user.isActive ? (
                              <ToggleRight className="w-8 h-8 text-blue-600" />
                            ) : (
                              <ToggleLeft className="w-8 h-8 text-slate-300" />
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STATION MANAGEMENT */}
          {activeSubTab === 'stations' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs space-y-5">
                <div className="border-b border-slate-50 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-slate-900 font-sans text-sm">Municipal Police Stations</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Configure station codes, districts, and phone directories.</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">Total Stations: {stations.length}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Create Station Form */}
                  <form onSubmit={handleCreateStation} className="border border-slate-100 p-4 rounded-xl space-y-3 bg-slate-50/50">
                    <span className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <Building className="w-4 h-4 text-blue-600" /> Add Police Station
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Station Name</label>
                        <input
                          type="text"
                          value={stationName}
                          onChange={e => setStationName(e.target.value)}
                          placeholder="e.g. South Coastal Watch"
                          required
                          className="w-full rounded border border-slate-200 p-1.5 text-xs focus:border-blue-500 focus:outline-hidden bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Station Code</label>
                        <input
                          type="text"
                          value={stationCode}
                          onChange={e => setStationCode(e.target.value)}
                          placeholder="e.g. PS-CW-005"
                          required
                          className="w-full rounded border border-slate-200 p-1.5 text-xs focus:border-blue-500 focus:outline-hidden bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">District Area</label>
                        <select
                          value={stationDistrict}
                          onChange={e => setStationDistrict(e.target.value)}
                          className="w-full rounded border border-slate-200 p-1.5 text-xs focus:border-blue-500 focus:outline-hidden bg-white"
                        >
                          {districts.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Reception Phone</label>
                        <input
                          type="text"
                          value={stationPhone}
                          onChange={e => setStationPhone(e.target.value)}
                          placeholder="+1 (555) 019-2005"
                          required
                          className="w-full rounded border border-slate-200 p-1.5 text-xs focus:border-blue-500 focus:outline-hidden bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Physical Address</label>
                      <input
                        type="text"
                        value={stationAddress}
                        onChange={e => setStationAddress(e.target.value)}
                        placeholder="74 Promenade Highway, Sector 9"
                        required
                        className="w-full rounded border border-slate-200 p-1.5 text-xs focus:border-blue-500 focus:outline-hidden bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 rounded-lg shadow-sm transition flex items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Register Station
                    </button>
                  </form>

                  {/* Stations List */}
                  <div className="border border-slate-100 rounded-xl p-4 overflow-y-auto max-h-[380px] space-y-2.5">
                    <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Stations</span>
                    {stations.map(station => (
                      <div key={station.id} className="border border-slate-50 bg-white p-3 rounded-lg text-xs shadow-xs space-y-1">
                        <div className="flex justify-between items-start">
                          <span className="font-extrabold text-slate-800 font-sans">{station.name}</span>
                          <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-50 px-1 py-0.2 rounded">{station.code}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Compass className="w-3 h-3" /> {station.address}
                        </p>
                        <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-50/70 pt-1.5">
                          <span>District: {station.districtName}</span>
                          <span className="font-semibold text-slate-700">{station.phone}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BACKUP & RESTORATION */}
          {activeSubTab === 'backup' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs space-y-6">
                <div className="border-b border-slate-50 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-slate-900 font-sans text-sm">System Database Controller</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Perform instant database backups, or restore schema configurations securely.</p>
                  </div>
                  <Database className="w-5 h-5 text-blue-600" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Backup actions card */}
                  <div className="md:col-span-1 border border-slate-100 bg-slate-50 p-5 rounded-xl text-center space-y-4 flex flex-col justify-between h-full">
                    <div className="space-y-2">
                      <Database className="w-10 h-10 text-blue-600 mx-auto" />
                      <h4 className="font-bold text-slate-800 text-sm">Complete SQL Backup</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">Generates a secure compressed MySQL schema catalog with all logged users, reports, and active investigation notes.</p>
                    </div>

                    <button
                      onClick={triggerBackup}
                      disabled={backingUp}
                      className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 text-white text-xs font-semibold py-2.5 rounded-lg shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      {backingUp ? (
                        <>
                          <Activity className="w-4 h-4 animate-spin" /> Compiling Backup...
                        </>
                      ) : (
                        <>
                          <Database className="w-4 h-4" /> Trigger SQL Backup
                        </>
                      )}
                    </button>
                  </div>

                  {/* Backups Catalogue list */}
                  <div className="md:col-span-2 border border-slate-100 rounded-xl p-5 space-y-4">
                    <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-50 pb-1.5">Backups Archive Directory</span>
                    
                    <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
                      {backups.map((bk, i) => (
                        <div key={i} className="border border-slate-50 bg-slate-50/50 p-3 rounded-lg flex items-center justify-between text-xs">
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-800 block truncate max-w-[250px] font-mono">{bk.fileName}</span>
                            <span className="text-[10px] text-slate-400 block font-medium">Hashed: {new Date(bk.timestamp).toLocaleString()} | Size: {bk.size}</span>
                          </div>

                          <button
                            onClick={() => triggerRestore(bk)}
                            disabled={restoringFile !== null}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase px-3 py-1.5 rounded transition shrink-0 cursor-pointer disabled:bg-slate-300"
                          >
                            {restoringFile === bk.fileName ? 'Restoring...' : 'Restore'}
                          </button>
                        </div>
                      ))}
                    </div>

                    {restoringFile && (
                      <div className="p-3 bg-amber-50 text-amber-800 text-xs border border-amber-200 rounded-lg flex items-center gap-2 font-medium">
                        <Activity className="w-4 h-4 animate-spin text-amber-600 shrink-0" /> Restoring tables, mapping foreign keys, checking compliance hashes. Do not reload...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AUDIT LOGS */}
          {activeSubTab === 'audit' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs space-y-4">
                <div className="border-b border-slate-50 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-slate-900 font-sans text-sm">Federal System Audit trail</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Compliance records tracking server connections, updates, and backup events.</p>
                  </div>
                  <History className="w-5 h-5 text-blue-600" />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs divide-y divide-slate-100 border border-slate-50 rounded-lg overflow-hidden">
                    <thead className="bg-slate-900 text-white text-[10px] uppercase font-bold tracking-wider">
                      <tr>
                        <th className="p-3">Logged At</th>
                        <th className="p-3">Subject / Role</th>
                        <th className="p-3">Action</th>
                        <th className="p-3">Operation Parameters</th>
                        <th className="p-3 text-right">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700 bg-white">
                      {auditLogs.map((log, i) => (
                        <tr key={log.id} className="hover:bg-slate-50/50">
                          <td className="p-3 text-[10px] text-slate-400 font-mono shrink-0 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                          <td className="p-3 whitespace-nowrap">
                            <span className="font-semibold block text-slate-800">{log.username}</span>
                            <span className="text-[9px] text-slate-400 uppercase font-bold">{log.role}</span>
                          </td>
                          <td className="p-3 whitespace-nowrap"><span className="bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">{log.action}</span></td>
                          <td className="p-3 font-medium text-slate-500 max-w-xs truncate">{log.details}</td>
                          <td className="p-3 text-right font-mono text-slate-400 text-[10px] whitespace-nowrap">{log.ipAddress}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
