import FieldOfficerNavigationPath from '@/actions/App/Http/Controllers/FieldOfficer/ViewController';
import FocalPersonNavigationPath from '@/actions/App/Http/Controllers/FocalPerson/ViewController';
import ProgramHeadNavigationPath from '@/actions/App/Http/Controllers/ProgramHead/ViewController';
import ProvincialDirectorNavigationPath from '@/actions/App/Http/Controllers/ProvincialDirector/ViewController';
import AdminDirectorNavigationPath from '@/actions/App/Http/Controllers/Admin/ViewController';


import { NavItem } from '@/types';
import { Bell, ClipboardList, File, FileCheck, Folder, Layers, LayoutGrid, Users } from 'lucide-react';

export function mainNavigationPath(role: string): NavItem[] {
    switch (role) {
        case 'field_officer':
            return [
                {
                    title: 'Dashboard',
                    href: FieldOfficerNavigationPath.dashboard().url,
                    icon: LayoutGrid,
                },
                {
                    title: 'Programs',
                    href: FieldOfficerNavigationPath.programs().url,
                    icon: Layers,
                    // badge: {
                    //     countKey: 'pending_reports_count',
                    //     variant: 'warning',
                    // },
                },
                {
                    title: 'Pending Reports',
                    href: FieldOfficerNavigationPath.pendingReports().url,
                    icon: File,
                    badge: {
                        countKey: 'pending_reports_count',
                        variant: 'warning',
                    },
                },

                {
                    title: 'My Submissions ',
                    href: FieldOfficerNavigationPath.myReportSubmissions().url,
                    icon: FileCheck,

                },

                {
                    title: 'Notifications',
                    href: FieldOfficerNavigationPath.notifications().url,
                    icon: Bell,
                    badge: {
                        countKey: 'notifications_count',
                        variant: 'notification',
                    },
                },
            ];

        case 'focal_person':
            return [
                {
                    title: 'Dashboard',
                    href: FocalPersonNavigationPath.dashboard().url,
                    icon: LayoutGrid,
                },
                {
                    title: 'Programs',
                    href: FocalPersonNavigationPath.programs().url,
                    icon: Layers,
                    // badge: {
                    //     countKey: 'pending_submissions_count', // amber — submissions to review
                    //     variant: 'warning',
                    // },
                },
                {
                    title: 'Review Queue',
                    href: FocalPersonNavigationPath.reviewQueuePage().url,
                    icon: ClipboardList,
                    badge: {
                        countKey: 'pending_submissions_count', // amber — submissions to review
                        variant: 'warning',
                    },
                },
                {
                    title: 'Submission Logs',
                    href: FocalPersonNavigationPath.submissionPage().url,
                    icon: FileCheck,
                },
                {
                    title: 'Notifications',
                    href: FocalPersonNavigationPath.notifications().url,
                    icon: Bell,
                    badge: {
                        countKey: 'notifications_count',
                        variant: 'notification',
                    },
                },
            ];
        case 'program_head':
            return [
                {
                    title: 'Dashboard',
                    href: ProgramHeadNavigationPath.dashboard().url,
                    icon: LayoutGrid,
                },
                {
                    title: 'Programs',
                    href: ProgramHeadNavigationPath.programs().url,
                    icon: Layers,
                },
                {
                    title: 'Submission Logs',
                    href: ProgramHeadNavigationPath.submissionLogs().url,
                    icon: FileCheck,
                },
                {
                    title: 'User management',
                    href: ProgramHeadNavigationPath.manageUsers().url,
                    icon: Users,
                },
                // {
                //     title: 'Notifications',
                //     href: ProgramHeadNavigationPath.notifications().url,
                //     icon: Bell,
                //     showNotificationBadge: true,
                // },
            ];

        case 'provincial_director':
            return [
                {
                    title: 'Dashboard',
                    href: ProvincialDirectorNavigationPath.dashboard().url,
                    icon: LayoutGrid,
                },
                {
                    title: 'Programs',
                    href: ProvincialDirectorNavigationPath.programs().url,
                    icon: Layers,
                },
                {
                    title: 'Submission Logs',
                    href: ProvincialDirectorNavigationPath.submissionLogs().url,
                    icon: FileCheck,
                },
            ];
        case 'admin':
            return [
                {
                    title: 'Dashboard',
                    href: AdminDirectorNavigationPath.dashboard().url,
                    icon: LayoutGrid,
                },
            ];
        default:
            return [];
    }
}
