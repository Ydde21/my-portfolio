

## Eddy Casas — Portfolio Website (Rebuilt & Enhanced)

A modern, single-page portfolio website for **Eddy Casas**, Full Stack Developer, rebuilt from scratch with improved design, responsiveness, and no gradients.

---

### Design Direction
- **Clean, solid-color design** — no gradients anywhere. Use solid accent colors (e.g., a bold blue or teal) with high-contrast text
- **Dark/light theme toggle** preserved
- **Smooth scroll-based animations** using CSS animations (no GSAP dependency needed — lighter and simpler)
- **Fully responsive** from 320px mobile to ultra-wide desktop

---

### Sections

#### 1. **Navigation Bar**
- Fixed top nav with glass-blur backdrop
- Logo "use 3D image" on the left, nav links on the right (Home, Tech Stack, Projects, Contact)
- Dark/light mode toggle button
- Mobile: hamburger menu with slide-in drawer

#### 2. **Hero Section**

- Subtitle: "Full Stack Developer & Vibe Coding Specialist"
- Short bio paragraph
- Two CTA buttons: "View Projects" and "Contact Me" — solid colored buttons, no gradient
- Subtle floating geometric shapes or dots as background decoration instead of gradient blobs

#### 3. **Tech Marquee**
- Continuous scrolling ticker showing all technologies (CSS animation)
- Two rows scrolling in opposite directions
- Clean pill/badge style for each tech item

#### 4. **Tech Stack Section**
- Three category cards: Frontend, Backend, Database & Cloud
- Each card with a solid colored top accent bar (blue, purple, teal)
- Tech items listed as clean badges/tags inside each card
- Fade-in animation on scroll

#### 5. **Projects Section — "Featured Work"**
- Three project cards in a responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- **Haven Harmony** — Hotel Management System
- **Savvy Wallet** — Finance & Expense Tracker
- **Aniverse Canvas** — Anime Art Platform
- Each card has: image carousel with auto-play & dot indicators, title, description, and "Live Demo" link
- 3D tilt effect on hover (CSS perspective transform)
- **New improvement**: Add tech tags below each project description showing what stack was used

#### 6. **Contact Section — "Get In Touch"**
- Contact info card: Name, Phone, Email, Address
- Social links: GitHub and LinkedIn (re-enabled, they were commented out)
- **New improvement**: Add a simple contact form (name, email, message) — front-end only with toast confirmation
- Footer with copyright

---

### Improvements Over Original
1. **No gradients** — replaced with solid colors, subtle borders, and shadows for depth
2. **Better responsiveness** — proper breakpoints for all screen sizes including small phones
3. **Contact form** added for easy outreach
4. **Social links** re-enabled (GitHub + LinkedIn)
5. **Tech tags on project cards** for quick skill scanning
6. **Lighter animations** using CSS instead of GSAP (faster load, no extra dependency)
7. **Improved accessibility** — proper ARIA labels, focus states, keyboard navigation
8. **About Me mini-section** added to hero with a more detailed intro

