# Open Questions Register — CORE CPS V0.1

**Status:** Living document. These are unresolved questions that shape the
product. Each has an ID, the question, why it matters, who likely answers it, and
the current prototype behavior/assumption. Nothing here is hard-coded as a
business rule; where reasonable it is configurable until resolved.

**Legend — likely owner:** CPS = CPS operations (Illinois/Florida),
ACCT = Accounting, IT = CORE IT, LEAD = Leadership, LEGAL = Legal/Compliance.

---

## Request & Approval Workflow
| ID | Question | Why it matters | Owner | Current prototype behavior |
|----|----------|----------------|-------|----------------------------|
| OQ-001 | Who is allowed to submit requests? | Determines role/permission design | CPS/LEAD | Any Project User may submit (ASSUMPTION-011) |
| OQ-002 | Who approves requests, and in what stages? | Defines approval workflow | CPS/LEAD | Single-stage CPS Coordinator review (ASSUMPTION-006) |
| OQ-003 | Are there approval thresholds (value/duration)? | Controls/segregation of duties | ACCT/LEAD | None enforced |
| OQ-004 | Is partial fulfillment allowed? | Line-item status model | CPS | Supported in schema; rules undefined |
| OQ-005 | Can requests be edited/cancelled after submission, and by whom? | Status transitions & audit | CPS | Status transitions exist; policy undefined |

## Project Access & Authorization
| ID | Question | Why it matters | Owner | Current prototype behavior |
|----|----------|----------------|-------|----------------------------|
| OQ-010 | What is the source of truth for projects and job codes? | Integration & data ownership | IT/CPS | Manual seed data |
| OQ-011 | Who grants a user access to a project? | Authorization workflow | IT/CPS | Manual by Admin (ASSUMPTION-002) |
| OQ-012 | How are phase/cost codes validated? | Cost attribution accuracy | ACCT/IT | Free per-project seed codes |
| OQ-013 | Can external parties (subs/owners) have access? | Identity & security scope | IT/LEGAL | Not modeled |

## Rates & Billing
| ID | Question | Why it matters | Owner | Current prototype behavior |
|----|----------|----------------|-------|----------------------------|
| OQ-020 | How are rates set (internal transfer vs external)? | Core commercial model | ACCT/CPS | Fictional sample rates (ASSUMPTION-004) |
| OQ-021 | What event starts billing? | Revenue/cost accuracy | ACCT/CPS | Assumed delivery date (ASSUMPTION-007) |
| OQ-022 | What event stops billing? | Revenue/cost accuracy | ACCT/CPS | Assumed receipt + inspection (ASSUMPTION-008) |
| OQ-023 | How are transportation charges structured? | Cost model | ACCT/CPS | Fields exist; amounts fictional (ASSUMPTION-009) |
| OQ-024 | How are damage chargebacks handled? | Liability & billing | ACCT/CPS/LEGAL | DamageRecord exists; no billing |
| OQ-025 | What is the rate period definition (176-hr/28-day?) | Overtime & proration | ACCT/CPS | Placeholder included hours (ASSUMPTION-003) |

## Asset Management
| ID | Question | Why it matters | Owner | Current prototype behavior |
|----|----------|----------------|-------|----------------------------|
| OQ-030 | What is the asset numbering standard? | Identity & interoperability | CPS | `CPS-{TYPE}-{NNNN}` (ASSUMPTION-013) |
| OQ-031 | What inspections are required, and when? | Compliance & condition | CPS | Inspection types modeled; rules undefined |
| OQ-032 | Who is responsible for maintenance (in-house vs vendor)? | Ops & cost | CPS | MaintenanceRecord exists; policy undefined |
| OQ-033 | Are PM schedules by hours, calendar, or both? | Maintenance triggers | CPS | Not enforced |

## External Rentals
| ID | Question | Why it matters | Owner | Current prototype behavior |
|----|----------|----------------|-------|----------------------------|
| OQ-040 | Does CPS have authority to rent externally? | Process ownership | CPS/LEAD | Assumed yes (ASSUMPTION-014) |
| OQ-041 | How are vendors selected/approved? | Procurement controls | CPS/ACCT | Vendor list; no rules |
| OQ-042 | What is the purchase-order process? | Financial controls | ACCT | `poNumber` field only |
| OQ-043 | What reason codes apply to external rentals? | Reporting & analysis | CPS | Provisional codes (ASSUMPTION-015) |

## Fulfillment
| ID | Question | Why it matters | Owner | Current prototype behavior |
|----|----------|----------------|-------|----------------------------|
| OQ-050 | How does CPS choose owned vs transfer vs external? | Allocation logic | CPS | Manual; no precedence rule |
| OQ-051 | What is allocation precedence when stock is short? | Fulfillment fairness | CPS | Undefined |
| OQ-052 | Are substitutions allowed? | Catalog & fulfillment | CPS | Not modeled |

## Accounting & ERP Integration
| ID | Question | Why it matters | Owner | Current prototype behavior |
|----|----------|----------------|-------|----------------------------|
| OQ-060 | What is the ERP/accounting system of record? | Integration design | IT/ACCT | Unknown; fields reserved |
| OQ-061 | Where do cost codes originate? | Cost attribution | ACCT/IT | Manual seed |
| OQ-062 | How/when are costs posted? | Financial accuracy | ACCT | Not implemented (ASSUMPTION-016) |
| OQ-063 | How is owner reimbursement handled? | Commercial model | ACCT/LEGAL | Not modeled |

## Roles & Permissions
| ID | Question | Why it matters | Owner | Current prototype behavior |
|----|----------|----------------|-------|----------------------------|
| OQ-070 | What are the real CORE/CPS roles? | Access control | CPS/IT | Six prototype roles (ASSUMPTION-010) |
| OQ-071 | Who can do what (permission matrix)? | Security | CPS/IT | Provisional mapping |
| OQ-072 | What approval limits apply per role? | Controls | LEAD/ACCT | None |
| OQ-073 | What segregation-of-duties rules apply? | Audit/compliance | ACCT/LEGAL | None enforced |

## IT & Identity
| ID | Question | Why it matters | Owner | Current prototype behavior |
|----|----------|----------------|-------|----------------------------|
| OQ-080 | What identity provider will be used? | SSO integration | IT | Prototype credentials (ASSUMPTION-001) |
| OQ-081 | What is the authoritative project data source? | Integration | IT | Manual seed |
| OQ-082 | What ERP system is in use? | Integration | IT | Unknown |
| OQ-083 | What are hosting requirements (cloud/on-prem, region)? | Deployment | IT | Portable; TBD |

## Legal & Compliance
| ID | Question | Why it matters | Owner | Current prototype behavior |
|----|----------|----------------|-------|----------------------------|
| OQ-090 | What rental terms apply internally vs externally? | Contracts | LEGAL | Not modeled |
| OQ-091 | What insurance requirements apply? | Risk | LEGAL | Not modeled |
| OQ-092 | Who bears damage liability, and how is it evidenced? | Risk & billing | LEGAL/CPS | DamageRecord only |
| OQ-093 | What records-retention rules apply (incl. audit)? | Compliance | LEGAL/IT | Undefined |
