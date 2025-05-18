# Unlocking Private Health Analytics on Nostr: NIP-101h, HealthNote SDK, and Blossom

The decentralized health revolution is here. With the NIP-101h framework, the HealthNote SDK, and Blossom personal data servers, we're building a new foundation for health and fitness data—one that's open, privacy-first, and interoperable across the Nostr network.

## The NIP-101h Metric Lineup: Modular, Extensible, and User-Controlled

NIP-101h defines a set of micro-specifications for health and fitness metrics, each as its own Nostr event kind. This modular approach means you can share only the data you want, in the format you choose, with privacy as the default.

**Current NIP-101h Metrics:**
- **Weight** (`kind: 1351`): Body weight in kg or lb.
- **Height** (`kind: 1352`): Height in cm or imperial units.
- **Age** (`kind: 1353`): Age in years (optionally with date of birth).
- **Gender** (`kind: 1354`): Gender identity (free-form string).
- **Fitness Level** (`kind: 1355`): Subjective or objective fitness level.
- **Workout Intensity** (`kind: 1356`): RPE scale or keyword intensity.
- **Calories Expended** (`kind: 1357`): Calories burned.
- **Calories Consumed** (`kind: 2357`): Calories eaten.
- **Activity Duration** (`kind: 1358`): Duration of an activity.
- **Step Count** (`kind: 1359`): Steps for a given period.
- **Elevation** (`kind: 1360`): Elevation gain, loss, or altitude.

Each metric is a self-contained event, with its own schema, tags, and privacy controls. You can find the full details and examples in the [NIP-101h Metric Directory](../NIP101h-Directory.md).

## Privacy-Preserving Analytics: Trends Without Exposure

One of the most powerful aspects of NIP-101h is its privacy-first design. All metric values are encrypted by default using NIP-44, but the event tags (like unit, metric type, and timestamp) remain visible. This means:

- **Developers can build graphs, correlations, and trend visualizations** using only the metadata—without ever seeing the sensitive health values themselves.
- For example, an app can show your activity streaks, step count trends, or workout frequency by analyzing timestamps and metric types, even if the actual values are encrypted.
- When you choose to decrypt and aggregate your data (locally or on your own server), you unlock even richer analytics—always under your control.

## Introducing the HealthNote SDK: Private Data Aggregation Made Easy

To make this vision a reality, we're building the **HealthNote SDK**—a toolkit for developers to:

- **Aggregate, validate, and transform NIP-101h events** from any Nostr relay or local export.
- **Decrypt content locally** (never server-side) using your keys, with full support for NIP-44.
- **Export your data** to CSV, SQLite, or JSON for use in spreadsheets, databases, or custom dashboards.
- **Integrate with Blossom**—your personal data server, which can be hosted or self-hosted for maximum privacy.

The SDK is designed to be plug-and-play for health and fitness apps, making it easy to support NIP-101h metrics, privacy controls, and data portability out of the box.

## Health Data on Nostr: Share, Sync, and Visualize Across Clients

With NIP-101h and the HealthNote SDK, your health and fitness data becomes as portable and interoperable as a kind 1 note or a direct message on Nostr:

- **Blast your encrypted data to relays** for backup, sharing, or cross-device sync.
- **Send encrypted events to your Blossom server**—hosted or self-hosted—for private aggregation, analysis, and export.
- **View your health data across any compatible client**—just like you can read your notes or DMs on any Nostr app.

This means your health journey is no longer locked into a single app or device. You own your data, you control your privacy, and you choose how and where to use it.

## Building the Future: NIP-101h + HealthNote SDK + Blossom

Our goal is to spark a new wave of health and fitness applications on Nostr—apps that are open, privacy-respecting, and interoperable by design. With NIP-101h as the foundation, the HealthNote SDK as the toolkit, and Blossom as the personal data hub, we're enabling:

- **Personal analytics and insights**—without sacrificing privacy.
- **Community-driven innovation**—anyone can propose and add new metrics.
- **A vibrant ecosystem**—where your health data works for you, not for corporate silos.

**Join us in building the next generation of decentralized health apps. Your data, your privacy, your future—powered by NIP-101h, HealthNote SDK, and Blossom.** 