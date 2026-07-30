# BIMM Lab Website

Static, multi-page website for the Bio-Inspired Multifunctional Materials
Laboratory (BIMM Lab), Mechanical Engineering Department, New Mexico Tech.

Plain HTML/CSS/JS — no build step, no framework, no dependencies.

## Structure

```
index.html          Home
research.html        Research focus areas
publications.html    Publications (Journal Articles, Conference Proceedings, Theses, Patents)
teaching.html         Courses taught
people.html           PI profile and lab members
openings.html         Graduate / undergraduate openings
news.html             Lab news (placeholder)
media.html            Media coverage (placeholder)
css/styles.css        Shared stylesheet
js/nav.js             Shared navigation behavior (Openings dropdown)
assets/img/           NM Tech logo, sponsor logos
```

Every page includes the same header/nav markup (a horizontal top nav with an
"Openings" dropdown) and a matching page-hero banner, and links to the shared
`css/styles.css` and `js/nav.js`. There's no templating engine, so if you add
a page, copy the header/nav/hero/footer blocks from an existing page and add
a matching nav entry to every other page.

## Previewing locally

No build tools or installs are required — just serve the folder over HTTP
(opening the files directly with `file://` mostly works too, but a local
server avoids any browser quirks with relative paths).

**Python (if installed):**

```
cd bimm-lab-website
python -m http.server 8000
```

Then open http://localhost:8000 in a browser.

**Node (if installed):**

```
cd bimm-lab-website
npx serve .
```

**VS Code:** use the "Live Server" extension and click "Go Live" from
`index.html`.

## Notes

- The Google Scholar link on the People page is a placeholder (`#`) flagged
  with a "TODO" badge — a public profile URL for Dr. Ghosh could not be
  confirmed and should be added once available.
- The Publications page lists real Journal Articles and Conference
  Proceedings, grouped by year; Theses Supervised and Patents remain
  placeholder sections pending content.
- Openings, News, and Media are placeholder pages ready for content.
