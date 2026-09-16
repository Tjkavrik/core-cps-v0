import { prisma } from "@/lib/db";

/**
 * Generate a human-friendly, unique-ish document number for the prototype.
 * Format: <PREFIX>-<YYYY>-<NNNN>. Not guaranteed collision-free under heavy
 * concurrency — acceptable for a demo (a production system would use a DB
 * sequence or dedicated numbering service).
 */
export async function nextNumber(prefix: string, count: number): Promise<string> {
  const year = new Date().getFullYear();
  const seq = String(count + 1).padStart(4, "0");
  return `${prefix}-${year}-${seq}`;
}

export async function nextRequestNumber(): Promise<string> {
  const count = await prisma.request.count();
  return nextNumber("REQ", count);
}

export async function nextPoNumber(): Promise<string> {
  const count = await prisma.externalRental.count();
  return nextNumber("PO", count);
}
