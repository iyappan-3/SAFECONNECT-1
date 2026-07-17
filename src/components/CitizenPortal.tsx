import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IncidentReport, ReportType } from '../types';
import {
  Shield,
  FileText,
  AlertTriangle,
  MapPin,
  Upload,
  Clock,
  Phone,
  Info,
  Building,
  CheckCircle2,
  ChevronRight,
  Eye,
  FileSpreadsheet,
  AlertOctagon,
  User,
  Compass,
  ArrowRight
} from 'lucide-react';

export default function CitizenPortal() {
  const { reports, cases, districts, createReport, submitComplaint, complaints, stations, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'report' | 'track' | 'emergency' | 'stations'>('dashboard');

  // Form State
  const [reportType, setReportType] = useState<ReportType>('CRIME');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [districtId, setDistrictId] = useState('1');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().slice(0, 16));
  const [anonymous, setAnonymous] = useState(false);
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [tempFiles, setTempFiles] = useState<{ name: string; size: string; type: string }[]>([]);

  // Sub-forms
  const [missingName, setMissingName] = useState('');
  const [missingAge, setMissingAge] = useState('');
  const [missingGender, setMissingGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [missingClothing, setMissingClothing] = useState('');
  const [missingFeatures, setMissingFeatures] = useState('');

  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');

  // Complaint Form State
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintOfficer, setComplaintOfficer] = useState('');

  // Tracked Detail State
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);

  // Success screen
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files).map((file: any) => ({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type
      }));
      setTempFiles(prev => [...prev, ...filesArr]);
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const extraData: any = {};
    if (reportType === 'MISSING_PERSON') {
      extraData.missingPersonDetails = {
        fullName: missingName,
        age: parseInt(missingAge) || 30,
        gender: missingGender,
        lastSeenWearing: missingClothing,
        distinguishingFeatures: missingFeatures
      };
    } else if (reportType === 'LOST_VEHICLE') {
      extraData.vehicleDetails = {
        licensePlate: vehiclePlate,
        makeModel: vehicleModel,
        color: vehicleColor,
        registrationYear: parseInt(vehicleYear) || 2020,
        stolenDate: incidentDate.slice(0, 10)
      };
    }

    createReport({
      reportType,
      title,
      description,
      districtId,
      incidentDate,
      anonymous,
      gpsLatitude: gpsEnabled ? 37.7749 + (Math.random() - 0.5) * 0.05 : undefined,
      gpsLongitude: gpsEnabled ? -122.4194 + (Math.random() - 0.5) * 0.05 : undefined,
      evidenceUrls: tempFiles.map(f => ({ name: f.name, type: f.type, url: '#', size: f.size })),
      ...extraData
    });

    setTitle('');
    setDescription('');
    setTempFiles([]);
    setSuccessMessage('Incident Report Filed Successfully! Your case has been secured and dispatched for review.');
    setActiveTab('dashboard');
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintTitle || !complaintDesc) return;
    submitComplaint(complaintTitle, complaintDesc, complaintOfficer);
    setComplaintTitle('');
    setComplaintDesc('');
    setComplaintOfficer('');
    setSuccessMessage('Security Misconduct Complaint Logged. Your details will remain confidential.');
    setActiveTab('dashboard');
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const myReports = reports.filter(r => r.citizenId === (currentUser?.id || 'usr-citizen'));

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6" id="citizen-portal-view">
      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg flex items-start gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-emerald-900 font-semibold font-sans">Action Approved</h4>
            <p className="text-emerald-700 text-sm">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Main Grid banner */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-900 to-indigo-950 p-6 md:p-10 text-white shadow-xl">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold tracking-wider text-blue-300 uppercase">
                <Shield className="w-3.5 h-3.5" /> Federal Communications Portal
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold font-sans tracking-tight leading-tight">
                Secure Citizen Connection to Law Enforcement
              </h1>
              <p className="text-blue-100 text-base md:text-lg leading-relaxed">
                GovFind empowers citizens to securely report incidents, locate emergency services, and monitor case progress with real-time audit updates.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => { setReportType('CRIME'); setActiveTab('report'); }}
                  className="rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium px-5 py-2.5 shadow-md transition"
                  id="btn-report-crime-hero"
                >
                  Report Crime
                </button>
                <button
                  onClick={() => setActiveTab('track')}
                  className="rounded-lg bg-white/15 hover:bg-white/20 text-white border border-white/10 font-medium px-5 py-2.5 transition"
                >
                  Track My Cases
                </button>
              </div>
            </div>
            {/* Ambient Background Grid */}
            <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none transform translate-y-1/4 translate-x-1/4">
              <Compass className="w-96 h-96" />
            </div>
          </div>

          {/* Quick Service Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => { setReportType('CRIME'); setActiveTab('report'); }}
              className="flex flex-col items-start p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left shadow-sm transition duration-200 group"
            >
              <div className="p-3 bg-red-50 text-red-600 rounded-lg group-hover:scale-105 transition-transform mb-4">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 font-sans group-hover:text-blue-900">Report Crime</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Securely lodge theft, robbery, vandalisms, and suspicious activities.</p>
              <span className="text-blue-600 font-medium text-xs flex items-center gap-1 mt-4">
                Lodge Report <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>

            <button
              onClick={() => { setReportType('MISSING_PERSON'); setActiveTab('report'); }}
              className="flex flex-col items-start p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left shadow-sm transition duration-200 group"
            >
              <div className="p-3 bg-amber-50 text-amber-600 rounded-lg group-hover:scale-105 transition-transform mb-4">
                <User className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 font-sans group-hover:text-blue-900">Missing Person</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Submit profiles of elder walk-away or missing citizens for silver alerts.</p>
              <span className="text-blue-600 font-medium text-xs flex items-center gap-1 mt-4">
                Lodge Report <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>

            <button
              onClick={() => { setReportType('LOST_VEHICLE'); setActiveTab('report'); }}
              className="flex flex-col items-start p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left shadow-sm transition duration-200 group"
            >
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-105 transition-transform mb-4">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 font-sans group-hover:text-blue-900">Lost/Stolen Vehicle</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Report motor vehicle theft, license plates loss, or stolen scooters.</p>
              <span className="text-blue-600 font-medium text-xs flex items-center gap-1 mt-4">
                Lodge Report <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>

            <button
              onClick={() => { setReportType('COMPLAINT'); setActiveTab('report'); }}
              className="flex flex-col items-start p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left shadow-sm transition duration-200 group"
            >
              <div className="p-3 bg-slate-100 text-slate-600 rounded-lg group-hover:scale-105 transition-transform mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 font-sans group-hover:text-blue-900">Police Misconduct</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Directly escalate issues, unprofessional actions, or abuse of power.</p>
              <span className="text-blue-600 font-medium text-xs flex items-center gap-1 mt-4">
                Lodge Report <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          </div>

          {/* Directory Shortcuts & Notice Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 font-sans text-lg flex items-center gap-2 border-b border-slate-50 pb-3">
                <Clock className="w-5 h-5 text-blue-600" /> Active Safety Advisories
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3 items-start bg-slate-50 p-3 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900">Increased Vehicle Theft Patrols</h4>
                    <p className="text-xs text-slate-500 mt-0.5">High numbers of catalytic converter thefts reported around North Metropolitan. Citizens advised to park in well-lit garages.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start bg-slate-50 p-3 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900">National Silver Alert Broadcast Activated</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Alert triggered for Thomas Davis (last seen in East Valley). Please inspect neighborhood spaces.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 text-white rounded-xl p-5 shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="font-bold font-sans text-lg">Official Channels</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Always use emergency phone lines for active, in-progress crime events. Web reports undergo review within 12-24 hours.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                    <span className="text-slate-400">Emergency Dispatch</span>
                    <span className="font-bold text-red-400">911 / 112</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                    <span className="text-slate-400">HQ Desk Line</span>
                    <span className="font-semibold text-slate-200">+1 (555) 019-2001</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setActiveTab('emergency')} className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-center py-2 text-xs font-semibold transition">
                  Emergency List
                </button>
                <button onClick={() => setActiveTab('stations')} className="flex-1 rounded-lg bg-white/10 hover:bg-white/15 text-center py-2 text-xs font-semibold transition">
                  Find Station
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT INCIDENT FORM */}
      {activeTab === 'report' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 max-w-3xl mx-auto space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-sans flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" /> Lodge Official Report
              </h2>
              <p className="text-xs text-slate-500 mt-1">Provide honest and accurate details. Submitting a false report is a criminal offense.</p>
            </div>
            <button
              onClick={() => { setActiveTab('dashboard'); setTempFiles([]); }}
              className="text-xs text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5 font-medium transition"
            >
              Cancel
            </button>
          </div>

          {/* Type selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'CRIME', label: 'Crime Event', icon: AlertOctagon, color: 'border-red-200 bg-red-50/10 text-red-700' },
              { id: 'MISSING_PERSON', label: 'Missing Elder', icon: User, color: 'border-amber-200 bg-amber-50/10 text-amber-700' },
              { id: 'LOST_VEHICLE', label: 'Stolen Car', icon: FileSpreadsheet, color: 'border-blue-200 bg-blue-50/10 text-blue-700' },
              { id: 'COMPLAINT', label: 'Misconduct', icon: AlertTriangle, color: 'border-slate-200 bg-slate-50 text-slate-700' }
            ].map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => setReportType(type.id as ReportType)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition cursor-pointer ${
                  reportType === type.id
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold shadow-xs'
                    : 'border-slate-100 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <type.icon className="w-5 h-5 mb-1.5" />
                <span className="text-[11px] tracking-wide">{type.label}</span>
              </button>
            ))}
          </div>

          {/* Sub-form Specific Fields */}
          {reportType === 'COMPLAINT' ? (
            <form onSubmit={handleComplaintSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Officer Name / Badge (Optional)</label>
                  <input
                    type="text"
                    value={complaintOfficer}
                    onChange={e => setComplaintOfficer(e.target.value)}
                    placeholder="e.g. Sgt. Miller or Badge-7402"
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Complaint Category</label>
                  <input
                    type="text"
                    value={complaintTitle}
                    onChange={e => setComplaintTitle(e.target.value)}
                    placeholder="e.g. Unprofessional demeanor"
                    required
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Detailed Complaint Narrative</label>
                <textarea
                  rows={4}
                  value={complaintDesc}
                  onChange={e => setComplaintDesc(e.target.value)}
                  placeholder="Provide date, time, location, dialog, or context of the misconduct."
                  required
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="bg-slate-50 rounded-lg p-3 text-slate-600 text-xs flex gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>Your misconduct report will go directly to the Admin Internal Audit board. Officers logged in the system cannot delete or override complaints once filed.</p>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 text-sm shadow-md transition"
              >
                Log Misconduct Complaint
              </button>
            </form>
          ) : (
            <form onSubmit={handleReportSubmit} className="space-y-4">
              {/* General Core Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Incident Short Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Stolen Package from front yard"
                    required
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Precinct District Range</label>
                  <select
                    value={districtId}
                    onChange={e => setDistrictId(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-blue-500 focus:outline-hidden"
                  >
                    {districts.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Approximate Date & Time</label>
                  <input
                    type="datetime-local"
                    value={incidentDate}
                    onChange={e => setIncidentDate(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Secure Controls</span>
                  <div className="flex items-center gap-6 h-full">
                    <label className="inline-flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={anonymous}
                        onChange={e => setAnonymous(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Report Anonymously</span>
                    </label>

                    <label className="inline-flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gpsEnabled}
                        onChange={e => setGpsEnabled(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-500" /> Auto GPS coordinates</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Sub-form fields: Missing Person */}
              {reportType === 'MISSING_PERSON' && (
                <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-100 space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm font-sans flex items-center gap-1.5">
                    <User className="w-4 h-4 text-amber-600" /> Missing Elder / Person Profile Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        value={missingName}
                        onChange={e => setMissingName(e.target.value)}
                        placeholder="Thomas Davis"
                        required
                        className="w-full bg-white rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Estimated Age</label>
                      <input
                        type="number"
                        value={missingAge}
                        onChange={e => setMissingAge(e.target.value)}
                        placeholder="78"
                        required
                        className="w-full bg-white rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Biological Gender</label>
                      <select
                        value={missingGender}
                        onChange={e => setMissingGender(e.target.value as any)}
                        className="w-full bg-white rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-hidden"
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Last Seen Wearing</label>
                      <input
                        type="text"
                        value={missingClothing}
                        onChange={e => setMissingClothing(e.target.value)}
                        placeholder="Light blue shirt and gray trousers"
                        required
                        className="w-full bg-white rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Distinguishing Features / Conditions</label>
                      <input
                        type="text"
                        value={missingFeatures}
                        onChange={e => setMissingFeatures(e.target.value)}
                        placeholder="Wears glasses, suffers from early-stage dementia"
                        className="w-full bg-white rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-form fields: Lost Vehicle */}
              {reportType === 'LOST_VEHICLE' && (
                <div className="bg-blue-50/30 p-4 rounded-xl border border-blue-100 space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm font-sans flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-blue-600" /> Stolen Motor Vehicle Register
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">License Plate No.</label>
                      <input
                        type="text"
                        value={vehiclePlate}
                        onChange={e => setVehiclePlate(e.target.value)}
                        placeholder="ABC-1234"
                        required
                        className="w-full bg-white rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Make / Model</label>
                      <input
                        type="text"
                        value={vehicleModel}
                        onChange={e => setVehicleModel(e.target.value)}
                        placeholder="Honda Civic"
                        required
                        className="w-full bg-white rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Color Accent</label>
                      <input
                        type="text"
                        value={vehicleColor}
                        onChange={e => setVehicleColor(e.target.value)}
                        placeholder="Red"
                        required
                        className="w-full bg-white rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">Registration Year</label>
                      <input
                        type="number"
                        value={vehicleYear}
                        onChange={e => setVehicleYear(e.target.value)}
                        placeholder="2021"
                        required
                        className="w-full bg-white rounded-lg border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Narrative description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Full Chronological Narrative</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe what occurred. Provide as much details as possible including witness descriptions, speech used, or path of suspects."
                  required
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              {/* Evidence upload simulation */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Upload Evidence (Images, Videos, PDFs)</label>
                <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-6 text-center cursor-pointer relative bg-slate-50/50 hover:bg-slate-50 transition">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <span className="block text-xs font-bold text-slate-700">Drag files here or click to select</span>
                  <span className="block text-[10px] text-slate-400 mt-1">Maximum single file size: 50MB. Uploads are hashed and locked for court eligibility.</span>
                </div>

                {/* Uploaded files queue */}
                {tempFiles.length > 0 && (
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Evidence Files Attached ({tempFiles.length})</span>
                    {tempFiles.map((file, i) => (
                      <div key={i} className="flex justify-between items-center bg-white border border-slate-100 p-2 rounded-md text-xs">
                        <span className="font-semibold text-slate-700 truncate max-w-[200px]">{file.name}</span>
                        <div className="flex gap-2 items-center text-slate-400 text-[10px]">
                          <span>{file.size}</span>
                          <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">{file.type.split('/')[1] || 'FILE'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold py-3 text-sm shadow-md transition"
              >
                Log Incident to Precinct Command
              </button>
            </form>
          )}
        </div>
      )}

      {/* CASE TRACKING */}
      {activeTab === 'track' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submissions list */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-900 text-white p-4 rounded-xl flex justify-between items-center">
              <div>
                <h3 className="font-bold font-sans">Track Submissions</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Your protected incident submissions catalog.</p>
              </div>
              <span className="text-xs bg-white/10 px-2 py-1 rounded-full font-bold">{myReports.length} Active</span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {myReports.length === 0 ? (
                <div className="p-8 text-center bg-white border border-slate-100 rounded-xl">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-medium">No reports submitted yet.</p>
                </div>
              ) : (
                myReports.map(report => {
                  const linkedCase = cases.find(c => c.reportId === report.id);
                  return (
                    <button
                      key={report.id}
                      onClick={() => setSelectedReport(report)}
                      className={`w-full text-left p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between gap-3 ${
                        selectedReport?.id === report.id
                          ? 'bg-blue-50/50 border-blue-400 shadow-xs'
                          : 'bg-white border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          report.reportType === 'CRIME' ? 'bg-red-50 text-red-700' :
                          report.reportType === 'MISSING_PERSON' ? 'bg-amber-50 text-amber-700' :
                          report.reportType === 'LOST_VEHICLE' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {report.reportType.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-900 font-sans text-sm line-clamp-1">{report.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{report.description}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs w-full">
                        <span className="text-slate-400 text-[11px]">Status Indicator:</span>
                        <span className={`font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
                          report.status === 'SUBMITTED' ? 'bg-indigo-50 text-indigo-700' :
                          report.status === 'UNDER_REVIEW' ? 'bg-purple-50 text-purple-700' :
                          report.status === 'CASE_CREATED' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {report.status.replace('_', ' ')}
                        </span>
                      </div>

                      {linkedCase && (
                        <div className="bg-slate-50 rounded-lg p-2 flex items-center justify-between text-[11px] w-full text-slate-600 border border-slate-100">
                          <span className="font-bold text-slate-800">{linkedCase.caseNumber}</span>
                          <span className="font-semibold text-blue-600 flex items-center gap-0.5">
                            Track <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Report/Case details view */}
          <div className="lg:col-span-2 space-y-6">
            {selectedReport ? (
              <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">Incident File: {selectedReport.id}</span>
                    <h2 className="text-xl font-bold text-slate-900 font-sans mt-0.5">{selectedReport.title}</h2>
                  </div>
                  <span className={`self-start sm:self-center font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full ${
                    selectedReport.status === 'SUBMITTED' ? 'bg-indigo-50 text-indigo-700' :
                    selectedReport.status === 'UNDER_REVIEW' ? 'bg-purple-50 text-purple-700' :
                    selectedReport.status === 'CASE_CREATED' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}>
                    Status: {selectedReport.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Sub-panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Report Metadata</span>
                    <div className="space-y-1.5 text-xs text-slate-700">
                      <div className="flex justify-between"><span className="text-slate-500">Filed On:</span> <span className="font-semibold">{new Date(selectedReport.createdAt).toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Incident Date:</span> <span className="font-semibold">{new Date(selectedReport.incidentDate).toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">District Precinct:</span> <span className="font-semibold">{selectedReport.districtName}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Confidentiality:</span> <span className="font-semibold">{selectedReport.anonymous ? 'Anonymous Source' : 'Standard Profile verified'}</span></div>
                    </div>
                  </div>

                  {/* GPS simulated map panel */}
                  <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" /> GPS Dispatch Location
                      </span>
                      <p className="text-xs text-slate-600 mt-2">
                        {selectedReport.gpsLatitude && selectedReport.gpsLongitude ? (
                          <span className="font-semibold text-slate-800">
                            Coordinates Secured: Lat {selectedReport.gpsLatitude.toFixed(5)}, Lng {selectedReport.gpsLongitude.toFixed(5)}
                          </span>
                        ) : (
                          <span className="text-slate-400">GPS authorization was not checked during lodging.</span>
                        )}
                      </p>
                    </div>
                    {selectedReport.gpsLatitude && (
                      <div className="bg-blue-100/40 rounded-lg p-2 text-[10px] text-blue-700 flex items-center gap-2 font-medium border border-blue-100">
                        <Compass className="w-4 h-4 shrink-0 animate-spin-slow" /> Coordinates synced with Precinct Dispatch Units.
                      </div>
                    )}
                  </div>
                </div>

                {/* Specific details panels if present */}
                {selectedReport.missingPersonDetails && (
                  <div className="bg-amber-50/30 border border-amber-100 rounded-xl p-4 space-y-2.5">
                    <h4 className="font-bold text-amber-800 text-sm font-sans flex items-center gap-1.5">
                      <User className="w-4 h-4" /> Missing Individual File Specs
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div><span className="text-slate-400 block text-[10px] uppercase">Name</span> <span className="font-semibold text-slate-800">{selectedReport.missingPersonDetails.fullName}</span></div>
                      <div><span className="text-slate-400 block text-[10px] uppercase">Age</span> <span className="font-semibold text-slate-800">{selectedReport.missingPersonDetails.age} years</span></div>
                      <div><span className="text-slate-400 block text-[10px] uppercase">Gender</span> <span className="font-semibold text-slate-800">{selectedReport.missingPersonDetails.gender}</span></div>
                      <div><span className="text-slate-400 block text-[10px] uppercase">Wearing</span> <span className="font-semibold text-slate-800 truncate block">{selectedReport.missingPersonDetails.lastSeenWearing}</span></div>
                    </div>
                    <div className="text-xs border-t border-amber-100 pt-2"><span className="text-slate-400 block text-[10px] uppercase">Distinguishing Traits</span> <span className="font-semibold text-slate-800">{selectedReport.missingPersonDetails.distinguishingFeatures}</span></div>
                  </div>
                )}

                {selectedReport.vehicleDetails && (
                  <div className="bg-blue-50/20 border border-blue-100 rounded-xl p-4 space-y-2.5">
                    <h4 className="font-bold text-blue-800 text-sm font-sans flex items-center gap-1.5">
                      <FileSpreadsheet className="w-4 h-4" /> Vehicle Register Parameters
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div><span className="text-slate-400 block text-[10px] uppercase">License Plate</span> <span className="font-semibold text-slate-800">{selectedReport.vehicleDetails.licensePlate}</span></div>
                      <div><span className="text-slate-400 block text-[10px] uppercase">Make/Model</span> <span className="font-semibold text-slate-800">{selectedReport.vehicleDetails.makeModel}</span></div>
                      <div><span className="text-slate-400 block text-[10px] uppercase">Color Accent</span> <span className="font-semibold text-slate-800">{selectedReport.vehicleDetails.color}</span></div>
                      <div><span className="text-slate-400 block text-[10px] uppercase">Reg Year</span> <span className="font-semibold text-slate-800">{selectedReport.vehicleDetails.registrationYear}</span></div>
                    </div>
                  </div>
                )}

                {/* Chronology description */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Incident Description</span>
                  <div className="text-slate-700 text-sm bg-slate-50 p-4 rounded-xl leading-relaxed border border-slate-50">{selectedReport.description}</div>
                </div>

                {/* Evidence attachments list */}
                {selectedReport.evidenceUrls.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Logged Evidence Materials ({selectedReport.evidenceUrls.length})</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedReport.evidenceUrls.map((ev, idx) => (
                        <div key={idx} className="flex gap-3 items-center border border-slate-100 bg-white rounded-xl p-3 shadow-xs">
                          {ev.type.startsWith('image/') ? (
                            <img src={ev.url === '#' ? 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=100&auto=format&fit=crop&q=60' : ev.url} alt={ev.name} className="w-12 h-12 object-cover rounded-lg shrink-0 bg-slate-100" />
                          ) : (
                            <div className="w-12 h-12 bg-blue-50 text-blue-700 flex items-center justify-center rounded-lg font-bold text-[10px] shrink-0 uppercase">
                              {ev.type.split('/')[1] || 'PDF'}
                            </div>
                          )}
                          <div className="truncate text-xs">
                            <span className="font-semibold text-slate-800 truncate block">{ev.name}</span>
                            <span className="text-[10px] text-slate-400">{ev.size}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CASE FILE TIMELINE SECTION */}
                {(() => {
                  const linkedCase = cases.find(c => c.reportId === selectedReport.id);
                  if (!linkedCase) {
                    return (
                      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-center space-y-2.5">
                        <Shield className="w-8 h-8 text-slate-300 mx-auto" />
                        <h4 className="font-semibold text-slate-800 text-sm font-sans">Under General Precinct Review</h4>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                          Our officers are analyzing this lodging. An investigator will be designated, opening an official case file once validated.
                        </p>
                      </div>
                    );
                  }

                  // Render Case File Updates Timeline
                  const visibleTimeline = linkedCase.timeline.filter(t => t.visibleToCitizen);

                  return (
                    <div className="border-t border-slate-100 pt-6 space-y-5">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-slate-900 text-white p-4 rounded-xl">
                        <div>
                          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">OFFICIAL INVESTIGATION FILE ACTIVE</span>
                          <h4 className="font-bold text-base font-sans mt-0.5">{linkedCase.caseNumber}</h4>
                        </div>
                        <div className="text-left sm:text-right text-xs">
                          <span className="text-slate-400 block text-[10px]">Assigned Officer</span>
                          <span className="font-bold text-slate-200">{linkedCase.assignedOfficerName} (Badge-{linkedCase.badgeNumber})</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Case Audit History</span>
                        
                        <div className="relative border-l-2 border-slate-100 ml-3.5 pl-6 space-y-6">
                          {visibleTimeline.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">No public status entries logged yet.</p>
                          ) : (
                            visibleTimeline.map((item, idx) => (
                              <div key={item.id} className="relative">
                                {/* Bullet indicator */}
                                <div className={`absolute -left-[32px] top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                                  idx === 0 ? 'border-emerald-500 ring-4 ring-emerald-50' : 'border-slate-300'
                                }`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                </div>

                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                    <h5 className="font-bold text-sm text-slate-900 font-sans">{item.title}</h5>
                                    <span className="text-[10px] text-slate-400 font-mono">{new Date(item.createdAt).toLocaleString()}</span>
                                  </div>
                                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                                  <span className="text-[10px] text-slate-400 block font-medium">Logged by Officer {item.updatedBy} (Badge {item.badgeNumber})</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

              </div>
            ) : (
              <div className="h-[450px] flex flex-col items-center justify-center bg-white border border-slate-100 rounded-xl text-center p-6">
                <Shield className="w-12 h-12 text-slate-200 mb-3" />
                <h3 className="font-bold text-slate-800 font-sans">No Submissions Selected</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Choose an incident report from the left sidebar to explore its details, mapped coordinates, and real-time case investigation status history.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EMERGENCY CONTACTS */}
      {activeTab === 'emergency' && (
        <div className="bg-white rounded-xl border border-slate-100 p-6 space-y-6 max-w-3xl mx-auto">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-bold text-slate-900 font-sans flex items-center gap-2">
              <Phone className="w-6 h-6 text-red-600" /> State Emergency Hotline Directory
            </h2>
            <p className="text-xs text-slate-500 mt-1">In emergency situations, call 911 or direct precinct lines immediately for rapid dispatch.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'National Police Dispatch', phone: '911 / 112', desc: 'Active physical threats, ongoing break-ins, or physical accidents.', priority: 'HIGH' },
              { title: 'State Cyber Crime Desk', phone: '+1 (800) 555-CYBER', desc: 'Ransomware, severe server threats, fraud, or targeted cyber abuse.', priority: 'MEDIUM' },
              { title: 'National Silver Alert Broadcasters', phone: '+1 (800) 555-AMBER', desc: 'Immediate assistance registering senior citizens or child search alerts.', priority: 'MEDIUM' },
              { title: 'Precinct Administrative Desk', phone: '+1 (555) 019-2001', desc: 'Non-emergency filings, compliance requests, and station visits.', priority: 'LOW' }
            ].map((contact, i) => (
              <div key={i} className="border border-slate-100 p-4 rounded-xl flex flex-col justify-between hover:bg-slate-50 transition">
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-sm font-sans">{contact.title}</h3>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      contact.priority === 'HIGH' ? 'bg-red-50 text-red-600' :
                      contact.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {contact.priority} PRIORITY
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{contact.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Direct Number:</span>
                  <a href={`tel:${contact.phone}`} className="font-extrabold text-blue-600 hover:underline font-mono text-sm">{contact.phone}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEARBY STATIONS */}
      {activeTab === 'stations' && (
        <div className="bg-white rounded-xl border border-slate-100 p-6 space-y-6 max-w-3xl mx-auto">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-bold text-slate-900 font-sans flex items-center gap-2">
              <Building className="w-6 h-6 text-blue-600" /> Active Precinct Precincts Directory
            </h2>
            <p className="text-xs text-slate-500 mt-1">Locate nearby physically active police stations, contact staff, or report in-person.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stations.map(station => (
              <div key={station.id} className="border border-slate-100 rounded-xl p-4 space-y-3 flex flex-col justify-between hover:bg-slate-50 transition">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-slate-900 text-sm font-sans">{station.name}</h3>
                    <span className="text-[10px] font-bold text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded">{station.code}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {station.address}
                  </p>
                  <p className="text-[10px] text-blue-600 font-semibold mt-1.5 bg-blue-50/50 px-2 py-0.5 rounded self-start inline-block">
                    District: {station.districtName}
                  </p>
                </div>
                <div className="border-t border-slate-50 pt-2 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Reception Line:</span>
                  <span className="font-semibold text-slate-800 font-mono">{station.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
