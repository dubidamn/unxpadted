## **Clash of Unxpadted — Event Brief**

### **What It Is**

A first-of-its-kind hybrid competition in Indonesia that combines **esports** and **academic challenges** into one live event, all played on the Infinix XPAD 30 Pro. Classes compete against classes — not individuals — until one class is crowned "Class of Unxpadted."

### **Why It Exists**

It's the marketing platform for the **XPAD 30 Pro** launch, built around the insight that today's Indonesian students (the "Slash Gen," 18–25) constantly switch between being a student, a good kid for their parents, and a gamer/teammate — and need one device that's big enough to win on and fast enough to keep up with them.

### **Partner**

Built in collaboration with **Ruangguru**, extending an earlier partnership (the "Clash of Champions" school program), giving the event access to Ruangguru's school network.

### **Format (high level)**

* Class vs. class battles, mixing gaming stations and academic stations  
* One continuous event with a running clock and a live scoreboard  
* Designed so both "brains" (academic skill) and "game" (esports skill) matter equally — no team wins on just one strength

### **Where It Happens**

A custom-built **XPAD Arena**, an outdoor esports-style venue set up at school locations, styled like a pro tournament stage.

### **PR Angle**

Positioned as **"the world's first"** event of its kind in Indonesia, pitched to media as a story about how today's youth can excel in both academics and esports — intended to generate news coverage beyond a typical product launch or tournament.

### **Core Message**

**"Be Unxpadted"** — don't choose between being smart and being competitive. Show up and win at both, on one device.

Design System:

\---

version: alpha

name: Infinix Mobility (Dark)

description: A clean retail-tech system with bold product-first hero moments and restrained utility UI, reworked for dark mode with a neon green primary accent.

colors:

  primary: "\#39FF14"

  secondary: "\#A3A3A3"

  tertiary: "\#262626"

  neutral: "\#0D0D0D"

  surface: "\#0D0D0D"

  on-surface: "\#FFFFFF"

  error: "\#FF5449"

  border: "\#262626"

  muted: "\#1A1A1A"

typography:

  headline-display:

    fontFamily: InfinixDisplay

    fontSize: 32px

    fontWeight: 400

    lineHeight: 38px

    letterSpacing: 0px

  headline-lg:

    fontFamily: Aktiv Grotesk Ex

    fontSize: 32px

    fontWeight: 700

    lineHeight: 38px

    letterSpacing: 0px

  headline-md:

    fontFamily: Aktiv Grotesk Ex

    fontSize: 27px

    fontWeight: 700

    lineHeight: 32px

    letterSpacing: 0px

  headline-sm:

    fontFamily: InfinixDisplay

    fontSize: 23px

    fontWeight: 400

    lineHeight: 28px

    letterSpacing: 0px

  body-lg:

    fontFamily: Aktiv Grotesk Ex

    fontSize: 19px

    fontWeight: 400

    lineHeight: 20.6667px

    letterSpacing: 0px

  body-md:

    fontFamily: Aktiv Grotesk Ex

    fontSize: 16px

    fontWeight: 400

    lineHeight: 24px

    letterSpacing: 0px

  body-sm:

    fontFamily: Aktiv Grotesk Ex

    fontSize: 10.3333px

    fontWeight: 400

    lineHeight: 14px

    letterSpacing: 0px

  label-lg:

    fontFamily: Aktiv Grotesk Ex

    fontSize: 16px

    fontWeight: 500

    lineHeight: 24px

    letterSpacing: 0px

  label-md:

    fontFamily: Aktiv Grotesk Ex

    fontSize: 14px

    fontWeight: 500

    lineHeight: 20px

    letterSpacing: 0px

  label-sm:

    fontFamily: Aktiv Grotesk Ex

    fontSize: 10.3333px

    fontWeight: 500

    lineHeight: 14px

    letterSpacing: 0px

  nav-md:

    fontFamily: Aktiv Grotesk Ex

    fontSize: 16px

    fontWeight: 500

    lineHeight: 24px

    letterSpacing: 0px

  caption-sm:

    fontFamily: Aktiv Grotesk Ex

    fontSize: 12px

    fontWeight: 400

    lineHeight: 16px

    letterSpacing: 0px

rounded:

  none: 0px

  sm: 2.58333px

  md: 8px

  lg: 12px

  xl: 16px

  full: 9999px

spacing:

  xs: 8px

  sm: 16px

  md: 26px

  lg: 56px

  xl: 86px

components:

  button-primary:

    backgroundColor: "{colors.primary}"

    textColor: "{colors.neutral}"

    typography: "{typography.label-sm}"

    rounded: "{rounded.sm}"

    padding: 14px 19px

    height: 38px

    width: 114px

  button-primary-hover:

    backgroundColor: "{colors.secondary}"

    textColor: "{colors.neutral}"

    typography: "{typography.label-sm}"

    rounded: "{rounded.sm}"

    padding: 14px 19px

    height: 38px

    width: 114px

  button-secondary:

    backgroundColor: "{colors.surface}"

    textColor: "{colors.primary}"

    typography: "{typography.label-sm}"

    rounded: "{rounded.sm}"

    padding: 14px 19px

    height: 38px

    width: 114px

  button-link:

    backgroundColor: "transparent"

    textColor: "{colors.secondary}"

    typography: "{typography.body-sm}"

    rounded: "{rounded.none}"

    padding: 0px

  card:

    backgroundColor: "{colors.surface}"

    textColor: "{colors.on-surface}"

    rounded: "{rounded.md}"

    padding: 16px

  input:

    backgroundColor: "{colors.surface}"

    textColor: "{colors.on-surface}"

    typography: "{typography.body-md}"

    rounded: "{rounded.sm}"

    padding: 12px 14px

  chip:

    backgroundColor: "{colors.muted}"

    textColor: "{colors.on-surface}"

    typography: "{typography.label-md}"

    rounded: "{rounded.full}"

    padding: 8px 12px

\---

\# Infinix Mobility (Dark)

\#\# Overview

Infinix still feels youthful, product-forward, and promotional, with a strong retail energy rather than a quiet editorial tone — now expressed as a dark, high-contrast interface with a neon green signature accent. The layout stays spacious and highly visual, built to showcase bold device imagery against deep black surfaces, with the neon primary color doing the work of drawing the eye to key actions. Overall the system should feel modern, lightweight, and confident, with crisp typography and minimal decorative chrome.

\#\# Colors

\- \*\*Primary (\#39FF14):\*\* The signature neon green accent, used for the most important actions, key highlights, and moments that need to pop against the dark surface.

\- \*\*Secondary (\#A3A3A3):\*\* A lightened gray used for supporting text, navigation, and secondary UI so copy stays legible on black without competing with the neon accent.

\- \*\*Tertiary (\#262626):\*\* A dark neutral tone for cards, dividers, and subtle structure — the dark-mode counterpart to a light hairline border.

\- \*\*Surface (\#0D0D0D):\*\* The main page and component surface color; content blocks sit on a near-black surface with very little tonal layering, keeping the system flat and confident.

\- \*\*Neutral (\#0D0D0D):\*\* The background partner to the neon primary, used for text on primary-filled buttons and other reversed, high-contrast contexts.

\- \*\*Muted (\#1A1A1A):\*\* A very low-lift dark wash for chips, subtle containers, or low-emphasis surfaces when the design needs gentle separation from pure black.

\- \*\*Error (\#FF5449):\*\* Reserved for validation, destructive actions, and alert states; brightened from the original red so it stays legible on dark surfaces, and remains sparing in this otherwise monochrome-plus-neon system.

\#\# Typography

Aktiv Grotesk Ex remains the primary workhorse family for navigation, body, labels, and UI controls, unchanged by the shift to dark mode. InfinixDisplay is still used for select brand-forward display moments to add a distinct identity note, and should remain limited so the interface doesn't feel overly stylized.

Headlines are compact and assertive: h1 and h2 use Aktiv Grotesk Ex at bold weights, while h3 can switch to InfinixDisplay for a softer branded feel. Body copy is regular-weight and comfortably spaced for product descriptions and support content, set in white or light gray against black. Labels and buttons should feel crisp and functional; keep letter-spacing neutral rather than reaching for an exaggerated uppercase tracking.

\#\# Layout

The system still favors a wide, fluid desktop layout with large hero imagery and generous open space around key messaging — the darker canvas makes bold product photography and the neon primary accent feel even more high-impact. Content blocks align to a simple grid with substantial horizontal breathing room, and spacing steps should follow the observed rhythm of 8px, 16px, 26px, 56px, and 86px. Sections should feel expansive rather than dense, with clear separation between promotional hero areas, utility navigation, and supporting content.

Cards and UI panels use modest internal padding, typically around 16px, to keep the interface efficient and retail-focused. Primary page sections should avoid overly tight stacking; reserve larger gaps for between major modules and smaller gaps for grouped label-text pairs.

\#\# Elevation & Depth

Elevation is still intentionally flat. The interface relies on contrast, borders, and large-scale imagery instead of shadows or layered floating surfaces — on black, hairline borders in the dark tertiary tone read clearly without needing drop shadows. The one allowance for the neon accent: primary actions and key highlights may use a subtle, restrained glow around the neon green fill to reinforce it as the focal point, but this should stay minimal and never spread into a general glassmorphism or heavy-glow treatment elsewhere in the system.

\#\# Shapes

The shape language is restrained and slightly softened. Interactive elements use small radii, with buttons around 2.58px and cards at 8px, which keeps the system feeling precise and technical rather than playful. Use rounded corners sparingly and consistently; nothing should look pillowy or overly organic unless it is a deliberate chip or tag.

\#\# Components

Buttons are compact and utilitarian. \`button-primary\` uses a neon green fill with near-black text, small-radius corners, and fixed proportions that suit strong calls to action — the highest-contrast, most attention-grabbing element in the system. \`button-primary-hover\` shifts the fill to the lighter gray secondary tone rather than adding glow or motion, keeping hover states subtle. \`button-secondary\` reverses the treatment with a dark surface background and neon green text/outline for lower-emphasis actions that still nod to the accent color. \`button-link\` stays text-only, gray, and borderless for inline navigation and legal links.

Cards should stay on the dark surface, bordered in the dark tertiary tone, and shadowless, with \`card\` using a light hairline border and 16px padding. They are structural containers, not decorative panels, so avoid heavy contrast or floating effects beyond the border. Inputs follow the same restrained logic: dark surface background, subtle border, modest padding, and clear focus states that rely on a neon green outline or border color rather than glow.

Chips can use the muted dark surface tone with rounded-full corners for compact metadata, filters, or quick options. Navigation items should use the medium label style and remain visually quiet in light gray until active or hovered, at which point neon green can indicate the active state. For consent bars and banners, pair a large dark surface with white or gray text and strong rectangular action buttons in neon green; this keeps the direct, conversion-first behavior of the original system.

\#\# Do's and Don'ts

\- Do keep the page visually spacious and hero-led, with product imagery taking precedence over dense text blocks.

\- Do use Aktiv Grotesk Ex for most interface copy and reserve InfinixDisplay for limited brand moments.

\- Do rely on contrast and borders for hierarchy instead of shadows or layered elevation, reserving any glow effect for the neon primary accent only.

\- Do keep buttons compact, rectangular, and high-clarity, especially for primary conversion actions in neon green.

\- Don't introduce heavy rounding, soft shadows, or glassmorphism effects.

\- Don't overuse the neon accent color; the system is fundamentally dark and monochrome with neon green reserved for emphasis only.

\- Don't make navigation or utility text too large, too decorative, or too bright — leave the neon punch to primary actions.

\- Don't crowd sections; preserve the generous rhythm implied by the large hero composition.

Assets:

* unxpadted-logotype.png (event logo: clash of unxpadted) — [https://i.imgur.com/fNtfFL5.png](https://i.imgur.com/fNtfFL5.png)  
* device-accent.png — [https://i.imgur.com/09SFmYc.png](https://i.imgur.com/09SFmYc.png)  
* device-back2.png — [https://i.imgur.com/BUVIhyY.png](https://i.imgur.com/BUVIhyY.png)  
* device-back.png — [https://i.imgur.com/vsQd1XQ.png](https://i.imgur.com/vsQd1XQ.png)  
* logotype.png (xpad30pro logo) — [https://i.imgur.com/FFvOtN0.png](https://i.imgur.com/FFvOtN0.png)  
* infinix-logo.png (black) — https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Infinix\_logo.svg/960px-Infinix\_logo.svg.png  
* ruangguru-logo.svg (blue) https://cdn-web-2.ruangguru.com/landing-pages/assets/hs/OPTIMIZE/logo%20rg.svg

–

# **Competition System**

**Version:** 1.0 (Simple/MVP) **Prepared for:** Infinix XPAD 30 Pro x Ruangguru — Clash of Unxpadted **Doc type:** Product Requirements Document

---

## **1\. Background**

Clash of Unxpadted is a live class-vs-class hybrid event combining academic challenges (Math Speedrun, Cerdas Cermat, AI Pitch, AI Social) with esports stations, all played on the Infinix XPAD 30 Pro.

This PRD covers the **software system** needed to run the academic/quiz stations live on stage: two team-facing tablets, one gamemaster control panel, and one main screen monitor for the audience.

All four interfaces must sync in **real time** on the same local network so a buzz, an answer, or a timer change is instantly reflected everywhere.

---

## **2\. Goals**

* Let two competing classes (Team X and Team Y) access questions, buzz in, and submit answers on their own tablet.  
* Let one gamemaster run the whole match from a single control panel: load questions, manage teams, and control the timer.  
* Let the audience follow the match live on a big-screen monitor showing score, timer, and current station.  
* Keep it simple enough to set up and run per match without technical staff on stage.

## **3\. Out of Scope**

* The esports stations (MLBB, Free Fire) — these run on their native game clients, not this system.  
* Scoring/matchmaking across multiple matches or a season-long leaderboard.  
* User accounts, login, or long-term data storage beyond a single event day.

## **4\. Users / Roles**

| Role | Device | Purpose |
| ----- | ----- | ----- |
| Team X Player(s) | Tablet 1 | View question, buzz, submit answer |
| Team Y Player(s) | Tablet 2 | View question, buzz, submit answer |
| Gamemaster | Control laptop/tablet | Run and referee the match |
| Audience / Host | Main screen / TV | Follow match progress |

---

## **5\. Interface Requirements**

### **5.1 Team Interface (x2 — Team X & Team Y)**

Same interface, deployed twice, one per team tablet.

**Must have:**

* Display the current active question/challenge pushed by the gamemaster.  
* A **Buzz button**, big and central, only active when the gamemaster opens the buzzer window.  
* Locks out after buzzing — shows "Buzzed" state, disables further buzzing until reset.  
* Shows whether their buzz was first, second, or too late.  
* An **answer submission** field appropriate to the question type (multiple choice tap, or short text/number entry).  
* Displays own team's current score and match status (which leg is active).  
* Clear "waiting" state when it's not their team's turn.

**Nice to have (later phase):**

* Sound/vibration cue when buzzer window opens.  
* Countdown visible on-screen during timed rounds.

### **5.2 Gamemaster Control Panel**

**Must have:**

* **CSV upload** for questions/challenges. Each row maps to one question with fields such as: station ID, question text, choices (if any), correct answer, points, time limit.  
* **Team management**: set/edit Team X and Team Y names (e.g. class names) before a match.  
* **Timer control**: start, pause, resume, reset — per leg and for the whole 55-minute match clock.  
* Ability to select which station/question is currently "live" and push it to both team tablets.  
* Open/close the buzzer window (who's allowed to buzz, and when).  
* View incoming buzz order and submitted answers from both teams.  
* Manually mark an answer correct/incorrect and award points (final say rests with gamemaster).  
* One button to push the current state (score, timer, station) to the Main Screen Monitor.  
* Ability to reset/advance to the next leg.

### **5.3 Main Screen Monitor**

**Must have:**

* Large, readable display of: current match leg/station name, running timer, and live score (Team X vs Team Y).  
* Visual progress indicator toward the 11-point match, highlighting the matchpoint (6).  
* Shows which team buzzed first / is currently answering.  
* End-of-match screen showing final score and winning team ("Class of Unxpadted").  
* Read-only — no interactive controls, purely a display.

---

## **6\. Data: Question CSV Format**

Simple flat file the gamemaster uploads before each match.

| Column | Description |
| ----- | ----- |
| station\_id | e.g. X1, X2, X3, X4 |
| question\_text | The question or prompt shown to teams |
| choices | Optional, pipe-separated (for multiple choice) |
| correct\_answer | Expected correct answer |
| points | Points awarded for this question |
| time\_limit\_sec | Time allowed to answer |

---

## **7\. Non-Functional Requirements**

* **Real-time sync:** all 4 interfaces reflect the same match state within \~1 second (buzz order especially must be accurate and fair).  
* **Device:** must run well on the Infinix XPAD 30 Pro (tablet-sized screens) for the two team interfaces.  
* **Network:** designed to run on a local venue network; should not depend on unstable public internet.  
* **Reliability:** gamemaster must be able to correct/override any state (score, timer, active question) mid-match without restarting the system.  
* **Simplicity:** no login required during the event; gamemaster panel is the only interface with administrative controls.