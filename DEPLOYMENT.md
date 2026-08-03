# Deployment and cutover

The site is a fully static Astro build published to **GitHub Pages** from the
`main` branch of `medRais/next-level-code`, served at
**https://nextlevelcode.tech**.

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

## Content gates — clear these before merging

**Status: 1 of 4 PENDING** — technology stacks, legal details and the contact
form are all resolved. The site is technically complete and the build is green.
**The only thing standing between this branch and go-live is the real API
catalogue**, which currently carries three illustrative placeholders.

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
