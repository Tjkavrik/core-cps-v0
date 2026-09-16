/**
 * ============================================================================
 * FICTIONAL / SAMPLE SEED DATA — rate cards
 * ============================================================================
 * WARNING: EVERY RATE BELOW IS FICTIONAL AND INVENTED FOR THE PROTOTYPE.
 *   - No value here represents an actual CORE or CPS rate.
 *   - The daily / weekly / 28-day structure is INSPIRED BY public Blue Hat
 *     research (see docs/research/bluehat-research.md) and is NOT confirmed
 *     CPS methodology (ASSUMPTION-003, ASSUMPTION-004).
 *   - `includedHours` / overtime are placeholders; the real 176-hour/28-day
 *     mechanics and thresholds are UNKNOWN and must be validated in Illinois.
 * Rate methodology is an OPEN QUESTION (see docs/open-questions.md — Rates & Billing).
 * ============================================================================
 */

export const rateCard = {
  name: "Prototype Sample Rate Card (FICTIONAL)",
  description:
    "Fictional placeholder rates for demonstration only. Not CORE rates. " +
    "Structure inspired by public Blue Hat research; methodology unconfirmed.",
  effectiveDate: new Date("2026-01-01T00:00:00.000Z"),
  // No expirationDate — this is the current sample card.
};

// classCode maps to EquipmentClass.code. All amounts are FICTIONAL.
export const rateCardLines = [
  { classCode: "EXC-MINI-8K", dailyRate: 320, weeklyRate: 960, monthlyRate: 2400, includedHours: 176, overtimeHourRate: 12, deliveryCharge: 150, pickupCharge: 150 },
  { classCode: "EXC-MINI-12K", dailyRate: 400, weeklyRate: 1200, monthlyRate: 3000, includedHours: 176, overtimeHourRate: 14, deliveryCharge: 175, pickupCharge: 175 },
  { classCode: "SKID-TRACK", dailyRate: 350, weeklyRate: 1050, monthlyRate: 2625, includedHours: 176, overtimeHourRate: 13, deliveryCharge: 150, pickupCharge: 150 },
  { classCode: "GEN-25KW", dailyRate: 180, weeklyRate: 540, monthlyRate: 1350, includedHours: 176, overtimeHourRate: 6, deliveryCharge: 100, pickupCharge: 100 },
  { classCode: "GEN-70KW", dailyRate: 260, weeklyRate: 780, monthlyRate: 1950, includedHours: 176, overtimeHourRate: 9, deliveryCharge: 125, pickupCharge: 125 },
  { classCode: "LIGHT-TOWER", dailyRate: 90, weeklyRate: 270, monthlyRate: 675, includedHours: 176, overtimeHourRate: 3, deliveryCharge: 75, pickupCharge: 75 },
  { classCode: "BOOM-40", dailyRate: 300, weeklyRate: 900, monthlyRate: 2250, includedHours: 176, overtimeHourRate: 10, deliveryCharge: 200, pickupCharge: 200 },
  { classCode: "SCISSOR-26", dailyRate: 140, weeklyRate: 420, monthlyRate: 1050, includedHours: 176, overtimeHourRate: 5, deliveryCharge: 125, pickupCharge: 125 },
  { classCode: "FORK-5K", dailyRate: 220, weeklyRate: 660, monthlyRate: 1650, includedHours: 176, overtimeHourRate: 8, deliveryCharge: 150, pickupCharge: 150 },
  { classCode: "TELEHANDLER-10K", dailyRate: 380, weeklyRate: 1140, monthlyRate: 2850, includedHours: 176, overtimeHourRate: 13, deliveryCharge: 200, pickupCharge: 200 },
  { classCode: "COMPACTOR-PLATE", dailyRate: 70, weeklyRate: 210, monthlyRate: 525, includedHours: 176, overtimeHourRate: 2, deliveryCharge: 50, pickupCharge: 50 },
  { classCode: "PUMP-2IN", dailyRate: 60, weeklyRate: 180, monthlyRate: 450, includedHours: 176, overtimeHourRate: 2, deliveryCharge: 50, pickupCharge: 50 },
  { classCode: "OFFICE-TRAILER", dailyRate: 55, weeklyRate: 165, monthlyRate: 415, includedHours: null, overtimeHourRate: null, deliveryCharge: 300, pickupCharge: 300 },
  { classCode: "STORAGE-CONTAINER", dailyRate: 25, weeklyRate: 75, monthlyRate: 190, includedHours: null, overtimeHourRate: null, deliveryCharge: 250, pickupCharge: 250 },
];
