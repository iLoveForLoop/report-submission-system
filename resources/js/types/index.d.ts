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
    name: string;
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
    created_at: string;
    updated_at: string;
}


export interface ReportSubmission {
  id: string;
  report_id: string;
  field_officer_id: number;
  status: 'draft' | 'submitted';
  created_at: string;
  updated_at: string;

  report?: Report;
  field_officer?: User;
}
