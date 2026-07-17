import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CaseStatus } from '../types';
import {
  Smartphone,
  Shield,
  Phone,
  Clock,
  ArrowRight,
  FileText,
  Building,
  User,
  Compass,
  AlertTriangle,
  Send,
  Moon,
  Sun,
  Plus,
  ChevronLeft,
  CheckCircle2,
  Lock,
  Clipboard,
  AlertOctagon,
  Eye,
  MapPin
} from 'lucide-react';

export default function FlutterSimulator() {
  const { 
    currentUser, 
    reports, 
    cases, 
    stations, 
    createReport, 
    createCase, 
    updateCaseStatus 
  } = useApp();
  
  const [currentMobileTab, setCurrentMobileTab] = useState<'home' | 'report' | 'track' | 'contacts'>('home');
  const [mobileDarkMode, setMobileDarkMode] = useState(false);

  // Form State inside Mobile (Citizen)
  const [mobileTitle, setMobileTitle] = useState('');
  const [mobileDesc, setMobileDesc] = useState('');
  const [mobileType, setMobileType] = useState<'CRIME' | 'MISSING_PERSON' | 'LOST_VEHICLE'>('CRIME');

  // Interactive Police Details State
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [policeNotes, setPoliceNotes] = useState('');
  const [policeStatus, setPoliceStatus] = useState<CaseStatus>('INVESTIGATING');

  // Filter lists based on logged-in user
  const citizenReports = reports.filter(r => r.citizenId === (currentUser?.id || 'usr-citizen'));
  const policeCases = cases.filter(c => c.assignedOfficerId === currentUser?.id);
  const unassignedReports = reports.filter(r => r.status === 'SUBMITTED');

  // Get current assigned station details
  const currentStation = stations.find(s => s.id === currentUser?.stationId) || stations[0];

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileTitle || !mobileDesc) return;

    createReport({
      reportType: mobileType,
      title: mobileTitle,
      description: mobileDesc,
      districtId: '1',
      incidentDate: new Date().toISOString(),
      anonymous: false,
      evidenceUrls: [],
      citizenPhone: currentUser?.phone || '555-012-3456'
    });

    setMobileTitle('');
    setMobileDesc('');
    setCurrentMobileTab('track');
  };

  const handleCreateCaseFromReport = (reportId: string) => {
    if (!currentUser) return;
    createCase(reportId, 'HIGH', currentUser.id, 'Investigation initiated via officer terminal app.');
    setSelectedReportId(null);
    setCurrentMobileTab('track');
  };

  const handleUpdateCase = (caseId: string) => {
    if (!policeNotes) return;
    updateCaseStatus(
      caseId,
      policeStatus,
      `Investigation Update: ${policeStatus.replace('_', ' ')}`,
      policeNotes,
      true
    );
    setPoliceNotes('');
    setSelectedCaseId(null);
  };

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col items-center space-y-4" id="flutter-simulator-container">
      <div className="text-center space-y-1">
        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">Interactive Mobile Simulator</span>
        <h3 className="font-extrabold text-slate-900 font-sans text-sm flex items-center justify-center gap-1.5">
          <Smartphone className="w-4.5 h-4.5 text-blue-600" /> Flutter M3 Simulator
        </h3>
        <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed">
          {currentUser 
            ? `Signed in as ${currentUser.fullName} (${currentUser.role}). Experience the live synced app environment.`
            : 'Access anonymous/guest dashboard or use the top corner login to test individual perspectives.'
          }
        </p>
      </div>

      {/* Simulator Device Shell */}
      <div className={`relative w-[340px] h-[680px] rounded-[40px] border-[12px] shadow-2xl overflow-hidden flex flex-col justify-between transition duration-300 ${
        mobileDarkMode 
          ? 'bg-[#0F172A] border-[#1E293B] text-slate-100' 
          : 'bg-[#F8FAFC] border-[#334155] text-slate-800'
      }`}>
        {/* Notch / Speaker bar */}
        <div className={`absolute top-0 inset-x-0 h-6 flex justify-between items-center px-6 text-[10px] font-bold z-50 transition duration-300 ${
          mobileDarkMode ? 'bg-[#0F172A] text-slate-400' : 'bg-[#F8FAFC] text-slate-500'
        }`}>
          <span>9:41</span>
          {/* Camera Notch pill */}
          <div className="w-20 h-4 bg-slate-950 rounded-b-xl absolute left-1/2 transform -translate-x-1/2 top-0" />
          <div className="flex gap-1.5 items-center">
            <span>5G</span>
            <div className="w-4 h-2.5 rounded-xs border border-current flex items-center p-0.5"><div className="w-full h-full bg-current rounded-xs" /></div>
          </div>
        </div>

        {/* Smartphone Content Scrollable Container */}
        <div className={`flex-1 overflow-y-auto pt-7 pb-2 px-4 transition duration-300 ${
          mobileDarkMode ? 'bg-[#0F172A]' : 'bg-[#F8FAFC]'
        }`}>
          
          {/* CITIZEN PROFILE OR GUEST VIEWS */}
          {(!currentUser || currentUser.role === 'CITIZEN') ? (
            <>
              {currentMobileTab === 'home' && (
                <div className="space-y-4 pt-2 animate-fade-in">
                  {/* Citizen Welcome Banner */}
                  <div className="rounded-2xl p-4 bg-gradient-to-br from-[#0F3D91] to-[#2563EB] text-white shadow-md space-y-2">
                    <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {currentUser ? 'Verified Citizen' : 'Guest Account'}
                    </span>
                    <h4 className="font-extrabold text-base font-sans">
                      Welcome, {currentUser ? currentUser.fullName.split(' ')[0] : 'Guest'}
                    </h4>
                    <p className="text-[10px] text-blue-100 leading-relaxed">
                      Lodge quick police requests, secure alerts, and review active municipal directories.
                    </p>
                    {!currentUser && (
                      <span className="inline-block text-[9px] text-amber-200 font-semibold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                        Sign in from the top header to save cases
                      </span>
                    )}
                  </div>

                  {/* Emergency Actions */}
                  <div className="space-y-2">
                    <h5 className={`text-xs font-bold font-sans uppercase tracking-wide ${mobileDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Emergency Despatches</h5>
                    <div className="grid grid-cols-2 gap-2.5">
                      <a href="tel:911" className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 shadow-xs transition active:scale-95 ${
                        mobileDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                      }`}>
                        <Phone className="w-5 h-5 text-red-500 animate-pulse" />
                        <div>
                          <span className="block text-[10px] font-bold">Call Police</span>
                          <span className="text-[9px] text-slate-400 font-semibold">911 Dispatch</span>
                        </div>
                      </a>

                      <button className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 shadow-xs transition active:scale-95 ${
                        mobileDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                      }`}>
                        <Shield className="w-5 h-5 text-indigo-500" />
                        <div>
                          <span className="block text-[10px] font-bold">Cyber Cell</span>
                          <span className="text-[9px] text-slate-400 font-semibold">+1 800-CYBER</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Recent Activity List */}
                  <div className="space-y-2">
                    <h5 className={`text-xs font-bold font-sans uppercase tracking-wide ${mobileDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>My Submissions</h5>
                    {citizenReports.length === 0 ? (
                      <div className={`p-4 rounded-xl border text-center text-xs text-slate-400 ${mobileDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100'}`}>
                        No submitted files. Tap 'Report' below to log one.
                      </div>
                    ) : (
                      citizenReports.slice(0, 2).map(r => (
                        <div
                          key={r.id}
                          onClick={() => setCurrentMobileTab('track')}
                          className={`p-3 rounded-xl border flex items-center justify-between shadow-xs cursor-pointer hover:opacity-80 transition ${
                            mobileDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex gap-2.5 items-center truncate">
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                              <FileText className="w-4.5 h-4.5" />
                            </div>
                            <div className="truncate text-xs">
                              <span className="font-bold block truncate">{r.title}</span>
                              <span className="text-[10px] text-slate-400">{r.reportType} · {r.status}</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Citizen Reporting Wizard */}
              {currentMobileTab === 'report' && (
                <div className="pt-2 space-y-4 animate-fade-in">
                  <div className="border-b pb-2 border-slate-100 dark:border-slate-800">
                    <h4 className="font-extrabold text-base font-sans">Lodge Incident Report</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Submit immediate details to municipal precincts.</p>
                  </div>

                  <form onSubmit={handleMobileSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Incident Type</label>
                      <select
                        value={mobileType}
                        onChange={e => setMobileType(e.target.value as any)}
                        className={`w-full rounded-lg border p-1.5 text-xs focus:outline-hidden ${
                          mobileDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                        }`}
                      >
                        <option value="CRIME">Crime Event</option>
                        <option value="MISSING_PERSON">Missing Person</option>
                        <option value="LOST_VEHICLE">Stolen Vehicle</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Incident Title</label>
                      <input
                        type="text"
                        value={mobileTitle}
                        onChange={e => setMobileTitle(e.target.value)}
                        placeholder="e.g. Broken back gate lock"
                        required
                        className={`w-full rounded-lg border p-2 text-xs focus:outline-hidden ${
                          mobileDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Details description</label>
                      <textarea
                        rows={3}
                        value={mobileDesc}
                        onChange={e => setMobileDesc(e.target.value)}
                        placeholder="Describe context of incident, suspects, or vehicles seen."
                        required
                        className={`w-full rounded-lg border p-2 text-xs focus:outline-hidden ${
                          mobileDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#0F3D91] hover:bg-[#2563EB] text-white font-bold py-2 rounded-lg text-xs shadow-md transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> Submit Case Report
                    </button>
                  </form>
                </div>
              )}

              {/* Citizen Track Tab */}
              {currentMobileTab === 'track' && (
                <div className="pt-2 space-y-4 animate-fade-in">
                  <div className="border-b pb-2 border-slate-100 dark:border-slate-800">
                    <h4 className="font-extrabold text-base font-sans">My Active Cases</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Logs and timeline tracking of submitted incidents.</p>
                  </div>

                  <div className="space-y-3">
                    {citizenReports.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 py-10">No cases recorded under this identity.</p>
                    ) : (
                      citizenReports.map(r => {
                        const activeCase = cases.find(c => c.reportId === r.id);
                        return (
                          <div key={r.id} className={`p-3 rounded-xl border space-y-2 shadow-xs ${
                            mobileDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                          }`}>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold font-mono text-blue-500">
                                {activeCase ? activeCase.caseNumber : 'QUEUED'}
                              </span>
                              <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                                r.status === 'CASE_CREATED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {r.status.replace('_', ' ')}
                              </span>
                            </div>

                            <div>
                              <h5 className="font-bold text-xs">{r.title}</h5>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">{r.description}</p>
                            </div>

                            {activeCase && (
                              <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-between items-center text-[9px] text-slate-400 font-medium">
                                <span>Officer: {activeCase.assignedOfficerName}</span>
                                <span className="font-bold text-emerald-600">{activeCase.status}</span>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* POLICE INVESTIGATOR MOBILE PORTAL (Active when currentUser.role === 'POLICE') */
            <>
              {currentMobileTab === 'home' && (
                <div className="space-y-4 pt-2 animate-fade-in">
                  {/* Police Header Area */}
                  <div className="rounded-2xl p-4 bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white shadow-lg space-y-2.5 border border-slate-800">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] bg-blue-500/30 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Police Investigator
                      </span>
                      <span className="text-[9px] font-mono font-bold text-slate-400">precinct-{currentUser.stationId}</span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base font-sans">{currentUser.fullName}</h4>
                      <p className="text-[10px] text-slate-300">{currentUser.rankTitle || 'Senior Investigator'} · Badge #{currentUser.badgeNumber}</p>
                    </div>
                    <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Assigned Station:</span>
                      <span className="font-bold text-white text-[11px] truncate">{currentStation.name}</span>
                    </div>
                  </div>

                  {/* Police Overview Counters */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className={`p-3 rounded-xl border shadow-xs ${mobileDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wide">My Active Cases</span>
                      <div className="flex justify-between items-end mt-1">
                        <span className="text-xl font-black font-mono text-blue-600">{policeCases.length}</span>
                        <Clipboard className="w-4 h-4 text-blue-500 mb-1" />
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border shadow-xs ${mobileDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wide">Pending Dispatch</span>
                      <div className="flex justify-between items-end mt-1">
                        <span className="text-xl font-black font-mono text-amber-600">{unassignedReports.length}</span>
                        <AlertOctagon className="w-4 h-4 text-amber-500 mb-1" />
                      </div>
                    </div>
                  </div>

                  {/* Action Quick List */}
                  <div className="space-y-2">
                    <h5 className={`text-xs font-bold font-sans uppercase tracking-wide ${mobileDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Quick Case Dispatch</h5>
                    {unassignedReports.length === 0 ? (
                      <div className={`p-4 rounded-xl border text-center text-xs text-slate-400 ${mobileDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100'}`}>
                        No unassigned citizen briefs right now. All clear!
                      </div>
                    ) : (
                      unassignedReports.slice(0, 2).map(r => (
                        <div
                          key={r.id}
                          onClick={() => { setSelectedReportId(r.id); setCurrentMobileTab('report'); }}
                          className={`p-3 rounded-xl border flex items-center justify-between shadow-xs cursor-pointer hover:opacity-80 transition ${
                            mobileDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex gap-2.5 items-center truncate">
                            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                              <AlertTriangle className="w-4 h-4" />
                            </div>
                            <div className="truncate text-xs">
                              <span className="font-bold block truncate">{r.title}</span>
                              <span className="text-[10px] text-slate-400">From: {r.citizenName}</span>
                            </div>
                          </div>
                          <span className="text-[9px] font-bold text-blue-600 shrink-0 bg-blue-50 px-1.5 py-0.5 rounded dark:bg-blue-900/20">Review</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Police Reports / Inbox View */}
              {currentMobileTab === 'report' && (
                <div className="pt-2 space-y-4 animate-fade-in">
                  {!selectedReportId ? (
                    <>
                      <div className="border-b pb-2 border-slate-100 dark:border-slate-800">
                        <h4 className="font-extrabold text-base font-sans">District Desk Briefs</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Citizens reports awaiting official case registration.</p>
                      </div>

                      <div className="space-y-2.5">
                        {unassignedReports.length === 0 ? (
                          <div className="text-center py-12 text-slate-400 text-xs">
                            No pending incident briefs.
                          </div>
                        ) : (
                          unassignedReports.map(r => (
                            <div
                              key={r.id}
                              onClick={() => setSelectedReportId(r.id)}
                              className={`p-3 rounded-xl border text-left shadow-xs cursor-pointer hover:border-blue-500 transition space-y-2 ${
                                mobileDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-[8px] font-bold font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded uppercase">
                                  {r.reportType}
                                </span>
                                <span className="text-[9px] text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div>
                                <h5 className="font-bold text-xs">{r.title}</h5>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{r.description}</p>
                              </div>
                              <div className="flex justify-between items-center text-[9px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-1.5">
                                <span>Reporter: {r.citizenName}</span>
                                <span className="font-bold text-blue-600 flex items-center gap-0.5">Process <ArrowRight className="w-3 h-3" /></span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </>
                  ) : (
                    /* Detailed view of citizen report for police to process */
                    (() => {
                      const repObj = reports.find(r => r.id === selectedReportId);
                      if (!repObj) return <button onClick={() => setSelectedReportId(null)}>Back</button>;
                      return (
                        <div className="space-y-4 animate-fade-in pt-1">
                          <button
                            onClick={() => setSelectedReportId(null)}
                            className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" /> Back to Dispatch List
                          </button>

                          <div className={`p-4 rounded-xl border space-y-3 ${
                            mobileDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                          }`}>
                            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                              <span className="text-[9px] font-extrabold bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded">
                                {repObj.reportType}
                              </span>
                              <span className="text-[9px] text-slate-400">Date: {new Date(repObj.incidentDate).toLocaleDateString()}</span>
                            </div>

                            <div className="space-y-1">
                              <h4 className="font-black text-sm">{repObj.title}</h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{repObj.description}</p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-900 space-y-1 text-[10px]">
                              <p className="text-slate-400 font-bold uppercase text-[8px]">Complainant Details</p>
                              <p className="font-semibold text-slate-700 dark:text-slate-300">Name: {repObj.citizenName}</p>
                              <p className="text-slate-500 font-mono">Mobile: {repObj.citizenPhone}</p>
                            </div>

                            <button
                              onClick={() => handleCreateCaseFromReport(repObj.id)}
                              className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-2 rounded-lg text-xs shadow-md transition flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Register & Assign to Me
                            </button>
                          </div>
                        </div>
                      );
                    })()
                  )}
                </div>
              )}

              {/* Police Track Tab (Case Investigator Log) */}
              {currentMobileTab === 'track' && (
                <div className="pt-2 space-y-4 animate-fade-in">
                  {!selectedCaseId ? (
                    <>
                      <div className="border-b pb-2 border-slate-100 dark:border-slate-800">
                        <h4 className="font-extrabold text-base font-sans">Assigned Cases</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Active investigation logs assigned to your badge.</p>
                      </div>

                      <div className="space-y-2.5">
                        {policeCases.length === 0 ? (
                          <div className="text-center py-12 text-slate-400 text-xs">
                            No cases assigned to your badge.
                          </div>
                        ) : (
                          policeCases.map(c => (
                            <div
                              key={c.id}
                              onClick={() => setSelectedCaseId(c.id)}
                              className={`p-3 rounded-xl border text-left shadow-xs cursor-pointer hover:border-blue-500 transition space-y-2 ${
                                mobileDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] font-bold font-mono text-blue-500">
                                  {c.caseNumber}
                                </span>
                                <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full ${
                                  c.status === 'CLOSED' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {c.status}
                                </span>
                              </div>
                              <div>
                                <h5 className="font-bold text-xs">{c.title}</h5>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{c.description}</p>
                              </div>
                              <div className="flex justify-between items-center text-[9px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-1.5">
                                <span>Priority: <strong className="text-red-500">{c.priority}</strong></span>
                                <span className="font-semibold text-blue-600 flex items-center gap-0.5">Update <Eye className="w-3 h-3" /></span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </>
                  ) : (
                    /* Detailed view of active case with status editing */
                    (() => {
                      const caseObj = cases.find(c => c.id === selectedCaseId);
                      if (!caseObj) return <button onClick={() => setSelectedCaseId(null)}>Back</button>;
                      return (
                        <div className="space-y-4 animate-fade-in pt-1">
                          <button
                            onClick={() => setSelectedCaseId(null)}
                            className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" /> Back to Case List
                          </button>

                          <div className={`p-4 rounded-xl border space-y-3.5 ${
                            mobileDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                          }`}>
                            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                              <span className="text-[9px] font-bold font-mono text-blue-500">{caseObj.caseNumber}</span>
                              <h4 className="font-extrabold text-sm mt-1">{caseObj.title}</h4>
                            </div>

                            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-relaxed">{caseObj.description}</p>

                            {/* Status Update Form */}
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2.5">
                              <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Post Action / Status Update</h5>
                              
                              <div>
                                <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Set Case Status</label>
                                <select
                                  value={policeStatus}
                                  onChange={e => setPoliceStatus(e.target.value as any)}
                                  className={`w-full rounded-lg border p-1.5 text-xs focus:outline-hidden ${
                                    mobileDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                                  }`}
                                >
                                  <option value="INVESTIGATING">INVESTIGATING</option>
                                  <option value="COLLECTING_EVIDENCE">COLLECTING EVIDENCE</option>
                                  <option value="SUSPENDED">SUSPENDED</option>
                                  <option value="CLOSED">CLOSED (Resolved)</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Investigation Notes</label>
                                <textarea
                                  rows={2.5}
                                  value={policeNotes}
                                  onChange={e => setPoliceNotes(e.target.value)}
                                  placeholder="e.g. Completed witness check, secured high-definition surveillance tapes."
                                  required
                                  className={`w-full rounded-lg border p-2 text-xs focus:outline-hidden ${
                                    mobileDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                                  }`}
                                />
                              </div>

                              <button
                                onClick={() => handleUpdateCase(caseObj.id)}
                                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-1.5 rounded-lg text-xs transition"
                              >
                                Post Progress Update
                              </button>
                            </div>

                            {/* Timeline History inside Simulator */}
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                              <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Timeline</h5>
                              <div className="space-y-2.5 max-h-32 overflow-y-auto pr-1">
                                {caseObj.timeline.map((evt, idx) => (
                                  <div key={evt.id} className="relative pl-3 border-l border-slate-200 dark:border-slate-800 text-[10px] space-y-0.5">
                                    <div className="absolute left-[-4.5px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500" />
                                    <p className="font-bold">{evt.title}</p>
                                    <p className="text-slate-400 leading-relaxed text-[9px]">{evt.description}</p>
                                    <p className="text-[8px] text-slate-400 font-mono">{new Date(evt.createdAt).toLocaleDateString()}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })()
                  )}
                </div>
              )}
            </>
          )}

          {/* Directory Tab (Shared for guest, citizen, and police) */}
          {currentMobileTab === 'contacts' && (
            <div className="pt-2 space-y-4 animate-fade-in">
              <div className="border-b pb-2 border-slate-100 dark:border-slate-800">
                <h4 className="font-extrabold text-base font-sans">Precinct directories</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Locate verified municipal law enforcement headquarters.</p>
              </div>

              <div className="space-y-2.5">
                {stations.map(st => (
                  <div key={st.id} className={`p-3 rounded-xl border space-y-1.5 shadow-xs ${
                    mobileDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex justify-between items-start gap-1">
                      <h5 className="font-bold text-xs">{st.name}</h5>
                      <span className="text-[8px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded shrink-0">{st.code}</span>
                    </div>
                    <p className="text-[9.5px] text-slate-400 flex items-center gap-1"><Compass className="w-3.5 h-3.5" /> {st.address}</p>
                    <div className="flex justify-between items-center text-[9.5px] border-t border-slate-100 dark:border-slate-800 pt-1 text-slate-400">
                      <span>Phone Line:</span>
                      <span className="font-bold text-blue-600 font-mono">{st.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Smartphone Bottom Navigation Frame */}
        <div className={`h-14 border-t flex justify-around items-center px-2 z-50 transition duration-300 ${
          mobileDarkMode ? 'bg-[#0F172A] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
        }`}>
          {[
            { id: 'home', label: 'Home', icon: Smartphone },
            { id: 'report', label: currentUser?.role === 'POLICE' ? 'Inbox' : 'Report', icon: currentUser?.role === 'POLICE' ? Clipboard : Plus },
            { id: 'track', label: currentUser?.role === 'POLICE' ? 'Cases' : 'Track', icon: FileText },
            { id: 'contacts', label: 'Precincts', icon: Building }
          ].map(mobTab => (
            <button
              key={mobTab.id}
              onClick={() => {
                // reset sub views
                setSelectedCaseId(null);
                setSelectedReportId(null);
                setCurrentMobileTab(mobTab.id as any);
              }}
              className={`flex flex-col items-center justify-center p-1 cursor-pointer transition-transform duration-150 ${
                currentMobileTab === mobTab.id
                  ? 'text-blue-600 scale-105 font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <mobTab.icon className="w-4.5 h-4.5" />
              <span className="text-[8px] tracking-wide mt-1.5">{mobTab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Simulator controller settings */}
      <div className="flex gap-3 justify-center pt-1.5">
        <button
          onClick={() => setMobileDarkMode(false)}
          className={`flex items-center gap-1.5 rounded-lg text-xs font-semibold px-4 py-2 border transition cursor-pointer ${
            !mobileDarkMode ? 'bg-white text-slate-900 border-slate-300 shadow-xs' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Sun className="w-4 h-4 text-amber-500" /> Light Theme
        </button>
        <button
          onClick={() => setMobileDarkMode(true)}
          className={`flex items-center gap-1.5 rounded-lg text-xs font-semibold px-4 py-2 border transition cursor-pointer ${
            mobileDarkMode ? 'bg-slate-950 text-white border-slate-900 shadow-xs' : 'bg-white text-slate-400 border-slate-200 hover:text-slate-800'
          }`}
        >
          <Moon className="w-4 h-4 text-blue-500" /> Dark Theme
        </button>
      </div>
    </div>
  );
}
