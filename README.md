# Subsentry

You can copy–paste the whole thing below directly into **Lovable** (or any AI front-end builder) as a single prompt 👇

---

You are a Lovable AI builder that generates fully functional, user-ready front-end interfaces for MVP products.
Build a complete UI for my product using the information below. The design must follow my brand, use intuitive navigation, and generate all screens in one build.

---

## 📌 Context

### Product Name

**SubSentry**

### Product Description

SubSentry is a smart, intuitive web application that empowers users to take control of their recurring subscriptions — from OTT platforms to gym memberships and SaaS tools.
It provides a unified dashboard that displays all active subscriptions, total monthly and annual spending, and sends timely renewal alerts before each payment is charged.
By helping users avoid forgotten renewals and unnecessary expenses, SubSentry transforms subscription management from a chore into a calm, organized experience.

**Tagline:** *“Stay aware. Stay in control.”*

### Primary User Persona

**Aakash Mehta, 28 — Marketing Executive in Bengaluru**

* Digitally active, works in a fast-paced marketing firm.
* Subscribes to Netflix, Spotify, Canva, Google Drive, gym, broadband, etc.
* Pays mostly via UPI and credit card.
* Rarely maintains a manual expense tracker.

**Behavior & Needs:**

* Values **convenience and clarity** over complexity.
* Gets frustrated by **unexpected renewal charges** for unused services.
* Prefers **minimal, intuitive, mobile-responsive** apps.
* Seeks **peace of mind** and a sense of financial order.

**Pain Points:**

* Forgets renewal dates across multiple platforms.
* Spreadsheets are tedious and get abandoned.
* No single place to view all subscriptions and total monthly spending.

**Goals:**

* Avoid surprise renewals or hidden charges.
* Maintain better budgeting awareness.
* Get proactive reminders without sharing full bank access.

**Persona Quote:**

> “I just want to know what’s renewing next week — without digging through my emails and bank statements.”

### Core Problem Solved

Modern users have dozens of recurring payments spread across OTTs, fitness centers, productivity tools, and utilities. These subscriptions auto-renew, causing **“subscription fatigue”** and surprise deductions.

SubSentry solves this by giving users **centralized visibility** and **timely alerts**, helping them stay aware of upcoming renewals and decide whether to cancel, continue, or budget ahead.

**Key Problems Addressed:**

* Lack of centralized visibility into all active subscriptions.
* Forgotten renewals and surprise auto-pay charges.
* Manual, inconsistent tracking methods (spreadsheets, memory).
* Need for simple financial awareness without full banking automation.

### Brand Tone

**Calm, Empowering, Reliable, Friendly**

* **Calm:** UI and copy reduce financial anxiety.
* **Empowering:** Gives users control and confidence.
* **Reliable:** Alerts and data feel accurate and trustworthy.
* **Friendly:** Human, approachable tone — never robotic or overly technical.

**User Feeling:**
The app should feel like it **“has their back”** — quietly watching over subscriptions so users don’t worry about unexpected renewals.

### Visual Identity

**Color Palette**

* **Soft Blue (#3A86FF):** Primary — trust, calmness, clarity.
* **Cool Gray (#F4F5F7):** Background — clean, spacious, supports white space.
* **Mint Green (#8EE3B0):** Success states and positive highlights (“All caught up!”).
* **White (#FFFFFF):** Main canvas — simplicity and transparency.
* **Deep Navy (#1C3D5A):** Headers and key emphasis.
* **Light Sky Blue (#D7E8FF):** Hovers and subtle cues.

**Emotional Intent:**
The UI should feel like a **“digital breath of fresh air”** — clean, composed, and trustworthy.

**Font Style**

* **Primary Font:** Inter or Poppins (sans-serif).
* Headings: weight 500–600.
* Body: ≥16px, regular.
* Labels/Buttons: medium weight, clear letter spacing.

**Typography Feel:**
Readable, structured, and approachable — reliability without rigidity.

**UI Style**

* **Layout:** Dashboard-first; card-based components.
* **Cards:** Each subscription as a card with name, cost, renewal date, frequency.
* **Corners:** Rounded, radius ~12px.
* **Shadows:** Soft shadows for subtle depth.
* **Interactions:** Smooth micro-animations (transitions, success tick, hover highlights).
* **Accessibility:** WCAG 2.1 AA contrast; clean, keyboard-friendly navigation.
* **Empty States:** Friendly text like “You’re all caught up!” instead of “No data.”

---

## 🖥️ 1️⃣ Front-End Screens to Generate

Generate all of these screens in one connected prototype for **SubSentry**:

1. **Login / Signup Page**

   * Google and email-based authentication.
   * Tagline: “Stay aware. Stay in control.”

2. **Dashboard (Subscription Overview)**

   * Shows total monthly and annual spend.
   * List of active subscriptions as cards (name, category, cost, next renewal date).
   * Section for upcoming renewals (“Next 7 days”).
   * Primary CTA: **“+ Add Subscription”**.

3. **Add Subscription Screen**

   * Form fields: Subscription Name, Category (OTT / Fitness / Software / Other), Cost, Billing Cycle (Monthly/Yearly), Next Renewal Date.
   * Toggle: “Enable Renewal Alerts”.
   * Primary CTA: **“Save Subscription”**.

4. **Subscription Detail View**

   * Shows subscription logo/name, cost, billing cycle, next renewal date, category.
   * Toggle: Alerts On/Off.
   * Buttons: **“Edit Subscription”**, **“Delete Subscription”**.
   * Insight text: e.g., “Next renewal in 3 days”.

5. **Renewal Alert / Notification Setup Page**

   * Global alert preferences:

     * When to alert (1, 3, or 7 days before).
     * Channels: Email, Push (toggles).
   * Preview of a sample alert.
   * Primary CTA: **“Save Alert Settings”**.

6. **Settings / Profile Page**

   * Profile: Name, Email.
   * Currency: (₹, $, etc.).
   * Theme Toggle: Light/Dark mode.
   * Data & privacy note.
   * Logout button.

7. **Success / Confirmation State**

   * For actions like saving a subscription or alert.
   * Big success icon (tick), message like “You’re all set!”
   * CTA: **“Back to Dashboard”**.

**For every screen:**

* Follow brand tone & color palette.
* Use **Inter or Poppins** with consistent hierarchy.
* Have a consistent header/nav and back navigation.
* Ensure **one primary action** per screen.

---

## 🎨 2️⃣ Design Style and Layout Instructions

* **Layout:** Responsive web UI (desktop-first, mobile-friendly).
* **Navigation:**

  * Top nav bar with product logo (SubSentry), links to Dashboard, Settings/Profile.
  * Avatar or settings icon on the top-right to open Settings.
* **Design Style:** Modern minimal with rounded cards, ample white space, soft shadows.
* **Primary Color:** Soft Blue (#3A86FF).
* **Secondary Colors:** Cool Gray (#F4F5F7), Mint Green (#8EE3B0).
* **Buttons:** Rounded rectangle, filled primary color, hover effect (slightly darker blue, subtle shadow).
* **Icons:** Clean, flat icons (Lucide or Material style) — e.g., bell for alerts, plus for add, gear for settings.
* **Typography:** Inter or Poppins, consistent heading/body hierarchy.
* **Alignment:**

  * Text left-aligned in cards.
  * Primary CTAs right-aligned or prominent at the bottom/right.

---

## 🔄 3️⃣ Flow & Navigation Logic

Define a complete clickable flow:

* User opens **Login / Signup** → logs in → lands on **Dashboard**.
* On **Dashboard**:

  * Click “+ Add Subscription” → goes to **Add Subscription Screen** → on save → **Success Screen** → automatic return to **Dashboard**.
  * Click any subscription card → opens **Subscription Detail View**.
* On **Subscription Detail View**:

  * “Edit Subscription” → opens editable form (in-page or modal).
  * “Delete Subscription” → triggers confirmation prompt.
* From top-right icon or nav: **Settings / Profile** is accessible from all main screens.
* From Dashboard or Settings: click “Alert Settings” link or bell icon → **Renewal Alert Setup Page**.
* After saving alert preferences → **Success Screen** → back to Dashboard.

Transitions:

* Use soft fade or slide transitions between screens.
* Keep interactions smooth and calm.

---

## 🧱 4️⃣ Required Functionality (Front-End Only)

* All buttons and toggles should be interactive with dummy state changes.
* **Dashboard**:

  * Show sample subscription cards (e.g., Netflix, Spotify, Gym) with mock data.
  * Display total monthly and annual spend using placeholder amounts.
  * “Upcoming Renewals” list with 2–3 mock items.
* **Add Subscription**: interactive form fields and validation states (e.g., show inline error if name is empty).
* **Detail View**: toggling alerts changes visual state.
* **Alert Setup**: changing timing and channel options updates preview dynamically (front-end only).
* **Settings**: changing theme and currency updates UI state visually (e.g., dark mode preview).
* No backend or real APIs – just front-end components ready for wiring later.

---

## 🧩 5️⃣ Text & Microcopy Guidelines

**Tone:** Supportive, calm, and human.

**Examples:**

* Success: “You’re all set — your renewal is now on your radar.”
* Empty Dashboard: “No subscriptions added yet. Let’s add your first one to stay ahead.”
* Alerts section empty: “No upcoming renewals. You’re all caught up!”
* Error: “Something didn’t work as expected. Let’s try that again.”
* Loading: “Fetching your subscriptions — just a moment.”

Avoid robotic phrases like “Invalid Input” or “Error 404.” Add short, friendly explanations instead.

---

## 🧰 6️⃣ Accessibility & Usability

* Minimum font size: **14px**, body ideally **16px**.
* Primary button contrast ≥ **4.5:1** against background.
* Single consistent color for primary CTA across all screens (#3A86FF).
* Keyboard-accessible navigation: focus states on buttons/links.
* Alt text for icons where meaningful (e.g., “Add new subscription”, “Open settings”).
* Use clear labels on all form fields (no placeholder-only labels).

---

## 🧭 7️⃣ Output Expectations

* Generate **all 7 screens** in one connected prototype.
* Include consistent header/navigation on all main screens.
* Apply brand styles (colors, fonts, UI style) consistently everywhere.
* Label each screen clearly (e.g., “Dashboard”, “Add Subscription”, “Alert Settings”).
* If supported, include clickable navigation and animated transitions.

---

## 📄 8️⃣ PRD Summary (for documentation)

After building, the front-end should match this summary:

> “The SubSentry front-end includes 7 key screens covering login, dashboard, subscription creation, subscription detail, alert setup, settings, and success states. The UI uses a soft blue, gray, and white palette with Inter/Poppins typography, emphasizing calm clarity and financial control. Navigation is simple, with key actions (add subscription, edit details, manage alerts) achievable within 3 clicks. The experience is designed to feel trustworthy, minimal, and empowering for budget-conscious professionals.”

---

💡 **Key takeaway:**
The user should feel **calmly in control** — as if SubSentry is quietly keeping watch over all their subscriptions so they never have to worry about surprise renewals again.
Please make sure design is interactive and is very similar to the attached image. Refer the image multiple times as you generate the app and workflows to ensure consistency with the image.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://subtle-watchdog.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3f919176-920e-4d13-b943-291dd01b4c71).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
