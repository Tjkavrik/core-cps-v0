import type { NavItem } from "@/components/AppShell";

export const PROJECT_NAV: NavItem[] = [
  { label: "Home", href: "/home", icon: "🏠" },
  { label: "Browse Equipment", href: "/catalog", icon: "🔧" },
  { label: "My Requests", href: "/requests", icon: "📋" },
  { label: "My Equipment", href: "/equipment", icon: "🏗️" },
  { label: "I Don't See What I Need", href: "/request/new/freeform", icon: "📝" },
];

export const OPS_NAV: NavItem[] = [
  { label: "Dashboard", href: "/ops/dashboard", icon: "📊" },
  { label: "Requests", href: "/ops/requests", icon: "📋", badgeKey: "pendingRequests" },
  { label: "Assets", href: "/ops/assets", icon: "🚜" },
  { label: "Assignments", href: "/ops/assignments", icon: "🔗" },
  { label: "Transfers", href: "/ops/transfers", icon: "🔄" },
  { label: "Returns", href: "/ops/returns", icon: "↩️", badgeKey: "returns" },
  { label: "Inspections", href: "/ops/inspections", icon: "🔍", badgeKey: "inspections" },
  { label: "External Rentals", href: "/ops/rentals", icon: "🏢" },
  { label: "Maintenance", href: "/ops/maintenance", icon: "🛠️" },
  { label: "Reports", href: "/ops/reports", icon: "📈" },
];

export const ADMIN_NAV: NavItem[] = [
  { label: "Users", href: "/admin/users", icon: "👥" },
  { label: "Projects", href: "/admin/projects", icon: "🏗️" },
  { label: "Equipment", href: "/admin/equipment", icon: "🔧" },
  { label: "Assets", href: "/admin/assets", icon: "🚜" },
  { label: "Vendors", href: "/admin/vendors", icon: "🏢" },
  { label: "Rate Cards", href: "/admin/ratecards", icon: "💲" },
  { label: "Roles", href: "/admin/roles", icon: "🔐" },
];

export const VIEWER_NAV: NavItem[] = [{ label: "Dashboard", href: "/viewer/dashboard", icon: "📊" }];
