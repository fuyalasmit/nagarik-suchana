// Mock Data for Admin Dashboard
import {
  MunicipalityInfo,
  DashboardStats,
  Grievance,
  BudgetData,
  WardStats,
  ActivityItem,
} from '@/types/admin';

// Color scheme
export const AdminColors = {
  primary: '#59AC77',
  primaryDark: '#3A6F43',
  accent: '#FDAAAA',
  accentLight: '#FFD5D5',
};

export const municipalityInfo: MunicipalityInfo = {
  name: 'Bharatpur Metropolitan City',
  nameNepali: 'भरतपुर महानगरपालिका',
  province: 'Bagmati Province',
  district: 'Chitwan',
  totalWards: 29,
  population: 280502,
  area: '432.95 sq km',
  contactEmail: 'info@bharatpurmun.gov.np',
  contactPhone: '+977-56-527620',
  establishedDate: '2017-03-10',
};

export const dashboardStats: DashboardStats = {
  totalPopulation: 280502,
  totalWards: 29,
  registeredUsers: 12847,
  activeNotices: 34,
  pendingGrievances: 23,
  resolvedGrievances: 156,
};

export const grievances: Grievance[] = [
  {
    id: 'g1',
    title: 'Road Damage on Main Highway',
    description: 'Large potholes on the main highway near ward office causing accidents. Immediate repair needed.',
    category: 'roads',
    priority: 'high',
    status: 'pending',
    submittedBy: 'Ram Sharma',
    wardNumber: 5,
    submittedAt: '2026-01-04T08:30:00Z',
    updatedAt: '2026-01-04T08:30:00Z',
    isRead: false,
  },
  {
    id: 'g2',
    title: 'Water Supply Disruption',
    description: 'No water supply for the past 3 days in sector 7. Multiple households affected.',
    category: 'water',
    priority: 'high',
    status: 'in-progress',
    submittedBy: 'Sita Devi',
    wardNumber: 12,
    submittedAt: '2026-01-03T14:20:00Z',
    updatedAt: '2026-01-04T09:00:00Z',
    isRead: true,
  },
  {
    id: 'g3',
    title: 'Street Light Not Working',
    description: 'Street lights in residential area have been non-functional for a week.',
    category: 'electricity',
    priority: 'medium',
    status: 'pending',
    submittedBy: 'Hari Prasad',
    wardNumber: 8,
    submittedAt: '2026-01-02T16:45:00Z',
    updatedAt: '2026-01-02T16:45:00Z',
    isRead: false,
  },
  {
    id: 'g4',
    title: 'Garbage Collection Issue',
    description: 'Garbage not collected for 2 weeks. Health hazard in the community.',
    category: 'sanitation',
    priority: 'high',
    status: 'in-progress',
    submittedBy: 'Maya Tamang',
    wardNumber: 3,
    submittedAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-03T11:30:00Z',
    isRead: true,
  },
  {
    id: 'g5',
    title: 'Drainage System Blocked',
    description: 'Main drainage blocked causing waterlogging during rain.',
    category: 'infrastructure',
    priority: 'medium',
    status: 'resolved',
    submittedBy: 'Bikash Thapa',
    wardNumber: 15,
    submittedAt: '2025-12-28T09:15:00Z',
    updatedAt: '2026-01-02T14:00:00Z',
    isRead: true,
  },
  {
    id: 'g6',
    title: 'Public Toilet Maintenance',
    description: 'Public toilet near bus park needs urgent cleaning and repair.',
    category: 'sanitation',
    priority: 'low',
    status: 'pending',
    submittedBy: 'Gita Rai',
    wardNumber: 1,
    submittedAt: '2025-12-30T13:20:00Z',
    updatedAt: '2025-12-30T13:20:00Z',
    isRead: true,
  },
  {
    id: 'g7',
    title: 'Bridge Repair Needed',
    description: 'Wooden bridge over canal is damaged and unsafe for pedestrians.',
    category: 'infrastructure',
    priority: 'high',
    status: 'in-progress',
    submittedBy: 'Prakash Gurung',
    wardNumber: 22,
    submittedAt: '2025-12-25T11:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
    isRead: true,
  },
  {
    id: 'g8',
    title: 'Electricity Pole Leaning',
    description: 'Electricity pole near school is leaning dangerously.',
    category: 'electricity',
    priority: 'high',
    status: 'resolved',
    submittedBy: 'Sunita KC',
    wardNumber: 9,
    submittedAt: '2025-12-20T08:00:00Z',
    updatedAt: '2025-12-23T16:00:00Z',
    isRead: true,
  },
  {
    id: 'g9',
    title: 'Park Maintenance Request',
    description: 'Community park needs grass cutting and bench repairs.',
    category: 'other',
    priority: 'low',
    status: 'pending',
    submittedBy: 'Deepak Shrestha',
    wardNumber: 17,
    submittedAt: '2026-01-03T15:30:00Z',
    updatedAt: '2026-01-03T15:30:00Z',
    isRead: false,
  },
  {
    id: 'g10',
    title: 'Water Tank Leakage',
    description: 'Community water tank has major leakage wasting water.',
    category: 'water',
    priority: 'medium',
    status: 'rejected',
    submittedBy: 'Anita Poudel',
    wardNumber: 6,
    submittedAt: '2025-12-15T12:00:00Z',
    updatedAt: '2025-12-18T09:00:00Z',
    isRead: true,
  },
];

export const budgetData: BudgetData = {
  fiscalYear: '2082/83 (2025-26)',
  totalBudget: 5000000000,
  totalSpent: 2150000000,
  categories: [
    { id: 'c1', name: 'Infrastructure', allocated: 1750000000, spent: 820000000, color: '#59AC77' },
    { id: 'c2', name: 'Education', allocated: 1000000000, spent: 450000000, color: '#3A6F43' },
    { id: 'c3', name: 'Health', allocated: 750000000, spent: 380000000, color: '#FDAAAA' },
    { id: 'c4', name: 'Administration', allocated: 500000000, spent: 250000000, color: '#FFD5D5' },
    { id: 'c5', name: 'Social Welfare', allocated: 400000000, spent: 150000000, color: '#7BC88F' },
    { id: 'c6', name: 'Agriculture', allocated: 350000000, spent: 60000000, color: '#4A8A5C' },
    { id: 'c7', name: 'Environment', allocated: 250000000, spent: 40000000, color: '#FF9999' },
  ],
  monthlyTrend: [
    { month: 'Shrawan', amount: 180000000 },
    { month: 'Bhadra', amount: 220000000 },
    { month: 'Ashwin', amount: 350000000 },
    { month: 'Kartik', amount: 280000000 },
    { month: 'Mangsir', amount: 420000000 },
    { month: 'Poush', amount: 380000000 },
    { month: 'Magh', amount: 320000000 },
    { month: 'Falgun', amount: 0 },
    { month: 'Chaitra', amount: 0 },
    { month: 'Baisakh', amount: 0 },
    { month: 'Jestha', amount: 0 },
    { month: 'Ashadh', amount: 0 },
  ],
};

export const wardStats: WardStats[] = [
  { wardNumber: 1, name: 'Narayangadh', population: 15200, grievanceCount: 3, activeNotices: 2, budgetAllocated: 180000000 },
  { wardNumber: 2, name: 'Pulchowk', population: 12800, grievanceCount: 1, activeNotices: 1, budgetAllocated: 150000000 },
  { wardNumber: 3, name: 'Sharadanagar', population: 9500, grievanceCount: 4, activeNotices: 3, budgetAllocated: 120000000 },
  { wardNumber: 4, name: 'Gitanagar', population: 11200, grievanceCount: 2, activeNotices: 1, budgetAllocated: 140000000 },
  { wardNumber: 5, name: 'Ratnanagar', population: 8900, grievanceCount: 5, activeNotices: 2, budgetAllocated: 110000000 },
  { wardNumber: 6, name: 'Mangalpur', population: 10500, grievanceCount: 1, activeNotices: 1, budgetAllocated: 130000000 },
  { wardNumber: 7, name: 'Patihani', population: 7800, grievanceCount: 0, activeNotices: 2, budgetAllocated: 100000000 },
  { wardNumber: 8, name: 'Jutpani', population: 9200, grievanceCount: 2, activeNotices: 1, budgetAllocated: 115000000 },
  { wardNumber: 9, name: 'Shivanagar', population: 8400, grievanceCount: 1, activeNotices: 2, budgetAllocated: 105000000 },
  { wardNumber: 10, name: 'Gunjanagar', population: 11800, grievanceCount: 3, activeNotices: 3, budgetAllocated: 145000000 },
];

export const recentActivities: ActivityItem[] = [
  {
    id: 'a1',
    type: 'notice',
    title: 'New Notice Published',
    description: 'Tax payment deadline notice published for Ward 5',
    timestamp: '2026-01-04T10:30:00Z',
    icon: 'notice',
  },
  {
    id: 'a2',
    type: 'grievance',
    title: 'Grievance Resolved',
    description: 'Electricity pole repair completed in Ward 9',
    timestamp: '2026-01-04T09:15:00Z',
    icon: 'check',
  },
  {
    id: 'a3',
    type: 'user',
    title: 'New User Registration',
    description: '15 new citizens registered today',
    timestamp: '2026-01-04T08:00:00Z',
    icon: 'user',
  },
  {
    id: 'a4',
    type: 'grievance',
    title: 'High Priority Grievance',
    description: 'Road damage report received from Ward 5',
    timestamp: '2026-01-04T07:30:00Z',
    icon: 'alert',
  },
  {
    id: 'a5',
    type: 'budget',
    title: 'Budget Update',
    description: 'Infrastructure fund disbursed for Q2',
    timestamp: '2026-01-03T16:00:00Z',
    icon: 'budget',
  },
  {
    id: 'a6',
    type: 'notice',
    title: 'Notice Updated',
    description: 'Health camp schedule updated for Ward 12',
    timestamp: '2026-01-03T14:30:00Z',
    icon: 'edit',
  },
  {
    id: 'a7',
    type: 'system',
    title: 'System Maintenance',
    description: 'Scheduled maintenance completed successfully',
    timestamp: '2026-01-03T06:00:00Z',
    icon: 'system',
  },
  {
    id: 'a8',
    type: 'grievance',
    title: 'Grievance Assigned',
    description: 'Water supply issue assigned to maintenance team',
    timestamp: '2026-01-02T15:45:00Z',
    icon: 'assign',
  },
];

// Helper function to format currency in Nepali style
export const formatNepaliCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `रू ${(amount / 10000000).toFixed(2)} करोड`;
  } else if (amount >= 100000) {
    return `रू ${(amount / 100000).toFixed(2)} लाख`;
  }
  return `रू ${amount.toLocaleString('en-IN')}`;
};

// Helper function to get relative time
export const getRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Helper to get priority color
export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high': return '#FDAAAA';
    case 'medium': return '#F59E0B';
    case 'low': return '#59AC77';
    default: return '#6B7280';
  }
};

// Helper to get status color
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending': return '#FCD34D';
    case 'in-progress': return '#59AC77';
    case 'resolved': return '#3A6F43';
    case 'rejected': return '#FDAAAA';
    default: return '#9CA3AF';
  }
};
