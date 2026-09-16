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
  { code: "EARTHMOVING", name: "Earthmoving", sortOrder: 10 },
  { code: "POWER_LIGHT", name: "Power & Light", sortOrder: 20 },
  { code: "AERIAL", name: "Aerial Work Platforms", sortOrder: 30 },
  { code: "MATERIAL_HANDLING", name: "Forklifts & Material Handling", sortOrder: 40 },
  { code: "SITE_SETUP", name: "Site Setup", sortOrder: 50 },
  { code: "GENERAL", name: "General Equipment", sortOrder: 60 },
];

// Equipment classes = the "type" of machine (rate + catalog level), NOT an
// individual serialized asset. Rates attach to classes, not to assets.
export const equipmentClasses = [
  { code: "EXC-MINI-8K", categoryCode: "EARTHMOVING", name: "Mini Excavator (8K)", description: "Compact excavator, ~8,000 lb class.", specifications: { operatingWeightLb: 8000, fuel: "Diesel" } },
  { code: "EXC-MINI-12K", categoryCode: "EARTHMOVING", name: "Mini Excavator (10-12K)", description: "Compact excavator, 10-12K lb class.", specifications: { operatingWeightLb: 12000, fuel: "Diesel" } },
  { code: "SKID-TRACK", categoryCode: "EARTHMOVING", name: "Track Skid Steer", description: "Compact track loader.", specifications: { fuel: "Diesel" } },
  { code: "GEN-25KW", categoryCode: "POWER_LIGHT", name: "25 kW Generator", description: "Towable diesel generator, 25 kW.", specifications: { outputKw: 25, fuel: "Diesel" } },
  { code: "GEN-70KW", categoryCode: "POWER_LIGHT", name: "70 kW Generator", description: "Towable diesel generator, 70 kW.", specifications: { outputKw: 70, fuel: "Diesel" } },
  { code: "LIGHT-TOWER", categoryCode: "POWER_LIGHT", name: "Light Tower", description: "Towable LED light tower.", specifications: { lamps: 4, fuel: "Diesel" } },
  { code: "BOOM-40", categoryCode: "AERIAL", name: "40 ft Articulating Boom Lift", description: "Self-propelled articulating boom lift.", specifications: { platformHeightFt: 40 } },
  { code: "SCISSOR-26", categoryCode: "AERIAL", name: "26 ft Scissor Lift", description: "Electric scissor lift.", specifications: { platformHeightFt: 26, power: "Electric" } },
  { code: "FORK-5K", categoryCode: "MATERIAL_HANDLING", name: "5,000 lb Forklift", description: "Warehouse/rough-terrain forklift, 5K capacity.", specifications: { capacityLb: 5000 } },
  { code: "TELEHANDLER-10K", categoryCode: "MATERIAL_HANDLING", name: "10,000 lb Telehandler", description: "Rough-terrain telehandler.", specifications: { capacityLb: 10000 } },
  { code: "OFFICE-TRAILER", categoryCode: "SITE_SETUP", name: "Office Trailer (8x20)", description: "Jobsite office trailer.", specifications: { sizeFt: "8x20" } },
  { code: "STORAGE-CONTAINER", categoryCode: "SITE_SETUP", name: "Storage Container (20 ft)", description: "Lockable steel storage container.", specifications: { sizeFt: "20" } },
  { code: "COMPACTOR-PLATE", categoryCode: "GENERAL", name: "Plate Compactor", description: "Gas plate compactor.", specifications: { fuel: "Gas" } },
  { code: "PUMP-2IN", categoryCode: "GENERAL", name: '2" Trash Pump', description: "Portable trash/dewatering pump.", specifications: { inletIn: 2 } },
];

// Relationships between classes (accessories / commonly used together).
export const classRelations = [
  { sourceCode: "GEN-25KW", targetCode: "LIGHT-TOWER", relationType: "COMMONLY_USED_WITH" },
  { sourceCode: "BOOM-40", targetCode: "GEN-25KW", relationType: "COMMONLY_USED_WITH" },
  { sourceCode: "PUMP-2IN", targetCode: "GEN-25KW", relationType: "REQUIRES" },
];

// Individual serialized assets. FICTIONAL. assetNumber format CPS-{TYPE}-{NNNN}
// is provisional (ASSUMPTION-013). status is one of the schema status values.
export const assets = [
  { assetNumber: "CPS-EXC-0001", classCode: "EXC-MINI-8K", serialNumber: "SN-EXC-0001", make: "SampleMake", model: "MX80", year: 2022, status: "AVAILABLE", locationCode: "WH-IL-01" },
  { assetNumber: "CPS-EXC-0002", classCode: "EXC-MINI-12K", serialNumber: "SN-EXC-0002", make: "SampleMake", model: "MX120", year: 2023, status: "AVAILABLE", locationCode: "WH-IL-01" },
  { assetNumber: "CPS-SKID-0001", classCode: "SKID-TRACK", serialNumber: "SN-SKID-0001", make: "SampleMake", model: "TS75", year: 2021, status: "MAINTENANCE", locationCode: "WH-IL-01" },
  { assetNumber: "CPS-GEN-0001", classCode: "GEN-25KW", serialNumber: "SN-GEN-0001", make: "SampleMake", model: "G25", year: 2022, status: "AVAILABLE", locationCode: "WH-IL-01" },
  { assetNumber: "CPS-GEN-0002", classCode: "GEN-70KW", serialNumber: "SN-GEN-0002", make: "SampleMake", model: "G70", year: 2023, status: "AVAILABLE", locationCode: "YARD-IL-01" },
  { assetNumber: "CPS-LT-0001", classCode: "LIGHT-TOWER", serialNumber: "SN-LT-0001", make: "SampleMake", model: "LT4", year: 2020, status: "AVAILABLE", locationCode: "YARD-IL-01" },
  { assetNumber: "CPS-BOOM-0001", classCode: "BOOM-40", serialNumber: "SN-BOOM-0001", make: "SampleMake", model: "B40", year: 2022, status: "AVAILABLE", locationCode: "WH-IL-01" },
  { assetNumber: "CPS-SCIS-0001", classCode: "SCISSOR-26", serialNumber: "SN-SCIS-0001", make: "SampleMake", model: "S26", year: 2023, status: "AVAILABLE", locationCode: "WH-IL-01" },
  { assetNumber: "CPS-FORK-0001", classCode: "FORK-5K", serialNumber: "SN-FORK-0001", make: "SampleMake", model: "F50", year: 2021, status: "AVAILABLE", locationCode: "WH-IL-01" },
  { assetNumber: "CPS-TELE-0001", classCode: "TELEHANDLER-10K", serialNumber: "SN-TELE-0001", make: "SampleMake", model: "T100", year: 2022, status: "AVAILABLE", locationCode: "YARD-IL-01" },
  { assetNumber: "CPS-PUMP-0001", classCode: "PUMP-2IN", serialNumber: "SN-PUMP-0001", make: "SampleMake", model: "P2", year: 2023, status: "AVAILABLE", locationCode: "WH-IL-01" },
  { assetNumber: "CPS-CONT-0001", classCode: "STORAGE-CONTAINER", serialNumber: "SN-CONT-0001", make: "SampleMake", model: "C20", year: 2019, status: "AVAILABLE", locationCode: "YARD-IL-01" },
];

// Locations (warehouses/yards). FICTIONAL addresses.
export const locations = [
  { code: "WH-IL-01", name: "Illinois Warehouse (Demo)", type: "WAREHOUSE", city: "Peoria", state: "IL" },
  { code: "YARD-IL-01", name: "Illinois Yard (Demo)", type: "YARD", city: "Peoria", state: "IL" },
  { code: "WH-FL-01", name: "Florida Warehouse (Demo)", type: "WAREHOUSE", city: "Tampa", state: "FL" },
];
