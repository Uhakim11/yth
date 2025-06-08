

import { HomeIcon, UserCircleIcon, CogIcon, ArrowLeftOnRectangleIcon, BriefcaseIcon, ShieldCheckIcon, UserPlusIcon, UsersIcon as UsersIconHero, ChartBarIcon, AdjustmentsHorizontalIcon, BellIcon as BellOutlineIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { Trophy, CalendarDays, BookOpen, Lightbulb, TrendingUp, Palette, Music, Clapperboard, Code, Feather, Bike, Rocket, Camera, ChefHat, Sparkles, DollarSign, Star, Image as ImageIconLucide, Video as VideoIconLucide, FileText as BlogIconLucide, Link as LinkIconLucide, LucideIcon, Brain, Paintbrush, Mic, Film, AlertTriangle, CheckCircle2, Info, Edit, Mail, BarChart3, Users, ServerIcon as ServerIconLucide } from 'lucide-react';
import { NavItem, Testimonial, StatisticCardData, ResourceCategory, Competition, Workshop, Resource, ShowcasedWinner, CategoryShowcase, AccentColor, CompetitionCategory, Slide, PortfolioItemType, User, AdminNotification, CompetitionTask, PortfolioItem, AwardItem, CompetitionExercise, Talent, AdminAnalyticChart } from './types';

export const ROUTES = {
  WELCOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN_LOGIN: '/admin-login',
  USER_DASHBOARD: '/dashboard',
  ADMIN_DASHBOARD: '/admin',
  TALENT_DETAIL: '/talent/:id',
  PUBLIC_TALENTS: '/talents',
  SETTINGS: '/settings',
  CONTACT_US: '/contact', // New Contact Us Route
  COMPETITIONS_LIST: '/competitions',
  COMPETITION_DETAIL: '/competitions/:id', 
  WORKSHOPS_LIST: '/workshops',
  WORKSHOP_DETAIL: '/workshops/:id', 
  RESOURCES_LIST: '/resources',
  COMPETITION_TASKS_DETAILS: '/competitions/:id/tasks-details', // Admin view
  COMPETITION_USER_TASK_PAGE: '/competitions/:id/do-tasks', // User view
};

export const GUEST_NAV_ITEMS: NavItem[] = [
  { path: ROUTES.WELCOME, label: 'Home', icon: HomeIcon, roles: ['guest', 'user', 'admin'], title: 'Homepage' },
  { path: ROUTES.PUBLIC_TALENTS, label: 'Browse Talents', icon: UsersIconHero, roles: ['guest', 'user', 'admin'], title: 'Explore All Talents'},
  { path: ROUTES.COMPETITIONS_LIST, label: 'Competitions', icon: Trophy, roles: ['guest', 'user', 'admin'], title: 'View Competitions'},
  { path: ROUTES.WORKSHOPS_LIST, label: 'Workshops', icon: CalendarDays, roles: ['guest', 'user', 'admin'], title: 'Upcoming Workshops'},
  { path: ROUTES.RESOURCES_LIST, label: 'Resources', icon: BookOpen, roles: ['guest', 'user', 'admin'], title: 'Resource Hub'},
  { path: ROUTES.CONTACT_US, label: 'Contact Us', icon: Mail, roles: ['guest', 'user', 'admin'], title: 'Get in Touch'},
  { path: ROUTES.LOGIN, label: 'Login', icon: ArrowLeftOnRectangleIcon, roles: ['guest'], title: 'User Login' },
  { path: ROUTES.REGISTER, label: 'Register', icon: UserPlusIcon, roles: ['guest'], title: 'Create Account' },
  { path: ROUTES.ADMIN_LOGIN, label: 'Admin Login', icon: ShieldCheckIcon, roles: ['guest'], title: 'Administrator Login' },
];

export const USER_NAV_ITEMS: NavItem[] = [
  { path: ROUTES.WELCOME, label: 'Home', icon: HomeIcon, roles: ['guest', 'user', 'admin'], title: 'Homepage' },
  { path: ROUTES.PUBLIC_TALENTS, label: 'Browse Talents', icon: UsersIconHero, roles: ['guest', 'user', 'admin'], title: 'Explore All Talents'},
  { path: ROUTES.USER_DASHBOARD, label: 'My Profile', icon: UserCircleIcon, roles: ['user', 'admin'], title: 'Manage Your Profile' },
  { path: ROUTES.COMPETITIONS_LIST, label: 'Competitions', icon: Trophy, roles: ['guest', 'user', 'admin'], title: 'View Competitions'},
  { path: ROUTES.WORKSHOPS_LIST, label: 'Workshops', icon: CalendarDays, roles: ['guest', 'user', 'admin'], title: 'Upcoming Workshops'},
  { path: ROUTES.RESOURCES_LIST, label: 'Resources', icon: BookOpen, roles: ['guest', 'user', 'admin'], title: 'Resource Hub'},
  { path: ROUTES.CONTACT_US, label: 'Contact Us', icon: Mail, roles: ['guest', 'user', 'admin'], title: 'Get in Touch'},
  { path: ROUTES.SETTINGS, label: 'Settings', icon: AdjustmentsHorizontalIcon, roles: ['user', 'admin'], title: 'Account Settings' },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { path: ROUTES.WELCOME, label: 'Home', icon: HomeIcon, roles: ['guest', 'user', 'admin'], title: 'Homepage' },
  { path: ROUTES.PUBLIC_TALENTS, label: 'Browse Talents', icon: UsersIconHero, roles: ['guest', 'user', 'admin'], title: 'Explore All Talents'},
  { path: ROUTES.ADMIN_DASHBOARD, label: 'Admin Panel', icon: CogIcon, roles: ['admin'], title: 'Manage Platform' },
  { path: ROUTES.COMPETITIONS_LIST, label: 'Competitions', icon: Trophy, roles: ['guest', 'user', 'admin'], title: 'View & Manage Competitions'},
  { path: ROUTES.WORKSHOPS_LIST, label: 'Workshops', icon: CalendarDays, roles: ['guest', 'user', 'admin'], title: 'View & Manage Workshops'},
  { path: ROUTES.RESOURCES_LIST, label: 'Resources', icon: BookOpen, roles: ['guest', 'user', 'admin'], title: 'View & Manage Resources'},
  { path: ROUTES.CONTACT_US, label: 'Contact Us', icon: Mail, roles: ['guest', 'user', 'admin'], title: 'Get in Touch'},
  { path: ROUTES.USER_DASHBOARD, label: 'My Admin Profile', icon: UserCircleIcon, roles: ['admin'], title: 'Manage Your Admin Profile' }, 
  { path: ROUTES.SETTINGS, label: 'Settings', icon: AdjustmentsHorizontalIcon, roles: ['user', 'admin'], title: 'Account Settings' },
];

export const SLIDER_IMAGES: Slide[] = [ 
  { id: '1', imageUrl: 'https://picsum.photos/seed/slidehero1/1600/900', altText: 'Youth expressing talent on stage', title: 'Ignite Your Spark', subtitle: 'Where Talent Meets Opportunity.', titleAnimation: 'slide-up', subtitleAnimation: 'typewriter' },
  { id: '2', imageUrl: 'https://picsum.photos/seed/slidehero2/1600/900', altText: 'Diverse group of young people collaborating', title: 'Create & Connect', subtitle: 'Join a Vibrant Community of Innovators.', titleAnimation: 'slide-up', subtitleAnimation: 'typewriter' },
  { id: '3', imageUrl: 'https://picsum.photos/seed/slidehero3/1600/900', altText: 'Artist working on a digital painting', title: 'Unleash Your Potential', subtitle: 'Tools, Resources, and a Stage for You.', titleAnimation: 'slide-up', subtitleAnimation: 'typewriter' },
];

export const MOCK_TALENT_CATEGORIES_WITH_ICONS = [
  { name: "Art & Design", icon: Palette },
  { name: "Music", icon: Music },
  { name: "Performing Arts", icon: Clapperboard },
  { name: "Technology", icon: Code },
  { name: "Writing", icon: Feather },
  { name: "Sports", icon: Bike },
  { name: "Entrepreneurship", icon: Rocket },
  { name: "Photography", icon: Camera },
  { name: "Culinary Arts", icon: ChefHat },
  { name: "Other", icon: Lightbulb },
];
export const MOCK_TALENT_CATEGORIES = MOCK_TALENT_CATEGORIES_WITH_ICONS.map(c => c.name);


export const MOCK_TESTIMONIALS: Testimonial[] = [
  { id: 't1', quote: "This platform is incredible! I found a competition, submitted my work, and got amazing feedback. It's a game-changer for young artists like me.", name: 'Aisha K.', role: 'Digital Artist', avatarUrl: 'https://picsum.photos/seed/aisha/100/100' },
  { id: 't2', quote: "The workshops are top-notch. I learned so much about video editing, which directly helped my YouTube channel grow. Thank you, Youth Talent Hub!", name: 'Ben C.', role: 'Vlogger', avatarUrl: 'https://picsum.photos/seed/benc/100/100' },
  { id: 't3', quote: "Connecting with other talents and finding resources all in one place has been invaluable. I highly recommend this hub to any young creator.", name: 'Chloe T.', role: 'Musician & Songwriter', avatarUrl: 'https://picsum.photos/seed/chloet/100/100' },
];

// Value property will be dynamically populated in WelcomePage.tsx from context data
export const MOCK_STATISTICS_BASE_CONFIG: Omit<StatisticCardData, 'value'>[] = [
    { id: 's0', title: 'Registered Users', icon: Users, bgColorClass: 'bg-sky-600' },
    { id: 's1', title: 'Showcased Talents', icon: Sparkles, bgColorClass: 'bg-primary-600' }, 
    { id: 's3', title: 'Talent Categories', icon: BriefcaseIcon, bgColorClass: 'bg-indigo-600' },
    { id: 's5', title: 'Active Competitions', icon: Trophy, bgColorClass: 'bg-amber-600' },
    { id: 's6', title: 'Upcoming Workshops', icon: CalendarDays, bgColorClass: 'bg-teal-600' },
    { id: 's7', title: 'Shared Resources', icon: BookOpen, bgColorClass: 'bg-rose-600' },
];

// For Admin Dashboard
export const MOCK_ADMIN_STATISTICS_CONFIG: Omit<StatisticCardData, 'value'>[] = [
    { id: 'admin_s0', title: 'Total Users', icon: Users, bgColorClass: 'bg-sky-600' }, // Uses Lucide Users
    { id: 'admin_s1', title: 'Total Talents', icon: UsersIconHero, bgColorClass: 'bg-primary-600' }, // Uses Hero Users
    { id: 'admin_s2', title: 'Total Competitions', icon: Trophy, bgColorClass: 'bg-amber-600' },
    { id: 'admin_s3', title: 'Total Workshops', icon: CalendarDays, bgColorClass: 'bg-teal-600' },
    { id: 'admin_s4', title: 'Total Resources', icon: BookOpen, bgColorClass: 'bg-rose-600' },
    { id: 'admin_s5', title: 'Platform Settings', icon: ServerIconLucide, bgColorClass: 'bg-slate-600' },
];


export const COMPETITION_CATEGORIES: CompetitionCategory[] = ["Art & Design", "Music & Audio", "Video & Film", "Technology & Coding", "Writing & Storytelling", "Performance", "Innovation", "Other"];

const mockCompetitionExercises: CompetitionExercise[] = [
  {
    id: 'ex1',
    title: 'Creative Writing Prompt',
    type: 'essay_mock',
    instructions: 'Write a 500-word story based on the theme "Futures Reimagined". Focus on character development and a compelling narrative arc.',
    points: 50,
  },
  {
    id: 'ex2',
    title: 'Multiple Choice Quiz: Art History',
    type: 'multiple_choice_mock',
    instructions: 'Answer the following questions about key art movements. (This is a mock quiz, no actual questions provided here).',
    points: 20,
    mockSolutionPreview: 'Example: Q1: A, Q2: C, ...'
  },
  {
    id: 'ex3',
    title: 'Mock File Upload: Concept Art',
    type: 'file_upload_mock',
    instructions: 'Upload your concept art for the "Futures Reimagined" theme. (This will use a mock file uploader component). Ensure your file is a JPG or PNG and under 5MB.',
    points: 30,
  }
];

const mockCompetitionTasks: CompetitionTask[] = [
  { 
    id: 'task1', 
    title: 'Concept Sketch & Artistic Statement', 
    description: 'Submit a detailed sketch of your main character or scene and write a short (200-300 words) artistic statement explaining your vision for "Futures Reimagined" and how your artwork embodies it.', 
    type: 'file_upload_mock', 
    points: 60,
    imageUrls: ['https://picsum.photos/seed/taskimg1/300/200', 'https://picsum.photos/seed/taskimg2/300/200'],
    guidingQuestions: [
      'What is the central theme of your sketch?', 
      'How does your character express the theme "Futures Reimagined"?',
      'What inspired your vision for the artistic statement?', 
      'Explain the symbolism in your artwork.'
    ],
    exercises: [mockCompetitionExercises[0], mockCompetitionExercises[2]], 
  },
  { 
    id: 'task2', 
    title: 'Inspiration Board Link & Video Pitch', 
    description: 'Share a link to a public Pinterest board or online mood board that inspired your artwork. Additionally, record a short (max 60 seconds) video pitching your concept and upload it or provide a link.', 
    type: 'external_link', 
    points: 40,
    videoUrls: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ'], 
    exercises: [mockCompetitionExercises[1]], 
  },
];


export const MOCK_COMPETITIONS: Competition[] = [
  {
    id: 'comp1',
    title: 'Digital Art Showcase 2024',
    description: 'Show off your best digital artwork! Theme: "Futures Reimagined". All styles welcome, from illustration to 3D rendering.',
    category: "Art & Design",
    bannerImageUrl: 'https://picsum.photos/seed/compbanner1/800/400', 
    rules: '1. Must be original work. 2. Submit by deadline. 3. Max 2 entries per person. 4. Artwork must adhere to the theme. 5. Address all tasks in your submission.',
    prize: 'Winner: $500 + Featured on Homepage. Runner-ups: $100 Art Store Voucher.',
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), 
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), 
    status: 'open',
    submissions: [],
    tasks: mockCompetitionTasks, 
  },
  {
    id: 'comp2',
    title: 'Short Film Contest: 60 Second Stories',
    description: 'Tell a compelling story in just 60 seconds. Any genre accepted. Creativity and impact are key!',
    category: "Video & Film",
    bannerImageUrl: 'https://picsum.photos/seed/compbanner2/800/400',
    rules: '1. Max film length 60 seconds (including credits). 2. Must be family-friendly. 3. Submit a link to your video (YouTube, Vimeo, etc.).',
    prize: 'Grand Prize: Professional Film Editing Software Suite. Category Winners: Online Filmmaking Masterclass.',
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), 
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), 
    status: 'upcoming',
    submissions: [],
    tasks: [ 
      { id: 'task2-1', title: 'Script Submission (PDF)', description: 'Upload your 60-second script.', type: 'file_upload_mock', points: 20, imageUrls: ['https://picsum.photos/seed/scriptSample/300/200'] },
      { id: 'task2-2', title: 'Video Link', description: 'Provide a public link to your 60-second film (e.g., YouTube, Vimeo).', type: 'external_link', points: 60 },
      { id: 'task2-3', title: 'Director\'s Statement', description: 'Briefly explain your film\'s concept (max 150 words).', type: 'text_response', points: 20, guidingQuestions: ['What is the core message?', 'What techniques did you use?'] },
    ],
  },
   {
    id: 'comp3',
    title: 'Eco Innovators Challenge',
    description: 'Develop an innovative idea or project that addresses an environmental challenge in your community. Submit a project proposal or a demo.',
    category: "Innovation",
    bannerImageUrl: 'https://picsum.photos/seed/compbanner3/800/400',
    rules: '1. Submissions can be individual or team-based (max 3 people). 2. Clearly outline the problem, solution, and potential impact. 3. Video demos encouraged but not mandatory.',
    prize: 'Seed funding of $1000 for winning project + Mentorship from industry experts.',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), 
    endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), 
    status: 'judging',
    tasks: [{id: 'task3-1', title: 'Project Proposal', description: 'Submit a detailed project proposal document.', type: 'file_upload_mock', points: 100}],
    submissions: [
        { submissionId: 'sub1_c3', talentId: 'user1', talentName: 'Test User', submissionContent: 'Project proposal for community composting system using IoT. Details in submitted document.', submissionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), submissionType: 'text', ratings: [{judgeId: 'admin1', score: 4, comment: "Great idea!"}]},
        { submissionId: 'sub2_c3', talentId: 'admin1', talentName: 'Admin Hakim', submissionContent: 'My idea is to create a community composting system using IoT sensors. More details in the attached document.', submissionDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), submissionType: 'text', ratings: [{judgeId: 'admin1', score: 3}]}
    ],
    winner: { talentId: 'user1', talentName: 'Test User', submissionId: 'sub1_c3'},
    paymentProcessed: 'Pending'
  },
];

export const MOCK_WORKSHOPS: Workshop[] = [
  {
    id: 'work1',
    title: 'Intro to Podcasting: Find Your Voice',
    description: 'Learn the basics of podcasting, from planning and recording to editing and publishing. No prior experience needed!',
    dateTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000).toISOString(), 
    durationMinutes: 120,
    locationOrLink: 'Online via Zoom (Link provided upon registration)',
    facilitator: 'Jane Doe, Podcast Pro',
    category: 'Media & Communication',
    capacity: 50,
    registeredTalents: [],
    fee: 'Free',
    bannerImageUrl: 'https://picsum.photos/seed/workbanner1/600/300', 
  },
  {
    id: 'work2',
    title: 'Advanced Photography: Mastering Light & Composition',
    description: 'Take your photography skills to the next level. This workshop covers advanced lighting techniques, compositional rules, and post-processing secrets.',
    dateTime: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(), 
    durationMinutes: 180,
    locationOrLink: 'Community Art Center, Room 102',
    facilitator: 'John Aperture',
    category: 'Photography',
    capacity: 20,
    registeredTalents: [],
    fee: '$25 (Materials included)',
    bannerImageUrl: 'https://picsum.photos/seed/workbanner2/600/300', 
  },
];

export const RESOURCE_CATEGORIES_LIST: ResourceCategory[] = ["Skill Development", "Funding & Grants", "Tools & Software", "Career Advice", "Legal & Business", "Inspiration", "Other"];

export const MOCK_RESOURCES: Resource[] = [
  {
    id: 'res1',
    title: 'Coursera: Free Online Courses',
    description: 'Access thousands of free courses from top universities and companies to learn new skills or advance your career.',
    link: 'https://www.coursera.org',
    category: 'Skill Development',
    tags: ['online learning', 'courses', 'education'],
    createdAt: new Date().toISOString(),
    imageUrl: 'https://picsum.photos/seed/resimg1/400/200', 
  },
  {
    id: 'res2',
    title: 'Canva: Free Design Tool',
    description: 'Create stunning graphics, presentations, and videos easily with Canva\'s user-friendly interface and vast library of templates.',
    link: 'https://www.canva.com',
    category: 'Tools & Software',
    tags: ['design', 'graphics', 'free tools'],
    createdAt: new Date().toISOString(),
    imageUrl: 'https://picsum.photos/seed/resimg2/400/200', 
  },
  {
    id: 'res3',
    title: 'Kickstarter: Crowdfunding Platform',
    description: 'Bring your creative projects to life with the help of a global community. Learn how to launch a successful crowdfunding campaign.',
    link: 'https://www.kickstarter.com',
    category: 'Funding & Grants',
    tags: ['crowdfunding', 'creative projects', 'funding'],
    createdAt: new Date().toISOString(),
    imageUrl: 'https://picsum.photos/seed/resimg3/400/200', 
  },
];

export const MOCK_WELCOME_ACTION_BUTTONS = [
    {id: 'wb1', label: "Explore Talents", href: ROUTES.PUBLIC_TALENTS, icon: UsersIconHero, color: "bg-primary-600 hover:bg-primary-700"},
    {id: 'wb2', label: "View Competitions", href: ROUTES.COMPETITIONS_LIST, icon: Trophy, color: "bg-amber-500 hover:bg-amber-600"},
    {id: 'wb3', label: "Find Workshops", href: ROUTES.WORKSHOPS_LIST, icon: CalendarDays, color: "bg-teal-500 hover:bg-teal-600"},
    {id: 'wb4', label: "Resource Hub", href: ROUTES.RESOURCES_LIST, icon: BookOpen, color: "bg-rose-500 hover:bg-rose-600"},
];

export const generatePath = (path: string, params: object) => {
  return Object.entries(params).reduce((acc, [key, value]) => acc.replace(`:${key}`, String(value)), path);
};

export const MOCK_SHOWCASED_WINNERS: ShowcasedWinner[] = [
    { id: 'sw1', talentName: 'Elena Petrova', talentImageUrl: 'https://picsum.photos/seed/elena/200/200', competitionTitle: 'Digital Art Showcase 2023', competitionCategory: 'Art & Design', prizeDescription: '$500 Grand Prize', prizeIcon: DollarSign, rating: 5, judgesScore: 4.8},
    { id: 'sw2', talentName: 'Marcus Chen', talentImageUrl: 'https://picsum.photos/seed/marcus/200/200', competitionTitle: 'Indie Music Fest', competitionCategory: 'Music & Audio', prizeDescription: 'Featured EP Release', prizeIcon: Trophy, rating: 4, judgesScore: 4.5},
    { id: 'sw3', talentName: 'Sofia Al-Jamil', talentImageUrl: 'https://picsum.photos/seed/sofia/200/200', competitionTitle: 'Tech Innovators Sprint', competitionCategory: 'Technology & Coding', prizeDescription: 'Startup Mentorship', prizeIcon: Brain, rating: 5, judgesScore: 4.9},
];

export const MOCK_CATEGORY_SHOWCASES: CategoryShowcase[] = [
    { id: 'cs1', name: 'Art & Design', imageUrl: 'bg-category-art-design', icon: Paintbrush, description: 'Visual arts, illustration, graphic design, fashion.', link: `${ROUTES.PUBLIC_TALENTS}?category=Art%20&%20Design`},
    { id: 'cs2', name: 'Music & Audio', imageUrl: 'bg-category-music', icon: Mic, description: 'Singers, musicians, producers, sound engineers.', link: `${ROUTES.PUBLIC_TALENTS}?category=Music`},
    { id: 'cs3', name: 'Video & Film', imageUrl: 'bg-category-performance', icon: Film, description: 'Filmmakers, animators, video editors, actors.', link: `${ROUTES.COMPETITIONS_LIST}?category=Video%20&%20Film`},
    { id: 'cs4', name: 'Technology & Coding', imageUrl: 'bg-category-tech', icon: Code, description: 'Developers, innovators, tech enthusiasts.', link: `${ROUTES.COMPETITIONS_LIST}?category=Technology%20&%20Coding`},
];

export const ACCENT_COLORS: AccentColor[] = [
  { name: 'Default Blue', primary500: '#3b82f6', primary600: '#2563eb', primary700: '#1d4ed8', ring: '#3b82f6', cssVariableSuffix: 'default-blue' },
  { name: 'Sky Blue', primary500: '#0ea5e9', primary600: '#0284c7', primary700: '#0369a1', ring: '#0ea5e9', cssVariableSuffix: 'sky-blue' },
  { name: 'Teal', primary500: '#14b8a6', primary600: '#0d9488', primary700: '#0f766e', ring: '#14b8a6', cssVariableSuffix: 'teal' },
  { name: 'Green', primary500: '#22c55e', primary600: '#16a34a', primary700: '#15803d', ring: '#22c55e', cssVariableSuffix: 'green' },
  { name: 'Vibrant Green', primary500: '#84cc16', primary600: '#65a30d', primary700: '#4d7c0f', ring: '#84cc16', cssVariableSuffix: 'vibrant-green' },
  { name: 'Indigo', primary500: '#6366f1', primary600: '#4f46e5', primary700: '#4338ca', ring: '#6366f1', cssVariableSuffix: 'indigo' },
  { name: 'Violet', primary500: '#8b5cf6', primary600: '#7c3aed', primary700: '#6d28d9', ring: '#8b5cf6', cssVariableSuffix: 'violet' },
  { name: 'Rose', primary500: '#f43f5e', primary600: '#e11d48', primary700: '#be123c', ring: '#f43f5e', cssVariableSuffix: 'rose' },
  { name: 'Amber', primary500: '#f59e0b', primary600: '#d97706', primary700: '#b45309', ring: '#f59e0b', cssVariableSuffix: 'amber' },
  { name: 'Yellow', primary500: '#eab308', primary600: '#ca8a04', primary700: '#a16207', ring: '#eab308', cssVariableSuffix: 'yellow' },
];


export const PORTFOLIO_ITEM_ICONS: { [key in PortfolioItemType]: LucideIcon } = {
  image: ImageIconLucide,
  video: VideoIconLucide,
  blog: BlogIconLucide,
  link: LinkIconLucide,
};


export const MOCK_ADMIN_NOTIFICATIONS: AdminNotification[] = [
    { id: 'an1', message: 'New talent "Sarah Connor" just registered.', type: 'success', timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), link: ROUTES.ADMIN_DASHBOARD + '?tab=Talents', read: false, icon: UserPlusIcon },
    { id: 'an2', message: 'Competition "Digital Art Showcase 2024" is now in judging phase.', type: 'info', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), link: generatePath(ROUTES.COMPETITION_DETAIL, {id: 'comp1'}), read: false, icon: Info },
    { id: 'an3', message: 'Workshop "Intro to Podcasting" has 5 new registrations.', type: 'info', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), link: generatePath(ROUTES.WORKSHOP_DETAIL, {id: 'work1'}), read: true, icon: CalendarDays },
    { id: 'an4', message: 'User "user@example.com" reported an issue with login (Simulated).', type: 'warning', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), read: true, icon: AlertTriangle },
    { id: 'an5', message: 'Platform data successfully backed up (Simulated).', type: 'success', timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), read: true, icon: CheckCircle2 },
    { id: 'an6', message: 'New competition "Summer CodeFest" created by admin.', type: 'success', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), link: ROUTES.ADMIN_DASHBOARD + '?tab=Competitions', read: false, icon: Trophy },
    { id: 'an7', message: 'Reminder: Monthly platform performance review meeting tomorrow.', type: 'info', timestamp: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(), read: false, icon: BellOutlineIcon },
];

// Helper for mock data: Simple Portfolio Items
export const MOCK_PORTFOLIO_ITEMS_ALICE: PortfolioItem[] = [
  { id: 'p1-1', talentId: 'talent1', type: 'image', title: 'Reimagined Logos', contentUrlOrText: 'https://picsum.photos/seed/portAlice1/600/400', description: 'A collection of modern logo designs for various brands.', createdAt: new Date(Date.now() - 5 * 24*60*60*1000).toISOString() },
  { id: 'p1-2', talentId: 'talent1', type: 'blog', title: 'My Design Philosophy', contentUrlOrText: 'Exploring the intersection of art and utility in modern design. True design is not just about aesthetics, but about solving problems elegantly and intuitively. \n\n## Core Principles \n\n*   **User-Centricity:** Always start with the user. \n*   **Simplicity:** Less is often more. \n*   **Consistency:** Create a cohesive experience.', description: 'A short blog post about my approach to design.', createdAt: new Date(Date.now() - 2 * 24*60*60*1000).toISOString() },
  { id: 'p1-3', talentId: 'talent1', type: 'video', title: 'Animation Reel', contentUrlOrText: 'https://www.w3schools.com/html/mov_bbb.mp4', 
    thumbnailDataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBAUEBAYFBQUGBgYHCQ4JCQgICRINDQoOFRIWFhUSFBQXGI_jio_Nns0PjQ_Ljk_LzI_AAAA////AAAAAP_EABoBAQEBAQEBAQAAAAAAAAAAAAEDAgQFAAb/wgELAwEBAQSPAQAAAAAAAABgQFAwABCP_AABEIABUAFQMBIgACEQEDEQH_xAAaAAEBAQEAAwAAAAAAAAAAAAAEAgEDBQYA/8QAHhABAQABBAMBAAAAAAAAAAAAAAECERIDIZFSscH/2gAMAwEAAhADEAAAAPpOT4RzOx27r6rT_P_EAB4QAQACAgEFAAAAAAAAAAAAABEEAgMAFSESFCIx/9oACAECAAEFAPfLDRoKxK1WjPBP/8QAGhABAQEAAwEAAAAAAAAAAAAAEQACAxESMf/aAAgBAwABBQPuBNZzXlr_xAAeEAABBAIDAQEAAAAAAAAAAAABAAIREgMQICEwMv/aAAgBAQABPwDpKCOVjHw8pjO464L_G_xABcEQEAAQMCAwAAAAAAAAAAAAARIAAhEDMTBBUf/aAAgBAgEBPwDBqMmhbyGysRPfF_zj_wD_xAAbEQEAAgMBAAAAAAAAAAAAAAABABEQITFBYf/aAAgBAwEBPwDSOCL2mR0Y4h_n3v_Z', 
    description: 'A showcase of my recent animation work.', createdAt: new Date(Date.now() - 1 * 24*60*60*1000).toISOString() },
];

export const MOCK_TALENTS_DATA : Talent[] = [ 
  {
    id: 'talent1', userId: 'talent1_user', name: 'Alice Wonderland', category: MOCK_TALENT_CATEGORIES[0], contactEmail: 'alice@example.com',
    description: 'Passionate graphic designer and illustrator with 5 years of experience in branding and digital art. Loves creating vibrant and engaging visuals. Proficient in Adobe Creative Suite.',
    skills: ['Graphic Design', 'Illustration', 'Branding', 'Photoshop', 'Illustrator'],
    profileImageUrl: 'https://picsum.photos/seed/aliceW/400/300',
    achievements: ['Winner - Local Design Contest 2023', 'Featured Artist - Design Weekly'],
    portfolio: MOCK_PORTFOLIO_ITEMS_ALICE,
  },
  {
    id: 'talent2', userId: 'talent2_user', name: 'Bob The Builder', category: MOCK_TALENT_CATEGORIES[3], contactEmail: 'bob@example.com',
    description: 'Full-stack web developer specializing in React, Node.js, and serverless architectures. Enjoys solving complex problems and building scalable applications.',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Serverless'],
    profileImageUrl: 'https://picsum.photos/seed/bobB/400/300',
    achievements: ['Top Coder - Monthly Challenge (3 times)', 'Open Source Contributor Award'],
    portfolio: [],
  },
  {
    id: 'talent3', userId: 'talent3_user', name: 'Charlie Chaplin Jr.', category: MOCK_TALENT_CATEGORIES[2], contactEmail: 'charlie@example.com',
    description: 'Versatile performing artist with skills in acting, mime, and comedy. Has performed in various theatre productions and street shows. Brings energy to every performance.',
    skills: ['Acting', 'Mime', 'Comedy', 'Improvisation'],
    profileImageUrl: 'https://picsum.photos/seed/charlieC/400/300',
    achievements: ['Best Performer - Fringe Festival 2022'],
    portfolio: [],
  },
  {
    id: 'talent4', userId: 'talent4_user', name: 'Diana Prince', category: MOCK_TALENT_CATEGORIES[5], contactEmail: 'diana@example.com',
    description: 'Dedicated athlete with a focus on track and field. Specializes in sprinting and long jump. Always pushing limits and aiming for personal bests.',
    skills: ['Sprinting', 'Long Jump', 'Athletic Training', 'Discipline'],
    profileImageUrl: 'https://picsum.photos/seed/dianaP/400/300',
    achievements: ['Regional Champion - 100m Sprint 2023', 'Athlete of the Year Nominee'],
    portfolio: [],
  },
  {
    id: 'talent5', userId: 'talent5_user', name: 'Edward Nygma', category: MOCK_TALENT_CATEGORIES[6], contactEmail: 'edward@example.com',
    description: 'Innovative entrepreneur with a passion for tech startups. Launched two successful apps. Strong believer in solving real-world problems with technology.',
    skills: ['Startups', 'Mobile App Development', 'Business Strategy', 'Pitching'],
    profileImageUrl: 'https://picsum.photos/seed/edwardN/400/300',
    achievements: ['Founder - SolveIt App', 'Young Innovator Award 2024'],
    portfolio: [],
  },
  {
    id: 'talent6', userId: 'talent6_user', name: 'Fiona Glenanne', category: MOCK_TALENT_CATEGORIES[1], contactEmail: 'fiona@example.com',
    description: 'Talented musician and songwriter, plays guitar and piano. Her music blends folk and indie pop creating a unique sound. Performs regularly at local venues.',
    skills: ['Songwriting', 'Guitar', 'Piano', 'Vocals', 'Music Production (Basic)'],
    profileImageUrl: 'https://picsum.photos/seed/fionaG/400/300',
    achievements: ['Best Original Song - City Music Fair', 'EP "Echoes" Released 2023'],
    portfolio: [],
  },
  {
    id: 'talent7', userId: 'talent7_user', name: 'George Jetson', category: MOCK_TALENT_CATEGORIES[3], 
    description: 'Aspiring robotics engineer and inventor. Loves building gadgets and exploring future technologies. Currently working on a home automation system.',
    skills: ['Robotics', 'Circuit Design', 'Programming (Python, C++)', '3D Printing'],
    profileImageUrl: 'https://picsum.photos/seed/georgeJ/400/300',
    achievements: ['1st Place - Science Fair (Robotics)', 'Patent Pending - Automated Pet Feeder'],
    portfolio: [],
  },
  {
    id: 'talent8', userId: 'talent8_user', name: 'Harley Quinn', category: MOCK_TALENT_CATEGORIES[2], 
    description: 'Dynamic gymnast and acrobat with a flair for dramatic performance. Combines athleticism with artistic expression. Loves circus arts.',
    skills: ['Gymnastics', 'Acrobatics', 'Aerial Silks', 'Stage Presence'],
    profileImageUrl: 'https://picsum.photos/seed/harleyQ/400/300',
    achievements: ['Circus Arts Performer of the Year (Local)', 'Audience Choice Award - Talent Show 2023'],
    portfolio: [],
  },
  { 
    id: 'talent_reponsekdz', userId: 'user_reponsekdz', name: 'Reponse Kdz', category: MOCK_TALENT_CATEGORIES[4], 
    contactEmail: 'reponsekdz06@gmail.com',
    description: 'Creative writer and storyteller, passionate about crafting compelling narratives and exploring diverse genres. Also enjoys coding small web projects.',
    skills: ['Creative Writing', 'Storytelling', 'Blogging', 'JavaScript', 'React (Basic)'],
    profileImageUrl: 'https://picsum.photos/seed/reponsekdz_talent/400/300',
    achievements: ['Short Story Contest Winner 2023', 'NaNoWriMo Participant (2 years)'],
    portfolio: [],
  },
  {
    id: 'talent9', userId: 'talent9_user', name: 'Ivy Pepper', category: MOCK_TALENT_CATEGORIES[0], 
    contactEmail: 'ivy@example.com',
    description: 'Botanical artist and sculptor. Creates intricate pieces inspired by nature. Also skilled in digital illustration with a focus on floral patterns.',
    skills: ['Botanical Art', 'Sculpture', 'Digital Illustration', 'Pattern Design'],
    profileImageUrl: 'https://picsum.photos/seed/ivyP/400/300',
    achievements: ['"Nature\'s Beauty" Art Exhibition Participant', 'Green Thumb Design Award'],
    portfolio: [],
  },
  {
    id: 'talent10', userId: 'talent10_user', name: 'Jack Sparrow', category: MOCK_TALENT_CATEGORIES[8], 
    contactEmail: 'jack.sparrow@example.com',
    description: 'Adventurous chef specializing in fusion cuisine. Known for exotic flavors and daring presentations. Always seeking the next culinary treasure.',
    skills: ['Fusion Cuisine', 'Plating', 'Spice Blending', 'Rum Tasting (Expert)'],
    profileImageUrl: 'https://picsum.photos/seed/jackS/400/300',
    achievements: ['"Taste of the Caribbean" Cook-off Champion', 'Featured in "Pirate Chef Monthly"'],
    portfolio: [],
  },
  {
    id: 'talent11', userId: 'talent11_user', name: 'Kara Danvers', category: MOCK_TALENT_CATEGORIES[7], 
    contactEmail: 'kara.d@example.com',
    description: 'Photojournalist with a keen eye for impactful stories. Captures moments that matter. Also dabbles in aerial photography.',
    skills: ['Photojournalism', 'Documentary Photography', 'Editing (Lightroom, Photoshop)', 'Aerial Photography'],
    profileImageUrl: 'https://picsum.photos/seed/karaD/400/300',
    achievements: ['"Human Spirit" Photography Award', 'International Photo Contest - Honorable Mention'],
    portfolio: [],
  },
];

// New Awards Data
export const MOCK_AWARDS_DATA: AwardItem[] = [
  {
    id: 'award1',
    title: 'Grand Champion Trophy',
    description: 'Awarded to the overall winner of the Annual Talent Olympiad for outstanding performance.',
    imageUrl: 'https://picsum.photos/seed/trophy1/300/400',
    category: 'Championship',
    year: 2023,
  },
  {
    id: 'award2',
    title: 'Medal of Excellence - Tech',
    description: 'Recognizing exceptional innovation and skill in the Technology & Coding category.',
    imageUrl: 'https://picsum.photos/seed/medaltech/300/300',
    category: 'Excellence',
    year: 2023,
  },
  {
    id: 'award3',
    title: 'Artistic Vision Award',
    description: 'Presented for unique vision and creativity in the Art & Design competitions.',
    imageUrl: 'https://picsum.photos/seed/artaward/300/350',
    category: 'Special Recognition',
  },
  {
    id: 'award4',
    title: 'Rising Star Participation Medal',
    description: 'Encouragement award for promising talents who actively participated in multiple events.',
    imageUrl: 'https://picsum.photos/seed/participationmedal/300/300',
    category: 'Participation',
    year: 2024,
  },
  {
    id: 'award5',
    title: 'Music Maestro Cup',
    description: 'For the most captivating musical performance or composition of the year.',
    imageUrl: 'https://picsum.photos/seed/musiccup/300/400',
    category: 'Championship',
  },
];

// Mock Admin Analytics Data
export const MOCK_ANALYTICS_DATA: AdminAnalyticChart[] = [
  {
    id: 'talentSignups',
    title: 'Talent Sign-ups (Last 6 Months)',
    type: 'bar',
    dataLabel: 'New Talents',
    data: [
      { label: 'Jan', value: 23, color: '#3b82f6' }, { label: 'Feb', value: 31, color: '#10b981' },
      { label: 'Mar', value: 45, color: '#f59e0b' }, { label: 'Apr', value: 38, color: '#ef4444' },
      { label: 'May', value: 52, color: '#6366f1' }, { label: 'Jun', value: 60, color: '#8b5cf6' },
    ],
  },
  {
    id: 'competitionEntries',
    title: 'Competition Entries (Top 5)',
    type: 'bar',
    dataLabel: 'Entries',
    data: [
      { label: 'DigiArt \'24', value: 150, color: '#0ea5e9' }, { label: 'FilmFest \'24', value: 95, color: '#14b8a6' },
      { label: 'EcoInnovate', value: 78, color: '#84cc16' }, { label: 'Music Mania', value: 120, color: '#f43f5e' },
      { label: 'Code Clash', value: 65, color: '#d946ef' },
    ],
  },
  {
    id: 'workshopAttendance',
    title: 'Workshop Attendance (Avg. per Category)',
    type: 'bar',
    dataLabel: 'Avg. Attendees',
    data: [
      { label: 'Art', value: 25, color: '#f97316' }, { label: 'Tech', value: 40, color: '#06b6d4' },
      { label: 'Music', value: 30, color: '#a855f7' }, { label: 'Writing', value: 18, color: '#059669' },
      { label: 'Performance', value: 22, color: '#db2777' },
    ],
  },
];