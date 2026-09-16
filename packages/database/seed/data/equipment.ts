/**
 * ============================================================================
 * FICTIONAL / SAMPLE SEED DATA — equipment categories, classes, assets
 * ============================================================================
 * WARNING: FICTIONAL prototype data.
 *   - Category taxonomy is derived from general construction practice and
 *     public Blue Hat research (see docs/research/bluehat-research.md).
 *     Actual CPS classifications must be validated in Illinois (ASSUMPTION-005).
 *   - Asset numbers use provisional format CPS-{TYPE}-{NNNN} (ASSUMPTION-013).
 *   - No real CORE assets, serial numbers, or fleet data are represented.
 * ============================================================================
 */

// Top-level categories (provisional taxonomy — validate with CPS).
export const categories = [
  { code: "POWER_LIGHT", name: "Power & Light", sortOrder: 10 },
  { code: "AERIAL", name: "Aerial Work Platforms", sortOrder: 20 },
  { code: "EARTHMOVING", name: "Earthmoving", sortOrder: 30 },
  { code: "CLIMATE", name: "Climate Control", sortOrder: 40 },
  { code: "SITE_SETUP", name: "Site Setup", sortOrder: 50 },
  { code: "MATERIAL_HANDLING", name: "Material Handling", sortOrder: 60 },
  { code: "SAFETY", name: "Safety", sortOrder: 70 },
  { code: "SMALL_TOOLS", name: "Small Tools", sortOrder: 80 },
];

// Equipment classes = the "type" of machine (rate + catalog level), NOT an
// individual serialized asset. Rates attach to classes, not to assets.
export const equipmentClasses = [
  // Power & Light
  { code: "GEN-25KW", categoryCode: "POWER_LIGHT", name: "25 kW Generator", description: "Towable diesel generator, 25 kW output. Common for temporary power and small trailers.", specifications: { outputKw: 25, fuel: "Diesel", towable: true } },
  { code: "GEN-60KW", categoryCode: "POWER_LIGHT", name: "60 kW Generator", description: "Towable diesel generator, 60 kW output. For larger temporary power loads.", specifications: { outputKw: 60, fuel: "Diesel", towable: true } },
  { code: "LT-4HEAD", categoryCode: "POWER_LIGHT", name: "Light Tower (4-Head)", description: "Towable LED light tower with four adjustable heads.", specifications: { lamps: 4, fuel: "Diesel", towable: true } },
  { code: "DIST-BOX-100A", categoryCode: "POWER_LIGHT", name: "Power Distribution Box (100A)", description: "Temporary power distribution box, 100A service.", specifications: { amperage: 100 } },

  // Aerial Work Platforms
  { code: "AWP-SCIS-40", categoryCode: "AERIAL", name: "40 ft Scissor Lift", description: "Electric scissor lift, 40 ft platform height.", specifications: { platformHeightFt: 40, power: "Electric" } },
  { code: "AWP-BOOM-60", categoryCode: "AERIAL", name: "60 ft Boom Lift", description: "Self-propelled articulating boom lift, 60 ft.", specifications: { platformHeightFt: 60, type: "Articulating" } },
  { code: "AWP-BOOM-80", categoryCode: "AERIAL", name: "80 ft Boom Lift", description: "Self-propelled telescopic boom lift, 80 ft.", specifications: { platformHeightFt: 80, type: "Telescopic" } },

  // Earthmoving
  { code: "EARTH-MINI-8K", categoryCode: "EARTHMOVING", name: "Mini Excavator (7-8k)", description: "Compact excavator, ~7,000-8,000 lb class.", specifications: { operatingWeightLb: 8000, fuel: "Diesel" } },
  { code: "EARTH-SKID", categoryCode: "EARTHMOVING", name: "Skid Steer", description: "Compact skid steer loader.", specifications: { fuel: "Diesel" } },

  // Climate Control
  { code: "CLIM-HEAT-150", categoryCode: "CLIMATE", name: "Portable Heater (150k BTU)", description: "Indirect-fired portable construction heater.", specifications: { btu: 150000, fuel: "Diesel" } },
  { code: "CLIM-DEHU-LG", categoryCode: "CLIMATE", name: "Dehumidifier (Large)", description: "Large-capacity portable dehumidifier for dry-out.", specifications: { capacityPPD: 250 } },

  // Site Setup
  { code: "SITE-FENCE", categoryCode: "SITE_SETUP", name: "Construction Fence Panel", description: "Temporary chain-link fence panel with base.", specifications: { sizeFt: "6x12" } },
  { code: "SITE-JOBBOX", categoryCode: "SITE_SETUP", name: "Job Box (Heavy Duty)", description: "Lockable heavy-duty jobsite storage box.", specifications: { sizeFt: "4x2x2" } },
  { code: "SITE-TRLR-10X24", categoryCode: "SITE_SETUP", name: "Temporary Office Trailer (10x24)", description: "Jobsite office trailer, 10 ft x 24 ft.", specifications: { sizeFt: "10x24" } },

  // Material Handling
  { code: "MAT-TELE-6K", categoryCode: "MATERIAL_HANDLING", name: "Telehandler (6k)", description: "Rough-terrain telehandler, 6,000 lb capacity.", specifications: { capacityLb: 6000 } },
  { code: "MAT-PJACK", categoryCode: "MATERIAL_HANDLING", name: "Pallet Jack", description: "Manual pallet jack.", specifications: { capacityLb: 5500 } },

  // Safety
  { code: "SAF-CONE-SET", categoryCode: "SAFETY", name: "Traffic Cone Set", description: "Set of reflective traffic cones.", specifications: { quantity: 25 } },
  { code: "SAF-BARR", categoryCode: "SAFETY", name: "Barricade (Water-Filled)", description: "Water-filled traffic barricade.", specifications: { material: "HDPE" } },

  // Small Tools
  { code: "TOOL-COMP-185", categoryCode: "SMALL_TOOLS", name: "Air Compressor (185 CFM)", description: "Towable diesel air compressor, 185 CFM.", specifications: { cfm: 185, fuel: "Diesel", towable: true } },
  { code: "TOOL-VIBR", categoryCode: "SMALL_TOOLS", name: "Concrete Vibrator", description: "Portable concrete vibrator.", specifications: { power: "Electric" } },
];

// Relationships between classes (accessories / commonly used together).
export const classRelations = [
  { sourceCode: "GEN-25KW", targetCode: "LT-4HEAD", relationType: "COMMONLY_USED_WITH" },
  { sourceCode: "GEN-25KW", targetCode: "DIST-BOX-100A", relationType: "COMMONLY_USED_WITH" },
  { sourceCode: "AWP-BOOM-60", targetCode: "GEN-25KW", relationType: "COMMONLY_USED_WITH" },
  { sourceCode: "SITE-TRLR-10X24", targetCode: "GEN-25KW", relationType: "REQUIRES" },
  { sourceCode: "CLIM-HEAT-150", targetCode: "GEN-60KW", relationType: "COMMONLY_USED_WITH" },
];

// Individual serialized assets. FICTIONAL. assetNumber format CPS-{TYPE}-{NNNN}
// is provisional (ASSUMPTION-013). status is one of the schema status values.
// A mix of statuses is used to demonstrate operational workflows.
export const assets = [
  { assetNumber: "CPS-GEN-0001", classCode: "GEN-25KW", serialNumber: "SN-GEN-0001", make: "SampleMake", model: "G25", year: 2022, status: "AVAILABLE", locationCode: "WH-IL-01" },
  { assetNumber: "CPS-GEN-0002", classCode: "GEN-25KW", serialNumber: "SN-GEN-0002", make: "SampleMake", model: "G25", year: 2023, status: "ASSIGNED", locationCode: "WH-IL-01" },
  { assetNumber: "CPS-GEN-0003", classCode: "GEN-60KW", serialNumber: "SN-GEN-0003", make: "SampleMake", model: "G60", year: 2023, status: "AVAILABLE", locationCode: "YARD-IL-01" },
  { assetNumber: "CPS-AWP-0001", classCode: "AWP-SCIS-40", serialNumber: "SN-AWP-0001", make: "SampleMake", model: "S40", year: 2022, status: "AVAILABLE", locationCode: "WH-IL-01" },
  { assetNumber: "CPS-AWP-0002", classCode: "AWP-SCIS-40", serialNumber: "SN-AWP-0002", make: "SampleMake", model: "S40", year: 2023, status: "MAINTENANCE", locationCode: "WH-IL-01" },
  { assetNumber: "CPS-AWP-0003", classCode: "AWP-BOOM-60", serialNumber: "SN-AWP-0003", make: "SampleMake", model: "B60", year: 2021, status: "ASSIGNED", locationCode: "WH-IL-01" },
  { assetNumber: "CPS-ERT-0001", classCode: "EARTH-MINI-8K", serialNumber: "SN-ERT-0001", make: "SampleMake", model: "MX80", year: 2022, status: "IN_TRANSFER", locationCode: "YARD-IL-01" },
  { assetNumber: "CPS-LTR-0001", classCode: "LT-4HEAD", serialNumber: "SN-LTR-0001", make: "SampleMake", model: "LT4", year: 2020, status: "AVAILABLE", locationCode: "YARD-IL-01" },
  { assetNumber: "CPS-LTR-0002", classCode: "LT-4HEAD", serialNumber: "SN-LTR-0002", make: "SampleMake", model: "LT4", year: 2021, status: "AVAILABLE", locationCode: "YARD-IL-01" },
  { assetNumber: "CPS-MAT-0001", classCode: "MAT-TELE-6K", serialNumber: "SN-MAT-0001", make: "SampleMake", model: "T60", year: 2022, status: "AVAILABLE", locationCode: "WH-IL-01" },
];

// Locations (warehouses/yards). FICTIONAL addresses.
export const locations = [
  { code: "WH-IL-01", name: "Illinois Warehouse (Demo)", type: "WAREHOUSE", city: "Chicago", state: "IL" },
  { code: "YARD-IL-01", name: "Illinois Yard (Demo)", type: "YARD", city: "Joliet", state: "IL" },
  { code: "WH-FL-01", name: "Florida Warehouse (Demo)", type: "WAREHOUSE", city: "Miami", state: "FL" },
];
