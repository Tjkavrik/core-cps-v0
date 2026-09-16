# Blue Hat / JE Dunn Public Research — Evidence Matrix
**Classification:** Research document — public sources only
**Date:** September 2026
**For:** CORE CPS V0.1 Prototype discovery
**Important:** This document records publicly observed evidence, inferences, and CPS proposals. 
It does not represent Blue Hat, JE Dunn, or any proprietary content.

---

# Blue Hat Rentals public research — structured raw notes

**Research date:** September 16, 2026  
**Purpose:** Evidence gathering for a construction equipment-management prototype for CORE Construction’s CPS operation.  
**Method and boundary:** Public pages and public search results only. No login was attempted, no authenticated/restricted content was accessed, and no private data was scraped. Findings distinguish direct evidence from interpretation. This is concept research, not a recommendation to copy Blue Hat’s visual design or proprietary implementation.

## Evidence labels

- **OBSERVED** — directly visible in a public page, its public DOM text, or an identified public search result.
- **INFERRED** — a reasonable interpretation of observed evidence; not confirmed operating policy.
- **UNKNOWN** — requires validation with stakeholders or authenticated product owners.

## Executive evidence summary

| ID | Label | Finding | Primary source |
|---|---|---|---|
| E-01 | OBSERVED | Blue Hat is an independent division/brand in the JE Dunn family providing equipment rental and hoisting services to JE Dunn projects and external customers. | https://centennial.jedunn.com/blog/from-the-warehouse-to-blue-hat-je-dunns-equipment-story/ |
| E-02 | OBSERVED | The public history says Blue Hat manages more than 20,000 unique equipment pieces, has a 180+ person team, facilities in eight cities, and on-site presence at five large JE Dunn jobsites. | Same as E-01 |
| E-03 | OBSERVED | Blue Hat’s three stated focus areas are regional equipment, mobile crane, and tower crane; the 2024 history cited 37 tower cranes and 40+ personnel hoists. | Same as E-01 |
| E-04 | OBSERVED | The public shop exposes catalog browsing, search, cart, account request/sign-in, purchase-order support, feedback, locations, help, and product families including Rental, Sales, Non-Stock, Site Setup, Job Services, and Concrete Pump Parts. | https://shop.bluehatrentals.com/ |
| E-05 | OBSERVED | All JE Dunn employees and third-party customers must select an appropriate project/JE Dunn job for an order; project access is security-controlled. | https://shop.bluehatrentals.com/HelpCenter |
| E-06 | OBSERVED | Checkout includes fulfillment selection, job-code attribution, and final submission; saved orders retain job number and phase code. | https://shop.bluehatrentals.com/HelpCenter |
| E-07 | OBSERVED | Submitted orders are centralized in a backend called “Manage Requisitions” and monitored/fulfilled by Blue Hat and Procurement teams; regional teams draw on a national network of warehouses, colleagues, and vendors. | https://shop.bluehatrentals.com/HelpCenter |
| E-08 | OBSERVED | Public product listings show names, part numbers, filters, and “Sign In For Pricing”; no public daily/weekly/monthly price schedule was visible. | https://shop.bluehatrentals.com/Catalog/Earthmoving/Mini-Excavators |
| E-09 | OBSERVED | The public rental agreement defines daily, weekly, and monthly rental periods and related billing mechanics, but item rates are supplied in an agreement and are not published publicly. | https://shop.bluehatrentals.com/Terms-Conditions |
| E-10 | OBSERVED | Returns begin through a “Request Return” form, proceed through the normal cart/checkout process, and are followed by a call from the local Blue Hat team to coordinate details. | https://shop.bluehatrentals.com/HelpCenter |

---

## Platform / service overview

### Public positioning and scale

**OBSERVED — Source:** https://bluehatrentals.com/  
Blue Hat says it provides equipment rental and hoisting services across industries, emphasizing safety, efficiency, productivity, experienced staff, client focus, cranes, popular/general equipment, and job services. The public page lists Kansas City, Atlanta, Austin, Denver, Minneapolis, Nashville, Omaha, and Portland; the separate contact page also lists Sioux Falls.

**OBSERVED — Source:** https://bluehatrentals.com/contact-us/  
The public contact page identifies Kansas City, KS as headquarters and publishes eight additional location addresses, plus named crane-rental contacts and general social channels. The page displays Avetta, ISN, Appruv, ComplyWorks, and FirstVerify accreditations.

**OBSERVED — Source:** https://centennial.jedunn.com/blog/from-the-warehouse-to-blue-hat-je-dunns-equipment-story/  
JE Dunn’s centennial history describes the operation’s evolution from “The Warehouse” to “Dunn Logistics Support Center” in 2005 and Blue Hat in 2013. It calls Blue Hat an independent division and brand within the JE Dunn family. It states that the team largely supports JE Dunn projects while also serving external clients. It reports 180+ staff, more than 20,000 unique equipment pieces, facilities in eight cities, and on-site presence at five larger JE Dunn jobsites. Its three focus areas are regional equipment, mobile crane, and tower crane.

**OBSERVED — Source:** https://jedunn.com/services/  
JE Dunn publicly lists Blue Hat in its “Family of Brands” and repeats the equipment-rental/hoisting, safety, efficiency, productivity, expertise, and client-focus positioning. JE Dunn’s core services are Development, Design, Preconstruction, and Construction.

**INFERRED:** Blue Hat is both a fleet/operations function and a customer-facing service business. Its platform likely has to support internal JE Dunn demand and external customers with different identity, access, commercial, and support needs.

**UNKNOWN:** Current authoritative facility count is inconsistent across public pages (the 2024 history says eight facilities, while the 2026 contact page lists nine locations). Validate active branches, service territories, inventory ownership by branch, and which locations are full warehouses versus offices/on-site operations.

---

## Equipment categories and catalog structure

**OBSERVED — Source:** https://shop.bluehatrentals.com/  
The public “Shop by Category” hierarchy exposes these top-level categories:

Specialty Systems; Cranes; Popular Equipment; Aerial Work Platforms; Concrete & Masonry; Drywall; Earthmoving; Forklifts & Material Handling; General Construction; General Equipment; Material; Power & Light; Safety; Scaffold; Site Setup; Small Tools; Vehicles & Trailers.

The footer separately exposes product/service families: Rental, Sales, Non-Stock, Site Setup, Job Services, and Concrete Pump Parts.

**OBSERVED — Source:** https://shop.bluehatrentals.com/Catalog/Earthmoving  
Earthmoving is described as supporting excavation, grading, land clearing, construction, and landscaping. Its visible subcategories are Earthmoving Attachments, Mini-Excavators, and Skid Steers & Track Loaders.

**OBSERVED — Source:** https://shop.bluehatrentals.com/Catalog/Earthmoving/Mini-Excavators  
The public listing showed five items with names and part numbers: 70-Mini Excavator-7K (70-EXCA7), 70-Mini Excavator-8K (70-EXCA8), 70-Mini Excavator-10-12K (70-EXCA12), 70-Mini Excavator-18-19K (70-EXCA19), and 70-Mini Excavator-15-16K (70-EXCA16). Visible facets include Product Type, Brand, Type, Model, Fuel Type, and Size. Sorting includes best match and product A–Z/Z–A.

**OBSERVED — Source:** https://bluehatrentals.com/  
The crane offering includes mobile and tower cranes. Public spotlight content names a Liebherr LR 1300.1 SX crawler crane and a Liebherr LTM 1450-8.1 all-terrain crane with descriptive capacity/reach details.

**INFERRED:** A CPS catalog should separate a stable classification hierarchy from individual stock/asset records and commercial offerings. Product master, sell/rent/non-stock classification, part number, attributes/facets, attachments, images, and branch availability should be distinct data concerns.

**UNKNOWN:** Whether the displayed “part number” is a product-class SKU, rate-card code, or asset identifier; how serialized and non-serialized items differ; whether quantity is branch inventory, national availability, or vendor capacity.

---

## How projects/jobs are associated with users

**OBSERVED — Source:** https://shop.bluehatrentals.com/HelpCenter  
The FAQ states that all JE Dunn employees and third-party customers must select the appropriate “project,” or JE Dunn job, for an order. If a job is missing, Blue Hat verifies whether the user has existing security access or needs access granted.

**OBSERVED — Source:** https://shop.bluehatrentals.com/HelpCenter  
JE Dunn employees use standard SSO. External customers request an account, explain why they are registering, and are reviewed by a sales team before receiving further instructions.

**OBSERVED — Source:** https://shop.bluehatrentals.com/HelpCenter  
Saved Orders retain job number and phase code. Shipping addresses pre-populate from project addresses managed by the project team in TPS / CMiC.

**OBSERVED — Source:** https://shop.bluehatrentals.com/ and https://shop.bluehatrentals.com/HelpCenter  
A current public banner says some users are experiencing job-access issues and directs them to info@bluehatrentals.com and their local Blue Hat or Procurement contact for ordering support.

**INFERRED:** Identity-to-project authorization is a first-class domain relationship, not merely a checkout field. Project, phase/job-code, authorized user/customer, shipping locations, and order attribution likely need independent records and auditable access changes.

**UNKNOWN:** Source of truth for user–project entitlement; approval authority; whether external users can access multiple customers/jobs; phase-code validation rules; whether permissions are role-, company-, branch-, or contract-based.

---

## Request / ordering workflow

**OBSERVED — Source:** https://shop.bluehatrentals.com/HelpCenter  
The public Help Center describes four tutorials: site navigation; order history/status/reorder/invoices; document attachments and free-form requests; and cart/checkout. The cart/checkout tutorial explicitly covers fulfillment selection, job-code attribution, and final submission.

**OBSERVED — Source:** https://shop.bluehatrentals.com/HelpCenter  
Users can upload specifications, drawings, or PDFs to an order and submit free-form requests when an item is not in the catalog.

**OBSERVED — Source:** https://shop.bluehatrentals.com/HelpCenter  
Order history supports finding past orders, checking status, reordering favorites, and viewing invoices.

**OBSERVED — Source:** https://shop.bluehatrentals.com/HelpCenter  
“My Lists” stores and can share frequently ordered product sets for scopes such as site setup or self-perform. “Saved Orders” stores a one-time draft for later review and preserves job number and phase code; placed orders are no longer saved drafts.

**OBSERVED — Source:** https://shop.bluehatrentals.com/HelpCenter  
Submitted orders are centralized in “Manage Requisitions,” monitored by Blue Hat and Procurement staff, and fulfilled by regional teams using a national network of warehouses, colleagues, and vendors. The site provides real-time updates.

**INFERRED:** The public evidence suggests a requisition workflow rather than guaranteed instant allocation: discover or free-form request → build list/cart → choose fulfillment → attribute job/phase → attach files → save draft or submit → operations review/fulfillment → status/invoice visibility.

**UNKNOWN:** Approval stages, budget checks, substitution rules, quote acceptance, reservation/availability checks, cancellation, partial fulfillment, vendor selection, dispatch sequencing, proof of delivery, and invoice integration.

---

## Rate structure

**OBSERVED — Source:** https://shop.bluehatrentals.com/Catalog/Earthmoving/Mini-Excavators  
Public catalog pages show “Sign In For Pricing.” No public product prices or public rate schedule were visible.

**OBSERVED — Source:** https://shop.bluehatrentals.com/Terms-Conditions  
The public agreement supports daily, weekly, and monthly rental periods. Rates are indicated per item in the relevant agreement; weekly payments are due on the first day of each week and monthly payments on the first day of each month. Daily rental is charged for each calendar day in advance and is not prorated for a partial return day. Fractions of a week/month after a minimum term use a lessor pro-rata schedule available on request. Overtime operation is reportable and chargeable. Past-due sums may bear 1.5% interest per month.

**OBSERVED — Source:** https://shop.bluehatrentals.com/Terms-Conditions  
The “Inclusions, Exclusions and Standards for Quotes” states that bare rentals are based on a 176-hour, 28-day month and additional use is billed pro rata. It also states that customers are responsible for insurance, taxes, labor, fuel, and maintenance on bare-rental equipment. The page describes preventive-maintenance service charges of $2.00 per hour up to a threshold and $2.50 thereafter; the same public page contains inconsistent thresholds (250 hours in paragraph 16 versus 200 hours in the quote notes).

**INFERRED:** CPS should model rate cards as configurable, effective-dated data with units, minimum term, included hours, overtime tiers, commercial scope/inclusions, customer/project applicability, and branch/vendor applicability—never as hard-coded constants.

**UNKNOWN:** Actual item rates; internal transfer pricing versus external rental pricing; day/week/month conversion; weekends/holidays; minimums; negotiated customer tiers; damage waiver; taxes; delivery fees; standby/downtime rules; Illinois-specific requirements. The 200/250-hour discrepancy must be validated rather than implemented.

---

## Fulfillment types (owned, transfer, external, etc.)

**OBSERVED — Source:** https://shop.bluehatrentals.com/HelpCenter  
Checkout includes “fulfillment selection.” Submitted orders are fulfilled by regional teams that are part of a national network of warehouses, colleagues, and vendors.

**OBSERVED — Source:** https://shop.bluehatrentals.com/Terms-Conditions  
The agreement describes lessor-owned equipment, delivery/return transportation, and shipment to the lessee’s work site or another lessor-designated point.

**INFERRED:** Public evidence reasonably suggests multi-source fulfillment can include local warehouse/fleet, another regional warehouse/colleague, and a vendor. The exact labels “owned,” “transfer,” and “external” were not directly visible in public content and therefore must not be treated as confirmed Blue Hat terminology.

**UNKNOWN:** Allocation precedence, cross-branch transfer rules, buy-versus-rent sourcing, vendor quote comparison, split fulfillment, backorders, substitutions, lead-time calculation, and who may override a source recommendation.

---

## Return / pickup process

**OBSERVED — Source:** https://shop.bluehatrentals.com/HelpCenter  
A return begins from “Request Return” in navigation. The user completes a form for items to return, is directed to the cart to complete the normal checkout process, and should expect a local Blue Hat call to coordinate details.

**OBSERVED — Source:** https://shop.bluehatrentals.com/Terms-Conditions  
The rental period ends when equipment is received by the lessor at its Kansas City yard or another designated point. The lessee bears transportation/freight/loading/unloading terms described in the agreement, must return equipment in the same condition subject to ordinary wear, and can remain liable for rent while required repairs/service are completed.

**INFERRED:** The public experience treats a return as a request requiring operational coordination rather than an immediate closed transaction. CPS should distinguish request date, scheduled pickup, actual pickup, receipt, inspection, repair/cleaning, and rental-stop decision.

**UNKNOWN:** Which event stops billing in practice for internal work; pickup windows; partial returns; quantity/serial reconciliation; condition evidence; damage approvals; off-rent authorization; missed pickup handling.

---

## User roles visible on the public site

**OBSERVED — Source:** https://shop.bluehatrentals.com/HelpCenter  
Publicly named participant groups include JE Dunn employees, third-party/external customers, Blue Hat representatives/team members, Procurement representatives/team members, sales team, project team, and regional fulfillment teams.

**OBSERVED — Source:** https://bluehatrentals.com/contact-us/  
Named public specialist role: Crane Rentals contact.

**OBSERVED — Sources:** https://jobs.jedunn.com/go/Blue-Hat-Crane-(Logistics)/9001200/ and public indexed job URLs listed below  
The Blue Hat Crane (Logistics) category page showed zero current openings when checked. Publicly indexed Blue Hat-related titles included Equipment Operations Manager, Equipment Operations Specialist, Equipment Foreman, Equipment Mechanic, Driver, and Crane Operator; several indexed detail URLs were already filled or no longer exposed full descriptions.

**INFERRED:** Prototype roles worth validating include requester/shopper, project approver, project administrator, procurement coordinator, fleet/warehouse fulfiller, dispatcher/driver, service/mechanic, billing/reporting user, branch manager, and platform administrator.

**UNKNOWN:** Exact production authorization matrix, segregation of duties, spend/approval limits, and whether external customer roles differ by company or project.

---

## Help center / support structure

**OBSERVED — Source:** https://shop.bluehatrentals.com/HelpCenter  
The Help Center combines four quick-start videos (~12 minutes total), eight FAQ topics, Contact Us, Provide Feedback, account access guidance, and ordering assistance.

**OBSERVED:** FAQ topics are Account Registration, Lists & Saved Orders, Order Submission, Platform & Mobile, Project Access, Returns, Shipping & Address, and Support & Feedback. The platform states it is optimized for desktop, tablet, and mobile.

**OBSERVED:** Support routes include info@bluehatrentals.com, Contact Us, Provide Feedback, local Blue Hat contacts, Procurement contacts, and cranes@bluehatrentals.com for crane inventory.

**INFERRED:** Support is embedded in operational context, with specialist routing and self-service education. A CPS prototype could provide contextual help, a support case linked to job/order/asset, feedback capture, and clear escalation ownership without copying Blue Hat’s design.

**UNKNOWN:** Support service levels, ticketing system, escalation tiers, after-hours coverage, and audit/retention requirements.

---

## Visible technology stack clues

**OBSERVED — Source:** public DOM of https://shop.bluehatrentals.com/  
The page loads a bundled asset at `/dist/public.js`, uses client-rendered interactive components, and exposes Hotjar, Google Analytics (`G-J01Z7K5SQK`), and Google Tag Manager (`GTM-T34HM6B`) scripts. Styled class names visible in the DOM appear generated, consistent with a CSS-in-JS component approach. No public generator meta tag was present.

**OBSERVED — Source:** https://shop.bluehatrentals.com/HelpCenter  
The Help Center states that project addresses are managed in TPS / CMiC and that submitted orders are centralized in a backend called Manage Requisitions. JE Dunn employees use standard SSO.

**INFERRED:** The public storefront is likely a JavaScript single-page or heavily client-rendered application integrated with enterprise identity, CMiC-related project data, and a requisition-management backend. Specific frameworks, vendors, API architecture, hosting, and database cannot be confirmed from public evidence.

**UNKNOWN:** Exact frontend framework, backend technology, identity provider/protocol, CMiC integration method, hosting, database, integration cadence, observability, and security controls.

---

## Job postings

**OBSERVED — Source:** https://jobs.jedunn.com/go/Blue-Hat-Crane-(Logistics)/9001200/  
The public Blue Hat Crane (Logistics) category page reported no open positions at the time of research.

**OBSERVED — Source:** https://jobs.jedunn.com/job/Atlanta-Equipment-Operations-Manager-1-GA-30339/1318021900/  
The Equipment Operations Manager — Atlanta page stated that the position had been filled.

**OBSERVED — Public indexed URLs discovered during research:**

- Equipment Operations Specialist — Bowling Green: https://jobs.jedunn.com/job/Bowling-Green-Equipment-Operations-Specialist-OH/1227569900/
- Crane Operator — Dallas: https://jobs.jedunn.com/job/Dallas-Crane-Operator-TX-75254/1370556000/
- Crane Operator SPMT — Nashville: https://jobs.jedunn.com/job/Nashville-Crane-Operator-SPMT-TN-37210/1408621300/
- Equipment Foreman Onsite — Atlanta: https://jobs.jedunn.com/job/Atlanta-Equipment-Foreman-Onsite-GA-30339/1394064600/
- Equipment Foreman — Tempe/Phoenix: https://jobs.jedunn.com/job/Tempe-Equipment-Foreman-Phoenix-AZ-85281/1390388500/
- Equipment Foreman — Dallas: https://jobs.jedunn.com/job/Dallas-Equipment-Foreman-TX-75254/1415322800/
- Driver — Omaha: https://jobs.jedunn.com/job/Omaha-Driver-NE-68138/1396417500/
- Equipment Mechanic — Nashville: https://jobs.jedunn.com/job/Nashville-Equipment-Mechanic-TN-37210/1376961800/

**INFERRED from public search snippets, not confirmed current postings:** These roles collectively suggest responsibility areas covering crane operation, inspections, field repair, fleet maintenance, warehouse/inventory control, delivery scheduling, DOT compliance, customer scheduling, rental operations, billing, and operational cost/time documentation.

**UNKNOWN:** Current openings and complete authoritative descriptions. Several indexed pages were stale/filled, so role details should be validated with current Blue Hat or CPS stakeholders before becoming permissions or workflows.

---

## Rental terms or policies

**OBSERVED — Source:** https://shop.bluehatrentals.com/Terms-Conditions  
The publicly posted Blue Hat Equipment Rental Agreement contains, among other topics:

1. Lessee/operator and erection/dismantling responsibilities unless otherwise specified; warranty disclaimers.
2. Lessor ownership/title to equipment.
3. Delivery acceptance and a three-day defect-notification window for limited replacement treatment.
4. Minimum rental period and commencement/end mechanics.
5. Daily/weekly/monthly billing, overtime reporting, pro-rata scheduling, and 1.5% monthly late interest.
6. Risk of loss, insurance requirements, qualified operation, maintenance/records, repair responsibility, taxes, indemnification, return condition, and continued rental during certain repair periods.
7. Restrictions on assignment, subletting, relocation, attachments, encumbrance, and use beyond capacity.
8. Transportation, freight, loading/unloading, default/recovery, inspection, notice, bonds/pre-lien information, and Missouri/Jackson County dispute terms.
9. Quote notes for bare rentals, mobilization/demobilization, maintenance, crane mats, Net 30/no retainage, and assembly/disassembly responsibility.

**OBSERVED:** The page includes numeric insurance limits and maintenance charges. These are contractual details that may change and are not assumed applicable to CORE/CPS.

**INFERRED:** A CPS system needs effective-dated terms/policy references, acknowledgement evidence, insurance/compliance artifacts, condition and inspection records, maintenance responsibility, billing-stop rules, and exception approvals.

**UNKNOWN:** Which posted terms apply to internal JE Dunn work versus external customers, which jurisdictions require variants, version/effective date, precedence between quote and master terms, and whether the public text is the latest legal form. Legal review is required before reuse.

---

## Public procurement information

**OBSERVED — Sources:** https://shop.bluehatrentals.com/ and https://shop.bluehatrentals.com/HelpCenter  
The storefront prominently exposes “Purchase Order Support,” directs ordering issues to local Blue Hat or Procurement contacts, and says Blue Hat and Procurement team members monitor and fulfill requisitions.

**OBSERVED — Source:** https://jedunn.com/services/  
JE Dunn’s public services page describes its general service portfolio and Blue Hat brand but did not expose a dedicated public procurement-services description in the material reviewed.

**UNKNOWN:** Procurement organization structure, approved-vendor rules, purchase-order lifecycle, delegation limits, quote thresholds, three-bid requirements, vendor onboarding, or Illinois-specific procurement controls. No public dedicated JE Dunn procurement-services page or public Blue Hat rate schedule was confirmed.

---

## CPS-relevant insights

### Evidence-backed concepts to carry into discovery

**CPS PROPOSED (derived from E-04 through E-10, not claimed as Blue Hat facts):**

- Treat project/job and phase/cost code as first-class order attribution with validated, auditable user entitlement.
- Separate product catalog, individual assets, availability, rate cards, and fulfillment sources.
- Support catalog requests and free-form/non-stock requests with attachments.
- Preserve reusable lists separately from one-time saved requisition drafts.
- Use configurable fulfillment options and explicit operations review rather than assuming instant allocation.
- Track a requisition/order through submission, sourcing, scheduling, delivery, active rental, return request, pickup, receipt, inspection, and financial close.
- Model returns as coordinated workflows, with the event that stops billing configurable by contract/policy.
- Keep rate units, minimums, included hours, overtime, delivery, taxes, insurance, maintenance, and negotiated terms configurable and effective-dated.
- Provide mobile-capable requester workflows and role-specific operational queues.
- Route support in context and retain feedback/audit history.

### Guardrails for the CPS prototype

**CPS PROPOSED:** Do not hard-code Blue Hat’s published legal terms, charges, thresholds, branch structure, rate conversions, project-access process, fulfillment names, or approval rules. Maintain them as discovery questions and configurable reference data. Keep fictional seed catalog/assets/rates in a separate seed layer so approved CORE sources can replace them.

**UNKNOWN / Illinois discovery:** rental tax treatment; operator licensing/certification; insurance thresholds; damage waiver; internal transfer pricing; union/labor constraints; DOT delivery requirements; lien/pre-lien procedures; records retention; privacy; approvals; accessibility; and local service geography.

---

## Screenshot evidence

### S-01 — Blue Hat public marketing homepage

Source: https://bluehatrentals.com/  
Shows public services positioning, crane/popular-equipment/job-services navigation, locations, and equipment spotlights.

![Blue Hat public homepage](/home/ubuntu/screenshots/screenshot_1789580412314.png)

### S-02 — Blue Hat public eCommerce homepage

Source: https://shop.bluehatrentals.com/  
Shows public job-access support banner, sign-in/request-account controls, cart, product and purchase-order-support navigation, crane/general support contacts, and merchandising content.

![Blue Hat eCommerce homepage](/home/ubuntu/screenshots/screenshot_1789580420272.png)

### S-03 — Help Center quick-start content

Source: https://shop.bluehatrentals.com/HelpCenter  
Shows public tutorials for navigation, order tracking, document/free-form requests, and cart/checkout.

![Blue Hat Help Center tutorials](/home/ubuntu/screenshots/screenshot_1789580434022.png)

### S-04 — Public mini-excavator listing

Source: https://shop.bluehatrentals.com/Catalog/Earthmoving/Mini-Excavators  
Shows catalog facets, public product cards and part numbers, and the explicit “Sign In For Pricing” gate.

![Blue Hat mini-excavator listing](/home/ubuntu/screenshots/screenshot_1789580551627.png)

### S-05 — Public Terms & Conditions page

Source: https://shop.bluehatrentals.com/Terms-Conditions  
Shows the publicly accessible Blue Hat Equipment Rental Agreement.

![Blue Hat Terms and Conditions](/home/ubuntu/screenshots/screenshot_1789580567415.png)

---

## Source register

| Source | Use in notes | Access result |
|---|---|---|
| https://bluehatrentals.com/ | Overview, services, locations, crane spotlights | Public; reviewed |
| https://bluehatrentals.com/contact-us/ | Locations, crane contacts, accreditations | Public; reviewed |
| https://shop.bluehatrentals.com/ | Storefront features and catalog taxonomy | Public; reviewed |
| https://shop.bluehatrentals.com/HelpCenter | Roles, project access, ordering, support, return, shipping, lists | Public; reviewed in DOM; no video playback/login required |
| https://shop.bluehatrentals.com/Catalog/Earthmoving | Category/subcategory structure | Public; reviewed |
| https://shop.bluehatrentals.com/Catalog/Earthmoving/Mini-Excavators | Product cards, facets, pricing gate | Public; reviewed |
| https://shop.bluehatrentals.com/Terms-Conditions | Rental terms and rate mechanics | Public; reviewed |
| https://shop.bluehatrentals.com/AboutUs | Search-discovered route | Public route returned no useful parsed content; not relied upon |
| https://shop.bluehatrentals.com/LocationFinder | Location capability | Public link observed; detailed locations corroborated on contact page |
| https://shop.bluehatrentals.com/JobServices | Job-services route | Public link observed; service names corroborated on marketing homepage |
| https://jedunn.com/ | Company overview and service positioning | Public; reviewed |
| https://jedunn.com/services/ | JE Dunn services and Family of Brands | Public; reviewed |
| https://centennial.jedunn.com/blog/from-the-warehouse-to-blue-hat-je-dunns-equipment-story/ | History, scale, operating focus | Public; reviewed |
| https://jobs.jedunn.com/go/Blue-Hat-Crane-(Logistics)/9001200/ | Job category/status | Public; reviewed; zero openings at research time |
| https://jobs.jedunn.com/job/Atlanta-Equipment-Operations-Manager-1-GA-30339/1318021900/ | Example job/status | Public; reviewed; filled |

## Evidence limitations

The storefront is client-rendered; conventional text scraping returned little for several routes, so public DOM text was read in the browser without authentication. Pricing was explicitly gated behind sign-in and was not pursued. Search indexes exposed several job URLs that may be stale; only current page status was treated as authoritative. No public item-level rate schedule, dedicated procurement-services page, exact fulfillment-type vocabulary, or complete current job descriptions were confirmed. These remain **UNKNOWN**, not negative proof that the capabilities do not exist.