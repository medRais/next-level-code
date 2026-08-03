# Deployment and cutover

The site is a fully static Astro build published to **GitHub Pages** from the
`main` branch of `medRais/next-level-code`, served at
**https://nextlevelcode.tech**.

---

## Status — 3 August 2026

**The site is LIVE on the apex and serving correctly.** Cutover is complete;
what remains is content, not engineering.

### Verified live

| Check | Result |
|---|---|
| `https://nextlevelcode.tech/` | 200, serving the new site |
| All 24 routes | 200, spot-checked across every section |
| Unknown URL | 404, serving the branded error page |
| Canonical / `og:url` / sitemap / `robots.txt` / `CNAME` | all agree on the apex; no `www` anywhere |
| `sitemap-0.xml` | 21 URLs — 24 routes minus the two `noindex` legal pages and the 404 |
| Deploy workflow | green on `b1d7a3a`, with no legacy branch-builder run alongside it |

Quality gates at the last full run: 24 pages built, `npm run check` clean
(0 errors, warnings and hints), Lighthouse 100 on performance, accessibility,
best practices and SEO across both mobile and desktop.

Rollback remains available: the previous site is preserved on the `old-site`
branch at `9dce679`.

### Open items

**1. Replace the placeholder API catalogue.** `/products/` is live with three
illustrative APIs. Details are in the content gates below. Nothing there
commits the company to an untrue claim — pricing is "on request" throughout
and the `Product` JSON-LD publishes no price — but they are not the real
products. This is the last content gate.

**2. Submit the contact form once from production.** The form was verified
end to end and the email arrived, but that test ran against a local dev
server. The deployed page posts to the same Web3Forms endpoint, so this is a
confirmation rather than a real risk — worth doing once from
`https://nextlevelcode.tech/contact/` all the same.

**3. Re-verify the `www` redirect.** At the time of writing,
`https://www.nextlevelcode.tech/` returns **404** instead of redirecting to
the apex. Before the cutover it redirected correctly, so this is a regression
introduced by the custom-domain change and is expected to clear on its own —
GitHub provisions the apex↔`www` redirect and its certificate asynchronously
after a domain change.

```bash
curl -sI https://www.nextlevelcode.tech/    # want: 301 -> https://nextlevelcode.tech/
```

If it is still 404 after a day, re-save the custom domain in **Settings →
Pages** (clear the field, Save, re-enter `nextlevelcode.tech`, Save). The apex
is unaffected either way — this only concerns visitors who type the `www`
prefix.

---

## How deployment works

| Workflow | Trigger | What it does |
|---|---|---|
| `.github/workflows/deploy.yml` | push to `main`, or manual dispatch | install → type check → build → verify `dist/CNAME` → publish to Pages |
| `.github/workflows/ci.yml` | push to any branch except `main`, and PRs into `main` | the same install, check and build — **no deploy**, no Pages permissions |

While the new site is being built on `new-site`, `deploy.yml` does not exist on
`main`, so **nothing is published before cutover**. `main` keeps serving the old
site untouched until the merge.

The custom domain is pinned by `public/CNAME`, which Astro copies verbatim into
`dist/`. Both workflows fail the build if that file goes missing, because a
deploy without it silently unbinds the domain.

## Domain: current state vs. after cutover

DNS is **already correct** and needs no change:

| Record | Value | Status |
|---|---|---|
| `nextlevelcode.tech` A | `185.199.108.153`, `.109.153`, `.110.153`, `.111.153` | ✅ in place |
| `www.nextlevelcode.tech` CNAME | `medrais.github.io` | ✅ in place |

The canonical host is the **apex, `nextlevelcode.tech`**. `www` redirects to
it, which is how it already behaved before the rebuild.

| | |
|---|---|
| Canonical | `nextlevelcode.tech` |
| `www` | 301 → apex, handled by GitHub Pages |

### Why the apex, when the plan originally said `www`

The build initially targeted `www.nextlevelcode.tech`, per AGENTS.md §3. That
was decided before the new site was live. Once it was deployed, the apex was
serving it correctly and was still the indexed host, which made the trade-off
concrete rather than theoretical:

- Moving to `www` would have been a **301 site migration on an already-indexed
  domain** — small and temporary in impact, but not zero, and it would have
  required a second Search Console property.
- Staying on the apex costs **nothing**. No migration, no re-verification, no
  ranking risk, and the existing Search Console property keeps working.

So the site config moved to the apex rather than the domain moving to `www`:
`public/CNAME` and `site` in `astro.config.ts` both say `nextlevelcode.tech`,
which makes canonical tags, the sitemap and `robots.txt` agree with the host
that actually serves.

**If you ever do want `www`**, it is those same two files plus the Pages custom
domain setting — and at that point the 301 migration caveat above applies
again.

## Content gates

**Status: 1 of 4 PENDING.** Technology stacks and legal details are resolved.
The contact form is verified end to end, though that test ran against a local
dev server — one production submission remains worth doing (see Status above).
**The real API catalogue is the only outstanding gate.** The site went live
with three illustrative placeholders in its place, knowingly.

None of them breaks the build — that is precisely why this list exists. `npm
run check` passes, `npm run build` passes, CI passes and Lighthouse scores 100
with every placeholder still in place. Nothing in the toolchain will stop a
placeholder reaching production; only this checklist will.

Run this at any time to see exactly what is still outstanding:

```bash
# every owner TODO, placeholder product and published stack claim
grep -rn "TODO(owner)" src/
grep -rln "PLACEHOLDER PRODUCT" src/content/products/en/
grep -rn -A10 "^stack:" src/content/services/en/*.md
```

- [ ] **Replace the three illustrative API products.**
      `src/content/products/en/*.md` — Document Intelligence, Knowledge Answers
      and Document Verification are credible inventions, not the real
      catalogue. Endpoint names, payloads and the `api.nextlevelcode.tech` host
      are illustrative. Each file carries a header comment saying so. Pricing
      is left "on request" throughout and the Product JSON-LD publishes no
      price, so nothing here commits the company to an untrue claim — but the
      products themselves must be swapped for the real list before launch.
      Replacing them is a content edit; no code changes.

- [x] ~~**Confirm or correct the technology stacks.**~~ **RESOLVED.**
      The owner supplied the confirmed stack and it is now published across
      the four service pages, grouped by concern and distributed by relevance:
      custom-software carries languages, backend, frontend and data;
      ai-solutions the AI and ML block; apis-and-products the integration,
      runtime and platform items; consulting-and-audit the practices,
      architecture and cloud. Every previously invented entry was removed —
      LangGraph, PyTorch, MLflow, GraphQL, OpenAPI, OAuth 2.0 and Webhooks are
      gone. Verified mechanically: nothing outside the confirmed list appears,
      and no confirmed item was dropped.

- [x] ~~**Complete the legal pages.**~~ **RESOLVED.**
      Both pages carry the confirmed identity: Next Level Code, SASU, share
      capital €1,000, registered office 7 rue Du 8 Mai 1845, 92340
      Bourg-la-Reine, France, SIREN 933 215 741, publication director RAIS
      Mohamed, contact email and telephone, GitHub as host. That satisfies what
      Article R123-238 of the Code de commerce requires of a SASU. No
      `TODO(owner)` marker remains anywhere in the codebase and the
      incompleteness banners are gone.

      One detail is inferred rather than supplied: applicable law is stated as
      French, which follows from the SASU form and the French registered
      office. Remove that section if it is wrong.

      Optional: the notice states the SIREN but not the RCS registry city.
      The public register (recherche-entreprises.api.gouv.fr) does not expose
      the greffe, so it remains unconfirmed and is deliberately left out. The
      Kbis extract, or data.inpi.fr, is the authoritative source if you want
      to add it.

      **Address corrected against the register.** The published address was
      first entered as "7 rue Du 8 Mai 1845". The public register lists
      "7 RUE DU 8 MAI 1945" — VE Day, which is the usual street name; there is
      no 8 May 1845. Both legal pages now say 1945. If the register itself is
      wrong, the correction needs reversing here and fixing at the registry.

      The same lookup independently corroborated two published facts: the
      company was created on 2024-09-25, matching `FOUNDED_YEAR = 2024`, and
      its legal form code 5710 is SAS/SASU.

- [x] ~~**Test the contact form end to end.**~~ **RESOLVED.**
      The owner submitted a real enquiry through the form and confirmed it
      arrived. Both paths are now proven: the success path by that live test,
      the failure path by stubbing the request in the browser and confirming
      the visitor gets a `mailto:` fallback and a re-enabled submit button
      rather than a dead end.

      `CONTACT_EMAIL` in `src/data/company.ts` is confirmed as
      `contact@nextlevelcode.tech`, used in the footer, on /contact/, in both
      legal pages, and as the form's failure fallback.

      Worth re-testing if any of these change: the Web3Forms access key, the
      mailbox it is bound to, or the domain. The key is public by design and
      lives in the markup, so rotating it is a content edit — but a rotated
      key that is never activated fails silently, which is exactly what this
      test catches.

## Cutover checklist

Run in order. Steps 1–3 are safe to do in advance; the site does not change
until step 4.

0. **Clear the content gates above.**

1. **Verify the branch builds clean**
   ```bash
   npm ci
   npm run check
   npm run build
   npm run preview     # spot-check the built site locally
   ```

2. **Set the Pages source to GitHub Actions**
   Repository → Settings → Pages → *Build and deployment* → Source =
   **GitHub Actions** (not "Deploy from a branch").
   This alone does not publish anything; it only changes where Pages takes its
   content from on the next deploy.

3. **Take a rollback reference**
   ```bash
   git branch old-site origin/main
   git push -u origin old-site
   ```
   This preserves the current live site as a branch you can redeploy from.

4. **Merge `new-site` into `main`**
   ```bash
   git checkout main
   git merge --no-ff new-site
   git push origin main
   ```
   The push triggers `deploy.yml`. Watch it in the Actions tab.

5. **Confirm the custom domain**
   Settings → Pages → *Custom domain* should read `nextlevelcode.tech`, and
   **Enforce HTTPS** should be ticked.

   > The Pages setting and `public/CNAME` must agree. If they disagree, Pages
   > can end up in a redirect loop. Both say `nextlevelcode.tech`.

6. **Verify**
   ```bash
   curl -sI https://nextlevelcode.tech/              # expect 200
   curl -sI https://www.nextlevelcode.tech/          # expect 301 -> apex
   curl -s  https://nextlevelcode.tech/robots.txt
   curl -s  https://nextlevelcode.tech/sitemap-index.xml
   ```
   Then check in a browser: home renders, navigation works, the contact form
   submits, and the 404 page shows for a bad URL.

7. **Search Console**
   Nothing to do. The apex property already exists and stays valid, because the
   canonical host did not change. Resubmit
   `https://nextlevelcode.tech/sitemap-index.xml` so the new URLs are picked up
   promptly.

## Incident, 3 August 2026 — the site 404'd for ~25 minutes

Worth recording, because the failure mode is invisible until it takes the site
down and the obvious explanation was the wrong one.

**Symptom.** Both `nextlevelcode.tech` and `www` returned GitHub's "There isn't
a GitHub Pages site here" 404, while `medrais.github.io/next-level-code/`
served the site correctly and the Deploy workflow reported success.

**Cause.** The Pages **source** had reverted from "GitHub Actions" to "Deploy
from a branch". Under branch mode GitHub serves the repository root of `main` —
and since the rebuild, `main`'s root has no `index.html`, because the site is
built into `dist/`. So Pages had nothing to serve and unbound the domain.

**The tell** was in the Actions list: a `pages build and deployment` run
appearing at all. That is GitHub's legacy branch builder. If the source is
"GitHub Actions" it never runs. Seeing it fail alongside a successful
`Deploy to GitHub Pages` run means the source setting is wrong, whatever the
settings page appears to say.

**Not the cause**, despite looking like it: the `public/CNAME` change from
`www` to the apex landed in the same push. It was coincidental.

**Two rules that follow:**

1. Changing the Pages **source** or **custom domain** is a settings action that
   must be done *before* pushing a matching `CNAME` — never in the same step,
   and never assumed to have persisted. Verify it stuck.
2. After any Pages settings change, re-check that
   `curl -sI https://nextlevelcode.tech/` returns 200. A successful Deploy run
   is not evidence the site is reachable; it only proves the artifact uploaded.

## Rollback

If something is wrong after cutover:

```bash
git checkout main
git revert --no-commit <merge-commit-sha>
git commit -m "revert: roll back to previous site"
git push origin main
```

The push re-runs `deploy.yml` and republishes. If the build itself is broken,
redeploy from the `old-site` branch created in step 3 instead.

Reverting does **not** touch the custom domain setting — if you also want the
apex back as canonical, change it in Settings → Pages.
