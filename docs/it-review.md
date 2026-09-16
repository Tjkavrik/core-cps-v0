# IT Review — Questions & Decisions for CORE IT

**Status:** Living document. Decisions and questions that will eventually require
CORE IT involvement before any production deployment. The prototype is built to
keep these options open (portable architecture, replaceable interfaces).

---

## Identity & SSO
- What identity provider will be used (Entra ID / Azure AD, Okta, other)?
- OIDC or SAML? What claims are available (email, name, groups)?
- How are roles/groups mapped to CPS roles?
- Prototype today: credentials-based auth behind an OIDC-ready interface.

## Network & Hosting
- Where will this run (public cloud, private cloud, on-prem)?
- Is VPN or private networking required for access?
- What regions/data centers are acceptable?
- Prototype today: portable Node.js + PostgreSQL; Abacus hosting is prototype-only.

## Data Sovereignty
- Where must data be hosted/stored?
- What are backup, retention, and disaster-recovery requirements?
- Are there encryption-at-rest/in-transit standards to meet?

## ERP Integration
- What ERP is authoritative (CMiC, Procore, other)?
- What integration approach is supported (API, file, event, middleware)?
- What is the sync cadence for projects and cost codes?

## Project Data Source
- What is the authoritative source for CORE projects and job/phase codes?
- Who owns project creation and lifecycle?

## Accounting Integration
- How should costs/usage post to accounting?
- What GL/cost-code structure applies?
- How does AP handle external rental invoices?

## Security Review
- What penetration testing is required before go-live?
- What is the vulnerability management/patching expectation?
- Are there mandatory secure-SDLC controls?

## Compliance
- What data-retention rules apply (including audit logs)?
- Do GDPR/CCPA or other privacy regimes apply?
- What audit/reporting obligations exist?

## Mobile Device Management
- Will field users use managed devices or BYOD?
- Are there MDM constraints on browser/app access?

## File Storage
- Preferred object storage (SharePoint, Azure Blob, S3, on-prem)?
- Prototype today: local filesystem behind a `StorageProvider` interface.

## Telematics Integration
- Is there GPS/hour-meter telematics data available?
- Which providers, and what integration method?

## Active Directory / User Provisioning
- How are users provisioned/deprovisioned?
- Is SCIM or another provisioning standard available?

## IT Support Model
- Who owns support and operations for the application?
- What are the SLAs and escalation paths?
- What monitoring/observability standards apply?
