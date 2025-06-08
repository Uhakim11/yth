import React from 'react';
import { LucideIcon } from 'lucide-react'; // For new icons

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  name?: string;
  avatarUrl?: string; // Original avatar URL, can be kept for initial mock data
  avatarDataUrl?: string; // For uploaded avatars
  lastSeen?: string | 'online'; // For chat (now potentially general user presence)
  status?: 'active' | 'suspended'; // New for user management
}

// Portfolio Related Types
export type PortfolioItemType = 'image' | 'video' | 'blog' | 'link';

export interface PortfolioItem {
  id: string;
  talentId: string;
  type: PortfolioItemType;
  title: string;
  description?: string;
  contentUrlOrText: string; // URL for link, text content for blog
  contentDataUrl?: string; // Data URL for uploaded image/video
  thumbnailDataUrl?: string; // Optional for video/link previews from upload
  createdAt: string;
}

export interface Talent {
  id:string;
  userId: string; 
  name: string;
  category: string;
  description: string;
  skills: string[];
  portfolioLinks?: string[]; 
  profileImageUrl?: string; // Original URL for mock data
  profileImageDataUrl?: string; // For uploaded profile images
  contactEmail?: string;
  location?: string;
  achievements?: string[]; 
  portfolio?: PortfolioItem[]; 
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  // error?: string; 
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface AccentColor {
  name: string;
  primary500: string; 
  primary600: string;
  primary700: string;
  ring: string; 
  cssVariableSuffix: string; 
}
export interface AccentColorContextType {
  accentColor: AccentColor;
  setAccentColorByName: (name: string) => void;
}


export interface NavItem {
  path: string;
  label: string;
  icon: ((props: React.SVGProps<SVGSVGElement>) => React.JSX.Element) | LucideIcon; 
  roles?: Array<'user' | 'admin' | 'guest'>;
  title?: string; 
}

export interface Slide {
  id: string;
  imageUrl: string; // Keep as URL for cinematic slider, assumes these are app assets
  altText: string;
  title?: string;
  subtitle?: string;
  titleAnimation?: 'typewriter' | 'slide-up'; 
  subtitleAnimation?: 'typewriter' | 'slide-up';
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatarUrl?: string; // Kept as URL for testimonials
}

export interface StatisticCardData {
  id: string;
  title: string;
  value: string;
  icon: ((props: React.SVGProps<SVGSVGElement>) => React.JSX.Element) | LucideIcon;
  bgColorClass: string; 
}

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertMessage {
  id: string;
  message: string;
  type: AlertType;
  duration?: number;
}

// --- Feature Specific Types ---

export type CompetitionStatus = 'upcoming' | 'open' | 'judging' | 'closed' | 'archived';
export type PaymentStatus = 'Pending' | 'Processed' | 'Not Applicable';

export interface CompetitionSubmissionRating {
  judgeId: string; 
  score: number; 
  comment?: string;
}

export interface CompetitionSubmission {
  submissionId: string;
  talentId: string;
  talentName: string; 
  submissionDate: string; 
  submissionType: 'text' | 'portfolio'; 
  submissionContent: string; 
  portfolioItemId?: string; 
  ratings?: CompetitionSubmissionRating[]; 
}

export type CompetitionCategory = "Art & Design" | "Music & Audio" | "Video & Film" | "Technology & Coding" | "Writing & Storytelling" | "Performance" | "Innovation" | "Other";

export interface CompetitionExercise {
  id: string;
  title: string;
  type: 'multiple_choice_mock' | 'coding_challenge_mock' | 'essay_mock' | 'file_upload_mock';
  instructions: string; // Markdown supported
  points?: number;
  mockSolutionPreview?: string; // Optional: For coding challenges or specific answers
}

export interface CompetitionTask {
  id: string;
  title: string;
  description: string;
  type: 'text_response' | 'file_upload_mock' | 'external_link'; 
  points?: number;
  imageUrls?: string[]; 
  videoUrls?: string[]; 
  guidingQuestions?: string[]; 
  exercises?: CompetitionExercise[]; // New
}

export interface Competition {
  id: string;
  title: string;
  description: string;
  category?: CompetitionCategory;
  bannerImageUrl?: string; 
  bannerImageDataUrl?: string; 
  rules: string; 
  prize: string; 
  startDate: string; 
  endDate: string; 
  status: CompetitionStatus;
  submissions: CompetitionSubmission[];
  tasks?: CompetitionTask[]; 
  winner?: {
    talentId: string;
    talentName: string; 
    submissionId: string;
  };
  paymentProcessed?: PaymentStatus;
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  dateTime: string; 
  durationMinutes?: number;
  locationOrLink: string; 
  facilitator?: string;
  category?: string;
  capacity?: number;
  registeredTalents: Array<{ talentId: string; talentName: string; registrationDate: string; }>; 
  fee: string; 
  bannerImageUrl?: string; 
  bannerImageDataUrl?: string; 
}

export type ResourceCategory = "Skill Development" | "Funding & Grants" | "Tools & Software" | "Career Advice" | "Legal & Business" | "Inspiration" | "Other";

export interface Resource {
  id: string;
  title: string;
  description: string;
  link: string;
  category: ResourceCategory;
  tags?: string[];
  addedByAdminId?: string; 
  createdAt: string; 
  imageUrl?: string; 
  imageDataUrl?: string; 
}

export interface ShowcasedWinner {
  id: string;
  talentName: string;
  talentImageUrl?: string; 
  talentImageDataUrl?: string; 
  competitionTitle: string;
  competitionCategory: CompetitionCategory | string; 
  prizeDescription: string; 
  prizeIcon?: LucideIcon; 
  rating: number; 
  judgesScore?: number; 
}

export interface CategoryShowcase {
  id: string;
  name: Talent['category'] | CompetitionCategory; 
  imageUrl: string; 
  icon: LucideIcon;
  description: string;
  link: string; 
}

// Chat Feature Types Removed

// Admin Notification Type
export interface AdminNotification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error'; 
  timestamp: string;
  link?: string; 
  read: boolean;
  icon?: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>;
}

// Util type for FileInput
export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

// New Award Type for Welcome Page
export interface AwardItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string; // URL for cup/medal image
  category: 'Championship' | 'Excellence' | 'Participation' | 'Special Recognition';
  year?: number; // Optional year of award
}

// Admin Analytics Types
export interface AdminAnalyticDataPoint {
  label: string; // e.g., "Jan", "Feb", "Competition A"
  value: number;
  color?: string; // Optional color for this data point
}

export interface AdminAnalyticChart {
  id: string;
  title: string;
  data: AdminAnalyticDataPoint[];
  type: 'bar' | 'line'; // More types can be added
  dataLabel?: string; // e.g. "Sign-ups", "Entries"
}

// Auth Context Type (moved from useAuth for clarity if needed elsewhere)
export interface AuthContextType extends AuthState {
  login: (email: string, pass: string) => Promise<User | null>;
  adminLogin: (email: string, pass: string) => Promise<User | null>;
  register: (name: string, email: string, pass: string) => Promise<User | null>;
  logout: () => void;
  updateUserAvatar: (avatarDataUrl: string) => Promise<void>;
  // For User Management by Admin
  fetchAllUsers: () => Promise<User[]>;
  updateUserStatusAsAdmin: (userId: string, status: User['status']) => Promise<User | null>;
}