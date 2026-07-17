import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IncidentReport, ActiveCase, CaseStatus, CasePriority } from '../types';
import {
  Shield,
  Search,
  Filter,
  Users,
  Briefcase,
  AlertTriangle,
  FolderPlus,
  Edit3,
  CheckCircle2,
  Calendar,
  MapPin,
  FileText,
  UserCheck,
  TrendingUp,
  Inbox,
  ClipboardList,
  Eye,
  Check,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';

export default function PolicePortal() {
  const {
    reports,
    cases,
    users,
    createCase,
    assignOfficer,
    updateCaseStatus,
    districts,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'queue' | 'cases' | 'analytics'>('queue');
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Selected details
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);
  const [selectedCase, setSelectedCase] = useState<ActiveCase | null>(null);

  // Case creation form state
  const [casePriority, setCasePriority] = useState<CasePriority>('MEDIUM');
  const [assignedOfficer, setAssignedOfficer] = useState('usr-police-1');
  const [initialCaseNotes, setInitialCaseNotes] = useState('');

  // Status updating form state
  const [newCaseStatus, setNewCaseStatus] = useState<CaseStatus>('INVESTIGATING');
  const [timelineTitle, setTimelineTitle] = useState('');
  const [timelineDesc, setTimelineDesc] = useState('');
  const [notifyCitizen, setNotifyCitizen] = useState(true);

  // Filter reports
  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = selectedDistrict === 'ALL' || r.districtId === selectedDistrict;
    const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
    return matchesSearch && matchesDistrict && matchesStatus;
  });

  // Filter cases
  const filteredCases = cases.filter(c => {
    const matchesSearch = c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) || c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOfficer = c.assignedOfficerId === currentUser?.id || true; // Officers see all in demo
    return matchesSearch && matchesOfficer;
  });

  const handleCreateCaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;
    
    const newCaseFile = createCase(selectedReport.id, casePriority, assignedOfficer, initialCaseNotes);
    setSelectedReport(null);
    setInitialCaseNotes('');
    setSelectedCase(newCaseFile);
    setActiveTab('cases');
  };

  const handleUpdateStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !timelineTitle || !timelineDesc) return;

    updateCaseStatus(selectedCase.id, newCaseStatus, timelineTitle, timelineDesc, notifyCitizen);
    
    // Refresh case focus
    const refreshed = cases.find(c => c.id === selectedCase.id);
    if (refreshed) {
      setSelectedCase(refreshed);
    }
    
    setTimelineTitle('');
    setTimelineDesc('');
  };

  // Stats calculation
  const totalReportsCount = reports.length;
  const reportsPendingCount = reports.filter(r => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW').length;
  const totalActiveCases = cases.filter(c => c.status !== 'CLOSED').length;
  const criticalCasesCount = cases.filter(c => c.priority === 'CRITICAL' && c.status !== 'CLOSED').length;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6" id="police-portal-view">
      {/* Overview Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reports Intake</span>
            <span className="block text-2xl font-extrabold text-slate-900 font-sans">{totalReportsCount}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Under Review</span>
            <span className="block text-2xl font-extrabold text-slate-900 font-sans">{reportsPendingCount}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Investigations</span>
            <span className="block text-2xl font-extrabold text-slate-900 font-sans">{totalActiveCases}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-slate-950 text-slate-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Critical Priority</span>
            <span className="block text-2xl font-extrabold text-slate-900 font-sans">{criticalCasesCount}</span>
          </div>
        </div>
      </div>

      {/* Control Ribbon */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Navigation tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {[
            { id: 'queue', label: 'Reports Queue', count: reportsPendingCount },
            { id: 'cases', label: 'Active Cases', count: totalActiveCases },
            { id: 'analytics', label: 'Crime Analytics', count: null }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedReport(null);
                setSelectedCase(null);
              }}
              className={`rounded-md px-4 py-2 text-xs font-semibold tracking-wider uppercase transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-950'
              }`}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                {tab.count !== null && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.id ? 'bg-white/15 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {tab.count}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar (if not on analytics) */}
        {activeTab !== 'analytics' && (
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={activeTab === 'queue' ? "Search reports..." : "Search cases..."}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-hidden bg-slate-50"
              />
            </div>

            {activeTab === 'queue' && (
              <>
                <select
                  value={selectedDistrict}
                  onChange={e => setSelectedDistrict(e.target.value)}
                  className="rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-hidden bg-slate-50"
                >
                  <option value="ALL">All Districts</option>
                  {districts.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-hidden bg-slate-50"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="CASE_CREATED">Case Created</option>
                </select>
              </>
            )}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === 'queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports Table/List */}
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-sm text-slate-900 font-sans flex items-center gap-1.5">
                <Inbox className="w-4.5 h-4.5 text-blue-600" /> Incoming Incident Catalog
              </h3>
              <span className="text-xs font-semibold text-slate-400">Total Filtered: {filteredReports.length}</span>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-auto max-h-[550px]">
              {filteredReports.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <Inbox className="w-10 h-10 mx-auto mb-2 text-slate-200" />
                  <p className="text-xs font-medium">No incident reports match current filter criteria.</p>
                </div>
              ) : (
                filteredReports.map(report => (
                  <div
                    key={report.id}
                    className={`p-4 hover:bg-slate-50/70 transition flex justify-between gap-4 cursor-pointer ${selectedReport?.id === report.id ? 'bg-blue-50/25' : ''}`}
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="space-y-1 max-w-[70%]">
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          report.reportType === 'CRIME' ? 'bg-red-50 text-red-700 border border-red-100' :
                          report.reportType === 'MISSING_PERSON' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                          {report.reportType.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{report.districtName}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 font-sans text-xs">{report.title}</h4>
                      <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{report.description}</p>
                    </div>

                    <div className="flex flex-col items-end justify-between text-right shrink-0">
                      <span className="text-[9px] text-slate-400 font-mono">{new Date(report.createdAt).toLocaleDateString()}</span>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        report.status === 'SUBMITTED' ? 'bg-indigo-50 text-indigo-700' :
                        report.status === 'UNDER_REVIEW' ? 'bg-purple-50 text-purple-700' :
                        report.status === 'CASE_CREATED' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {report.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Report Intake View & Case Initiator */}
          <div className="lg:col-span-1 space-y-6">
            {selectedReport ? (
              <div className="bg-white border border-slate-100 rounded-xl shadow-xs p-5 space-y-5">
                <div className="border-b border-slate-50 pb-3 flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[9px] font-bold text-blue-600 font-mono">FILE: {selectedReport.id}</span>
                    <h3 className="font-extrabold text-slate-900 font-sans text-sm mt-0.5">{selectedReport.title}</h3>
                  </div>
                  <button onClick={() => setSelectedReport(null)} className="text-xs text-slate-400 hover:text-slate-800">Close</button>
                </div>

                {/* Submitting citizen detail */}
                <div className="bg-slate-50 p-3 rounded-lg space-y-1 text-xs">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Submitting Profile</span>
                  <div className="flex justify-between"><span className="text-slate-500">Name:</span> <span className="font-bold text-slate-800">{selectedReport.citizenName}</span></div>
                  {selectedReport.citizenPhone !== 'N/A' && (
                    <div className="flex justify-between"><span className="text-slate-500">Verified Phone:</span> <span className="font-medium text-slate-800">{selectedReport.citizenPhone}</span></div>
                  )}
                  <div className="flex justify-between"><span className="text-slate-500">District:</span> <span className="font-medium text-slate-800">{selectedReport.districtName}</span></div>
                </div>

                {/* Narrative narrative */}
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Description Narrative</span>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg leading-relaxed max-h-[140px] overflow-y-auto">{selectedReport.description}</p>
                </div>

                {/* Evidence Attachments */}
                {selectedReport.evidenceUrls.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Attached Evidence</span>
                    <div className="space-y-1.5">
                      {selectedReport.evidenceUrls.map((ev, i) => (
                        <div key={i} className="flex items-center justify-between border border-slate-100 p-2 rounded text-xs bg-white">
                          <span className="font-semibold text-slate-700 truncate max-w-[150px]">{ev.name}</span>
                          <span className="text-[9px] text-slate-400">{ev.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Case formulation Form */}
                {selectedReport.status === 'CASE_CREATED' ? (
                  <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-center border border-emerald-100">
                    <Check className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                    <span className="block font-bold text-xs font-sans">Official Case Opened</span>
                    <p className="text-[10px] text-emerald-600 mt-1">This report is successfully mapped and fully active inside the Cases workspace.</p>
                  </div>
                ) : (
                  <form onSubmit={handleCreateCaseSubmit} className="border-t border-slate-50 pt-4 space-y-3">
                    <span className="block text-[10px] font-extrabold text-blue-900 uppercase tracking-wider">Configure Official Case</span>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Set Case Priority</label>
                        <select
                          value={casePriority}
                          onChange={e => setCasePriority(e.target.value as CasePriority)}
                          className="w-full rounded border border-slate-200 p-1.5 text-xs focus:border-blue-500 focus:outline-hidden bg-white"
                        >
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                          <option value="CRITICAL">Critical</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lead Investigator</label>
                        <select
                          value={assignedOfficer}
                          onChange={e => setAssignedOfficer(e.target.value)}
                          className="w-full rounded border border-slate-200 p-1.5 text-xs focus:border-blue-500 focus:outline-hidden bg-white"
                        >
                          {users.filter(u => u.role === 'POLICE').map(off => (
                            <option key={off.id} value={off.id}>{off.fullName} ({off.badgeNumber})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Initial Investigation Notes</label>
                      <textarea
                        rows={2}
                        value={initialCaseNotes}
                        onChange={e => setInitialCaseNotes(e.target.value)}
                        placeholder="Log dispatch orders or next procedural tasks."
                        required
                        className="w-full rounded border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold py-2.5 text-xs shadow-sm transition flex items-center justify-center gap-1"
                    >
                      <FolderPlus className="w-4 h-4" /> Create Official Case File
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-xl shadow-xs p-5 text-center flex flex-col items-center justify-center h-[350px]">
                <Inbox className="w-8 h-8 text-slate-200 mb-2" />
                <h4 className="font-bold text-slate-800 text-xs font-sans">No Report Selected</h4>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">Click any incoming report on the left sidebar to assign officers or initiate cases.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CASES WORKSPACE */}
      {activeTab === 'cases' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active cases list */}
          <div className="lg:col-span-1 bg-white border border-slate-100 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-sm text-slate-900 font-sans flex items-center gap-1.5">
                <Shield className="w-4.5 h-4.5 text-blue-600" /> Active Case Files
              </h3>
              <span className="text-xs font-semibold text-slate-400">Total: {filteredCases.length}</span>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-auto max-h-[550px]">
              {filteredCases.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <Shield className="w-10 h-10 mx-auto mb-2 text-slate-200" />
                  <p className="text-xs font-medium">No active cases are logged in the system.</p>
                </div>
              ) : (
                filteredCases.map(caseItem => (
                  <div
                    key={caseItem.id}
                    onClick={() => setSelectedCase(caseItem)}
                    className={`p-4 hover:bg-slate-50/70 transition flex flex-col gap-2 cursor-pointer ${selectedCase?.id === caseItem.id ? 'bg-blue-50/25' : ''}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900 font-sans font-mono">{caseItem.caseNumber}</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                        caseItem.priority === 'CRITICAL' ? 'bg-red-950 text-red-200' :
                        caseItem.priority === 'HIGH' ? 'bg-red-50 text-red-700' :
                        caseItem.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {caseItem.priority}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 text-xs font-sans truncate">{caseItem.title}</h4>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>Lead: {caseItem.assignedOfficerName}</span>
                        <span className="font-semibold text-blue-600 uppercase tracking-wider">{caseItem.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Case Detail Workspace */}
          <div className="lg:col-span-2 space-y-6">
            {selectedCase ? (
              <div className="bg-white border border-slate-100 rounded-xl shadow-xs p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-blue-600">{selectedCase.caseNumber}</span>
                      <span className={`text-[8px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded ${
                        selectedCase.priority === 'CRITICAL' ? 'bg-red-950 text-red-200' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {selectedCase.priority} Priority
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 font-sans mt-0.5">{selectedCase.title}</h2>
                  </div>

                  <span className="self-start sm:self-center bg-blue-50 text-blue-800 border border-blue-100 font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded">
                    INVESTIGATION STATUS: {selectedCase.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Sub-workspace layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Update logs & details */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Log Status Update</span>
                    
                    <form onSubmit={handleUpdateStatusSubmit} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Transition Case Status</label>
                        <select
                          value={newCaseStatus}
                          onChange={e => setNewCaseStatus(e.target.value as CaseStatus)}
                          className="w-full rounded border border-slate-200 p-1.5 text-xs focus:border-blue-500 focus:outline-hidden bg-white"
                        >
                          <option value="ASSIGNED">Assigned</option>
                          <option value="INVESTIGATING">Investigating</option>
                          <option value="COLLECTING_EVIDENCE">Collecting Evidence</option>
                          <option value="SUSPENDED">Suspended</option>
                          <option value="CLOSED">Closed (Archive)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Update Heading</label>
                        <input
                          type="text"
                          value={timelineTitle}
                          onChange={e => setTimelineTitle(e.target.value)}
                          placeholder="e.g. CCTV analysis logged"
                          required
                          className="w-full rounded border border-slate-200 p-1.5 text-xs focus:border-blue-500 focus:outline-hidden bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Action Details narrative</label>
                        <textarea
                          rows={3}
                          value={timelineDesc}
                          onChange={e => setTimelineDesc(e.target.value)}
                          placeholder="Detailed action details or intelligence findings."
                          required
                          className="w-full rounded border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-hidden bg-white"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="notifyCheck"
                          checked={notifyCitizen}
                          onChange={e => setNotifyCitizen(e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="notifyCheck" className="text-[10px] font-bold text-slate-600 cursor-pointer">
                          Publish to Citizen Tracking Timeline
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-lg shadow-xs transition"
                      >
                        Publish Update Entry
                      </button>
                    </form>
                  </div>

                  {/* Right Column: Case Timeline & Audit list */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Investigation timeline</span>
                    
                    <div className="relative border-l-2 border-slate-100 pl-4 space-y-4 max-h-[350px] overflow-y-auto pr-1">
                      {selectedCase.timeline.map((item, idx) => (
                        <div key={item.id} className="relative">
                          {/* Bullet bullet */}
                          <div className={`absolute -left-[24px] top-1 w-3 h-3 rounded-full border bg-white flex items-center justify-center ${
                            idx === 0 ? 'border-blue-500 bg-blue-50' : 'border-slate-300'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-blue-500' : 'bg-slate-400'}`} />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between items-start">
                              <h5 className="font-bold text-xs text-slate-900 font-sans">{item.title}</h5>
                              <span className="text-[8px] font-bold uppercase tracking-wider px-1 bg-slate-100 text-slate-400 rounded">
                                {item.visibleToCitizen ? 'Public' : 'Internal'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">{item.description}</p>
                            <span className="text-[9px] text-slate-400 block">Logged: {new Date(item.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-xl shadow-xs p-5 text-center flex flex-col items-center justify-center h-[450px]">
                <Shield className="w-12 h-12 text-slate-200 mb-3" />
                <h3 className="font-bold text-slate-800 font-sans">No Case Active</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Select an active investigation case from the left panel sidebar to review the incident timeline, record investigative actions, or upload file evidence.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CRIME ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm font-sans flex items-center gap-1.5">
              <TrendingUp className="w-4.5 h-4.5 text-blue-600" /> District Occurrence Distribution
            </h3>
            
            {/* Custom SVG Bar Chart */}
            <div className="space-y-3 pt-2">
              {[
                { district: 'Central District', count: 12, percent: 40, color: 'bg-blue-600' },
                { district: 'North Metropolitan', count: 9, percent: 30, color: 'bg-indigo-600' },
                { district: 'East Valley', count: 5, percent: 16, color: 'bg-amber-500' },
                { district: 'South Coastal', count: 3, percent: 10, color: 'bg-emerald-500' },
                { district: 'West Highlands', count: 1, percent: 4, color: 'bg-slate-400' }
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{item.district}</span>
                    <span>{item.count} Incidents ({item.percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm font-sans flex items-center gap-1.5">
              <Calendar className="w-4.5 h-4.5 text-blue-600" /> Chronology Breakdown by Classification
            </h3>

            {/* Custom SVG Line Chart or Metric Card Grid */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="border border-slate-100 bg-slate-50 p-4 rounded-xl text-center">
                <span className="block text-2xl font-black text-red-600 font-sans">15</span>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Crime Events</span>
              </div>
              <div className="border border-slate-100 bg-slate-50 p-4 rounded-xl text-center">
                <span className="block text-2xl font-black text-amber-500 font-sans">4</span>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Missing Persons</span>
              </div>
              <div className="border border-slate-100 bg-slate-50 p-4 rounded-xl text-center">
                <span className="block text-2xl font-black text-blue-600 font-sans">8</span>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Stolen Vehicles</span>
              </div>
            </div>

            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-50 text-xs text-blue-700 space-y-1.5 leading-relaxed">
              <span className="font-extrabold flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Federal Statistical Compliance</span>
              <p>All intelligence charts and logs synchronize automatically. They meet federal data verification standards and cannot be modified by local personnel.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
