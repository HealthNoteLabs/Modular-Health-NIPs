# Health Note Labs — Architecture

*Technical architecture of the Health Note Labs ecosystem. How the pieces fit together, bottom to top.*

This document is for developers. It describes the layers of the stack, the technology that implements each one, and the seams where they connect. Where something is shipping, we say so. Where something is specified-and-building, we say that too — the distinction is marked throughout.

The whole stack exists to make one property true: **your health data is yours by construction, not by a company's promise.** Every layer below is in service of that. The user holds a Nostr keypair; data is published under that key, encrypted with the user's key, and readable only by the user and whoever they explicitly grant. Nothing in the stack holds a credential that can read your data without you. Read the layers with that constraint in mind — it's why each piece is shaped the way it is.

---

## The Layer Stack

```
┌──────────────────────────────────────────────────────────────────────┐
│  YOU  —  one npub, hold the keys, own the data, grant / revoke access  │
└──────────────────────────────────────────────────────────────────────┘
        ▲                  ▲                    ▲                  ▲
┌───────┴──────────────────────────────────────────────────────────────┐
│  6 · AGGREGATION   Npub.Health                                         │
│      One npub → one complete health profile. Cross-metric correlation. │
└───────────────────────────────────┬──────────────────────────────────┘
                                     │  reads every metric kind
┌────────────────────────────────────┴─────────────────────────────────┐
│  5 · APPLICATIONS                                                      │
│      RUNSTR (live) · Sleepstr · Dietstr · Calmstr · Habitstr (planned) │
│      Each app writes its own NIP-101h kinds to the same npub + relay.  │
└────────────────────────────────────┬─────────────────────────────────┘
                                     │  read / write health events
┌────────────────────────────────────┴─────────────────────────────────┐
│  4 · AGENT  —  Sovereign Health AI  (architectural principle)          │
│      OpenClaw / Hermes single-agent pattern, on the USER's hardware.   │
│      Reads NIP-101h via MCP. The model comes to the data.              │
└────────────────────────────────────┬─────────────────────────────────┘
                                     │  MCP (tools over health data)
┌────────────────────────────────────┴─────────────────────────────────┐
│  3 · INFRASTRUCTURE                                                    │
│      HealthNote Relay · HealthNote MCP Server · HealthNote SDK · Blossom│
│      The bridge between agents/apps and NIP-101h events.               │
└────────────────────────────────────┬─────────────────────────────────┘
                                     │  conforms to
┌────────────────────────────────────┴─────────────────────────────────┐
│  2 · PROTOCOL   NIP-101h                                               │
│      14 modular health-metric kinds · NIP-44 encrypted by default.     │
│      Built on Nostr (NIP-01) and Bitcoin-grade cryptography.           │
└──────────────────────────────────────────────────────────────────────┘
```

The arrows are the contract. Each layer talks to the one below it through a standardized format, so layers that have never met still interoperate — a new app and a local AI agent both work against the same events, because both conform to NIP-101h.

> **A note on the agent layer's position.** The agent sits *beside* the apps in practice — both are consumers of NIP-101h data — but it's drawn as its own layer because it's the architectural differentiator. The agent runs on the user's hardware and reaches the data through the MCP server. Apps reach the data through the SDK. Both read the same events from the same relays.

---

## 1. Protocol Layer: NIP-101h

NIP-101h is the foundation. It's the language; everything above it speaks that language. The full spec lives in [`NIP101h`](../NIP101h) at the repo root — this is the summary a developer needs to understand where it sits in the stack.

### What it standardizes

A Nostr event is a small, signed, timestamped JSON object with a `kind` number and a set of tags ([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md) — the base Nostr event protocol). A health metric is a small, timestamped value with metadata: a unit, a source, an accuracy. NIP-101h maps one to the other — **one event per measurement, the `kind` identifies the metric, the tags carry the context, and the signature proves provenance.**

The core design decision is **modularity**. Rather than one monolithic "health profile" event, each metric gets its own micro-spec on its own kind number. The framework currently defines **14 metrics**:

| NIP-101h.X | Metric | Kind | Category |
|---|---|---|---|
| .1 | Weight | 1351 | Anthropometrics |
| .2 | Height | 1352 | Anthropometrics |
| .3 | Age | 1353 | Anthropometrics |
| .4 | Gender | 1354 | Anthropometrics |
| .5 | Fitness Level | 1355 | Anthropometrics |
| .6 | Workout Intensity | 1356 | Activity & Fitness |
| .7 | Caloric Data | 1357 (expended) / 2357 (consumed) | Nutrition & Diet |
| .8 | Activity Duration | 1358 | Activity & Fitness |
| .9 | Step Count | 1359 | Activity & Fitness |
| .10 | Elevation | 1360 | Activity & Fitness |
| .11 | Splits | 1361 | Activity & Fitness |
| .12 | Pace | 1362 | Activity & Fitness |
| .13 | Distance | 1363 | Activity & Fitness |
| .14 | Speed | 1364 | Activity & Fitness |

Kind numbers are organized into reserved ranges by category, so new metrics slot in by claiming the next free number with no coordination cost and no risk of breaking existing implementations:

| Kind Range | Category |
|---|---|
| 1351–1369 | Anthropometrics |
| 1370–1389 | Activity & Fitness |
| 1390–1409 | Nutrition & Diet |
| 1410–1429 | Sleep |
| 1430–1449 | Mental Health & Mindfulness |
| 1450–1469 | Medical & Biometrics |
| 1470–1489 | Lifestyle & Environment |
| 1490–1499 | Reserved |
| 2351–2399 | Paired / secondary metrics |

Every event carries a `category` tag, the `['t', 'health']` tag, a metric-specific `['t', ...]` tag, and a `unit` tag. The full canonical tag registry (`source`, `device`, `entry_method`, `accuracy`, `goal`, `period`, `granularity`, `consent`, …) is in the spec. Clients **MUST** ignore unknown tags and **SHOULD** preserve them when relaying — that's the forward-compatibility rule that lets the standard grow without breakage.

### NIP-44 encryption by default

This is the single most important implementation rule, and it's deliberately phrased as a *default* rather than an option. Clients implementing NIP-101h **SHOULD** encrypt the `content` of every health metric using [NIP-44](https://github.com/nostr-protocol/nips/blob/master/44.md) (the modern Nostr encryption scheme) before the event ever leaves the device, and provide an explicit per-event or per-metric opt-in for anyone who wants to publish in the clear.

The direction matters: **privacy is on unless you turn it off, never off unless you turn it on.** Concretely — the numeric value of your weight is encrypted client-side; only the non-sensitive tags (unit, timestamp, the fact that this is a health event) stay readable. That last detail is what makes the scheme practical rather than merely private: an app can build your weight timeline, sort it, and chart its shape *from the tags alone*, and only decrypt the actual values locally, in your client, with your key. Encrypted events carry `['encryption_algo', 'nip44']` and `['p', <receiver_pubkey>]`.

### Consent model

A `consent` tag travels with each event so both clients and relays know the intended audience:

- `public` — anyone may access the event.
- `private` — only the user or explicitly authorized parties.
- `shared-with:<pubkey>` — only the named public key(s).
- `aggregate-only` — usable in privacy-preserving aggregates (see the HealthNote API), never exposed individually.

The user controls who decrypts, metric by metric. Because each metric is its own encrypted event, you can share your VO₂max with your coach while keeping your body-fat percentage private — **the granularity of sharing falls out of the granularity of the data model**, with no app having to build a custom permission system to make it possible. Clients and relays **SHOULD** respect the consent tag.

### Relationship to other Nostr NIPs

- **NIP-01** — the base Nostr protocol. Defines the event object, kinds, tags, signatures, and the relay request/response model. NIP-101h is a set of kind definitions on top of it.
- **NIP-44** — the encryption scheme NIP-101h uses by default for the `content` field.
- **NIP-101e** — a *separate, existing* standard for **workout and exercise records** ("I did a 5k run, here are the laps and the route"). NIP-101h is the **health metrics** standard — the underlying data points (weight, steps, calories, pace). They're complementary: a workout in NIP-101e is the session; the NIP-101h events are the measurements that session produced. RUNSTR writes both, and links them with `['e', <event_id>]` tags — that's the proof they compose.

---

## 2. Infrastructure Layer

The infrastructure layer is the developer toolkit. Its job: make building on NIP-101h something you can do in days, without becoming a Nostr internals expert or a cryptographer.

### Relays

NIP-101h events are stored on Nostr relays — simple servers that accept signed events and serve them back by filter (author, kind, tag, time range). Relays are interchangeable and many; a client publishes to several at once. **Any standard Nostr relay can store NIP-101h events** — they're valid Nostr events, so `relay.damus.io`, `nos.lol`, `relay.primal.net`, and the rest will carry them today.

The **HealthNote Relay** *(specified / building)* is a Nostr relay tuned for health events: aware of the NIP-101h kind ranges, able to filter and serve efficiently by metric category, and built to respect the consent model so private and shared events aren't exposed to parties who shouldn't see them. It's an optimization, not a dependency — the data isn't bound to it. If it disappears, the events are valid and queryable anywhere, because they're signed by the user's key, not owned by the relay.

### HealthNote MCP Server

The MCP server is the bridge between AI agents and NIP-101h data. It's how the agent layer above reaches the protocol layer below.

**What MCP is.** The [Model Context Protocol](https://modelcontextprotocol.io) is an open standard for giving AI models tool access — a uniform way for an LLM (Claude, a local model, anything that speaks MCP) to call external functions and read external resources. The model doesn't need bespoke integration code per data source; it connects to an MCP server and discovers the tools the server exposes. Here, those tools are *operations over a user's health data*.

The implementation lives in [`packages/healthnote-api/src/server.ts`](../packages/healthnote-api/src/server.ts). It's an Express server speaking MCP over the Streamable HTTP transport at `POST /mcp`, with per-session lifecycle (`mcp-session-id` header, `GET`/`DELETE /mcp` for session management). On startup it parses the `NIP101h` spec file directly and loads the kind registry into memory, so the tools it exposes always reflect the live spec. The four tools it currently exposes:

| MCP Tool | What it does |
|---|---|
| `listNip101hKinds` | Lists all defined NIP-101h kinds (optionally filtered by category) with their units, categories, and canonical tags. How an agent discovers what's trackable. |
| `getNip101hKindInfo` | Returns detailed info for one kind number (e.g. `1351` → Weight: unit `kg`, category Anthropometrics, required tags). |
| `prepareNip101hEvent` | Builds a well-formed NIP-101h event *template* for a given kind, value, and target pubkey — with the right `t`/`category`/`p`/`encryption_algo` tags pre-attached. Content is left as a placeholder: **encryption and signing happen client-side**, with the user's key. The server never sees plaintext or a private key. |
| `fetchUserNip101hEventsInstruction` | Returns a ready-to-use Nostr filter (authors, kinds, time bounds) plus suggested relays for reading a user's events. The client runs the query and decrypts locally. |

Note the deliberate boundary: the MCP server **prepares and instructs; it never encrypts, signs, or holds keys.** It hands the agent the structure and the filter; the actual cryptography stays on the user's machine. That's what makes it safe to run an agent against it.

> **Roadmap note — analytics routes.** The whitepaper describes a privacy-preserving aggregate-analytics surface on `ingest` / `trend` / `correlate` / `distribution` / `metrics` (time-series buckets, cross-metric correlation, population distributions) enforced behind **k-anonymity ≥ 5** and optional **differential privacy** (Laplace noise). These compute over `aggregate-only` "stat-blobs" — just `{kind, value, unit, timestamp}` — never raw encrypted content, and structurally cannot return an individual's value. These routes are **specified, not yet in `server.ts`**. The current server implements the four NIP-101h helper tools above. We mark the difference rather than imply the analytics layer ships today.

### HealthNote SDK

The **HealthNote SDK** *(specified / building)* is a TypeScript library that constructs well-formed NIP-101h events, handles NIP-44 encryption transparently, attaches the right consent tags (defaulting to the privacy-preserving choice), signs with the user's key, and publishes to relays. The target ergonomics: a developer calls something close to `publishWeight(70, 'kg')` and the SDK does event construction, encryption, signing, and relay publication underneath.

The low-level Nostr and crypto details are abstracted away *precisely so that getting privacy right is the path of least resistance*, not an expert option a busy developer skips. Reading is the mirror image: query relays by kind and tag, verify signatures, decrypt content locally if you hold the key.

### Blossom

**Blossom** is a Nostr-adjacent protocol for blob storage — content-addressed binary files served from user-controlled servers. NIP-101h events are small (one measurement each), but full health-data **exports** and larger artifacts (CSV/SQLite dumps of a complete history, raw device files) don't belong inline in an event. Blossom is where those go: the user can back up and move their entire history to a personal-data server they control, with `--strip-pii` controls and always-client-side decryption. The export formats are defined in the NIP-101h spec (JSON array of events, or flattened CSV). The principle holds — the blob lives on infrastructure the *user* points at, not a Health Note Labs server.

---

## 3. Agent Layer: Sovereign Health AI

This is the key differentiator, and it's an **architectural principle, not a product**. Read this section as "here is a property the stack makes possible," not "here is a thing you install."

### The principle

The mainstream path for AI + health is: you hand your data to a cloud service, it analyzes the data on its servers, you get insights back. The data leaves your control to be processed. For health data that reproduces exactly the problem the whole stack exists to solve.

NIP-101h data doesn't have to work that way, and the reason is structural: **your health record is a set of standardized, signed events you can decrypt with your own key on your own machine.** Nothing about analyzing it requires a third party. So:

> **An AI running on the user's own hardware reads the user's decrypted NIP-101h data, reasons over it, and returns analysis — with no cloud and no third party in the loop. The model comes to the data; the data never leaves the machine.**

### The single-agent pattern (OpenClaw / Hermes)

The concrete shape of this agent is the single-agent runtime from [OpenClaw](https://github.com/TheWildHustle/openclaw), currently deployed as **Hermes** on a Mac mini at `~/.hermes/hermes-agent/`. The same workspace contract is also used inside the RUNSTR app. The pattern:

- **One embedded agent runtime, one workspace directory.** No orchestration fleet — a single agent that wakes up fresh each session.
- **Bootstrap files define the agent.** On wake, the agent reads its identity and operating files from the workspace:

  | File | Role |
  |---|---|
  | `BOOTSTRAP.md` | Entry point — how to start up and what to read. |
  | `AGENTS.md` | Operating instructions and memory — how this agent works, what it has learned. |
  | `SOUL.md` | Persona — the agent's voice and character. |
  | `IDENTITY.md` | Who the agent is. |
  | `USER.md` | Who the user is. |
  | `TOOLS.md` | What tools the agent has and how to use them. |

- **The agent wakes fresh, reads its identity files, has tools, operates in one workspace.** Continuity comes from the files, not from a long-running process. Memory is durable because it's written to the workspace, not held in RAM.

### How it applies to health

The agent runs **on the user's own hardware** — Mac mini, home server, whatever the user controls. It connects to the **HealthNote MCP Server** (layer 2) to read and analyze NIP-101h data. The MCP server hands it the Nostr filters to fetch events and the kind metadata to interpret them; the agent fetches, the data is decrypted locally with the user's key, and the model reasons over the user's full, unredacted history — because it's running where the key already is.

Two consequences fall out of this:

1. **The data never leaves the user's machine.** The MCP server prepares and instructs; it holds no keys. Decryption is local. The model is local (or, if the user genuinely chooses, remote — the standard doesn't force it). At no point does a server hold a credential that reads the plaintext.
2. **Any model works.** Because NIP-101h data is open, standardized, and decryptable by the key-holder, *any* AI the user picks can consume it: Claude via the Anthropic API, a local open-weights model (Ollama / Qwen / etc.), a self-hosted assistant. The workspace contract (`SOUL.md` and friends) keeps the agent's personality and memory stable across whichever model is behind it.

This is the **sovereign computing** lineage applied to health: run your own node, run your own relay, run your own model over your own health record. Health Note Labs doesn't have to ship the agent for this to be real — it has to ship the *data layer* that makes a local agent possible, and that's exactly what NIP-101h and the MCP server are.

---

## 4. Application Layer

Apps are what a person actually uses. Each is a focused, best-in-class app for its domain — and each reads/writes its own NIP-101h metric kinds to the **same npub, the same relay, the same encryption keys**. That shared identity is the whole point: adopting a second app *extends* your record instead of fragmenting it.

### RUNSTR — live

The flagship fitness app, shipping today. On the surface it records GPS-tracked runs and workouts like any running app. Underneath, every data point is published as the user's own Nostr events:

- the workout session as a **NIP-101e** event,
- the underlying measurements — distance (1363), duration (1358), pace (1362), calories (1357), steps (1359), splits (1361) — as **NIP-101h** events,

encrypted by default, owned by the user's key, linked together with `['e', ...]` tags. If RUNSTR vanished tomorrow, its users keep every run, because the runs were never RUNSTR's to keep. RUNSTR also pays users **Bitcoin** for activity via an automated Lightning "zapper" — proof that an app on open rails can attach real economic incentives without an ad or data-sale model.

### Planned `-str` apps

Each writes to its category's kind range, to the same profile:

| App | Domain | Primary NIP-101h category |
|---|---|---|
| **Sleepstr** | Sleep | Sleep (1410–1429) |
| **Dietstr** | Nutrition | Nutrition & Diet (1390–1409) |
| **Calmstr** | Mental health & mindfulness | Mental Health & Mindfulness (1430–1449) |
| **Habitstr** | Habit tracking | Lifestyle & Environment (1470–1489) |
| **Spiritstr** | Spiritual practice | Lifestyle & Environment (1470–1489) |

These are roadmap, not downloadable today — and the framing matters: **NIP-101h is open, so a developer who builds a better sleep app than Sleepstr, writing to the same kinds, is the ecosystem working as designed, not a competitor.** The goal is interoperability, not monopoly.

---

## 5. Aggregation Layer: Npub.Health

The endgame dashboard. Npub.Health pulls **every metric from every app** into one user-owned view — and it's only possible *because* every app writes to the same standard under the same npub.

- **One npub = one complete health profile.** Npub.Health queries the user's relays for all their NIP-101h kinds (across every app that wrote them), verifies signatures, decrypts content locally with the user's key, and renders the timelines. No app's data is trapped; the dashboard reads RUNSTR's runs, Sleepstr's sleep, and Dietstr's nutrition as one record, because they're all events on the same keyspace in the same format.
- **Cross-metric correlation.** Once every metric is in one place, the interesting analysis is *between* metrics: how sleep (Sleep kinds) affects workout performance (pace 1362, intensity 1356); how diet (Nutrition kinds) tracks against weight trends (1351). This is exactly the analysis the local agent (layer 3) is positioned to do — Npub.Health is the visual surface, the sovereign agent is the reasoning surface, and both read the same one-npub profile.

---

## 6. Integration Points

### How the layers connect — follow one run through the system

1. **App → Protocol.** A user finishes a run in **RUNSTR**. The app records the session as a NIP-101e workout event and the measurements (distance, duration, pace, calories, steps) as **NIP-101h** events.
2. **Protocol → Infrastructure.** The **HealthNote SDK** encrypts each event's content with **NIP-44** using the user's key, signs them, attaches consent tags, and publishes to the user's relays — including the **HealthNote Relay**.
3. **Infrastructure → Agent.** Later, a **sovereign agent** (Hermes-style, on the user's Mac mini) wants to analyze the week. It calls the **HealthNote MCP Server**: `listNip101hKinds` to see what's trackable, `fetchUserNip101hEventsInstruction` to get the Nostr filter and relays. It runs the query, decrypts the events locally with the user's key, and reasons over them. **No plaintext left the machine.**
4. **Apps + Aggregation → User.** The user opens **Npub.Health**, which queries the same relays, verifies signatures, decrypts locally, and renders every metric from every app as one profile — and surfaces cross-metric correlations.

The same run, weeks later, is readable by a brand-new app the user installs, because the data was never trapped in RUNSTR — it was published to the user's own keyspace in a standard format. **That portability is the whole thesis, demonstrated end to end.**

### How a new developer builds on this

1. **Pick a metric.** Choose an existing NIP-101h kind, or claim the next free kind number in the right category range for a new one.
2. **Implement the NIP.** Define the content format, the required/optional tags, and examples — following the `NIP-101h.X` extension format in the spec. Encrypt content with NIP-44 by default. Honor the consent model.
3. **Register with the MCP server.** The server in [`server.ts`](../packages/healthnote-api/src/server.ts) parses the `NIP101h` spec file on startup to build its kind registry — so adding your metric to the spec makes it discoverable to every agent through `listNip101hKinds` / `getNip101hKindInfo` automatically. No separate registration step; the spec *is* the registry.
4. **Read and write with the SDK.** Use the HealthNote SDK to publish and query, so encryption, signing, and consent tagging are handled correctly by default.

The win condition: **build an app Health Note Labs didn't.** Because it speaks NIP-101h, your users own their data, your app interoperates with every other app on the standard, and your data shows up in the user's Npub.Health profile and is readable by their sovereign agent — for free, because you conformed to the protocol.

### How a user sets up their sovereign stack

The full self-custodied setup, in order of dependency:

1. **A Nostr keypair** — the `npub`/`nsec` that owns everything. One identity across every app.
2. **A relay** — any public Nostr relay works to start; run your own (or the HealthNote Relay) for a fully self-hosted data layer.
3. **A node / hardware** — a Mac mini, home server, or always-on machine the user controls. This is where the agent and (optionally) the relay live.
4. **An agent** — the OpenClaw/Hermes single-agent runtime in a workspace directory (`BOOTSTRAP.md`, `AGENTS.md`, `SOUL.md`, `IDENTITY.md`, `USER.md`, `TOOLS.md`), pointed at a model (Claude via API or a local LLM) and connected to the HealthNote MCP Server.
5. **Apps** — RUNSTR today, the `-str` suite as it ships, all writing to the same npub and relay.
6. **A dashboard** — Npub.Health, reading the whole profile back.

Every layer in that list is something the user points at hardware *they* control. The data layer is theirs, the relay can be theirs, the node is theirs, the model is theirs. The company sits in none of those positions — and structurally can't, because it never holds the keys.

---

*Health Note Labs is building the open standard for personal health data on Nostr and Bitcoin. NIP-101h is open. This document describes both shipping software (RUNSTR, the NIP-101h standard, the MCP server's NIP-101h helper tools) and specified-and-building work (HealthNote SDK, HealthNote Relay, the analytics routes, the `-str` app suite); the distinction is marked throughout. Nothing here is a medical claim, and Health Note Labs products are not medical devices.*
