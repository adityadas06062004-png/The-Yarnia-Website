# Deploy — The Yarniya

This site is deployed on **Netlify** at https://the-yarnia.netlify.app/.

## Deploying an update
- **Drag-and-drop**: on Netlify's dashboard for this site, drag the whole project folder onto the deploy area. Netlify serves `index.html` and everything alongside it automatically — no build step.
- **Git-based deploy** (recommended once this is in a GitHub repo): connect the repo in Netlify's dashboard with build command left empty and publish directory set to the repo root. Every push to the main branch redeploys automatically.

## Adding a custom domain
Netlify's dashboard → Domain settings → Add a domain, then follow the DNS instructions it gives you. HTTPS is provisioned automatically.

## Editing content
- Product names, prices, photos, and brand info all live in `data.js` — no other file needs to change for a normal update.
- After editing, just redeploy (drag-and-drop or git push); there's nothing to build or compile.
