/**
 * ============================================================================
 * FICTIONAL / SAMPLE SEED DATA — projects, locations, phase codes, vendors
 * ============================================================================
 * WARNING: FICTIONAL prototype data. No real CORE project, job number, or
 * client is represented. Project code format is provisional (see data-model.md
 * and docs/open-questions.md — Project Access & Authorization).
 * ============================================================================
 */

// Fictional CORE-style projects. `code` format PRJ-YYYY-NNN is provisional.
export const projects = [
  {
    code: "PRJ-2026-001",
    name: "Riverside Medical Center (Demo)",
    description: "Fictional healthcare project used for prototype demonstration.",
    status: "ACTIVE",
    city: "Peoria",
    state: "IL",
    addressLine1: "100 Demo Way",
    postalCode: "61602",
    locations: [
      { name: "Main Gate", isDefault: true },
      { name: "Trailer Row" },
      { name: "Crane Pad" },
    ],
    phaseCodes: [
      { code: "01-100", description: "General Conditions" },
      { code: "02-200", description: "Sitework" },
      { code: "03-300", description: "Concrete" },
    ],
  },
  {
    code: "PRJ-2026-002",
    name: "Lakeshore Office Tower (Demo)",
    description: "Fictional commercial high-rise project for prototype demonstration.",
    status: "ACTIVE",
    city: "Chicago",
    state: "IL",
    addressLine1: "200 Sample Ave",
    postalCode: "60601",
    locations: [
      { name: "Loading Dock", isDefault: true },
      { name: "Tower Core" },
    ],
    phaseCodes: [
      { code: "01-100", description: "General Conditions" },
      { code: "05-500", description: "Structural Steel" },
    ],
  },
  {
    code: "PRJ-2026-003",
    name: "Gulf Coast Distribution Center (Demo)",
    description: "Fictional Florida warehouse project for prototype demonstration.",
    status: "ON_HOLD",
    city: "Tampa",
    state: "FL",
    addressLine1: "300 Placeholder Blvd",
    postalCode: "33602",
    locations: [{ name: "Site Entrance", isDefault: true }],
    phaseCodes: [{ code: "01-100", description: "General Conditions" }],
  },
];

// Fictional vendors used for EXTERNAL fulfillment demonstration only.
export const vendors = [
  { code: "VEND-001", name: "Sample Rental Co. (Demo)", contactName: "Sample Contact", phone: "555-0100", email: "sales@sample-rental.test" },
  { code: "VEND-002", name: "Placeholder Equipment LLC (Demo)", contactName: "Demo Rep", phone: "555-0200", email: "rentals@placeholder-equip.test" },
];
