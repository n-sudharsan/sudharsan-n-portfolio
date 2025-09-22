# Sudharsan Portfolio

A fast, minimal‑dependency single‑page Cloud DevOps Engineer portfolio. Pure **HTML / CSS / vanilla JS** (no frameworks) for frictionless hosting on GitHub Pages, Netlify, Vercel, S3, Azure Static Web Apps, etc.

Current highlights:
- Accessible resume modal with watermark overlay + on‑demand print (toolbar hidden for cleaner look).
- Reverse chronological unified project list (no “Earlier” grouping; most recent first).
- Expanded impact bullet lists surfaced by default (no toggle UI; simplified DOM & CSS).
- Strong AI Platform / DevOps narrative (GitOps, Terraform modules, model deployment enablement).
- Contact form: async Formspree submission, inline validation, status feedback (single primary action).
- Theme toggle with persistence (`localStorage`).
- Lightweight animations (IntersectionObserver + staged hero entrance) respecting reduced‑motion.
- Structured data (Person + SoftwareSourceCode) for SEO enrichment.

## Files
- `index.html` – Main page structure (semantic sections, SEO + schema.org)
- `styles.css` – Theme, layout, components
- `script.js` – Theme toggle, mobile nav, scroll spy, fade‑in animations, contact form async handler, resume modal logic (including print proxy iframe)
- `Sudharshan_resume_cloud_devops.pdf` – Your resume (linked in hero button)
- `image.jfif` – Avatar / profile image (replace with your own)

## Customize (Find & Replace)
Update or confirm the following in `index.html`:

| Placeholder | What to Change |
|-------------|----------------|
| `Sudharsan` | Your full name (keep initials consistent with badge if desired) |
| `YOUR-LINKEDIN` | Your LinkedIn handle (e.g. `sudharsan-dev`) |
| `YOUR-GITHUB` | Your GitHub username |
| `YOUR-EMAIL` | Contact email |
| Experience cards | Replace role title, company, dates, bullet points |
| Skills list | Adjust categories / chips to match your stack |
| Projects section | Each project title, description, impacts & tags |
| Certifications | Replace entries with actual titles, issuers, year, credential IDs |
| Education | Degree, institution, years, focus lines |
| Schema.org JSON-LD | Match name, title, URLs, social links |

## Mapping from Resume → Site Sections
| Resume Section | Portfolio Section |
|----------------|------------------|
| Professional Summary | Hero (h1/h2 + paragraph) |
| Experience (roles) | Experience cards (`.exp-item`) |
| Technical Skills | Skills grid (group by Cloud / DevOps / Containers / Data / Security) |
| Projects / Achievements | Projects cards (focus on measurable impact) |
| Certifications | Certifications grid |
| Education | Education section |
| Contact details | Contact panel + footer |

## Adding More Experience
Duplicate an `<article class="exp-item">...</article>` block inside `#experience .experience-list`. Keep 5–7 concise action + impact bullets (e.g. *Reduced deployment latency 60% by introducing parallelised Terraform plan/apply workflow caching*).

## Styling Adjustments
Tweak global theme variables at top of `styles.css`:
```
:root {
  --primary:#0b57a4;
  --secondary:#176fb3;
  --accent:#00d4ff;
  --bg:#0a0e1b;
  --surface:#1a1f36;
}
```
Light mode values are defined under `body.light`.

## Replacing the Avatar
Overwrite `image.jfif` with a square image (ideally ≥512×512). Keep filename or update the hero `<img>` `src`.

## Deploy Options
### GitHub Pages
1. Create a new repo and push these files.
2. In GitHub: Settings → Pages → Deploy from `main` / root.
3. Wait for the URL to appear (usually `https://username.github.io/reponame`).

### Netlify / Vercel
Drag and drop the folder onto the dashboard or connect the repo. No build step required (static).

### AWS S3 + CloudFront
1. Create S3 bucket (enable static hosting, public or via CloudFront OAI).
2. Upload files (`index.html` root).
3. (Recommended) Put CloudFront in front with HTTPS + caching.

### Azure Static Web Apps
Select the repo; build preset: *Custom* → App location: `/` → No build command required.

## Performance Tips
- Compress `image.jfif` (use TinyPNG or Squoosh) → target < 100KB.
- Consider inlining a critical CSS subset (fold content) for extra speed (optional).
- Add `<link rel="preload" as="image" href="image.jfif">` if LCP matters.

## Accessibility Checklist
- Alt text for main avatar.
- Landmark roles: `header`, `main`, `footer`.
- Color contrast meets WCAG AA baselines (verify if you alter palette).
- Visible keyboard focus states (retain outlines or custom focus ring).
- Escape key closes resume modal; focus restored to trigger.

## SEO Enhancements (Optional)
Add sensible `meta name="description"`, refine OpenGraph image, and keep structured data in sync with your name, title, and social links. For individual project pages (if you split later), add per‑page OG/Twitter tags.

## Modifying Skills Layout
To add a new skill category:
```
<div class="skill-box">
  <h3><i class="fa fa-lock"></i> Security</h3>
  <ul class="skill-list">
    <li class="skill-chip">IAM</li>
    <li class="skill-chip">KMS</li>
    <li class="skill-chip">WAF</li>
  </ul>
</div>
```

## Dark / Light Theme
Theme preference stored in `localStorage` key `theme`. To force dark mode: remove the toggle markup + corresponding JS IIFE.

## Adding Real Project Links
Replace placeholders with actual URLs. For private or internal projects:
- Omit the Code button
- Or create a public README/Case Study repo
- Or link to an architecture diagram PDF

## Optional Enhancements (Roadmap)
| Feature | Value |
|---------|-------|
| Contact form (Formspree / Lambda) | (Implemented) Async submission + honeypot anti‑bot |
| Blog / Articles section | Boosts SEO + authority (use a `/blog` folder or static generator later) |
| JSON data feed (`projects.json`) | Lets you map & render dynamic cards without editing HTML |
| Simple service worker | Offline fallback + asset caching |
| Lighthouse automation (GitHub Action) | Ensures performance & a11y budgets stay green |
| Structured data for `Project` | Rich results for notable case studies |
| Tag filter for projects | Improves UX if list grows large |
| Print stylesheet | Cleaner layout if printing the modal / site |
| +N tag truncation logic | Compact long tag clusters |

## Simple Project JSON Example
Create `projects.json`:
```
[
  {
    "title": "Kubernetes Cost Optimizer",
    "desc": "Automated rightsizing + scheduled scale-down reducing monthly spend 28%",
    "links": {"code": "https://github.com/your/k8s-opt"}
  }
]
```
Then in `script.js` (append):
```
fetch('projects.json')
  .then(r=>r.json())
  .then(items => {
    const grid = document.querySelector('.projects-grid');
    if(!grid) return;
    items.forEach(p => {
      const el = document.createElement('article');
      el.className='project-card';
      el.innerHTML = `<h3>${p.title}</h3><p>${p.desc}</p>`;
      grid.appendChild(el);
    });
  });
```

## Version Control Suggestion
Commit in logical chunks:
```
feat: add experience & skills content
feat: add certifications section
chore: optimize hero image
refactor: extract project data to json
```

## License
Personal use by default. Add MIT (or similar) if you want public reuse.

---
### Resume Modal & Printing
The resume is embedded via `<object>` with a watermark overlay and optional print triggered through a hidden iframe (`#print-proxy`) to improve reliability of the system print dialog. Toolbar is suppressed using PDF fragment params (`#toolbar=0&...`). Adjust or remove the watermark in `styles.css` (`.pdf-watermark`).

### Watermark Customisation
Edit `.pdf-watermark::after` content or reduce opacity. For print‑clean output, add an `@media print { .pdf-watermark{display:none;} }` rule.

### Contact Form
Uses Formspree endpoint (update `action`). Displays dynamic status messages and provides basic required‑field validation. Add server‑side verification for production.

---
Need help extending it? Open an issue or adapt further—clean separation keeps maintenance low.
