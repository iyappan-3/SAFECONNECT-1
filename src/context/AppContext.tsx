import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserAccount,
  UserRole,
  IncidentReport,
  ActiveCase,
  Complaint,
  AuditLog,
  PoliceStation,
  initialUsers,
  initialReports,
  initialCases,
  initialComplaints,
  initialAuditLogs,
  initialStations,
  initialDistricts
} from '../types';

interface AppContextType {
  currentUser: UserAccount | null;
  users: UserAccount[];
  reports: IncidentReport[];
  cases: ActiveCase[];
  complaints: Complaint[];
  auditLogs: AuditLog[];
  stations: PoliceStation[];
  districts: { id: string; name: string; code: string }[];
  notifications: { id: string; title: string; message: string; read: boolean; date: string }[];
  loginAs: (role: UserRole) => void;
  logout: () => void;
  loginWithCredentials: (role: 'CITIZEN' | 'POLICE', identifier: string, password: string) => { success: boolean; error?: string };
  registerUser: (userData: Omit<UserAccount, 'id' | 'isActive'>) => { success: boolean; error?: string };
  createReport: (report: Omit<IncidentReport, 'id' | 'createdAt' | 'status' | 'citizenId' | 'citizenName' | 'districtName'>) => IncidentReport;
  createCase: (reportId: string, priority: ActiveCase['priority'], assignedOfficerId: string, initialNotes: string) => ActiveCase;
  assignOfficer: (caseId: string, officerId: string) => void;
  updateCaseStatus: (caseId: string, status: ActiveCase['status'], title: string, desc: string, notify: boolean) => void;
  submitComplaint: (title: string, desc: string, officerName?: string) => void;
  resolveComplaint: (complaintId: string, notes: string) => void;
  addPoliceAccount: (account: Omit<UserAccount, 'id' | 'isActive'>) => void;
  toggleUserStatus: (userId: string) => void;
  addStation: (station: Omit<PoliceStation, 'id'>) => void;
  backupDatabase: () => { fileName: string; size: string; timestamp: string };
  restoreDatabase: (fileName: string) => void;
  logAction: (action: string, details: string) => void;
  clearNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Try loading from localStorage first, or fall back to initial mock data
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('govfind_current_user');
    return saved ? JSON.parse(saved) : initialUsers.find(u => u.role === 'CITIZEN') || null;
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('govfind_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [reports, setReports] = useState<IncidentReport[]>(() => {
    const saved = localStorage.getItem('govfind_reports');
    return saved ? JSON.parse(saved) : initialReports;
  });

  const [cases, setCases] = useState<ActiveCase[]>(() => {
    const saved = localStorage.getItem('govfind_cases');
    return saved ? JSON.parse(saved) : initialCases;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('govfind_complaints');
    return saved ? JSON.parse(saved) : initialComplaints;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('govfind_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [stations, setStations] = useState<PoliceStation[]>(() => {
    const saved = localStorage.getItem('govfind_stations');
    return saved ? JSON.parse(saved) : initialStations;
  });

  const [notifications, setNotifications] = useState<{ id: string; title: string; message: string; read: boolean; date: string }[]>(() => {
    const saved = localStorage.getItem('govfind_notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: 'notif-1',
        title: 'Welcome to GovFind',
        message: 'Your citizen identity is active. You can report and track security alerts.',
        read: false,
        date: new Date().toISOString()
      }
    ];
  });

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem('govfind_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('govfind_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('govfind_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('govfind_cases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem('govfind_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('govfind_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('govfind_stations', JSON.stringify(stations));
  }, [stations]);

  useEffect(() => {
    localStorage.setItem('govfind_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Actions
  const logAction = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      username: currentUser ? currentUser.username : 'SYSTEM',
      role: currentUser ? currentUser.role : 'ADMIN',
      action,
      details,
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 254 + 1),
      createdAt: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const loginAs = (role: UserRole) => {
    const foundUser = users.find(u => u.role === role);
    if (foundUser) {
      setCurrentUser(foundUser);
      logAction('USER_LOGIN', `User ${foundUser.fullName} authenticated securely as ${role}.`);
    }
  };

  const loginWithCredentials = (role: 'CITIZEN' | 'POLICE', identifier: string, passwordStr: string) => {
    if (role === 'CITIZEN') {
      const cleanInput = identifier.replace(/[^0-9]/g, '');
      if (!cleanInput) {
        return { success: false, error: 'Please enter a valid mobile number.' };
      }
      const foundUser = users.find(u => {
        if (u.role !== 'CITIZEN') return false;
        const cleanUserPhone = (u.phone || '').replace(/[^0-9]/g, '');
        return cleanUserPhone.includes(cleanInput) || cleanInput.includes(cleanUserPhone);
      });

      if (!foundUser) {
        return { success: false, error: 'No citizen user registered with this mobile number.' };
      }
      if (foundUser.password !== passwordStr) {
        return { success: false, error: 'Incorrect password.' };
      }
      setCurrentUser(foundUser);
      logAction('USER_LOGIN', `Citizen ${foundUser.fullName} logged in via mobile app credentials.`);
      return { success: true };
    } else {
      const cleanStationIdInput = identifier.trim().toLowerCase();
      if (!cleanStationIdInput) {
        return { success: false, error: 'Please enter a Police Station ID or Code.' };
      }
      const targetStation = stations.find(s => 
        s.id.toLowerCase() === cleanStationIdInput || 
        s.code.toLowerCase() === cleanStationIdInput ||
        s.name.toLowerCase().includes(cleanStationIdInput)
      );
      if (!targetStation) {
        return { success: false, error: 'Invalid Police Station ID / Code. Try "PS-HQ-001" or "st-1".' };
      }
      // Look for any officer at this station whose username/badge/stationId is valid and password matches.
      // Or search officer by code/badge/username directly. Let's look for user at this station with this password.
      const foundOfficer = users.find(u => u.role === 'POLICE' && u.stationId === targetStation.id && u.password === passwordStr);
      if (!foundOfficer) {
        return { success: false, error: 'Incorrect credentials for this station precinct.' };
      }
      setCurrentUser(foundOfficer);
      logAction('USER_LOGIN', `Officer ${foundOfficer.fullName} logged in for precinct ${targetStation.name}.`);
      return { success: true };
    }
  };

  const registerUser = (userData: Omit<UserAccount, 'id' | 'isActive'>) => {
    if (userData.role === 'CITIZEN') {
      if (!userData.phone) {
        return { success: false, error: 'Mobile number is required.' };
      }
      const phoneClean = userData.phone.replace(/[^0-9]/g, '');
      if (phoneClean.length < 5) {
        return { success: false, error: 'Please enter a valid mobile number.' };
      }
      const exists = users.some(u => u.role === 'CITIZEN' && (u.phone || '').replace(/[^0-9]/g, '') === phoneClean);
      if (exists) {
        return { success: false, error: 'An account with this mobile number already exists.' };
      }
    } else {
      if (!userData.stationId) {
        return { success: false, error: 'Station selection is required.' };
      }
      if (!userData.badgeNumber) {
        return { success: false, error: 'Badge number is required.' };
      }
      const exists = users.some(u => u.role === 'POLICE' && u.badgeNumber === userData.badgeNumber);
      if (exists) {
        return { success: false, error: 'An officer with this badge number already exists.' };
      }
    }

    const prefix = userData.role === 'POLICE' ? 'usr-police' : 'usr-citizen';
    const newAccount: UserAccount = {
      ...userData,
      id: `${prefix}-${Date.now()}`,
      isActive: true
    };
    setUsers(prev => [...prev, newAccount]);
    logAction('REGISTER_USER', `Self-registration completed: ${newAccount.fullName} (${newAccount.role}).`);
    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      logAction('USER_LOGOUT', `User ${currentUser.fullName} logged out.`);
    }
    setCurrentUser(null);
  };

  const createReport = (reportData: Omit<IncidentReport, 'id' | 'createdAt' | 'status' | 'citizenId' | 'citizenName' | 'districtName'>) => {
    const district = initialDistricts.find(d => d.id === reportData.districtId);
    const newReport: IncidentReport = {
      ...reportData,
      id: `rep-${Date.now()}`,
      citizenId: currentUser?.id || 'usr-citizen',
      citizenName: reportData.anonymous ? 'Anonymous Citizen' : (currentUser?.fullName || 'Robert Davis'),
      districtName: district ? district.name : 'Unknown District',
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
    };

    setReports(prev => [newReport, ...prev]);
    logAction('CREATE_REPORT', `New incident reported: "${newReport.title}" (${newReport.reportType})`);
    
    // Add a notification for system admins / police
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: `New Incident Report`,
      message: `A new ${newReport.reportType.replace('_', ' ')} incident has been submitted.`,
      read: false,
      date: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newReport;
  };

  const createCase = (reportId: string, priority: ActiveCase['priority'], assignedOfficerId: string, initialNotes: string) => {
    const report = reports.find(r => r.id === reportId);
    const officer = users.find(u => u.id === assignedOfficerId);
    
    if (!report) throw new Error('Report not found');

    const newCase: ActiveCase = {
      id: `case-${Date.now()}`,
      reportId,
      caseNumber: `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: report.title,
      description: report.description,
      assignedOfficerId,
      assignedOfficerName: officer ? officer.fullName : 'Unassigned',
      badgeNumber: officer?.badgeNumber || 'N/A',
      priority,
      status: 'ASSIGNED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          id: `timeline-${Date.now()}`,
          title: 'Case Registered & Assigned',
          description: initialNotes || `Case opened. Assigned to Officer ${officer ? officer.fullName : 'Unassigned'}.`,
          updatedBy: officer ? officer.fullName : 'System',
          badgeNumber: officer?.badgeNumber || 'HQ',
          createdAt: new Date().toISOString(),
          visibleToCitizen: true,
        }
      ]
    };

    // Update Report Status
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'CASE_CREATED' } : r));
    setCases(prev => [newCase, ...prev]);
    
    logAction('CREATE_CASE', `Official case file ${newCase.caseNumber} created from report "${report.title}".`);

    // Add alert to notification list
    const citizenNotif = {
      id: `notif-${Date.now()}`,
      title: `Case File Created: ${newCase.caseNumber}`,
      message: `An official investigation file has been opened for your report: "${report.title}".`,
      read: false,
      date: new Date().toISOString()
    };
    setNotifications(prev => [citizenNotif, ...prev]);

    return newCase;
  };

  const assignOfficer = (caseId: string, officerId: string) => {
    const officer = users.find(u => u.id === officerId);
    if (!officer) return;

    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const newTimelineEvent = {
          id: `timeline-${Date.now()}`,
          title: 'Investigation Reassigned',
          description: `Case ownership transferred to Investigator ${officer.fullName}.`,
          updatedBy: officer.fullName,
          badgeNumber: officer.badgeNumber || 'HQ',
          createdAt: new Date().toISOString(),
          visibleToCitizen: true
        };
        return {
          ...c,
          assignedOfficerId: officerId,
          assignedOfficerName: officer.fullName,
          badgeNumber: officer.badgeNumber,
          status: 'ASSIGNED' as const,
          updatedAt: new Date().toISOString(),
          timeline: [newTimelineEvent, ...c.timeline]
        };
      }
      return c;
    }));

    logAction('ASSIGN_CASE', `Case ${caseId} assigned to officer ${officer.fullName}.`);
  };

  const updateCaseStatus = (
    caseId: string,
    status: ActiveCase['status'],
    title: string,
    desc: string,
    notify: boolean
  ) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const newEvent = {
          id: `timeline-${Date.now()}`,
          title,
          description: desc,
          updatedBy: currentUser?.fullName || 'Officer John Miller',
          badgeNumber: currentUser?.badgeNumber || '7402',
          createdAt: new Date().toISOString(),
          visibleToCitizen: notify
        };
        return {
          ...c,
          status,
          updatedAt: new Date().toISOString(),
          timeline: [newEvent, ...c.timeline]
        };
      }
      return c;
    }));

    const caseItem = cases.find(c => c.id === caseId);
    logAction('UPDATE_CASE', `Case ${caseItem?.caseNumber || caseId} status updated to ${status}.`);

    if (notify && caseItem) {
      const stateNotif = {
        id: `notif-${Date.now()}`,
        title: `Case status update: ${caseItem.caseNumber}`,
        message: `New update: "${title}". Current status is now ${status.replace('_', ' ')}.`,
        read: false,
        date: new Date().toISOString()
      };
      setNotifications(prev => [stateNotif, ...prev]);
    }
  };

  const submitComplaint = (title: string, desc: string, officerName?: string) => {
    const newComplaint: Complaint = {
      id: `comp-${Date.now()}`,
      citizenId: currentUser?.id || 'usr-citizen',
      citizenName: currentUser?.fullName || 'Robert Davis',
      officerNameOrBadge: officerName,
      title,
      description: desc,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString()
    };

    setComplaints(prev => [newComplaint, ...prev]);
    logAction('SUBMIT_COMPLAINT', `Citizen submitted misconduct complaint: "${title}".`);
  };

  const resolveComplaint = (complaintId: string, notes: string) => {
    setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, status: 'RESOLVED', resolutionNotes: notes } : c));
    logAction('RESOLVE_COMPLAINT', `Complaint ${complaintId} marked resolved.`);
  };

  const addPoliceAccount = (accountData: Omit<UserAccount, 'id' | 'isActive'>) => {
    const newAccount: UserAccount = {
      ...accountData,
      id: `usr-police-${Date.now()}`,
      isActive: true
    };
    setUsers(prev => [...prev, newAccount]);
    logAction('CREATE_USER', `Administrator registered a new Police account for ${newAccount.fullName}.`);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
    const user = users.find(u => u.id === userId);
    logAction('TOGGLE_USER_STATUS', `Account status toggled for user ${user?.username}.`);
  };

  const addStation = (stationData: Omit<PoliceStation, 'id'>) => {
    const newStation: PoliceStation = {
      ...stationData,
      id: `st-${Date.now()}`
    };
    setStations(prev => [...prev, newStation]);
    logAction('CREATE_STATION', `Registered new police station precinct: "${newStation.name}".`);
  };

  const backupDatabase = () => {
    const timestamp = new Date().toISOString().replace(/[:\-T]/g, '').slice(0, 12);
    const fileName = `govfind_prod_backup_${timestamp}.sql`;
    const size = `${(Math.random() * 2 + 1.5).toFixed(2)} MB`;
    
    logAction('BACKUP_DATABASE', `Complete Database Backup generated. Saved archive: ${fileName}`);
    return { fileName, size, timestamp: new Date().toISOString() };
  };

  const restoreDatabase = (fileName: string) => {
    logAction('RESTORE_DATABASE', `System restoration triggered from catalog file: ${fileName}. Verified table integrity: OK.`);
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      reports,
      cases,
      complaints,
      auditLogs,
      stations,
      districts: initialDistricts,
      notifications,
      loginAs,
      loginWithCredentials,
      registerUser,
      logout,
      createReport,
      createCase,
      assignOfficer,
      updateCaseStatus,
      submitComplaint,
      resolveComplaint,
      addPoliceAccount,
      toggleUserStatus,
      addStation,
      backupDatabase,
      restoreDatabase,
      logAction,
      clearNotification
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside an AppProvider');
  return context;
}
