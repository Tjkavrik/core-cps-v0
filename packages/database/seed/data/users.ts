/**
 * ============================================================================
 * FICTIONAL / SAMPLE SEED DATA — users, roles, permissions
 * ============================================================================
 * WARNING: Every record below is FICTIONAL prototype data.
 *   - No real CORE Construction employee is represented.
 *   - Passwords are throwaway demo values for local development ONLY.
 *   - This data is intentionally isolated from application logic so it can be
 *     replaced wholesale by approved CORE identity sources later.
 * See docs/assumptions.md (ASSUMPTION-001, ASSUMPTION-010, ASSUMPTION-012)
 * and docs/open-questions.md (Roles & Permissions, IT & Identity).
 * ============================================================================
 */

// Role codes are prototype placeholders — actual CORE roles TBD (ASSUMPTION-010).
// Six confirmed prototype roles (Phase 4 decision).
export const roles = [
  { code: "PROJECT_USER", name: "Project User", description: "Field/project staff who browse the catalog and submit requests.", isSystem: true },
  { code: "CPS_COORDINATOR", name: "CPS Coordinator", description: "Reviews requests, assigns assets, chooses fulfillment.", isSystem: true },
  { code: "CPS_WAREHOUSE", name: "CPS Warehouse / Logistics", description: "Handles delivery, transfer, return, and inspection.", isSystem: true },
  { code: "CPS_MANAGER", name: "CPS Manager", description: "Oversees CPS operations and approvals.", isSystem: true },
  { code: "READ_ONLY", name: "Read-Only Viewer", description: "Read-only access to reporting and dashboards.", isSystem: true },
  { code: "SYSTEM_ADMIN", name: "System Admin", description: "Manages reference data, users, and configuration.", isSystem: true },
];

// Permission set is a provisional starting point for discovery (see open-questions.md).
export const permissions = [
  { code: "CATALOG_READ", name: "Read catalog", resource: "CATALOG", action: "READ" },
  { code: "REQUEST_CREATE", name: "Create request", resource: "REQUEST", action: "CREATE" },
  { code: "REQUEST_READ_OWN", name: "Read own requests", resource: "REQUEST", action: "READ" },
  { code: "REQUEST_READ_ALL", name: "Read all requests", resource: "REQUEST", action: "READ" },
  { code: "REQUEST_REVIEW", name: "Review/assign request", resource: "REQUEST", action: "UPDATE" },
  { code: "REQUEST_FULFILL", name: "Make fulfillment decision", resource: "REQUEST", action: "APPROVE" },
  { code: "ASSET_READ", name: "Read assets", resource: "ASSET", action: "READ" },
  { code: "ASSET_MANAGE", name: "Manage assets (assign/transfer/deliver/return)", resource: "ASSET", action: "UPDATE" },
  { code: "RATE_CARD_READ", name: "Read rate cards", resource: "RATE_CARD", action: "READ" },
  { code: "RATE_CARD_MANAGE", name: "Manage rate cards", resource: "RATE_CARD", action: "UPDATE" },
  { code: "RENTAL_MANAGE", name: "Manage external rentals", resource: "RENTAL", action: "UPDATE" },
  { code: "REPORT_READ", name: "View reports", resource: "REPORT", action: "READ" },
  { code: "ADMIN_MANAGE", name: "Administer reference data & users", resource: "ADMIN", action: "UPDATE" },
];

// Provisional role -> permission mapping (ASSUMPTION-010; validate in Illinois).
export const rolePermissions: Record<string, string[]> = {
  PROJECT_USER: ["CATALOG_READ", "REQUEST_CREATE", "REQUEST_READ_OWN", "ASSET_READ"],
  CPS_COORDINATOR: [
    "CATALOG_READ", "REQUEST_READ_ALL", "REQUEST_REVIEW", "REQUEST_FULFILL",
    "ASSET_READ", "ASSET_MANAGE", "RATE_CARD_READ", "RENTAL_MANAGE", "REPORT_READ",
  ],
  CPS_WAREHOUSE: ["REQUEST_READ_ALL", "ASSET_READ", "ASSET_MANAGE", "REPORT_READ"],
  CPS_MANAGER: [
    "CATALOG_READ", "REQUEST_READ_ALL", "REQUEST_REVIEW", "REQUEST_FULFILL",
    "ASSET_READ", "ASSET_MANAGE", "RATE_CARD_READ", "RATE_CARD_MANAGE",
    "RENTAL_MANAGE", "REPORT_READ",
  ],
  READ_ONLY: ["REQUEST_READ_ALL", "ASSET_READ", "RATE_CARD_READ", "REPORT_READ"],
  SYSTEM_ADMIN: [
    "CATALOG_READ", "REQUEST_READ_ALL", "REQUEST_REVIEW", "REQUEST_FULFILL",
    "ASSET_READ", "ASSET_MANAGE", "RATE_CARD_READ", "RATE_CARD_MANAGE",
    "RENTAL_MANAGE", "REPORT_READ", "ADMIN_MANAGE",
  ],
};

// Demo login accounts (Phase 4 decision). Password for ALL demo users is
// "demo1234" (prototype only). These are NOT real people.
// `projectCodes: "ALL"` grants access to every seeded project.
export const users = [
  { email: "project.user@demo.cps", name: "Alex Rivera", roleCodes: ["PROJECT_USER"], projectCodes: ["DEMO-FL-001", "DEMO-IL-001"] },
  { email: "coordinator@demo.cps", name: "Jordan Hayes", roleCodes: ["CPS_COORDINATOR"], projectCodes: "ALL" as const },
  { email: "warehouse@demo.cps", name: "Sam Chen", roleCodes: ["CPS_WAREHOUSE"], projectCodes: "ALL" as const },
  { email: "manager@demo.cps", name: "Morgan Davis", roleCodes: ["CPS_MANAGER"], projectCodes: "ALL" as const },
  { email: "viewer@demo.cps", name: "Casey Kim", roleCodes: ["READ_ONLY"], projectCodes: "ALL" as const },
  { email: "admin@demo.cps", name: "Taylor Brooks", roleCodes: ["SYSTEM_ADMIN"], projectCodes: "ALL" as const },
];

// Shared demo password (prototype only — never a real credential).
export const DEMO_PASSWORD = "demo1234";
