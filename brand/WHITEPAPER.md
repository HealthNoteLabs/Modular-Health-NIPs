# Health Note Labs: An Open Standard for Sovereign Health Data

*Whitepaper · Version 1.0 · 2026-06-11*

*Health Note Labs — building the open standard for personal health data on Nostr and Bitcoin.*

---

## Abstract

Health data is the most personal data a person produces, and it is the most thoroughly captured. Your weight, your runs, your sleep, your heart rate, and the conditions you'd never post publicly all live on servers owned by Apple, Google, Strava, Whoop, and a long tail of "free" apps whose actual business is the data itself. You can look at this data. You cannot truly take it, move it, or stop it from being mined.

Health Note Labs is building the alternative: an open standard that turns each health metric into a portable, encrypted, user-owned record published on Nostr — an open protocol no company owns — and secured by the same cryptography that secures Bitcoin. The standard is **NIP-101h**, a modular family of specifications where each metric (weight, steps, calories, sleep, mood, heart rate) is its own small, independently versioned spec. Content is encrypted with NIP-44 by default, so the user holds the only keys that can read it. On top of the protocol sits a developer toolkit (SDK, API, MCP server, relay), an aggregation dashboard (Npub.Health), and live applications, beginning with the fitness app RUNSTR.

Why now: Nostr is mature enough to carry real data, Bitcoin micropayments make incentives programmable, and local AI makes private analysis of your own health data finally practical. The thesis is simple. The same way open standards beat the walled gardens in messaging and on the web, an open health-data standard will beat the silos.

---

## 1. Introduction

This document explains what Health Note Labs is building, why the architecture is shaped the way it is, and what is live versus planned. It is written for a reader who understands Bitcoin and Nostr but may not know health technology, and for grant committees and developers who need to evaluate the work on its merits.

A note on honesty up front, because the category is full of overstatement: parts of this stack are shipping and parts are specified-and-building. We mark the difference everywhere it matters. RUNSTR is a live application. NIP-101h is a published standard with fourteen-plus defined metrics. The SDK, API, MCP server, and relay are specified and in active development. The broader app suite is a roadmap, not a product line you can download today. Where a claim depends on the future, we say so.

The structure of the argument runs from problem to foundation to architecture to proof. Sections 2 through 4 establish why the current model fails and why Nostr is the right base layer. Sections 5 and 6 describe the full stack and its most distinctive consequence — that your health data can be read by an AI running on your own hardware, with no cloud in the loop. Section 7 covers RUNSTR as the working proof of concept. Section 8 explains why a clinical background, not a crypto background, sits behind the project. Sections 9 through 11 lay out the ecosystem roadmap, the business model, and who should do what next.

---

## 2. The Problem: Health Data Is Not Yours

Start with a test. Open your phone's health app right now and try to export every metric it holds — not a screenshot, not a PDF summary, but the structured underlying data — into a file you can hand to a different app that will read it natively and keep your full history intact. You can't. Not from Apple Health, not from Google Fit, not from Strava, not from Whoop or Oura. The data is visible to you and owned by them.

This is the defining property of the current model, and it is worth being precise about how each piece of it works, because the mechanism is the problem.

**Apple Health** keeps your data on-device and encrypts iCloud health sync, which is genuinely better than the ad-funded alternatives. But on-device is not the same as owned. The data lives inside Apple's ecosystem, under Apple's terms, in Apple's formats, reachable only through Apple's APIs on Apple's hardware. Leave the ecosystem — switch to Android, hand a year of data to a coach who uses something else — and it does not come with you intact. Apple decides what HealthKit exposes and to whom. You are a tenant with a good landlord, not an owner.

**Google Fit and Fitbit** are worse in a specific structural way: Google's core business is advertising, and Google owns Fitbit. Your resting heart rate, your sleep stages, and your menstrual cycle sit inside the balance sheet of the largest behavioral-advertising company in history. Even where Google does not directly serve ads against a given health signal, the data is an asset on the books of an organization whose incentive is to know more about you, not less.

**Strava** is the clearest case because the monetization is the product. Strava is a social network that runs on your workouts. Its defaults push your activity to public and social; the data is Strava's, the network is the lock-in, and the company has openly tightened its API to limit how third parties can use the data its users generated. In 2024 Strava restricted what other apps could do with that data, breaking integrations that athletes had relied on — a reminder that when the platform owns the data, the platform sets the terms unilaterally and can change them whenever the business calls for it.

**Whoop and Oura** rent your most intimate biometrics back to you by subscription. The device measures you continuously; the data sits on the company's servers; access is gated behind a recurring fee and a piece of hardware you must keep buying into. Stop paying and the insight stops, even though the body it measured is yours.

**Insurers and EHR vendors** complete the picture on the institutional side. Electronic health record systems are notorious for information blocking — making it deliberately difficult for patient data to move between providers, a problem severe enough that the U.S. government had to legislate against it (the 21st Century Cures Act's information-blocking rules exist precisely because vendors and providers were withholding data). Meanwhile wellness data flows toward insurers and data brokers in ways most people never consented to in any meaningful sense; period-tracking apps selling or sharing reproductive-health data became a national story for good reason.

Pull these together and three failures emerge, and they are structural, not incidental.

The first is **ownership**. Your data sits in someone else's database under someone else's terms. You hold a view, not the asset.

The second is **interoperability**. The apps do not talk. Your running app holds a fragment, your sleep app holds a fragment, your scale holds a fragment, and assembling the whole picture requires yet another company in the middle that harvests it as the price of integration. Switch any one app and you start from zero.

The third is **privacy**. The business model of free health tracking is data, which means your most sensitive information — conditions, cycles, mental-health signals, the things you would never post — is inventory on someone else's balance sheet. You are not the customer. You are the product, and your medical history is the stock.

The villain here is not any single company. Several of them build genuinely good software. The villain is the **silo model itself**: closed, extractive, and structurally opposed to the interest of the person generating the data. No amount of better UX inside a silo fixes a problem that is the architecture.

---

## 3. The Nostr Opportunity

If the problem is the silo, the solution has to break the silo — which means the data layer cannot be owned by whoever builds the app. That is a hard requirement, and it eliminates most of the obvious answers. A startup that promises to be a better custodian is still a custodian. A nonprofit data trust is still a single point of capture and failure. What you need is a substrate where identity and data are not owned by any platform in the first place.

Nostr is that substrate, and the fit is unusually clean.

**Keypair identity.** On Nostr, identity is a cryptographic keypair, not an account a company issues you. Your public key (`npub`) is your identity; your private key (`nsec`) is your control. No company creates it, no company can revoke it, and no company can lock you out of it. For health data this is the whole game: if your identity is self-custodied, the data published under that identity is yours by construction rather than by a company's promise. You are not asking permission to own your record. You already hold the only key that signs and reads it.

**Relay architecture.** Nostr stores data on relays — simple servers that accept signed events and serve them back. Relays are interchangeable and many. You can publish to several at once, run your own, and move between them freely, because the data is not bound to any one of them; it is bound to your key. This is the structural opposite of a silo. In the silo model the server is the product and your data is hostage to it. On Nostr the server is a commodity and your key is the product. If a relay disappears, mistreats your data, or changes its terms, you publish elsewhere and lose nothing, because the event is signed by you and valid anywhere.

**Censorship resistance.** Because identity is a keypair and storage is many independent relays, there is no central party that can deplatform you or quietly revoke access to your own history. For most consumer data this sounds abstract. For health data it is concrete: reproductive health, mental health, and chronic conditions are exactly the categories where a person most needs assurance that no single institution can cut off, surveil, or weaponize access to their record.

**An existing social graph.** Nostr is not a thesis; it is a running network with real users, real clients, and real developers, including a Bitcoin-native community that already values self-custody and open protocols. Health Note Labs is not bootstrapping a network from zero. It is building a health layer on a network whose users already understand why owning your keys matters and who form a natural first audience.

**Why health data maps to the event model.** A Nostr event is a small, signed, timestamped JSON object with a `kind` number and a set of tags. A health metric is a small, timestamped value with metadata — a unit, a source, an accuracy. The mapping is almost trivial: one event per measurement, the `kind` identifies the metric, the tags carry the context, and the signature proves provenance. A weight reading, a step count, a night of sleep — each is naturally a single event. The model did not have to be bent to fit health data; health data fits it as if it were designed for it.

It is worth saying plainly why **not** the obvious alternatives.

**Why not a blockchain.** Health data is high-volume, frequently updated, and must be deletable on the user's command. Putting it on a blockchain would be slow, expensive, and — fatally — permanent and public by design, the exact opposite of what private health data needs. Nostr gives you the cryptographic identity and signed provenance you'd want from a blockchain without forcing your sleep data into a globally replicated, immutable, public ledger. Bitcoin belongs in this stack as money and as the security model people already trust, not as a place to store your heart rate.

**Why not a federated system.** Federated models (think the fediverse) improve on pure silos but reintroduce the landlord. Your identity and data live on a specific server run by a specific admin; migrating between servers is awkward and lossy, and the admin still mediates your access. Nostr's design — identity as a portable keypair, relays as interchangeable commodity storage — removes the landlord entirely. You don't migrate your account between homes. You have no home to be evicted from; you have a key, and it works everywhere.

---

## 4. NIP-101h: A Modular Health Data Standard

A substrate is not a standard. Nostr gives you signed, portable events, but it does not tell two different apps what a "weight" event looks like, what unit it carries, or how to encrypt it. Without an agreed format, every app invents its own, and you are back to silos that happen to sit on a shared network. The standard is what makes the data actually interoperable. That standard is NIP-101h.

The core design decision is **modularity**. Rather than defining one giant "health profile" event that crams weight, sleep, mood, and heart rate into a single monolithic blob, NIP-101h gives each metric its own micro-specification. Weight is NIP-101h.1 on event kind 1351. Height is NIP-101h.2 on kind 1352. Caloric data is NIP-101h.7, using kind 1357 for calories expended and 2357 for calories consumed. Step count is NIP-101h.9 on kind 1359. The framework currently defines fourteen-plus metrics this way — weight, height, age, gender, fitness level, workout intensity, calories, activity duration, steps, elevation, splits, pace, distance, and speed — each living in its own file, each independently versioned, each adoptable on its own.

This Lego-like structure buys three things that a monolith cannot.

It buys **granularity**. An app can publish your weight daily without ever touching your step count. Each metric is an independent event, so you reveal exactly what you choose, metric by metric, rather than all-or-nothing.

It buys **evolvability**. A new metric — blood glucose, HRV, menstrual tracking — slots in by claiming the next free kind number in its category range, with no coordination cost and no risk of breaking existing implementations. The standard organizes kinds into reserved ranges by category (Anthropometrics, Activity & Fitness, Nutrition & Diet, Sleep, Mental Health & Mindfulness, Medical & Biometrics, Lifestyle & Environment), so there is room to grow in every direction without collisions.

It buys **selective sharing**. Because each metric is its own encrypted event, you can share your VO₂max with your coach while keeping your body-fat percentage private, with no app having to build a custom permission system to make that possible. The granularity of sharing falls out of the granularity of the data model.

**Encryption is the default, not a setting.** This is the single most important implementation rule in the standard, and it is deliberately phrased as a default rather than an option. Clients implementing NIP-101h SHOULD encrypt the `content` of every health metric using NIP-44 — the modern Nostr encryption scheme — before the event ever leaves the device, and provide a clear, explicit opt-in if a user wants to publish something in the clear. The direction matters: privacy is on unless you turn it off, never off unless you turn it on. Concretely, the numeric value of your weight is encrypted client-side; only the tags that carry non-sensitive context (the unit, the timestamp, the fact that this is a health event) stay readable. That last detail is what makes the scheme practical rather than merely private: an app can build your weight timeline, sort it, and chart its shape from the tags alone, and only decrypt the actual values locally, in your client, with your key. You get usable software and unreadable-to-everyone-else data at the same time.

**How apps publish and consume.** Publishing is: construct the event for the metric, encrypt the content with NIP-44, sign it with the user's key, and send it to the user's chosen relays. Consuming is: query relays by kind and tag (give me this user's weight events), receive the signed events, verify the signatures, and decrypt the content locally if you hold the key. Because the format is standardized, an app that has never heard of the app that wrote the data can still read it perfectly — that is the entire point. A consent tag (`public`, `private`, `shared-with:<pubkey>`, or `aggregate-only`) travels with each event so that both clients and relays know the intended audience, and the standard instructs them to respect it.

**The difference from NIP-101e.** This trips people up, so it is worth being exact. NIP-101e is a separate, existing Nostr standard for **workout and exercise records** — the structured "I did a 5k run, here are the laps and the route" event. RUNSTR already uses NIP-101e for exactly that. NIP-101h is the **health metrics** standard — the underlying physiological and activity data points: the weight, the steps, the calories, the pace. The two are complementary, not competing. A workout in NIP-101e is the session; the NIP-101h events are the measurements that session produced and the body that produced them. RUNSTR writing both is the proof that they compose: the workout record references the metric events, and an app can consume either layer depending on what it needs.

---

## 5. Architecture

The full system is three layers with the user on top, and the discipline of the design is that the user's keys run through all of it. Nothing in the stack holds a credential that can read your data without you.

```
┌───────────────────────────────────────────────────────────────┐
│  YOU — hold the keys, own the data, grant and revoke access    │
└───────────────────────────────────────────────────────────────┘
        ▲                    ▲                      ▲
┌───────┴────────────────────────────────────────────────────────┐
│  APPLICATIONS (consumer)                                        │
│  RUNSTR (live) · Npub.Health (dashboard)                        │
│  Planned: Sleepstr · Dietstr · Calmstr · Habitstr · Spiritstr   │
└────────────────────────────────┬───────────────────────────────┘
                                 │  read / write health events
┌────────────────────────────────┴───────────────────────────────┐
│  INFRASTRUCTURE (developer)                                     │
│  HealthNote SDK   — create / encrypt / publish events           │
│  HealthNote API   — privacy-preserving aggregate analytics      │
│  HealthNote MCP   — AI-agent access under consent + encryption  │
│  HealthNote Relay — Nostr relay tuned for health data           │
└────────────────────────────────┬───────────────────────────────┘
                                 │  conforms to
┌────────────────────────────────┴───────────────────────────────┐
│  PROTOCOL (foundation)                                          │
│  NIP-101h — open standard for health metrics on Nostr           │
│  encrypted-by-default · modular · on Nostr + Bitcoin            │
└─────────────────────────────────────────────────────────────────┘
```

**The protocol layer** is NIP-101h, described above. It is the language. Everything above it speaks that language, which is why the layers are decoupled: a new app and a new analytics service that have never met still interoperate, because both conform to the same metric specs.

**The infrastructure layer** is the developer toolkit, and its job is to make building on the protocol something a developer can do in days rather than months — without becoming a Nostr internals expert or a cryptographer.

The **HealthNote SDK** is a TypeScript library that constructs well-formed NIP-101h events, handles NIP-44 encryption transparently, attaches the right consent tags (defaulting to the privacy-preserving choice), and publishes to relays. A developer calls something close to `publishWeight(70, 'kg')` and the SDK does the event construction, encryption, signing, and relay publication underneath. The low-level Nostr and crypto details are abstracted away precisely so that getting privacy right is the path of least resistance, not an expert option a busy developer skips.

The **HealthNote API** is the part that lets developers build trends, charts, and correlations across many users **without ever touching anyone's raw data**, and the mechanism is what makes that claim real rather than aspirational. The SDK never sends raw encrypted content to the API. It extracts a minimal "stat-blob" — just the kind, the numeric value, the unit, and the timestamp — and forwards it only for events the user has marked `aggregate-only` (the default for analytics). The API's endpoints return *only* aggregates: a `/trend` endpoint gives time-series buckets, `/correlate` computes the statistical relationship between two metrics, `/distribution` shows how values spread across the user base. Two privacy techniques are enforced at the boundary: **k-anonymity** with a floor of five, so every returned bucket represents at least five distinct users and no point can be traced to one person, and optional **differential privacy** via the Laplace mechanism, adding calibrated statistical noise near the threshold so individual contributions stay hidden even under repeated querying. A developer querying this API gets chart-ready numbers and structurally cannot get an individual's value back out.

The **HealthNote MCP Server** connects AI agents to health data through the Model Context Protocol — the open standard for giving AI models tool access — under the same consent and encryption guarantees as everything else. This is the bridge between a user's health record and the AI that analyzes it, and it is what makes the next section possible.

The **HealthNote Relay** is a Nostr relay tuned for health events: aware of the NIP-101h kind ranges, able to filter and serve by metric category, and built to respect the consent model so that private and shared events are not exposed to parties who shouldn't see them.

**The application layer** is what a person actually uses. RUNSTR is the live flagship. Npub.Health is the aggregation dashboard that pulls every metric you've published — across every app that writes NIP-101h — into a single user-owned view, which is only possible *because* the apps share the protocol. The planned `-str` suite (Sleepstr, Dietstr, Calmstr, Habitstr, Spiritstr) extends the same model into new metric categories.

**Follow the data through the system.** A user finishes a run in RUNSTR. The app records the session as a NIP-101e workout event and the underlying measurements — distance, duration, pace, calories, steps — as NIP-101h events. The HealthNote SDK encrypts the content of each with NIP-44 using the user's key, signs them, and publishes them to the user's relays, including the HealthNote Relay. The values are now stored as portable, signed, encrypted events that only the user can read. For any event the user marked `aggregate-only`, the SDK also sends a stat-blob to the HealthNote API, where it contributes to k-anonymous trends without exposing the user. Later, the user opens Npub.Health, which queries the relays for their events, verifies the signatures, decrypts the content locally with their key, and renders the timelines. At no point did a server hold a key that could read the plaintext. The same run, weeks later, can be read by a brand-new app the user installs — because the data was never trapped in RUNSTR; it was published to the user's own keyspace in a standard format. That portability is the whole thesis, demonstrated end to end.

---

## 6. Sovereign AI and Health Data

This is the part of the architecture that most distinguishes Health Note Labs from everything else in the category, and it is a consequence of the design rather than a bolt-on feature.

Begin with where AI and health are headed by default. The mainstream path is that you hand your health data to a cloud AI service, the service analyzes it on its servers, and you get insights back. The data leaves your control to be processed. For most data that trade is tolerable. For health data it reproduces exactly the problem this whole project exists to solve: your most sensitive information sitting on someone else's machine, readable by someone else's model, under someone else's terms, generating insights whose underlying data you no longer control.

NIP-101h data does not have to work that way, and the reason is structural. Your health record is a set of standardized, signed events that you can decrypt with your own key on your own machine. Nothing about analyzing it requires a third party. **An AI running locally — on your laptop, your home server, your own hardware — can read your decrypted health data, reason over it, and give you analysis, with no cloud and no third party in the loop at any point.** Your AI, your data, your machine. The model sees your full, unredacted health history because it is running where your key already is, and that history never leaves the building to make it possible.

It is important to be precise about what this section claims and does not claim. This is **not** a pitch for any specific AI product. It is an architectural property. Because NIP-101h data is open, standardized, and decryptable by the key-holder, it can be consumed by *any* AI the user chooses — a local open-weights model, a self-hosted assistant, a privacy-preserving inference setup, or, if the user genuinely wants to, a cloud service. The point is that the standard does not force the choice. It hands the user the data in a form that a local model can read as easily as a remote one, and so it makes private, local analysis a first-class option rather than something the platform has quietly designed out. The HealthNote MCP Server is the concrete connective tissue: it exposes a user's consented health data to an AI agent through the open Model Context Protocol, and that agent can just as well be a process on the user's own laptop as a remote service.

Set this in the broader **sovereign computing** movement, because that is the lineage it belongs to. The Bitcoin world has spent a decade making the case that you should run your own node rather than trust an exchange, hold your own keys rather than an IOU, and increasingly run your own Nostr relay rather than depend on someone else's. The throughline is self-custody of infrastructure: the conviction that the things that matter most — your money, your identity, your speech — should not require a trusted third party. Local AI over your own health data is the same conviction applied to the most intimate computation there is. Run your own node. Run your own relay. Run your own model over your own health record. Health Note Labs does not have to build the local AI for this to be real; it has to build the data layer that makes the local AI possible, and that is exactly what NIP-101h is. The standard is the precondition. Sovereign AI over health data is what the standard unlocks.

---

## 7. RUNSTR: Proof of Concept

A standard with no application is a document. RUNSTR is the application that proves the standard works in the real world, with real users, real money, and real published data. It is live today.

At its surface RUNSTR is a fitness app. It records GPS-tracked runs and workouts the way you'd expect any running app to. Underneath, it does the thing no mainstream fitness app does: every data point it captures is published as the user's own Nostr events — the workout as NIP-101e, the underlying metrics as NIP-101h — encrypted by default and owned by the user's key rather than locked in RUNSTR's database. If RUNSTR vanished tomorrow, its users would keep every run, because the runs were never RUNSTR's to keep. That is the model validated in production.

Three things make RUNSTR more than a tracker that happens to use Nostr.

The first is **Bitcoin rewards**. RUNSTR pays users in Bitcoin for activity, turning the abstract idea of "incentive-aligned health software" into sats actually arriving in a wallet. This matters beyond novelty: it demonstrates that an app built on open rails can attach real economic incentives to health behavior without an ad model, a data-sale model, or a subscription as the only revenue path. The reward is paid in the open, peer-to-peer money of the same ecosystem the data lives in.

The second is the **zapper** — the piece worth understanding as infrastructure rather than feature. The RUNSTR zapper is automated Bitcoin distribution: a system that programmatically sends sats over the Lightning Network to users based on their activity and participation, including leaderboard performance and event results. "Zap" is the Nostr-native term for a Lightning payment attached to a Nostr event, and the zapper generalizes it into a distribution engine. Once you have automated Bitcoin distribution wired to verifiable activity data, you have the rails for streaks, challenges, prize pools, sponsored events, and charity flows — all programmable, all auditable, all paid in real money. The zapper is the reusable mechanism under all of RUNSTR's economic features, and it is reusable by every future app on the stack.

The third is **charity donations and leaderboards** — the social and prosocial layer. RUNSTR routes a portion of activity toward charitable giving and ranks users on leaderboards, demonstrating that the same automated-distribution infrastructure that rewards individuals can also direct Bitcoin to causes, with the activity that triggers it published transparently as Nostr events.

On real numbers: RUNSTR is live and accumulating users, paid sats, and logged workouts, and the honest position of this paper is to report those figures accurately rather than inflate them. *(Specific current totals — active users, sats distributed, workouts logged — should be inserted here from live data before this document is attached to any grant application, and stated as of a dated snapshot. The brand discipline is to let the real numbers carry the claim, and to never present a roadmap figure as a shipped one.)* What can be stated without qualification today is the architectural fact: RUNSTR publishes real, user-owned, encrypted health and workout events to Nostr, pays real Bitcoin through an automated zapper, and does it on the open NIP-101h and NIP-101e standards. The model is not a hypothesis. It is running.

---

## 8. Clinical Foundation

Most projects in this space are crypto projects that decided health looked like a large market. Health Note Labs is the inverse: a health professional who went looking for the right technology and found it in Nostr and Bitcoin. That ordering is not a marketing detail. It shapes what gets built and why.

The founder's background is in **behavioral health** — direct work in Applied Behavior Analysis (ABA) for autism therapy and time inside mental-health facilities. This is not adjacent-to-health experience; it is hands-on work with some of the most sensitive health data and most vulnerable populations there are, inside the systems that are supposed to serve them.

That experience matters for building health technology in concrete ways. ABA is an intensely **data-driven, evidence-based discipline**: practitioners collect granular behavioral data continuously, track it over time, and adjust intervention based on what the data shows. It is, in a real sense, the quantified self applied clinically — and it instills a working intuition for what good health data infrastructure actually needs: granularity, accurate provenance, the difference between a measurement and an estimate, longitudinal continuity, and the ability to share specific data with specific people on the client's terms. Those requirements are visible all over NIP-101h. The `accuracy` tag, the `entry_method` tag, the per-metric consent model, the insistence on portable longitudinal history — these are the concerns of someone who has done the actual work of clinical data collection, not someone who imagined it from the outside.

It also instills a clear-eyed view of **how badly the incumbent systems serve the people in them**. Working inside mental-health facilities and behavioral therapy means watching, firsthand, how the platforms that hold people's most sensitive data fail them: data trapped where the patient can't reach it, no consented way to share it, no continuity when a person moves between providers or apps. The motivation behind Health Note Labs is lived, not theoretical. It comes from having seen the failure mode up close and concluding that the fix had to be architectural — that no better-behaved custodian would do, and that the data had to belong to the person by construction.

This is also why the project stays disciplined about what it does **not** claim. A clinical background means knowing where the lines are. Health Note Labs builds infrastructure for owning and moving health data; it is not a medical device, it does not diagnose, and it does not make treatment claims. That restraint is itself a mark of the clinical foundation: the people who have worked in regulated health settings are precisely the ones who don't casually claim medical authority they haven't earned.

---

## 9. Ecosystem Roadmap

The endgame is not a product. It is a standard that other people build on, and the roadmap should be read with that goal in mind. Health Note Labs builds the first apps to prove the model and seed the network, but the win condition is an ecosystem where most of the apps are not Health Note Labs apps at all.

**What exists now.** NIP-101h is published with fourteen-plus defined metrics. RUNSTR is live, paying Bitcoin and publishing user-owned workout and health events. The HealthNote SDK, API, MCP server, and relay are specified and in active development. This is the foundation and the first proof point, both real.

**What is next.** Export and portability tooling that turns the abstract promise of "your data is yours" into a button: CSV, SQLite, and JSON export, plus integration with Blossom personal-data servers, so users can back up and move their full history with `--strip-pii` controls and always-client-side decryption. A Stats SDK for in-app trends — moving averages, personal records, streaks — computed on the client so the values never leave it. The Npub.Health dashboard as the unified, cross-app view of everything a user has published. And additional metric categories filling out the reserved ranges: sleep, mental health, biometrics.

**What is later.** The full `-str` application suite — Sleepstr for sleep, Dietstr for nutrition, Calmstr for mental health and mindfulness, Habitstr for habit tracking, Spiritstr for spiritual practice — each a focused, best-in-class app that writes to the same open profile, so that adopting a second app extends your record instead of fragmenting it. Broader device integrations. And the long compounding payoff: the network effect of an open health-data standard, where each new compatible app makes the shared profile more valuable to every user and every other app.

The crucial framing, and the thing that separates this roadmap from a product backlog: **NIP-101h is open, and any developer can build a compatible app today.** The `-str` suite is the long-term vision of what Health Note Labs itself intends to ship, but it is explicitly not a moat against other builders. A developer who builds a better sleep app than Sleepstr, writing to the same standard, is not a competitor to be fought; they are the ecosystem working as designed. The goal is interoperability, not monopoly. Health Note Labs wins if the standard wins, even when someone else's app is the one a given user opens. That is the difference between building a platform and building a protocol, and it is a deliberate choice.

---

## 10. Business Model

A privacy-first project has to answer one question before anyone takes it seriously: if you're not selling the data, how do you survive? The answer has to be structurally sound, not a temporary virtue that erodes the moment revenue gets tight. Here it is, and the key property is that none of it depends on reading user data — because the architecture makes that impossible, the business model has to make money some other way, and it does.

The revenue comes from four sources. **Subscriptions** for premium app features and tooling, where the value sold is software and convenience, not access to data. **Events** — organized fitness challenges, races, and competitions, run on the zapper's automated Bitcoin distribution, where Health Note Labs can take a margin on prize pools, entry, and sponsorship. **Sponsorships** from brands and organizations that want to reach an engaged, health-focused, Bitcoin-native audience through events and the apps. And **grants** — from organizations like OpenSats and the Human Rights Foundation that fund open-source, freedom-preserving infrastructure, which NIP-101h and its toolkit straightforwardly are.

A distinctive treasury choice ties it together: **subscription revenue is held as a Bitcoin treasury** rather than immediately converted and spent. This is not a gimmick; it is the engine of a flywheel. Subscriptions feed a Bitcoin treasury. The treasury funds rewards — the sats the zapper pays out for activity. Rewards drive engagement, because users have a real economic reason to log workouts and participate. Engagement makes the apps and events more valuable, which attracts more participants, more sponsorships, and more subscriptions. More subscriptions grow the treasury, which funds more rewards. The loop closes: **subscriptions → treasury → rewards → engagement → events and sponsorships → revenue → subscriptions.** The same Bitcoin rails that hold the treasury are the rails that distribute the rewards, so the financial machinery and the product machinery are the same machinery.

Why this is sustainable without selling data: every link in the flywheel is powered by activity, engagement, and real economic exchange — not by mining the user's information. Health Note Labs structurally *cannot* build an ad or data-sale business, because it never holds the keys to read the data. That constraint, which looks like a limitation, is actually the trust position: the company's incentives and the user's interests cannot diverge into surveillance, because the surveillance path is closed at the cryptographic level. The business has to make money by building things people pay for and join, which is the only kind of health-data business model that doesn't eventually turn on its users.

---

## 11. Call to Action

The work from here depends on four audiences, and each has a concrete next step.

**Developers** should build on NIP-101h. The standard is open and published, the metric specs are defined, and the SDK is being built precisely so that creating a privacy-first health app no longer requires becoming a Nostr or cryptography expert. If you build health or fitness software, building it on NIP-101h means your users own their data, your app interoperates with every other app on the standard, and you get k-anonymous aggregate analytics without ever holding raw data or carrying the liability that comes with it. The most valuable thing you can do for this ecosystem is build an app Health Note Labs didn't — that is the standard succeeding. Read the spec, pull the SDK, ship something.

**Users** should try RUNSTR. It is the live proof that owning your health data costs you nothing in usability: you track your runs, you earn Bitcoin, and every data point is yours, encrypted by default, portable to anything else that speaks the standard. Using it is how you stop renting access to your own health data and start holding it.

**Grant committees** — OpenSats, the Human Rights Foundation, and the broader set of funders backing open, freedom-preserving infrastructure — should fund the protocol and the toolkit. NIP-101h is exactly the kind of public-good standard that doesn't get built by a company chasing data monetization, because the whole value of it is that it makes data monetization impossible. It needs grant funding for the same reason Nostr itself did: it is infrastructure that benefits everyone and is owned by no one. Funding the SDK, the relay, the export tooling, and the metric specs is funding the rails that an entire category of sovereign health software will run on.

**Healthcare providers and clinicians** should pay attention. The thing that has been missing — a patient-owned, consent-controlled, portable way for people to hold their own health data and share specific pieces of it with specific providers on their own terms — is being built. It is early, and it is not a medical device, and those caveats are real. But the direction is the one that fixes the information-blocking, data-trapped, screenshot-everything reality that providers and patients both live inside today. The clinicians who engage early will shape what the consented, patient-owned health record actually becomes.

The bet underneath all of it is the one stated at the start. Open standards beat walled gardens — email beat the proprietary messaging services, the web beat the closed online services — and they beat them not because the gardens were poorly built but because closed is structurally weaker than open over a long enough horizon. Health data is the next thing that goes open. Health Note Labs is building the standard it converges on, and the apps that prove it works.

Your health data. Your keys. Your call.

---

*Health Note Labs is building the open standard for personal health data on Nostr and Bitcoin. NIP-101h is open and released under the MIT license. This document describes both shipping software (RUNSTR, the NIP-101h standard) and planned work (the broader app suite, portions of the developer toolkit); the distinction is marked throughout. Nothing here is a medical claim, and Health Note Labs products are not medical devices.*
