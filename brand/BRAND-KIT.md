# Health Note Labs — Brand Kit

*Version 1.0 · Last updated 2026-06-11 · Status: Living document*

This is the source of truth for how Health Note Labs talks, looks, and positions itself. It exists to make copy and design work fast and consistent. Use it. Argue with it. Update it when reality changes.

---

## Table of Contents

1. [Brand Identity](#1-brand-identity)
2. [Brand Voice](#2-brand-voice)
3. [Elevator Pitches](#3-elevator-pitches)
4. [Brand Story](#4-brand-story)
5. [Product Architecture](#5-product-architecture)
6. [Audience Segments](#6-audience-segments)
7. [Visual Direction](#7-visual-direction)
8. [Competitive Positioning](#8-competitive-positioning)
9. [Messaging Library](#9-messaging-library)
10. [Do / Don't Quick Reference](#10-do--dont-quick-reference)

---

## 1. Brand Identity

### Canonical name

**Health Note Labs** — three words, title case. This is the umbrella company/brand.

- ✅ Health Note Labs
- ❌ HealthNote Labs, Healthnote Labs, HealthNoteLabs, HNL (don't lead with an acronym)

**Naming exception worth knowing:** the technical/developer surface uses the compressed form **HealthNote** (HealthNote SDK, HealthNote API, HealthNote MCP Server, "stat-blobs" → HealthNote ingest). That's deliberate and fine — *Health Note Labs* is the company, *HealthNote* is the developer-product family. Keep the two-word form for brand/marketing, the one-word form for the technical product line. Don't mix them inside a single name (it's "HealthNote API," never "Health Note API").

**Protocol name:** **NIP-101h** — always hyphenated, lowercase `h`. Individual metrics are **NIP-101h.X** (e.g., NIP-101h.7). Don't write "NIP 101h" or "nip101h" in prose.

**Product names:** RUNSTR (all caps — it's a wordmark), Npub.Health, Sleepstr, Dietstr, Calmstr, Habitstr, Spiritstr. The `-str` suffix is a Nostr-native naming convention (signals "this is a Nostr app"); keep it lowercase except RUNSTR which is styled in caps.

### Tagline options

Lead candidate:

> **Your health data. Your keys. Your call.**

Tier-one alternates (pick by context):

- **Own your health data.** *(shortest, works as a button or hero)*
- **Health data that belongs to you.**
- **The open standard for health on Nostr.** *(developer/protocol context)*
- **Publish once. Visualize anywhere.** *(from the source material — strong for the SDK/developer audience)*
- **Decentralized health, by default private.**

Situational / campaign lines:

- **Not another data silo.**
- **Health tracking without the surveillance.**
- **Built on Bitcoin and Nostr. Owned by you.**
- **One profile. Every health app.** *(interoperability angle)*

Avoid: anything with "revolutionize," "empower" (overused in this space), "seamless," or "holistic wellness journey."

### Mission

**Give people full ownership and control of their health data, and give developers an open standard to build on — so health tracking finally works for the user instead of the platform.**

### Vision

**A world where your health record is portable, private, and permissionless — a single user-owned profile that every health app can read from and write to, with no company sitting in the middle.**

### Values (the non-negotiables)

1. **User ownership is the point, not a feature.** The user holds the keys. Always.
2. **Privacy by default, not by configuration.** Encryption is on unless the user turns it off — never the reverse.
3. **Open over proprietary.** Open standard, open formats (JSON, CSV, SQLite), zero lock-in.
4. **Modular over monolithic.** Small, composable pieces beat one big platform.
5. **Interoperable by design.** Every app speaks the same language so data flows freely between them.

---

## 2. Brand Voice

### Personality

Health Note Labs sounds like **a sharp, technically credible builder who actually gives a damn about your privacy** — not a wellness brand, not a VC pitch deck, not a crypto hype account.

Think: the friend who works in health tech and got fed up enough to build the alternative. Confident, plain-spoken, a little contrarian. Treats the reader as smart.

### Tone dial

| Attribute | We are | We are not |
|---|---|---|
| Register | Plain, direct, technically literate | Jargon-soaked or dumbed-down |
| Confidence | Opinionated, takes a stance | Hedgy, "it depends," wishy-washy |
| Energy | Earnest, a little rebellious | Hype-y, exclamation-point-heavy |
| Warmth | Human, occasionally dry-funny | Corporate-warm, "we care about you!" |
| Posture | Pro-user, anti-surveillance | Anti-everything, edgy for its own sake |

### Word choices

**Use these words:**
own, control, your keys, portable, private by default, open standard, interoperable, modular, decentralized, self-custody, permissionless, encrypted, granular, you decide, no middleman, zero lock-in.

**Kill these words:**
- "revolutionary," "game-changing," "disrupt" — let the product be the claim
- "empower" / "empowerment" — dead in this category
- "seamless," "frictionless" — meaningless
- "holistic wellness journey," "your best self" — wellness-brand mush
- "leverage," "synergy," "solutions" — corporate filler
- "users" when you can say "people" or "you" (use "users" in technical docs, "you" in marketing)
- "blockchain" as a buzzword — we're on Bitcoin and Nostr specifically; name them

**On crypto/Nostr terms:** Don't hide them, but always pair the jargon with the benefit on first use. "Self-custody (you hold the keys, not us)." "Nostr (an open protocol no company owns)." Assume a smart reader who may not know the stack.

### Sentence-level style

- **Short sentences carry the weight.** Lead with the claim, then support it.
- **Second person.** Talk to "you." It's the user's data — make that grammatically true.
- **Active voice.** "You own your data," not "data is owned by the user."
- **Concrete over abstract.** "Share your VO₂max with your coach but keep your body-fat % private" beats "granular sharing controls."
- **Earn the strong claim with a specific mechanism.** Don't say "totally private" — say "encrypted with NIP-44 by default; we never see plaintext."

### The "show the mechanism" rule

This brand's credibility comes from *how it works*, not adjectives. Whenever you make a privacy or ownership claim, the very next clause should name the mechanism that makes it true:

- "Your data is private — *encrypted client-side before it ever leaves your device.*"
- "No lock-in — *your data lives in open Nostr events you can export to CSV anytime.*"
- "We can't sell your data — *we never have the keys to read it.*"

---

## 3. Elevator Pitches

### One sentence

> **Health Note Labs is building an open, privacy-first health ecosystem on Nostr and Bitcoin, where you own your health data instead of renting access to it from Apple, Google, or Strava.**

Shorter variant:

> **Health Note Labs is an open ecosystem of health apps where you — not a platform — own and control your data.**

### One paragraph

> **Health Note Labs is building the open standard for personal health data.** Today your weight, workouts, sleep, and vitals are scattered across closed apps that own your data, sell insights from it, and never let it leave. Health Note Labs flips that: every health metric becomes an open, encrypted record that *you* control with your own keys, published on Nostr — a protocol no single company owns. Our protocol (NIP-101h) defines a shared language for health metrics so any app can read and write them; our developer tools (the HealthNote SDK, API, MCP Server, and Relay) make building privacy-first health apps trivial; and our apps — starting with RUNSTR for fitness, with Sleepstr, Dietstr, Calmstr, and more on the way — give you a real product to use today. One health profile, every app, encrypted by default, owned by you.

### One page

> **The problem.** Health data is the most personal data there is, and it's the most locked-up. Your fitness app owns your runs. Your phone's health platform owns your vitals. Your sleep tracker owns your nights. None of them talk to each other, none of them let your data leave intact, and all of them reserve the right to mine it. You're not the customer — you're the product, and your medical history is the inventory. Switch apps and you start from zero. Share data with your doctor or coach and you're emailing screenshots.
>
> **The solution.** Health Note Labs is building a decentralized health ecosystem where the data layer belongs to the user. It starts with **NIP-101h**, an open protocol that turns each health metric — weight, steps, calories, sleep, mood, heart rate — into a standardized, encrypted record published on **Nostr**, an open protocol with no owner, secured by **Bitcoin**-grade cryptography. Because every app speaks the same standard, your data is portable across all of them: one profile, many apps, no silos. Because every metric is encrypted with NIP-44 by default and you hold the keys, privacy isn't a setting you hope they honor — it's enforced by math. You decide what to share, with whom, and you can revoke it.
>
> **The stack.** On top of the protocol we build the tools to make it real:
> - **NIP-101h** — the open metric standard (this is the foundation).
> - **HealthNote SDK** — TypeScript tools so developers create, encrypt, and publish health events without becoming Nostr or cryptography experts.
> - **HealthNote API** — privacy-preserving analytics that compute trends and correlations across consenting users using k-anonymity and differential privacy, *without ever touching raw data*.
> - **HealthNote MCP Server** — connects AI agents to health data through the same consent and privacy guarantees.
> - **HealthNote Relay** — Nostr relay tuned for health data.
> - **Npub.Health** — a dashboard to see all your metrics in one place.
> - **The apps** — **RUNSTR** (live, fitness), with **Sleepstr**, **Dietstr**, **Calmstr**, **Habitstr**, and **Spiritstr** planned. Each is a focused, best-in-class app that writes to the same open profile.
>
> **Why us.** Health Note Labs is founded by a builder with a clinical behavioral-health background — years inside ABA and mental-health facilities, watching how badly the systems that hold people's most sensitive data actually serve them. This isn't a crypto project that wandered into health; it's a health project that found the right tools in Nostr and Bitcoin. The result: health software that finally answers to the person using it.
>
> **The bet.** The same way email beat the walled-garden messaging services and the open web beat the closed online services, an open health-data standard will beat the silos. Health Note Labs is building that standard — and the apps that prove it works.

---

## 4. Brand Story

### The problem (the enemy)

Health data lives in **silos owned by platforms, not people.** Three things are broken:

1. **Ownership.** Your health data sits on Apple's, Google's, Fitbit's, or Strava's servers under their terms. You can look at it; you can't truly take it or control it.
2. **Interoperability.** Apps don't talk. Your running app, sleep app, and diet app each hold a fragment, and nothing assembles the whole picture without yet another company in the middle harvesting it.
3. **Privacy.** The business model of "free" health apps is data. Your most sensitive information — conditions, cycles, mental-health signals — is an asset on someone else's balance sheet.

The villain isn't any one company. It's the **silo model itself**: closed, extractive, and structurally opposed to the user's interest.

### The solution (what we built)

An **open standard plus an ecosystem of tools and apps** that move the data layer back to the user:

- **The data is yours by construction.** It's published as open Nostr events you control with your keys — not rows in a company database.
- **The data is private by construction.** Encrypted with NIP-44 by default; only you (and whoever you explicitly grant) can read it.
- **The data is portable by construction.** Every app speaks NIP-101h, so your profile follows you. Switch apps, keep your history. Export to CSV, SQLite, or JSON anytime.
- **The data is composable by construction.** Modular metrics mean apps mix and match exactly what they need, and new metrics slot in without breaking anything.

### The credibility (why trust us)

- **Clinical roots.** The founder comes from behavioral health — ABA and mental-health facilities — and has seen firsthand how the systems holding people's most sensitive data fail the people in them. The motivation is lived, not theoretical.
- **Shipping, not slideware.** RUNSTR is a live fitness app, not a mockup. The protocol has 14+ defined metrics. The SDK, API, and relay are specified and in build. This is a working ecosystem, not a whitepaper.
- **Right tools for the job.** Built on Nostr (open, ownerless, censorship-resistant) and Bitcoin (the most battle-tested decentralized network). The architecture isn't crypto for its own sake — it's the only stack that makes genuine user-ownership technically possible.
- **Privacy you can verify.** Open standard, open formats, client-side encryption. The claims are checkable in code, not taken on faith.

### The narrative arc (use this shape in long-form)

**Closed → Open.** Health data went closed the way everything online first went closed — walled gardens, because they were easy to build and easy to monetize. Then standards win. Email beat the proprietary messaging services. The web beat the closed online services. Health data is next, and Health Note Labs is building the standard it converges on.

---

## 5. Product Architecture

### The mental model

Three layers, bottom-up. **Protocol → Infrastructure → Apps.** The user sits on top and owns the keys that run through all of it.

```
┌─────────────────────────────────────────────────────────────┐
│   YOU  —  hold the keys, own the data, grant/revoke access   │
└─────────────────────────────────────────────────────────────┘
            ▲                  ▲                    ▲
┌───────────┴──────────────────────────────────────────────────┐
│  APPS (consumer)                                              │
│  RUNSTR (live) · Npub.Health (dashboard)                     │
│  Planned: Sleepstr · Dietstr · Calmstr · Habitstr · Spiritstr│
└───────────────────────────────┬──────────────────────────────┘
                                 │  read/write health events
┌────────────────────────────────┴─────────────────────────────┐
│  INFRASTRUCTURE (developer)                                  │
│  HealthNote SDK   — create/encrypt/publish events            │
│  HealthNote API   — privacy-preserving aggregate analytics   │
│  HealthNote MCP   — AI-agent access to health data           │
│  HealthNote Relay — Nostr relay tuned for health data        │
└────────────────────────────────┬─────────────────────────────┘
                                 │  conforms to
┌────────────────────────────────┴─────────────────────────────┐
│  PROTOCOL (foundation)                                       │
│  NIP-101h — open standard for health metrics on Nostr        │
│  (encrypted-by-default, modular, on Nostr + Bitcoin)         │
└──────────────────────────────────────────────────────────────┘
```

### What each piece is (one-liners for copy)

| Piece | What it is | One-line description |
|---|---|---|
| **NIP-101h** | Protocol | The open standard that turns each health metric into a portable, encrypted, user-owned record on Nostr. |
| **HealthNote SDK** | Dev tool | TypeScript SDK that lets developers create, encrypt, and publish NIP-101h health events without touching low-level crypto. |
| **HealthNote API** | Dev tool | Privacy-preserving analytics — trends and correlations across consenting users with k-anonymity and differential privacy, never raw data. |
| **HealthNote MCP Server** | Dev tool | Connects AI agents to health data under the same consent and privacy guarantees. |
| **HealthNote Relay** | Infra | A Nostr relay purpose-built to store and serve NIP-101h health events. |
| **Npub.Health** | App | A dashboard that brings all your health metrics into one user-owned view. |
| **RUNSTR** | App (live) | The flagship fitness app — track runs and workouts, own every data point. |
| **Sleepstr / Dietstr / Calmstr / Habitstr / Spiritstr** | Apps (planned) | Focused apps for sleep, diet, calm/mental-health, habits, and spiritual practice — each writing to the same open profile. |

### How the pieces connect (the 3-sentence version)

> NIP-101h is the language; everything else speaks it. Developers use the SDK to write health events and the API to analyze them privately; the relay stores them and the MCP server lets AI agents work with them. Apps like RUNSTR and Npub.Health sit on top, and because they all share the protocol, your one health profile flows across every app you use.

### Roadmap framing (Now / Next / Later)

- **Now:** NIP-101h protocol (14+ metrics defined), RUNSTR live, SDK + API + relay specified and building.
- **Next:** Export/portability tooling (CSV/SQLite/Blossom), Stats SDK for in-app trends, Npub.Health dashboard, additional metric categories (sleep, mental health, biometrics).
- **Later:** Full app suite (Sleepstr, Dietstr, Calmstr, Habitstr, Spiritstr), broader device integrations, the network effect of an open health-data standard.

*Frame the roadmap as momentum, never as "vaporware." Lead with what's live (RUNSTR, the protocol), then "and we're building toward…"*

---

## 6. Audience Segments

### Primary segments

**1. The privacy-conscious quantified-self user**
- *Who:* Tracks fitness/health seriously, runs a Nostr/Bitcoin-adjacent or privacy-first life, distrusts Big Tech with their data.
- *Pain:* Hates that Strava/Apple/Google own and mine their data; wants to track without being tracked.
- *What they need to hear:* "Own your health data. Encrypted by default, your keys, no middleman."
- *Entry point:* RUNSTR, Npub.Health.

**2. The Nostr / Bitcoin native**
- *Who:* Already on Nostr, holds Bitcoin, values self-custody and open protocols, early adopter.
- *Pain:* Wants health apps that match their values; tired of the closed-app compromise.
- *What they need to hear:* "Health on Nostr, done right. The `-str` you've been waiting for."
- *Entry point:* RUNSTR, the protocol, the relay.

**3. The developer / builder**
- *Who:* Building health/fitness apps, or a Nostr dev looking for a domain; wants to avoid building privacy infra and data pipelines from scratch.
- *Pain:* Health data is a compliance and privacy minefield; interoperability is a nightmare; aggregation pipelines are expensive to build.
- *What they need to hear:* "Build privacy-first health apps in days, not months. Open standard, drop-in SDK, aggregate analytics for free."
- *Entry point:* NIP-101h spec, HealthNote SDK, HealthNote API, MCP Server.

### Secondary / future segments

**4. The clinical / behavioral-health professional**
- *Who:* Coaches, therapists, ABA practitioners, mental-health providers (the founder's home turf).
- *Pain:* No safe, consented, portable way for clients to share health data; everything is screenshots and silos.
- *What they need to hear:* "Patient-owned, consent-controlled health data your clients actually share on their terms."
- *Note:* Long-term, credibility-rich segment. Approach carefully — health-professional messaging carries regulatory weight (see §10).

**5. The AI / agent builder**
- *Who:* Building AI health assistants and agents.
- *Pain:* Connecting agents to health data safely and with consent.
- *What they need to hear:* "Give your agent health-data access without the privacy liability — consent and encryption built in."
- *Entry point:* HealthNote MCP Server.

### Audience-to-message map

| Segment | Lead with | Avoid leading with |
|---|---|---|
| Privacy QS user | Ownership + privacy | Nostr/Bitcoin internals |
| Nostr/Bitcoin native | Open protocol, self-custody, `-str` ecosystem | "Privacy" as if new to them |
| Developer | SDK speed, interop, free aggregate analytics | Consumer wellness framing |
| Clinical pro | Consent, patient ownership | Crypto/Bitcoin framing |
| AI builder | MCP, consent-safe access | Consumer app talk |

---

## 7. Visual Direction

*Directional guidance for design work — opinionated starting points, not a locked system. Build the formal design tokens from here.*

### Aesthetic north star

**Clean, modern, technical, and trustworthy — with a Bitcoin/Nostr undercurrent.** The look should say "serious infrastructure you can trust with your most private data," not "wellness app with rounded gradients" and not "crypto project with neon and 3D coins."

Closest reference points: the restraint of a well-designed developer tool (Linear, Vercel) crossed with the warmth a health/fitness product needs, and the orange-accented identity of the Bitcoin world without the hype-coin clichés.

**Core tension to resolve in every design:** *health/human warmth* ↔ *crypto/technical rigor*. Lean technical for developer surfaces, lean warm for consumer apps, keep the system coherent across both.

### Color

**Primary palette — recommendation:**

| Role | Color | Hex | Use |
|---|---|---|---|
| Brand accent | Bitcoin/health orange | `#F7931A` | Primary CTAs, highlights, brand moments. (This is Bitcoin orange — a deliberate nod to the foundation.) |
| Ink / base dark | Near-black | `#0E0E10` | Backgrounds (dark mode default), primary text on light |
| Surface dark | Charcoal | `#1A1A1E` | Cards, panels in dark mode |
| Paper / base light | Off-white | `#FAFAF7` | Light-mode background |
| Vital green | Health green | `#1DB954`-ish `#22C55E` | Success, positive trends, "live"/healthy states, secondary accent |

**Why orange + green:** Orange ties the brand to Bitcoin/Nostr and reads as energetic and human; green carries the health/vitality signal and the "your data is safe/live" states. Together they're distinctive in a category dominated by clinical blue (Apple Health, most health apps) and Strava's orange — note Strava also owns orange, so **differentiate via the specific Bitcoin-orange hue + green pairing + dark-first UI**, not orange alone.

**Default to dark mode.** It reads technical and privacy-serious, fits the Nostr/Bitcoin native aesthetic, and differentiates from the bright-white clinical look of Apple Health. Offer light mode; design dark first.

**Avoid:** medical/clinical sky-blue as a primary (it says "hospital app"), purple gradients (generic SaaS), neon crypto palettes, anything that looks like a wellness/meditation app (sage, blush, beige).

### Typography

- **Display / headlines:** A clean, confident geometric or grotesque sans. Recommendations: **Inter**, **Geist**, **Satoshi** (note the on-brand name), or **Space Grotesk** for a slightly more technical edge. Headlines should be tight, large, and high-contrast.
- **Body:** **Inter** or system sans — maximum legibility, neutral, trustworthy.
- **Mono (developer surfaces, code, data, "stat" displays):** **JetBrains Mono**, **Geist Mono**, or **IBM Plex Mono**. Use mono deliberately to signal the technical/data layer — code blocks, metric values, npub strings, "your keys."
- **Rule:** Mono is a flavor accent that reinforces "this is real, verifiable data," not the body face. Don't set paragraphs in mono.

### Logo & wordmark direction

- **Health Note Labs wordmark:** clean sans, lowercase or title case, optionally with a single accent element. The word "Note" is an opening — a musical-note motif or a document/note glyph could work, but **avoid the literal medical cross and the literal heart** (both are clichés in health branding).
- **Concept to explore:** a mark that fuses a **node/key** (ownership, Nostr) with a **health pulse/line** — signaling "your health, your key." A signed/encrypted "note" metaphor is strong and unique to this brand.
- **`-str` apps:** RUNSTR sets the pattern (bold, athletic wordmark). Each `-str` app should feel like a sibling — shared type system, app-specific accent within the family palette.

### Iconography & imagery

- **Icons:** line-based, geometric, consistent stroke. Functional, not decorative.
- **Imagery:** real people doing real activities (running, sleeping, eating) over abstract crypto/3D renders. When showing the tech, show **actual data** — charts, event structures, metric timelines — because the product's credibility is in the mechanism.
- **Motif library:** keys, locks (open/closed for consent states), nodes/networks, pulse/trend lines, the encrypted "note." Use the lock/key motif honestly — it should map to real privacy states, not just decoration.

### UI principles

1. **Data-forward.** The product is about your data — show it cleanly. Charts and metric timelines are hero elements, not afterthoughts.
2. **Consent is visible.** Privacy/sharing state (private · shared · public) should be a first-class, always-visible UI concept — a recognizable visual language across every app. This is a brand differentiator; make it iconic.
3. **Dark, focused, uncluttered.** Generous spacing, strong hierarchy, one clear action per screen.
4. **Honest density.** Don't dumb down for the QS/developer audience — they want detail. Make density legible, not sparse.

---

## 8. Competitive Positioning

### The one-line position

> **Apple Health, Strava, and the rest hold your health data. Health Note Labs hands it back — open, encrypted, and yours to take anywhere.**

### The category we're (re)defining

We are **not** "another fitness app" or "another health tracker." We're the **open, user-owned data layer for health** — and an ecosystem of apps that proves it. The competitive frame is *open standard vs. closed silo*, not *our app vs. their app*.

### Head-to-head

| | **Health Note Labs** | Apple Health | Strava | Fitbit/Google | Whoop/Oura |
|---|---|---|---|---|---|
| **Who owns the data** | The user (their keys) | Apple (on-device, Apple's terms) | Strava | Google | The company |
| **Portability** | Full — open Nostr events, export anytime | Locked to Apple ecosystem | Exports limited, lock-in by network | Locked to Google | Locked to device + subscription |
| **Interoperable across apps** | Yes — shared open standard | Within Apple only | No | Within Google only | No |
| **Privacy model** | Encrypted by default, you hold keys | On-device, but Apple's platform | Social by default, data mined | Ad-company owned | Company holds data |
| **Open standard** | Yes (NIP-101h) | No | No | No | No |
| **Business model** | Not selling your data (can't read it) | Hardware | Subscription + data | Ads/data | Hardware + subscription |
| **Works without their hardware** | Yes | Needs Apple devices | App-based | Needs Fitbit/Pixel | Needs their wearable |

### Positioning against each

**vs. Apple Health** — *"On-device isn't the same as owned."* Apple keeps your data reasonably private but locked inside Apple's walls and Apple's terms. Leave the ecosystem and it doesn't come with you. We give you data that's private *and* portable *and* yours — across any app, any device, no platform gatekeeper.

**vs. Strava** — *"Strava is a social network that monetizes your runs. We're infrastructure that gives them back."* Strava's default is public and social; the data is theirs and the network is the lock-in. RUNSTR gives the same fitness tracking with the opposite default: private, owned, portable. (Note: don't fight Strava on social features early — fight on ownership and privacy, our home turf.)

**vs. Fitbit/Google** — *"Your health data shouldn't fund an ad business."* Google owns Fitbit. We don't have an ad business and structurally can't build one on your data — we never hold the keys to read it.

**vs. Whoop/Oura** — *"Your most intimate biometrics, rented back to you by subscription, stored on their servers."* Premium wearables hold your data hostage to a subscription and a device. Our standard is hardware-agnostic and the data is yours regardless of which device measured it.

**vs. "build it yourself" / other Nostr health attempts** — *"This is the standard, not a one-off app."* The moat is the open protocol + the SDK/API/relay stack + a live app (RUNSTR) already shipping. We're building the rails everyone else can build on.

### Our unfair advantages (the moat)

1. **Open standard with first-mover position** — NIP-101h is the protocol; network effects compound as apps adopt it.
2. **Full-stack** — protocol + dev tools + live apps. We're not just a spec or just an app; we're both, so we can bootstrap adoption ourselves.
3. **Structural privacy** — we can't monetize user data because we can't read it. That's a *guarantee*, not a *promise* — and an unbeatable trust position against ad-funded incumbents.
4. **Founder credibility** — clinical behavioral-health background gives real domain authority in a space full of crypto tourists.
5. **Right rails** — Nostr + Bitcoin are the only stack where genuine self-custody of health data actually works.

### What we don't claim (stay honest)

- We're early. Don't oversell the app suite — most apps are planned, RUNSTR is the proof point.
- We're not a medical device or a substitute for clinical care. Don't make diagnostic or medical claims.
- We don't claim "more accurate" or "better tracking" than incumbents — we claim **ownership, privacy, and portability**. Compete on the axis we win.

---

## 9. Messaging Library

### Headline bank (drop-in copy)

- Own your health data.
- Your health data. Your keys. Your call.
- Health tracking without the surveillance.
- One profile. Every health app.
- Not another data silo.
- The open standard for health on Nostr.
- Encrypted by default. Owned by you. Portable everywhere.
- Your runs, your sleep, your vitals — finally yours.
- Publish once. Visualize anywhere.
- Built on Bitcoin and Nostr. Owned by you.
- Stop renting access to your own health data.

### Proof points (use to back claims)

- **14+ open health metrics** defined in the NIP-101h standard (weight, height, calories, steps, pace, distance, and more).
- **NIP-44 encryption by default** — content is encrypted client-side; plaintext never reaches a relay or server.
- **Aggregate analytics with k-anonymity ≥ 5 and differential privacy** — insights across users, never individual exposure.
- **Open formats** — export to CSV, SQLite, or JSON anytime. Zero lock-in.
- **RUNSTR is live** — a working fitness app, not a roadmap promise.
- **Built on Nostr and Bitcoin** — open protocols, no single owner.

### Boilerplate (press / footer / about)

**Short (50 words):**
> Health Note Labs is building the open standard for personal health data. Through the NIP-101h protocol, a developer toolkit, and apps like RUNSTR, it gives people full ownership of their health data — encrypted by default, portable across every app, and controlled by the user, on Nostr and Bitcoin.

**Medium (100 words):**
> Health Note Labs is building an open, privacy-first ecosystem for health data on Nostr and Bitcoin. At its core is NIP-101h, an open protocol that turns every health metric into a portable, encrypted, user-owned record — so your data is yours to control, not a platform's to monetize. On top of the protocol, Health Note Labs builds developer tools (the HealthNote SDK, API, MCP Server, and Relay) and consumer apps, starting with the live fitness app RUNSTR and expanding to sleep, diet, mental health, and more. One health profile, every app, encrypted by default, owned by you.

### Objection handling (FAQ seeds)

- **"Is my data really private?"** Yes — every metric is encrypted with NIP-44 on your device before it's published. We never hold the keys, so we can't read it, and neither can a relay.
- **"What if Health Note Labs disappears?"** Your data lives in open Nostr events you control, in open formats you can export. There's nothing to lock you in and nothing that breaks if we do. That's the point.
- **"Do I need to understand Bitcoin/Nostr to use it?"** No. The apps handle the keys and the protocol for you. The open stack is *why* you own your data — you don't have to think about it to benefit.
- **"How is this different from Apple Health?"** Apple keeps your data on your device but inside Apple's walls and Apple's terms. We make it private *and* portable across any app, on any platform, owned by you.

---

## 10. Do / Don't Quick Reference

### Voice

| ✅ Do | ❌ Don't |
|---|---|
| "You own your health data." | "We empower users to take control of their wellness journey." |
| "Encrypted by default — we never see plaintext." | "Bank-grade security and total privacy." |
| Name the mechanism (NIP-44, your keys, open events) | Make bare adjective claims ("totally secure") |
| Talk to "you" | Talk about "the user" in marketing |
| "RUNSTR is live; more apps are coming." | Imply the whole app suite already ships |
| Pair Nostr/Bitcoin jargon with its benefit | Drop crypto jargon naked |

### Naming

| ✅ Do | ❌ Don't |
|---|---|
| Health Note Labs (brand) | HealthNote Labs / HNL |
| HealthNote SDK / API / MCP (products) | Health Note SDK |
| NIP-101h, NIP-101h.7 | NIP 101h, nip101h |
| RUNSTR (caps) | Runstr / runstr in headlines |

### Claims & compliance

| ✅ Do | ❌ Don't |
|---|---|
| Position on ownership, privacy, portability | Claim "more accurate" or medical superiority |
| "Track and own your health data" | Make diagnostic, treatment, or medical claims |
| "Encrypted by default; you hold the keys" | Promise "unhackable" or "100% anonymous" |
| Be honest about what's live vs. planned | Present roadmap as shipped |
| Note it's not a medical device when context warrants | Imply clinical/regulatory endorsement |

---

*This kit is a living document. When the product, audience, or positioning shifts, update it here first — this is the source of truth for copy and design.*
