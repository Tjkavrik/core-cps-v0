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
// `monthlyRate` is the 28-DAY rate (labeled "28-Day" in the UI, never "Monthly").
export const rateCardLines = [
  { classCode: "GEN-25KW", dailyRate: 180, weeklyRate: 540, monthlyRate: 1350, includedHours: 176, overtimeHourRate: 6, deliveryCharge: 100, pickupCharge: 100 },
  { classCode: "GEN-60KW", dailyRate: 250, weeklyRate: 750, monthlyRate: 1875, includedHours: 176, overtimeHourRate: 9, deliveryCharge: 125, pickupCharge: 125 },
  { classCode: "LT-4HEAD", dailyRate: 90, weeklyRate: 270, monthlyRate: 675, includedHours: 176, overtimeHourRate: 3, deliveryCharge: 75, pickupCharge: 75 },
  { classCode: "DIST-BOX-100A", dailyRate: 45, weeklyRate: 135, monthlyRate: 340, includedHours: null, overtimeHourRate: null, deliveryCharge: 50, pickupCharge: 50 },
  { classCode: "AWP-SCIS-40", dailyRate: 210, weeklyRate: 630, monthlyRate: 1575, includedHours: 176, overtimeHourRate: 7, deliveryCharge: 150, pickupCharge: 150 },
  { classCode: "AWP-BOOM-60", dailyRate: 420, weeklyRate: 1260, monthlyRate: 3150, includedHours: 176, overtimeHourRate: 14, deliveryCharge: 250, pickupCharge: 250 },
  { classCode: "AWP-BOOM-80", dailyRate: 620, weeklyRate: 1860, monthlyRate: 4650, includedHours: 176, overtimeHourRate: 20, deliveryCharge: 300, pickupCharge: 300 },
  { classCode: "EARTH-MINI-8K", dailyRate: 320, weeklyRate: 960, monthlyRate: 2400, includedHours: 176, overtimeHourRate: 12, deliveryCharge: 150, pickupCharge: 150 },
  { classCode: "EARTH-SKID", dailyRate: 350, weeklyRate: 1050, monthlyRate: 2625, includedHours: 176, overtimeHourRate: 13, deliveryCharge: 150, pickupCharge: 150 },
  { classCode: "CLIM-HEAT-150", dailyRate: 110, weeklyRate: 330, monthlyRate: 825, includedHours: null, overtimeHourRate: null, deliveryCharge: 75, pickupCharge: 75 },
  { classCode: "CLIM-DEHU-LG", dailyRate: 130, weeklyRate: 390, monthlyRate: 975, includedHours: null, overtimeHourRate: null, deliveryCharge: 75, pickupCharge: 75 },
  { classCode: "SITE-FENCE", dailyRate: 8, weeklyRate: 24, monthlyRate: 60, includedHours: null, overtimeHourRate: null, deliveryCharge: 150, pickupCharge: 150 },
  { classCode: "SITE-JOBBOX", dailyRate: 20, weeklyRate: 60, monthlyRate: 150, includedHours: null, overtimeHourRate: null, deliveryCharge: 75, pickupCharge: 75 },
  { classCode: "SITE-TRLR-10X24", dailyRate: 75, weeklyRate: 225, monthlyRate: 560, includedHours: null, overtimeHourRate: null, deliveryCharge: 350, pickupCharge: 350 },
  { classCode: "MAT-TELE-6K", dailyRate: 340, weeklyRate: 1020, monthlyRate: 2550, includedHours: 176, overtimeHourRate: 12, deliveryCharge: 200, pickupCharge: 200 },
  { classCode: "MAT-PJACK", dailyRate: 20, weeklyRate: 60, monthlyRate: 150, includedHours: null, overtimeHourRate: null, deliveryCharge: 50, pickupCharge: 50 },
  { classCode: "SAF-CONE-SET", dailyRate: 12, weeklyRate: 36, monthlyRate: 90, includedHours: null, overtimeHourRate: null, deliveryCharge: 40, pickupCharge: 40 },
  { classCode: "SAF-BARR", dailyRate: 10, weeklyRate: 30, monthlyRate: 75, includedHours: null, overtimeHourRate: null, deliveryCharge: 40, pickupCharge: 40 },
  { classCode: "TOOL-COMP-185", dailyRate: 150, weeklyRate: 450, monthlyRate: 1125, includedHours: 176, overtimeHourRate: 5, deliveryCharge: 100, pickupCharge: 100 },
  { classCode: "TOOL-VIBR", dailyRate: 35, weeklyRate: 105, monthlyRate: 260, includedHours: null, overtimeHourRate: null, deliveryCharge: 40, pickupCharge: 40 },
];
