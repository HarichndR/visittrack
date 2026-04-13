export type UserRole = 'ADMIN' | 'ORGANIZER' | 'STAFF' | 'EXHIBITOR' | 'VISITOR';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  savedEvents?: string[];
  phone?: string;
  mustChangePassword?: boolean;
  permissions?: string[];
  profession?: string;
  interests?: string[];
  businessName?: string;
  avatarUrl?: string;
}

export interface Event {
  _id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  location: string;
  organizer?: string | User;
  isActive: boolean;
  banner?: string;
  host?: string;
  autoApproval?: boolean;
}

export interface Visitor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  eventId: string | Event;
  qrCode?: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'PENDING' | 'CHECKED_IN' | 'CHECKED_OUT';
  score?: 'HOT' | 'WARM' | 'COLD';
  profession?: string;
  interests?: string[];
}

export interface Exhibitor {
  _id: string;
  name: string;
  company: string;
  stallId: string;
  eventId: string | Event;
  userId: string | User;
  status: 'ACTIVE' | 'INACTIVE';
  logoUrl?: string;
}
