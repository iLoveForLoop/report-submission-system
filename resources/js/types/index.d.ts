import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    showNotificationBadge?: boolean;
    badge?: NavItemBadge;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    employee_code?: string;
    name: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    gender: string;
    birthday: Date | null;

    department: string;
    position: string;
    cluster: 'M&M' | "D'ONE" | null;
    email: string;
    avatar_url: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    role: string;
    notifications_count: number;
    pending_reports_count: number;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Program {
    id: number;
    name: string;
    description: string;
    coordinator: User<Pick<User, 'id' | 'name' | 'email' | 'avatar'>>;
    created_at: string;
    updated_at: string;
    has_pending_reports: boolean;
}

export interface Report {
    id: string;
    title: string;
    description?: string;
    program: Program<Pick<Program, 'id' | 'name' | 'description'>>;
    created_by: User<Pick<User, 'id' | 'name' | 'email' | 'avatar'>>;
    deadline: Date;
    final_deadline: Date;
    form_schema: Array;
    templates: Media[];
    references: Media[];
    created_at: string;
    updated_at: string;
    submission_status: string
}

export interface Media {
    id: string;
    name: string;
    file_name: string;
    mime_type: string;
    size: number;
    original_url: string;
}

// Add to types/index.d.ts
export interface ReportSubmission {
    id: string;
    report_id: string;
    field_officer: User<Pick<User, 'id' | 'name' | 'email' | 'avatar'>>;
    status: 'draft' | 'submitted' | 'accepted' | 'returned';
    timeliness: string | null;
    media: Media[];
    created_at: string;
    updated_at: string;
    remarks: string;
    description: string
    data: Object

    // Relationships
    fieldOfficer?: Pick<User, 'id' | 'name' | 'email' | 'avatar'>;
    media?: Media[];
    report?: Report; // Added report relationship
    program?: Program;
}

export interface LaravelPaginator<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;

}

interface NotificationItem {
    id: string;
    title: string;
    message: string;
    created_at: string;
    read_at: string | null;
    action_url: string | null;
}

export interface NavItemBadge {
    countKey: keyof User;           // which field from auth.user to read
    variant?: NavBadgeVariant;      // controls the color
}


export type FilterType = 'all' | 'pending' | 'rejected' | 'accepted';

export type NavBadgeVariant = 'notification' | 'warning' | 'info';
