// Admin Dashboard TypeScript Interfaces

export interface MunicipalityInfo {
  name: string;
  nameNepali: string;
  province: string;
  district: string;
  totalWards: number;
  population: number;
  area: string;
  contactEmail: string;
  contactPhone: string;
  establishedDate: string;
}

export interface DashboardStats {
  totalPopulation: number;
  totalWards: number;
  registeredUsers: number;
  activeNotices: number;
  pendingGrievances: number;
  resolvedGrievances: number;
}

export type GrievanceCategory = 
  | 'infrastructure' 
  | 'sanitation' 
  | 'water' 
  | 'electricity' 
  | 'roads' 
  | 'other';

export type GrievancePriority = 'high' | 'medium' | 'low';

export type GrievanceStatus = 'pending' | 'in-progress' | 'resolved' | 'rejected';

export interface Grievance {
  id: string;
  title: string;
  description: string;
  category: GrievanceCategory;
  priority: GrievancePriority;
  status: GrievanceStatus;
  submittedBy: string;
  wardNumber: number;
  submittedAt: string;
  updatedAt: string;
  isRead: boolean;
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  color: string;
}

export interface MonthlyExpenditure {
  month: string;
  amount: number;
}

export interface BudgetData {
  fiscalYear: string;
  totalBudget: number;
  totalSpent: number;
  categories: BudgetCategory[];
  monthlyTrend: MonthlyExpenditure[];
}

export interface WardStats {
  wardNumber: number;
  name: string;
  population: number;
  grievanceCount: number;
  activeNotices: number;
  budgetAllocated: number;
}

export type ActivityType = 'notice' | 'grievance' | 'user' | 'budget' | 'system';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

// Component Props Interfaces
export interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export interface GrievanceCardProps {
  grievance: Grievance;
  onPress: (id: string) => void;
  isCompact?: boolean;
}

export interface ActivityItemProps {
  activity: ActivityItem;
}

export interface QuickActionButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
  color?: string;
}

export interface WardCardProps {
  ward: WardStats;
  onPress?: (wardNumber: number) => void;
}

export interface PieChartProps {
  data: BudgetCategory[];
  size?: number;
  showLegend?: boolean;
}

export interface BarChartProps {
  data: MonthlyExpenditure[];
  height?: number;
  barColor?: string;
}
