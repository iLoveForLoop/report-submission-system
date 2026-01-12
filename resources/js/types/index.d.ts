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
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    role: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Program {
    id: number;
    name: string;
    description: string;
    coordinator: User;
    created_at: string;
    updated_at: string;
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
    created_at: string;
    updated_at: string;
}

export interface Media {
    id: string;
    name: string;
    file_name: string;
    mime_type: string;
    size: number;
    original_url: string;
}

export interface ReportSubmission {
    id: string;
    report_id: string;
    field_officer: User<Pick<User, 'id' | 'name' | 'email' | 'avatar'>>;
    status: 'draft' | 'submitted';
    media: Media[];
    created_at: string;
    updated_at: string;

    report?: Report;
    field_officer?: User;
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
