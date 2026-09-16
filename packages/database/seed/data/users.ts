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
export const roles = [
  { code: "PROJECT_USER", name: "Project User", description: "Field/project staff who browse the catalog and submit requests.", isSystem: true },
  { code: "CPS_COORDINATOR", name: "CPS Coordinator", description: "Reviews requests, assigns assets, chooses fulfillment.", isSystem: true },
  { code: "WAREHOUSE", name: "Warehouse / Logistics", description: "Handles delivery, transfer, return, and inspection.", isSystem: true },
  { code: "CPS_MANAGER", name: "CPS Manager", description: "Oversees CPS operations and approvals.", isSystem: true },
  { code: "LEADERSHIP", name: "Leadership", description: "Read-mostly access to reporting and dashboards.", isSystem: true },
  { code: "ADMIN", name: "System Administrator", description: "Manages reference data, users, and configuration.", isSystem: true },
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
  WAREHOUSE: ["REQUEST_READ_ALL", "ASSET_READ", "ASSET_MANAGE", "REPORT_READ"],
  CPS_MANAGER: [
    "CATALOG_READ", "REQUEST_READ_ALL", "REQUEST_REVIEW", "REQUEST_FULFILL",
    "ASSET_READ", "ASSET_MANAGE", "RATE_CARD_READ", "RATE_CARD_MANAGE",
    "RENTAL_MANAGE", "REPORT_READ",
  ],
  LEADERSHIP: ["REQUEST_READ_ALL", "ASSET_READ", "RATE_CARD_READ", "REPORT_READ"],
  ADMIN: [
    "CATALOG_READ", "REQUEST_READ_ALL", "REQUEST_REVIEW", "REQUEST_FULFILL",
    "ASSET_READ", "ASSET_MANAGE", "RATE_CARD_READ", "RATE_CARD_MANAGE",
    "RENTAL_MANAGE", "REPORT_READ", "ADMIN_MANAGE",
  ],
};

// Demo login accounts. Password for ALL demo users is "cps-demo-1234" (prototype only).
// These are NOT real people. Do not use in any production context.
export const users = [
  { email: "project.user@example.test", name: "Pat Fielding (Demo Project User)", roleCodes: ["PROJECT_USER"] },
  { email: "coordinator@example.test", name: "Casey Rivera (Demo CPS Coordinator)", roleCodes: ["CPS_COORDINATOR"] },
  { email: "warehouse@example.test", name: "Jordan Lee (Demo Warehouse)", roleCodes: ["WAREHOUSE"] },
  { email: "manager@example.test", name: "Morgan Diaz (Demo CPS Manager)", roleCodes: ["CPS_MANAGER"] },
  { email: "leadership@example.test", name: "Taylor Nguyen (Demo Leadership)", roleCodes: ["LEADERSHIP"] },
  { email: "admin@example.test", name: "Alex Kim (Demo Admin)", roleCodes: ["ADMIN"] },
];

// Shared demo password (prototype only — never a real credential).
export const DEMO_PASSWORD = "cps-demo-1234";
