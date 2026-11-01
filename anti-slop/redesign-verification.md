# ISE Domain redesign verification

Date: 2026-11-01. Mode: during (session override). Owner direction: retain the Japanese industry identity with stronger typography and calmer surfaces. Scope: the overview, shared catalog presentation, search labels, route titles, loading/error presentation, and Data Science interaction. Imported curriculum, career records, source URLs, and the Mathematics/MR/PP hierarchies are retained.

## Delivery Gate

### Hard Gate

- R-02 PASS: revised interface copy uses no em dashes; search normalization still recognizes them as input.
- R-03 PASS: browser viewport checks at 320, 390, 768, and 1440px; fixed search/filter wrapping and the narrow-phone Career Guide heading. Final 320px English and Persian checks measured 305px content and 305px scroll width.
- R-17 PASS: subject counts come from `courses`; graduate count comes from `pathways`; 140 credits is the validated degree requirement.
- R-18 PASS: no testimonials, customer names, or avatars added.
- R-23 PASS: reused original SVGs and the existing name/Japanese mark; no new visual asset or navigation destination created.
- R-24 PASS: all seven curriculum links and five supporting-directory links were clicked and verified against their destinations.
- R-25 PASS: calculated contrast for foreground, muted text, and accent against all three shared surfaces in both themes; lowest tested normal-text pair is 5.16:1. Action-label contrast is 8.32:1 dark and 6.25:1 light.
- R-26 PASS: revised links, manual principle controls, theme/menu controls, filters, search, dialogs, and Data Science connect/reset have real behavior. Click evidence follows below.
- R-27 PASS: existing empty-result/reset state verified; loading states identify the guide/catalog; `app/error.tsx` supplies retry and refresh guidance. The error boundary was code-inspected, not triggered in the browser.
- R-28 PASS: no FAQ added.
- R-32 PASS: a course was opened with Enter and its dialog dismissed with Escape; semantic links/buttons and visible focus styling retained.
- R-33 PASS: changes are authored directly in TSX/CSS; no source-rewriting helper or runtime CSS patcher added.
- R-34 PASS: both native theme selections were exercised; layout checks passed in light and dark. Palette calculations use declared site colors. Extension interference is recorded under limits.
- R-35 PASS: type check, catalog validation, authored-code lint, production export, artifact checks, and the scoped click-through below completed.
- R-36 PASS: no security, customer, or speed claims added; no Lighthouse or Web Vitals score claimed.
- R-37 PASS: owner-selected direction is recorded in `DESIGN.md`; Design Read announced before implementation.
- R-38 PASS: catalog content and actual destinations retained; new overview copy describes the guide's existing function.
- R-39 PASS: native controls, accessible names, visible search labels, 44px control targets, focus styles, reduced-motion handling, route titles, and language/direction metadata are present. Data Science changes have a live announcement.
- R-40 PASS: hero SVG is an HTML image with reserved dimensions and high fetch priority; index/dialog images are sized; no third-party render-blocking script added. Performance scores were not measured.

### Purpose-Gate

- R-01 PASS: ink/paper/vermilion decisions are recorded in `DESIGN.md`; removed the shared purple gradient treatment. Course-banner shading remains solely for reading text over existing subject illustrations.
- R-04 PASS: directory icons and the decorative factory/sparkle glyphs were removed. Remaining utility icons describe their controls; the star represents the real GitHub star count.
- R-06 PASS: retained the existing reading fonts and documented the compact editorial heading rationale; reduced label tracking.
- R-07 PASS: no background texture added. The retained systems figure depicts relationships between systems and is separated from the reading surface.
- R-08 PASS: removed repetitive arrows from the curriculum and directory; retained external-link and directional navigation cues.
- R-09 PASS: retained only factual course/resource/exposure labels; squared their presentation and removed glows.
- R-10 PASS: header and shared menu surfaces are opaque; revised interface has no glass layers.
- R-12 PASS: floating-menu shadows distinguish overlays; content surfaces remain flat.
- R-13 PASS: no new glow; removed the visible orbital/pulsing Data Science presentation.
- R-14 PASS: numbered subject rows express equal classification; the supporting directory uses compact text rows, not a second card grid.
- R-19 PASS: removed automatic principle rotation, scroll entrance effects, theme wipe, and the Data Science animation timer. Only interaction feedback remains.
- R-22 PASS: original subject SVGs identify real curriculum topics; no stock/generated imagery introduced.

### Liveliness

- PASS: ENERGY 2 / RHYTHM 3 / MOTION 1 declared in `DESIGN.md` and implemented.
- PASS: large editorial introduction, dense subject index, compact directory, and separate Japanese-industry panel provide distinct composition and spacing.
- PASS: the main heading leads the overview; each catalog page leads with its subject and search/filter controls.
- PASS: the existing Japanese domain mark and manufacturing principles provide a specific identity; the action color has a defined role.

### Craftsmanship and quality locks

- C-1 / R-31 PASS: major palette, layout, typography, image, icon, and motion choices have written reasons in `DESIGN.md`.
- C-2 PASS: scoped interaction checks completed; imported external destinations are retained and validated as URLs, not claimed to have been visited again.
- C-3 / R-05 PASS: sections reflect the actual curriculum, study destinations, and Japanese manufacturing content; no marketing-template sections added.
- C-4 PASS: revised layouts checked at phone, tablet, and desktop sizes in both languages; theme and keyboard controls exercised.
- C-5 PASS: no fabricated evidence or metrics.
- R-11 PASS: 4px control and 8px container radii distinguish roles; no universal pill treatment.
- R-15 / R-16 PASS: primary action says `Read the curriculum`; directory headings identify actual destinations rather than generic promises.
- R-20 / R-30 PASS: retained ISE Domain's own industrial/Japanese content and original artwork; no imitation of a named product.
- R-21 PASS: existing dark preference and light/dark toggle retained; both palettes use the same reading hierarchy.
- R-29 PASS: shared brand palette is neutral ink/paper plus one action accent. Degree segments retain meaningful categorical color encoding.

## Recorded browser click-through

| Control | Observed result |
| --- | --- |
| Seven curriculum index entries | Each opened Chart Analysis with the matching category selected: core, math, programming, management, finance, engineering foundations, product. |
| Mathematics category | Four ordered subheadings and all 14 courses retained, including Uncertainty Topics. |
| Five directory entries | Opened Master’s Majors, Career Guide, Tools & Software, Resources, and Wikipedia References with the correct page heading. |
| Course category select | Opened options and selected Mathematics. |
| Course row | Enter opened General Mathematics 1, showing prerequisites, pathways, resources, and Wikipedia connections. |
| Course dialog | Escape closed the dialog. |
| Catalog search | A nonexistent query produced No matches yet; Reset filters restored all categories. |
| Global search | Typed Maintenance; suggestions included Maintenance and Repair Planning and the MR career. Choosing the career opened its dialog. |
| Career dialog | Showed Maintenance and Repair under Industrial/Manufacturing; close button dismissed it. |
| Career hierarchy | Retained 10 domains and 31 roles, including ordered MR and PP entries and filled domain containers. |
| Tools search | Excel query returned Microsoft Excel and Microsoft Excel Solver; Clear search removed the query. |
| Tools pathway select | Selected Systems Optimization and rendered its matching tool set. |
| Resources nested filter | Opened Career Guide submenu and selected Industrial/Manufacturing. |
| Japan resource filter | Combined filtering produced the empty state and exposed Reset filters. |
| Principle controls | Next showed Just-in-Time; Previous returned to Kaizen. Automatic rotation removed. |
| Mobile menu | Opened, exposed existing section links, and closed after navigation. |
| Language links | Switched English/Persian and verified updated lang/dir/title at phone and tablet widths. Existing query-preservation code retained. |
| Theme control | Changed native light/dark selection with unchanged content and layout. |
| Data Science | Connect revealed the career details; Revisit foundations restored both subject lists. No looping animation remains. |

The course, tool, career, and resource lists share data-driven renderers. Representative repeated controls were exercised; this report does not claim an individual browser click on every imported record or an external-link availability audit.

## Checks and limits

- `npx tsc --noEmit`: passed.
- `node scripts/validate-data.mjs`: passed, including 84 course records, 10 pathway groups, 77 tools, 31 career profiles, and Mathematics membership.
- Authored application `oxlint`: passed.
- GitHub Pages production export and `prepare-github-pages.mjs`: passed; all localized routes prerendered and asset references verified.
- Browser console: hydration warnings explicitly contained Dark Reader's injected `data-darkreader-inline-color` and style attributes. No separate application exception was observed in the inspected log entries.
- Browser limitation: the available preview browser has Dark Reader enabled, which can recolor pages after navigation. A clean Chrome connector was unavailable. Extension settings were left untouched; screenshots may reflect its colors. Native palette ratios above were calculated directly from the site stylesheet.
- Unchanged imported external resource links were code/data-validated, not revisited individually. No accessibility certification, error-injection test, Lighthouse score, or Web Vitals measurement is claimed.
