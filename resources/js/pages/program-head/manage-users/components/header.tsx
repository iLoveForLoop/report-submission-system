import { router } from '@inertiajs/react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import AddUserDialog from './add-user-dialog';
import DeleteMultipleDialog from './delete-multiple-dialog';

// ─── Types ────────────────────────────────────────────────────────────────────

type RoleFilter =
    | ''
    | 'field_officer'
    | 'focal_person'
    | 'program_head'
    | 'provincial_director';
type ClusterFilter = '' | 'M&M' | "D'ONE";

interface Filters {
    search?: string;
    role?: string;
    cluster?: string;
    department?: string;
    position?: string;
}

interface HeaderProps {
    selectedUsers: Set<number>;
    filters: Filters;
    departments: string[];
    positions: string[];
    manageUsersUrl: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_OPTIONS: { value: RoleFilter; label: string }[] = [
    { value: '', label: 'All Roles' },
    { value: 'field_officer', label: 'Field Officer' },
    { value: 'focal_person', label: 'Focal Person' },
    { value: 'program_head', label: 'Program Head' },
    { value: 'provincial_director', label: 'Provincial Director' },
];

const CLUSTER_OPTIONS: { value: ClusterFilter; label: string }[] = [
    { value: '', label: 'All Clusters' },
    { value: 'M&M', label: 'M&M' },
    { value: "D'ONE", label: "D'ONE" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Header({
    selectedUsers,
    filters,
    departments,
    positions,
    manageUsersUrl,
}: HeaderProps) {
    const users_id = Array.from(selectedUsers);

    // Local state — mirrors server filters on mount
    const [search, setSearch] = useState(filters.search ?? '');
    const [role, setRole] = useState<RoleFilter>(
        (filters.role as RoleFilter) ?? '',
    );
    const [cluster, setCluster] = useState<ClusterFilter>(
        (filters.cluster as ClusterFilter) ?? '',
    );
    const [department, setDepartment] = useState(filters.department ?? '');
    const [position, setPosition] = useState(filters.position ?? '');
    const [showPanel, setShowPanel] = useState(false);

    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Active filter count ───────────────────────────────────────────────────
    const activeCount = [role, cluster, department, position].filter(
        Boolean,
    ).length;
    const hasAny = !!search || activeCount > 0;

    // ── Fire request ──────────────────────────────────────────────────────────
    const applyFilters = useCallback(
        (
            overrides: Partial<{
                search: string;
                role: string;
                cluster: string;
                department: string;
                position: string;
            }> = {},
        ) => {
            const params: Record<string, string> = {};
            const s =
                overrides.search !== undefined ? overrides.search : search;
            const r = overrides.role !== undefined ? overrides.role : role;
            const c =
                overrides.cluster !== undefined ? overrides.cluster : cluster;
            const d =
                overrides.department !== undefined
                    ? overrides.department
                    : department;
            const p =
                overrides.position !== undefined
                    ? overrides.position
                    : position;

            if (s) params.search = s;
            if (r) params.role = r;
            if (c) params.cluster = c;
            if (d) params.department = d;
            if (p) params.position = p;

            router.get(
                manageUsersUrl,
                { ...params, page: 1 },
                {
                    preserveScroll: true,
                    preserveState: true,
                },
            );
        },
        [search, role, cluster, department, position, manageUsersUrl],
    );

    // Debounced search
    const handleSearchChange = (value: string) => {
        setSearch(value);
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(
            () => applyFilters({ search: value }),
            400,
        );
    };

    const handleRoleChange = (value: RoleFilter) => {
        setRole(value);
        applyFilters({ role: value });
    };

    const handleClusterChange = (value: ClusterFilter) => {
        setCluster(value);
        applyFilters({ cluster: value });
    };

    const handleDepartmentChange = (value: string) => {
        setDepartment(value);
        applyFilters({ department: value });
    };

    const handlePositionChange = (value: string) => {
        setPosition(value);
        applyFilters({ position: value });
    };

    const clearAll = () => {
        setSearch('');
        setRole('');
        setCluster('');
        setDepartment('');
        setPosition('');
        router.get(
            manageUsersUrl,
            { page: 1 },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    useEffect(
        () => () => {
            if (searchTimer.current) clearTimeout(searchTimer.current);
        },
        [],
    );

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="space-y-3">
            {/* ── Top row ───────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <h2 className="font-semibold lg:text-lg">All Users</h2>
                <div className="flex items-center gap-2">
                    <DeleteMultipleDialog users_id={users_id} />
                    <AddUserDialog />
                </div>
            </div>

            {/* ── Filter bar ────────────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative min-w-0 flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Search name, email, employee code…"
                        className="h-9 w-full rounded-lg border bg-card-elevated py-2 pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    {search && (
                        <button
                            onClick={() => handleSearchChange('')}
                            className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                {/* Filters toggle */}
                <button
                    onClick={() => setShowPanel((v) => !v)}
                    className={`relative flex h-9 items-center gap-2 rounded-lg px-3 text-sm transition-colors ${
                        showPanel
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'bg-card-elevated hover:bg-muted'
                    }`}
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="hidden sm:inline">Filters</span>
                    {activeCount > 0 && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                            {activeCount}
                        </span>
                    )}
                </button>

                {/* Clear */}
                {hasAny && (
                    <button
                        onClick={clearAll}
                        className="flex h-9 items-center gap-1.5 rounded-lg border border-dashed px-3 text-xs text-muted-foreground transition-colors hover:border-rose-400 hover:text-rose-500"
                    >
                        <X className="h-3.5 w-3.5" />
                        Clear
                    </button>
                )}
            </div>

            {/* ── Expanded filter panel ─────────────────────────────────────── */}
            {showPanel && (
                <div className="rounded-xl border bg-card p-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Role */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">
                                Role
                            </label>
                            <select
                                value={role}
                                onChange={(e) =>
                                    handleRoleChange(
                                        e.target.value as RoleFilter,
                                    )
                                }
                                className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                            >
                                {ROLE_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Cluster */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">
                                Cluster
                            </label>
                            <select
                                value={cluster}
                                onChange={(e) =>
                                    handleClusterChange(
                                        e.target.value as ClusterFilter,
                                    )
                                }
                                className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                            >
                                {CLUSTER_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Department */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">
                                Department
                            </label>
                            <select
                                value={department}
                                onChange={(e) =>
                                    handleDepartmentChange(e.target.value)
                                }
                                className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                            >
                                <option value="">All Departments</option>
                                {departments.map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Position */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">
                                Position
                            </label>
                            <select
                                value={position}
                                onChange={(e) =>
                                    handlePositionChange(e.target.value)
                                }
                                className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                            >
                                <option value="">All Positions</option>
                                {positions.map((p) => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Active filter chips */}
                    {activeCount > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
                            <span className="text-xs text-muted-foreground">
                                Active:
                            </span>
                            {role && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                    {
                                        ROLE_OPTIONS.find(
                                            (o) => o.value === role,
                                        )?.label
                                    }
                                    <button
                                        onClick={() => handleRoleChange('')}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            {cluster && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                    {cluster}
                                    <button
                                        onClick={() => handleClusterChange('')}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            {department && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                    {department}
                                    <button
                                        onClick={() =>
                                            handleDepartmentChange('')
                                        }
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            {position && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                    {position}
                                    <button
                                        onClick={() => handlePositionChange('')}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
