# LandGuard implementation notes

## Agreed product direction
- Preserve the existing Flask + SQLAlchemy + SQLite backend and React + TypeScript + Vite frontend.
- Use the supplied reference image as the design source: forest green `#0C271D`, emerald `#10B981`, warm off-white surfaces, clean white cards, restrained shadows, professional civic-tech visual style.
- Use synthetic or organizer-provided data only. Never imply that a risk score proves legal title or criminal fraud.
- Avoid fake statistics, nonfunctional controls, unnecessary rewrites, excessive gradients, and neumorphism.

## Core verification capabilities
1. Document integrity checking using SHA-256 reference comparison.
2. Double-selling / conflicting active conveyance checks.
3. Suspicious transfer and ownership-chain checks.
4. Registration-mutation mismatch checks.

## Planned experience
- Landing page, dashboard, parcel/deed search, verification results, document upload, fraud relationship graph, ownership/transfer timeline, What-If simulator, Fraud DNA patterns, Evidence Chain, alerts, and downloadable reports.
- What-If scenarios must remain isolated from persistent database records.
- Distinguish recorded facts from system interpretations and include limitations/disclaimers.
- Continue testing the frontend production build and backend automated tests after changes.

## Changes in this update
- Public landing page is now the root route (`/`) and uses a compact forest-green hero, Bangladesh-map illustration, Verify Land / Watch Demo calls to action, and four capability cards aligned to the supplied reference.
- Added `/login` demo-entry page. It is explicitly not real authentication and warns users not to enter real credentials; backend auth, password recovery, and protected sessions remain future work.
- Moved the dashboard route to `/dashboard` and updated sidebar navigation so the public landing page is not rendered inside the app shell.
- Updated the dashboard risk distribution calculation to use mutually exclusive counts, clamp reported counts to the total, calculate percentages from each slice, and remove the fake minimum donut slice.
- Existing graph, Fraud DNA, timeline, simulator, alerts, reports, and backend routes were preserved.
