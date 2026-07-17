export type UserRole = 'CITIZEN' | 'POLICE' | 'ADMIN';

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
  badgeNumber?: string;
  rankTitle?: string;
  stationId?: string;
  isActive: boolean;
  avatarUrl?: string;
  phone?: string;
  password?: string;
}

export type ReportType = 'CRIME' | 'MISSING_PERSON' | 'LOST_VEHICLE' | 'COMPLAINT';
export type ReportStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'CASE_CREATED' | 'REJECTED';

export interface IncidentReport {
  id: string;
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  reportType: ReportType;
  title: string;
  description: string;
  districtId: string;
  districtName: string;
  incidentDate: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  status: ReportStatus;
  anonymous: boolean;
  createdAt: string;
  evidenceUrls: { name: string; type: string; url: string; size: string }[];
  missingPersonDetails?: {
    fullName: string;
    age: number;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    lastSeenWearing: string;
    distinguishingFeatures: string;
  };
  vehicleDetails?: {
    licensePlate: string;
    makeModel: string;
    color: string;
    registrationYear: number;
    stolenDate: string;
  };
}

export type CaseStatus = 'OPEN' | 'ASSIGNED' | 'INVESTIGATING' | 'COLLECTING_EVIDENCE' | 'SUSPENDED' | 'CLOSED';
export type CasePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface CaseTimelineEvent {
  id: string;
  title: string;
  description: string;
  updatedBy: string;
  badgeNumber: string;
  createdAt: string;
  visibleToCitizen: boolean;
}

export interface ActiveCase {
  id: string;
  reportId: string;
  caseNumber: string;
  title: string;
  description: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  badgeNumber?: string;
  priority: CasePriority;
  status: CaseStatus;
  timeline: CaseTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface PoliceStation {
  id: string;
  name: string;
  code: string;
  districtId: string;
  districtName: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
}

export interface Complaint {
  id: string;
  citizenId: string;
  citizenName: string;
  officerNameOrBadge?: string;
  title: string;
  description: string;
  status: 'SUBMITTED' | 'UNDER_INVESTIGATION' | 'RESOLVED' | 'REJECTED';
  resolutionNotes?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  username: string;
  role: UserRole;
  action: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

// Initial Mock Seed Data
export const initialDistricts = [
  { id: '1', name: 'Central District', code: 'CD-01' },
  { id: '2', name: 'North Metropolitan', code: 'NM-02' },
  { id: '3', name: 'East Valley', code: 'EV-03' },
  { id: '4', name: 'South Coastal', code: 'SC-04' },
  { id: '5', name: 'West Highlands', code: 'WH-05' },
];

export const initialStations: PoliceStation[] = [
  {
    id: 'st-1',
    name: 'Central Precinct HQ',
    code: 'PS-HQ-001',
    districtId: '1',
    districtName: 'Central District',
    address: '452 Government Blvd, Capitol City',
    phone: '+1 (555) 019-2001',
    lat: 37.7749,
    lng: -122.4194,
  },
  {
    id: 'st-2',
    name: 'Metro North Precinct',
    code: 'PS-MN-002',
    districtId: '2',
    districtName: 'North Metropolitan',
    address: '108 Industrial Way, Sector 4',
    phone: '+1 (555) 019-2002',
    lat: 37.7894,
    lng: -122.4012,
  },
  {
    id: 'st-3',
    name: 'Valley Station',
    code: 'PS-VS-003',
    districtId: '3',
    districtName: 'East Valley',
    address: '89 Oakridge Ave, Valley Springs',
    phone: '+1 (555) 019-2003',
    lat: 37.7562,
    lng: -122.4491,
  },
  {
    id: 'st-4',
    name: 'Coastal Watch Unit',
    code: 'PS-CW-004',
    districtId: '4',
    districtName: 'South Coastal',
    address: '14 Ocean Promenade, Beachside',
    phone: '+1 (555) 019-2004',
    lat: 37.7312,
    lng: -122.5029,
  },
];

export const initialUsers: UserAccount[] = [
  {
    id: 'usr-admin',
    username: 'admin_clara',
    email: 'clara.oswald@govfind.gov',
    role: 'ADMIN',
    fullName: 'Clara Oswald',
    isActive: true,
    password: 'admin123'
  },
  {
    id: 'usr-police-1',
    username: 'officer_john',
    email: 'john.miller@police.gov',
    role: 'POLICE',
    fullName: 'John Miller',
    badgeNumber: '7402',
    rankTitle: 'Senior Investigator',
    stationId: 'st-1',
    isActive: true,
    password: 'police123'
  },
  {
    id: 'usr-police-2',
    username: 'officer_sarah',
    email: 'sarah.chen@police.gov',
    role: 'POLICE',
    fullName: 'Sarah Chen',
    badgeNumber: '3819',
    rankTitle: 'Detective Sergeant',
    stationId: 'st-2',
    isActive: true,
    password: 'police123'
  },
  {
    id: 'usr-citizen',
    username: 'citizen_robert',
    email: 'robert.davis@email.com',
    role: 'CITIZEN',
    fullName: 'Robert Davis',
    isActive: true,
    phone: '555-012-3456',
    password: 'citizen123'
  },
];

export const initialReports: IncidentReport[] = [
  {
    id: 'rep-1',
    citizenId: 'usr-citizen',
    citizenName: 'Robert Davis',
    citizenPhone: '+1 (555) 012-3456',
    reportType: 'LOST_VEHICLE',
    title: 'Theft of Red Sedan',
    description: 'My 2021 Red Honda Civic was parked outside the grocery store at 7:30 PM. When I came back at 8:15 PM, the vehicle was missing. No broken glass was observed on the parking spot.',
    districtId: '1',
    districtName: 'Central District',
    incidentDate: '2026-07-15T20:15:00',
    gpsLatitude: 37.7735,
    gpsLongitude: -122.4181,
    status: 'CASE_CREATED',
    anonymous: false,
    createdAt: '2026-07-15T21:00:00',
    evidenceUrls: [
      { name: 'car_registration_pdf.pdf', type: 'application/pdf', url: '#', size: '1.2 MB' },
      { name: 'parked_spot_photo.jpg', type: 'image/jpeg', url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&auto=format&fit=crop&q=60', size: '820 KB' }
    ],
    vehicleDetails: {
      licensePlate: 'ABC-1234',
      makeModel: 'Honda Civic',
      color: 'Red',
      registrationYear: 2021,
      stolenDate: '2026-07-15',
    }
  },
  {
    id: 'rep-2',
    citizenId: 'usr-citizen',
    citizenName: 'Robert Davis',
    citizenPhone: '+1 (555) 012-3456',
    reportType: 'CRIME',
    title: 'Package Theft From Porch',
    description: 'A courier dropped off a package containing a laptop at 2:00 PM. At 3:15 PM, a suspect wearing a gray hoodie and dark sunglasses walked up the driveway, picked up the box, and ran to a dark blue getaway SUV. I have secure front-door doorbell camera footage of the incident.',
    districtId: '2',
    districtName: 'North Metropolitan',
    incidentDate: '2026-07-16T15:15:00',
    gpsLatitude: 37.7885,
    gpsLongitude: -122.4025,
    status: 'SUBMITTED',
    anonymous: false,
    createdAt: '2026-07-16T16:00:00',
    evidenceUrls: [
      { name: 'doorbell_camera_clip.mp4', type: 'video/mp4', url: '#', size: '14.5 MB' }
    ]
  },
  {
    id: 'rep-3',
    citizenId: 'anon-999',
    citizenName: 'Anonymous Citizen',
    citizenPhone: 'N/A',
    reportType: 'CRIME',
    title: 'Graffiti Vandalism on Public Library',
    description: 'Observed two individuals spraying green graffiti on the rear brick wall of the Sector 4 Public Library. One was wearing a yellow cap, the other a black leather jacket. They left on foot heading towards Metro West Park.',
    districtId: '2',
    districtName: 'North Metropolitan',
    incidentDate: '2026-07-14T23:30:00',
    gpsLatitude: 37.7901,
    gpsLongitude: -122.4042,
    status: 'UNDER_REVIEW',
    anonymous: true,
    createdAt: '2026-07-14T23:45:00',
    evidenceUrls: []
  },
  {
    id: 'rep-4',
    citizenId: 'usr-citizen',
    citizenName: 'Robert Davis',
    citizenPhone: '+1 (555) 012-3456',
    reportType: 'MISSING_PERSON',
    title: 'Missing Elder: Thomas Davis',
    description: 'Thomas Davis (my grandfather, age 78) left our residence on foot at 10:00 AM on July 14th for a short walk and has not returned. He suffers from early-stage dementia. He was last seen wearing a light-blue checkered shirt and gray trousers.',
    districtId: '3',
    districtName: 'East Valley',
    incidentDate: '2026-07-14T10:00:00',
    gpsLatitude: 37.7551,
    gpsLongitude: -122.4485,
    status: 'CASE_CREATED',
    anonymous: false,
    createdAt: '2026-07-14T12:30:00',
    evidenceUrls: [
      { name: 'thomas_davis_photo.jpg', type: 'image/jpeg', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60', size: '1.1 MB' }
    ],
    missingPersonDetails: {
      fullName: 'Thomas Davis',
      age: 78,
      gender: 'MALE',
      lastSeenWearing: 'Light-blue checkered shirt and gray trousers',
      distinguishingFeatures: 'Wears silver-rimmed reading glasses, thin white hair, minor limp in right leg.'
    }
  }
];

export const initialCases: ActiveCase[] = [
  {
    id: 'case-1',
    reportId: 'rep-1',
    caseNumber: 'CASE-2026-9031',
    title: 'Theft of Red Sedan (Honda Civic)',
    description: 'Investigation into the auto-theft of a Red Honda Civic, license ABC-1234, reported missing outside local grocery store.',
    assignedOfficerId: 'usr-police-1',
    assignedOfficerName: 'John Miller',
    badgeNumber: '7402',
    priority: 'HIGH',
    status: 'INVESTIGATING',
    createdAt: '2026-07-15T22:00:00',
    updatedAt: '2026-07-16T10:30:00',
    timeline: [
      {
        id: 't-1',
        title: 'Case File Opened',
        description: 'Citizen incident report verified. Official case file initialized and assigned to Officer John Miller.',
        updatedBy: 'John Miller',
        badgeNumber: '7402',
        createdAt: '2026-07-15T22:05:00',
        visibleToCitizen: true
      },
      {
        id: 't-2',
        title: 'Grocery Store CCTV Requested',
        description: 'Official dispatch issued requesting security camera footage from the Grocery Store parking lot covering 7:00 PM to 8:30 PM.',
        updatedBy: 'John Miller',
        badgeNumber: '7402',
        createdAt: '2026-07-16T09:15:00',
        visibleToCitizen: true
      },
      {
        id: 't-3',
        title: 'CCTV Review in Progress',
        description: 'Received footage. Suspect observed using a bypass module at 7:55 PM. Vehicle exited heading East toward South Highway.',
        updatedBy: 'John Miller',
        badgeNumber: '7402',
        createdAt: '2026-07-16T10:30:00',
        visibleToCitizen: true
      }
    ]
  },
  {
    id: 'case-2',
    reportId: 'rep-4',
    caseNumber: 'CASE-2026-8802',
    title: 'Missing Person - Thomas Davis',
    description: 'Active silver-alert search tracking for 78-year-old Thomas Davis last seen walking in the East Valley district.',
    assignedOfficerId: 'usr-police-2',
    assignedOfficerName: 'Sarah Chen',
    badgeNumber: '3819',
    priority: 'CRITICAL',
    status: 'COLLECTING_EVIDENCE',
    createdAt: '2026-07-14T13:00:00',
    updatedAt: '2026-07-15T15:00:00',
    timeline: [
      {
        id: 'tc-1',
        title: 'Silver Alert Issued',
        description: 'Statewide Silver Alert system broadcast triggered for Thomas Davis. BOLO dispatch sent to all county units.',
        updatedBy: 'Sarah Chen',
        badgeNumber: '3819',
        createdAt: '2026-07-14T13:15:00',
        visibleToCitizen: true
      },
      {
        id: 'tc-2',
        title: 'Hospital Logs Verified',
        description: 'Checked admitting logs for Valley General Hospital and Capitol Mercy. No matches found yet.',
        updatedBy: 'Sarah Chen',
        badgeNumber: '3819',
        createdAt: '2026-07-14T18:00:00',
        visibleToCitizen: false
      },
      {
        id: 'tc-3',
        title: 'Security Video Sighting Checked',
        description: 'Residential camera at 12th St spotted a citizen matching description heading toward Grand Valley transit terminal at 10:45 AM.',
        updatedBy: 'Sarah Chen',
        badgeNumber: '3819',
        createdAt: '2026-07-15T11:00:00',
        visibleToCitizen: true
      }
    ]
  }
];

export const initialComplaints: Complaint[] = [
  {
    id: 'comp-1',
    citizenId: 'usr-citizen',
    citizenName: 'Robert Davis',
    officerNameOrBadge: 'Badge-3819',
    title: 'Indifferent Response during check-in',
    description: 'Felt the officer at the desk was dismissive when I went to add details regarding my missing relative report.',
    status: 'RESOLVED',
    resolutionNotes: 'District captain spoke with staff regarding public hospitality standards. Case timeline records updated with citizen’s extra materials.',
    createdAt: '2026-07-14T14:00:00',
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    username: 'admin_clara',
    role: 'ADMIN',
    action: 'SYSTEM_START',
    details: 'GovFind Platform main initialization and security check completed successfully.',
    ipAddress: '10.240.0.4',
    createdAt: '2026-07-16T12:00:00'
  },
  {
    id: 'log-2',
    username: 'citizen_robert',
    role: 'CITIZEN',
    action: 'USER_LOGIN',
    details: 'Citizen profile Robert Davis authenticated on Web Interface.',
    ipAddress: '192.168.1.104',
    createdAt: '2026-07-16T13:45:00'
  },
  {
    id: 'log-3',
    username: 'officer_john',
    role: 'POLICE',
    action: 'CASE_UPDATE',
    details: 'Timeline update t-3 added to Case CASE-2026-9031.',
    ipAddress: '10.240.2.11',
    createdAt: '2026-07-16T15:30:00'
  }
];
