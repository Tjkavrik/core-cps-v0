/**
 * ============================================================================
 * FICTIONAL / SAMPLE SEED DATA — projects, locations, phase codes, vendors
 * ============================================================================
 * WARNING: FICTIONAL prototype data. No real CORE project, job number, or
 * client is represented. Project code format is provisional (see data-model.md
 * and docs/open-questions.md — Project Access & Authorization).
 * ============================================================================
 */

// Fictional CORE-style demo projects (Phase 4 decision). `code` uses a clearly
// fictional DEMO-{STATE}-{NNN} format so demo data is never mistaken for real
// CORE jobs.
export const projects = [
  {
    code: "DEMO-FL-001",
    name: "South Florida Public Safety Center",
    description: "Fictional public-safety facility used for prototype demonstration.",
    status: "ACTIVE",
    city: "Miami",
    state: "FL",
    addressLine1: "100 Demo Way",
    postalCode: "33101",
    locations: [
      { name: "Main Entrance", isDefault: true },
      { name: "Crane Pad" },
      { name: "Office Trailers" },
    ],
    phaseCodes: [
      { code: "01-GENERAL", description: "General Conditions" },
      { code: "02-CONCRETE", description: "Concrete" },
      { code: "03-STEEL", description: "Structural Steel" },
      { code: "04-MEP", description: "Mechanical / Electrical / Plumbing" },
    ],
  },
  {
    code: "DEMO-FL-002",
    name: "Coastal High School",
    description: "Fictional education project for prototype demonstration.",
    status: "ACTIVE",
    city: "Fort Lauderdale",
    state: "FL",
    addressLine1: "200 Sample Ave",
    postalCode: "33301",
    locations: [
      { name: "Main Entrance", isDefault: true },
      { name: "Athletic Field" },
      { name: "Office Trailers" },
    ],
    phaseCodes: [
      { code: "01-GENERAL", description: "General Conditions" },
      { code: "02-CONCRETE", description: "Concrete" },
      { code: "04-MEP", description: "Mechanical / Electrical / Plumbing" },
    ],
  },
  {
    code: "DEMO-FL-003",
    name: "South Florida Municipal Complex",
    description: "Fictional municipal complex for prototype demonstration.",
    status: "ACTIVE",
    city: "Boca Raton",
    state: "FL",
    addressLine1: "300 Placeholder Blvd",
    postalCode: "33431",
    locations: [
      { name: "Main Entrance", isDefault: true },
      { name: "Parking Structure" },
    ],
    phaseCodes: [
      { code: "01-GENERAL", description: "General Conditions" },
      { code: "03-STEEL", description: "Structural Steel" },
    ],
  },
  {
    code: "DEMO-IL-001",
    name: "Midwest Operations Facility",
    description: "Fictional operations facility for prototype demonstration.",
    status: "ACTIVE",
    city: "Chicago",
    state: "IL",
    addressLine1: "400 Example Rd",
    postalCode: "60601",
    locations: [
      { name: "Loading Dock", isDefault: true },
      { name: "Crane Pad" },
      { name: "Office Trailers" },
    ],
    phaseCodes: [
      { code: "01-GENERAL", description: "General Conditions" },
      { code: "02-CONCRETE", description: "Concrete" },
      { code: "03-STEEL", description: "Structural Steel" },
      { code: "04-MEP", description: "Mechanical / Electrical / Plumbing" },
    ],
  },
  {
    code: "DEMO-IL-002",
    name: "Chicago Medical Pavilion",
    description: "Fictional healthcare project for prototype demonstration.",
    status: "ACTIVE",
    city: "Chicago",
    state: "IL",
    addressLine1: "500 Demo Plaza",
    postalCode: "60602",
    locations: [
      { name: "Main Entrance", isDefault: true },
      { name: "Office Trailers" },
    ],
    phaseCodes: [
      { code: "01-GENERAL", description: "General Conditions" },
      { code: "04-MEP", description: "Mechanical / Electrical / Plumbing" },
    ],
  },
  {
    code: "DEMO-IL-003",
    name: "Illinois Distribution Hub",
    description: "Fictional distribution/warehouse project for prototype demonstration.",
    status: "ACTIVE",
    city: "Joliet",
    state: "IL",
    addressLine1: "600 Placeholder Pkwy",
    postalCode: "60431",
    locations: [
      { name: "Site Entrance", isDefault: true },
      { name: "Crane Pad" },
      { name: "Office Trailers" },
    ],
    phaseCodes: [
      { code: "01-GENERAL", description: "General Conditions" },
      { code: "02-CONCRETE", description: "Concrete" },
      { code: "03-STEEL", description: "Structural Steel" },
    ],
  },
];

// Fictional vendors used for EXTERNAL fulfillment demonstration only.
export const vendors = [
  { code: "VEND-001", name: "Sample Rental Co. (Demo)", contactName: "Sample Contact", phone: "555-0100", email: "sales@sample-rental.test" },
  { code: "VEND-002", name: "Placeholder Equipment LLC (Demo)", contactName: "Demo Rep", phone: "555-0200", email: "rentals@placeholder-equip.test" },
];
