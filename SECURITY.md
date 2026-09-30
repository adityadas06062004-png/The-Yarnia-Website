# Security Notes — The Yarniya

This site is a static HTML/CSS/JS site hosted on **Netlify** (not a self-managed VPS), so most infrastructure-level security (TLS, HTTPS redirect, DDoS protection) is handled by Netlify automatically. This file covers what's configured in the repo and what to keep in mind when editing it.

## What's already in place
- **HTTPS**: enforced automatically by Netlify on the `*.netlify.app` domain (and on any custom domain you attach, once its certificate is issued).
- **Content-Security-Policy** and related headers: set two ways —
  - a `<meta http-equiv="Content-Security-Policy">` tag in `index.html` (works everywhere, including if the site is ever opened as a local file)
  - the `netlify.toml` file, which sends the same protections as real HTTP response headers (stronger, since meta tags can't set every header type)
- **No secrets in frontend code**: there are no API keys, tokens, or credentials anywhere in `data.js`, `script.js`, or `index.html`. The only third-party calls are to Formspree (contact form) and wa.me/Instagram (order links), all public, unauthenticated endpoints.
- **Form handling**: the contact form posts to Formspree over HTTPS; all user input is trimmed and has HTML tags stripped client-side before use, and Formspree itself sanitizes submissions server-side.
- **Safe external links**: every `target="_blank"` link uses `rel="noopener noreferrer"`.

## If you add a custom domain
1. Point your domain's DNS at Netlify (Netlify's dashboard gives exact records).
2. Netlify auto-provisions a free TLS certificate (Let's Encrypt) — no manual Certbot/Nginx steps needed.
3. Update `<link rel="canonical">`, the Open Graph `og:url`, and `BRAND` info in `data.js` if the domain changes.

## If you ever add a backend (payments, order storage, admin login)
- Never put a private API key, database URL, or admin password directly in `data.js`/`script.js` — anything in frontend code is publicly visible.
- Use Netlify Functions (or a proper backend) and environment variables for anything that needs a secret.
- Add rate limiting on any new POST endpoint you introduce.

## Reporting an issue
If you (or the client) notice something that looks like a security problem — a broken form, a suspicious redirect, unexpected third-party requests — check `netlify.toml` and `index.html`'s CSP meta tag first; both control what the page is allowed to load or send data to.
