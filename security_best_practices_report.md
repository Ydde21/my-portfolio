# Security Best Practices Report

Date: 2026-03-12
Repo: `d:\Portfolio\portfolio\my-portfolio`

## Executive Summary

The codebase is generally clean on frontend XSS basics, but the contact email API endpoint is currently open to abuse and lacks secure-by-default validation controls. The highest-risk issue is an unauthenticated, unthrottled email-sending endpoint that can be spammed to create cost and availability impact.

Findings summary:
- Critical: 0
- High: 1
- Medium: 4
- Low: 2
- Informational: 1

## Scope and Method

- Stack identified: TypeScript + React (Vite frontend) and Vercel serverless function (`api/send.ts`).
- Security guidance used: `security-best-practices` references for React/frontend plus general web frontend practices.
- Supply-chain check executed: `npm audit --omit=dev`.

## High Severity

### SBP-001: Unauthenticated, unthrottled email-sending endpoint can be abused

- Rule ID: API-ABUSE-001
- Severity: High
- Location: `api/send.ts:6`, `api/send.ts:8`, `api/send.ts:20`, `src/components/portfolio/ContactSection.tsx:47`
- Evidence:
  - Endpoint is public and only checks method (`POST`).
  - No rate limit, CAPTCHA, honeypot, or origin check before sending email.
  - Every accepted request triggers `resend.emails.send(...)`.
- Impact: Attackers can automate requests to flood inboxes and incur provider costs, degrading contact-channel availability.
- Fix:
  - Add server-side rate limiting (IP + optional fingerprint; burst + daily caps).
  - Add bot friction (CAPTCHA or turnstile) and a hidden honeypot field.
  - Add request origin allowlist checks for browser traffic.
  - Add abuse monitoring/alerts and hard failover when thresholds are exceeded.
- Mitigation:
  - Apply WAF-level rate rules on `/api/send`.
  - Introduce temporary challenge mode during attacks.
- False positive notes: This is still a risk even for a public contact form because automated abuse does not require auth.

## Medium Severity

### SBP-002: User input is interpolated into HTML email without escaping

- Rule ID: API-INJECTION-001
- Severity: Medium
- Location: `api/send.ts:23`, `api/send.ts:29`, `api/send.ts:30`, `api/send.ts:32`
- Evidence:
  - `name`, `email`, and `message` are directly inserted into HTML template literals.
- Impact: Malicious markup/links can be injected into outbound email content (phishing/social-engineering risk in recipient clients).
- Fix:
  - Escape HTML entities for all user-controlled fields before interpolation.
  - Prefer sending plain text (`text`) for user fields, and keep HTML wrapper static.
- Mitigation:
  - Add strict field validation and reject suspicious payload patterns.
- False positive notes: Some modern mail clients strip active content, but link/markup manipulation remains realistic.

### SBP-003: Input validation is presence-only (no schema, format, or length constraints)

- Rule ID: API-VALIDATION-001
- Severity: Medium
- Location: `api/send.ts:12`, `api/send.ts:15`, `api/send.ts:24`
- Evidence:
  - Validation checks only that values exist; no email-format validation, CRLF checks, or max lengths.
- Impact: Large or malformed payloads can increase error volume, abuse surface, and provider/API instability.
- Fix:
  - Use schema validation (for example, `zod`) with:
    - `name`: trimmed, bounded length.
    - `email`: strict RFC-like validation, reject CR/LF.
    - `message`: min/max length and normalization.
  - Reject non-JSON requests and unexpected fields.
- Mitigation:
  - Enforce payload-size limits and request timeouts.
- False positive notes: Provider-side checks help but should not replace server-side validation.

### SBP-004: Upstream provider error details are exposed to clients

- Rule ID: API-ERROR-LEAK-001
- Severity: Medium
- Location: `api/send.ts:40`
- Evidence:
  - API returns `error.message` directly from provider response.
- Impact: Attackers can enumerate backend behavior and tune abuse based on provider errors.
- Fix:
  - Return generic client errors (`"Unable to send message"`) and log full details server-side only.
  - Include internal error IDs for traceability without leaking internals.
- Mitigation:
  - Add structured error logging and anomaly alerts.
- False positive notes: Leak severity depends on provider message detail, but current pattern is avoidable.

### SBP-005: Security headers/CSP are not visible in repo configuration

- Rule ID: FE-HEADERS-001
- Severity: Medium
- Location: `index.html:1`, `index.html:33`, `vite.config.ts:7`
- Evidence:
  - No CSP/security headers configured in app code.
  - No visible deployment header config file in repo (`vercel.json`, `_headers`, etc.).
- Impact: Reduced browser-side defense-in-depth against XSS, clickjacking, MIME sniffing, and referrer leakage.
- Fix:
  - Configure headers at deployment edge/server:
    - `Content-Security-Policy`
    - `X-Content-Type-Options: nosniff`
    - `Referrer-Policy`
    - `X-Frame-Options` or CSP `frame-ancestors`
    - `Permissions-Policy`
- Mitigation:
  - Start CSP in report-only mode, then enforce after tuning.
- False positive notes: Headers may already be set externally; verify with runtime response headers.

## Low Severity

### SBP-006: `dangerouslySetInnerHTML` in chart style generator could become injection-prone if config becomes untrusted

- Rule ID: REACT-XSS-ESCAPEHATCH-001
- Severity: Low
- Location: `src/components/ui/chart.tsx:70`, `src/components/ui/chart.tsx:71`, `src/components/ui/chart.tsx:78`
- Evidence:
  - Style tag content is generated via `dangerouslySetInnerHTML` using dynamic keys/colors.
- Impact: If chart config is ever sourced from untrusted input, CSS/style injection becomes possible.
- Fix:
  - Keep `config` strictly internal/trusted.
  - Escape selector fragments (`CSS.escape`) and validate color formats.
  - Prefer non-HTML injection approaches when feasible.
- Mitigation:
  - Add a guardrail comment and runtime assertions around trusted config sources.
- False positive notes: Current usage appears internal; risk increases only if future data sources change.

### SBP-007: Dependency advisories in runtime dependency graph

- Rule ID: SUPPLY-CHAIN-001
- Severity: Low
- Location: `package.json:46`, `package.json:63`
- Evidence:
  - `npm audit --omit=dev` reports 12 vulnerabilities (including transitive highs), notably through `@vercel/node` and `resend` chains.
- Impact: Known vulnerabilities in transitive packages can become exploitable depending on runtime usage and deployment context.
- Fix:
  - Upgrade direct dependencies to versions resolving vulnerable transitive trees.
  - Re-run `npm audit --omit=dev` in CI and track exceptions explicitly.
- Mitigation:
  - Prioritize runtime-path vulnerabilities before build-tool-only issues.
- False positive notes: Some findings may be non-exploitable in this app context; manual triage is required.

## Informational

### SBP-008: Local `.env` contains a live secret value (currently gitignored)

- Rule ID: SECRET-HYGIENE-001
- Severity: Informational
- Location: `.env:1`, `.gitignore:14`
- Evidence:
  - `RESEND_API_KEY` exists in `.env` and `.env` is gitignored.
- Impact: Secret is not currently tracked in git, but accidental disclosure remains possible via local logs/screenshots/backups.
- Fix:
  - Keep `.env` out of source control (already done).
  - Add `.env.example` without secrets.
  - Rotate the key if it has been shared/exposed outside trusted boundaries.
- Mitigation:
  - Use managed secret storage in deployment platform.
- False positive notes: This is best-practice hardening, not proof of active compromise.

## Secure-by-Default Improvement Plan (Suggested Order)

1. Protect `/api/send` against abuse: rate limits + CAPTCHA/honeypot + monitoring.
2. Add strict server-side schema validation and HTML escaping for email content.
3. Return generic errors to clients; keep detailed provider errors in logs only.
4. Configure production security headers and a practical CSP at the deployment edge.
5. Triage `npm audit` runtime findings and upgrade vulnerable transitive paths.
6. Add `.env.example` and document secret-rotation workflow.

## Positive Security Signals Already Present

- External links using `target="_blank"` include `rel="noopener noreferrer"` in reviewed portfolio components.
- `.env` is already listed in `.gitignore`.

