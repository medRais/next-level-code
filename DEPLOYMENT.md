# Deployment and cutover

The site is a fully static Astro build published to **GitHub Pages** from the
`main` branch of `medRais/next-level-code`, served at
**https://www.nextlevelcode.tech**.

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

What changes is which hostname is canonical:

| | Today | After cutover |
|---|---|---|
| Canonical | `nextlevelcode.tech` | `www.nextlevelcode.tech` |
| The other one | `www` → 301 → apex | apex → 301 → `www` |

GitHub Pages performs that redirect automatically once the repository's custom
domain is set to the `www` host — you do not configure the apex separately.

> **Worth knowing before you commit to `www`.** The live site is currently
> indexed on the apex domain. Moving the canonical host to `www` is a standard
> 301 site migration: Google passes ranking through permanent redirects, so the
> impact is normally small and temporary, but it is not zero, and it means
> adding `https://www.nextlevelcode.tech` as a property in Search Console. The
> `google3b35ea81435c516d.html` verification file is carried over in `public/`,
> so verifying the new property is a two-minute job. Staying on the apex would
> avoid the migration entirely — if that is preferable, change `public/CNAME`
> and `site` in `astro.config.ts` to the apex before merging.

## Content gates — clear these before merging

**Status: 3 of 4 PENDING** (technology stacks resolved). The site is
technically complete and the build is green, but three pieces of content are
still placeholders or unconfirmed values, to be filled in directly in the code
by the owner.

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

- [ ] **Complete the legal pages.**
      13 `TODO(owner)` markers across `src/content/legal/en/notice.md` and
      `privacy.md`: legal form, registered address, SIREN/SIRET, VAT, share
      capital, publication director, telephone, governing law and jurisdiction,
      and the enquiry retention period. Both pages show a warning banner until
      these are filled — remove the banner with the last TODO.

- [ ] **Confirm the contact address and test the form.**
      `CONTACT_EMAIL` in `src/data/company.ts` is an assumption. It appears in
      the footer, on /contact/, and as the contact form's failure fallback.
      Send one real enquiry through the form and confirm it arrives: the
      failure path has been tested, the success path deliberately has not,
      since testing it delivers a message to the owner's inbox.

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

5. **Set the custom domain**
   Settings → Pages → *Custom domain* → `www.nextlevelcode.tech` → Save.
   Wait for the DNS check to pass, then tick **Enforce HTTPS** (the certificate
   can take a few minutes to issue).

   > If the repo setting and `public/CNAME` ever disagree, Pages can end up in a
   > redirect loop. They must both say `www.nextlevelcode.tech`.

6. **Verify**
   ```bash
   curl -sI https://www.nextlevelcode.tech/          # expect 200
   curl -sI https://nextlevelcode.tech/              # expect 301 → www
   curl -s  https://www.nextlevelcode.tech/robots.txt
   curl -s  https://www.nextlevelcode.tech/sitemap-index.xml
   ```
   Then check in a browser: home renders, navigation works, the contact form
   submits, and the 404 page shows for a bad URL.

7. **Search Console**
   Add `https://www.nextlevelcode.tech` as a property, verify it (the
   verification file is already served), and submit
   `https://www.nextlevelcode.tech/sitemap-index.xml`.
   Keep the apex property in place — it will report the redirect.

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
