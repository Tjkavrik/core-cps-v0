import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { RateWarning } from "@/components/ui/RateWarning";
import { money, toNumber, fmtDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminRateCardsPage() {
  const rateCards = await prisma.rateCard.findMany({
    orderBy: { effectiveDate: "desc" },
    include: {
      lines: {
        include: { class: true },
        orderBy: { class: { name: "asc" } },
      },
    },
  });

  return (
    <>
      <PageHeader
        title="Rate Cards"
        subtitle="Sample rate structures — periods use a 28-Day cycle, not calendar months"
      />

      <RateWarning className="mb-4" />

      {rateCards.length === 0 ? (
        <EmptyState icon="💲" title="No rate cards" message="No rate cards are configured." />
      ) : (
        <div className="space-y-6">
          {rateCards.map((rc) => (
            <Card key={rc.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-cps-navy">{rc.name}</h2>
                    <p className="text-xs text-cps-slate">Effective {fmtDate(rc.effectiveDate)}</p>
                  </div>
                  <Badge color={rc.isActive ? "green" : "gray"}>{rc.isActive ? "Active" : "Inactive"}</Badge>
                </div>
              </CardHeader>
              <CardBody className="p-0">
                {rc.lines.length === 0 ? (
                  <p className="px-5 py-4 text-sm text-cps-slate">No rate lines defined.</p>
                ) : (
                  <Table>
                    <THead>
                      <TR>
                        <TH>Equipment Class</TH>
                        <TH>Daily</TH>
                        <TH>Weekly</TH>
                        <TH>28-Day</TH>
                        <TH>Incl. Hours</TH>
                        <TH>OT / Hr</TH>
                        <TH>Delivery</TH>
                        <TH>Pickup</TH>
                      </TR>
                    </THead>
                    <TBody>
                      {rc.lines.map((line) => (
                        <TR key={line.id}>
                          <TD className="font-medium text-cps-navy">{line.class.name}</TD>
                          <TD>{money(line.dailyRate)}</TD>
                          <TD>{money(line.weeklyRate)}</TD>
                          <TD>{money(line.monthlyRate)}</TD>
                          <TD>{toNumber(line.includedHours) ?? "—"}</TD>
                          <TD>{money(line.overtimeHourRate)}</TD>
                          <TD>{money(line.deliveryCharge)}</TD>
                          <TD>{money(line.pickupCharge)}</TD>
                        </TR>
                      ))}
                    </TBody>
                  </Table>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
