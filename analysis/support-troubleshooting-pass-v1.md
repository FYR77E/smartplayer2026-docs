# Support & Troubleshooting Pass V1

## Scope
- Home support strip
- Quick Start troubleshooting and support sections
- Docs troubleshooting page

## Real Issues Found
1. Support guidance existed, but the escalation order was not explicit:
   - self-check
   - docs / troubleshooting
   - logs and device id
   - support contact
2. On the home page, the support strip linked to a mixed set of pages, but did not clearly prioritize diagnostics before escalation.
3. Quick Start had troubleshooting and support blocks, but they were separated without a clear handoff.
4. The troubleshooting docs page still ended without a direct handoff to the knowledge base or support portal.

## Fixes Applied
1. Reframed the home support strip around a clearer support journey.
2. Added a short escalation note in Quick Start troubleshooting.
3. Added a short support route checklist in the Quick Start support section.
4. Added external support destinations to the troubleshooting docs page:
   - knowledge base
   - support portal

## Product Effect
- Users now get a more predictable support path:
  - check diagnostics
  - use docs
  - gather logs and id
  - escalate to support
- This reduces the chance that support feels like the first and only next step.

## Verification
- `npm run check:release:full`
- Manual live checks after deploy:
  - `/`
  - `/quickstart/`
  - `/generated/16-12-типовые-ошибки-и-решения`
