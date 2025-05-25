import { hideBin } from 'yargs/helpers';
import yargs, { type Argv } from 'yargs';

// Initialize the CLI with yargs
export const cli = yargs(hideBin(process.argv))
  .scriptName('nip101h-export')
  .command(
    '$0 <inputDir>',
    'Export NIP-101h events to various formats',
    (y: Argv) =>
      y
        .positional('inputDir', {
          type: 'string',
          describe: 'Directory containing JSON event files',
        })
        .option('to', {
          alias: 't',
          type: 'string',
          description: 'Output format (csv, sqlite, blossom)',
          choices: ['csv', 'sqlite', 'blossom'] as const,
          demandOption: true,
        })
        .option('out', {
          alias: 'o',
          type: 'string',
          description: 'Output file path (defaults based on format)',
        })
        .option('decrypt', {
          type: 'boolean',
          description: 'Decrypt content locally using provided private key',
          default: false,
        })
        .option('privkey', {
          type: 'string',
          description: 'Hex encoded private key used for local decryption',
        })
        .option('strip-pii', {
          type: 'boolean',
          description: 'Remove personally identifiable information from output',
          default: false,
        })
        .option('stats', {
          type: 'boolean',
          description: 'Generate aggregated time-series stats (JSON/CSV). Overrides --to',
          default: false,
        })
        .option('stats-format', {
          type: 'string',
          description: 'Stats output format',
          choices: ['json', 'csv'] as const,
          default: 'json',
        })
        .option('stats-bucket', {
          type: 'string',
          description: 'Bucket size for aggregation',
          choices: ['day', 'week', 'month'] as const,
          default: 'day',
        })
        .option('stats-aggregate', {
          type: 'string',
          description: 'Aggregate function',
          choices: ['avg', 'sum', 'min', 'max', 'count'] as const,
          default: 'avg',
        })
        .option('kinds', {
          type: 'string',
          description: 'Comma-separated list of event kind numbers to include',
        })
        .help('help')
        .alias('help', 'h')
        .version('0.1.0')
        .alias('version', 'v'),
    async (argv) => {
      const { inputDir, to, out, stats, statsFormat, statsBucket, statsAggregate } = argv as unknown as {
        inputDir: string;
        to: string;
        out?: string;
        stats?: boolean;
        statsFormat?: string;
        statsBucket?: string;
        statsAggregate?: string;
      };

      // Handle --stats early
      if (stats) {
        const path = await import('path');
        const fs = await import('fs/promises');

        const { loadEventsFromDir } = await import('./loaders/jsonLoader.js');

        let events = await loadEventsFromDir(inputDir);

        // Filter kinds if provided
        if (argv.kinds) {
          const kinds = String(argv.kinds)
            .split(',')
            .map((k) => Number(k.trim()));
          events = events.filter((e) => kinds.includes(e.kind));
        }

        // @ts-ignore – health-note workspace package
        const { toTimeSeries, groupByBucket } = await import('health-note');

        const series = toTimeSeries(events);

        const bucketed = groupByBucket(series, {
          // @ts-ignore
          bucket: statsBucket,
          // @ts-ignore
          aggregate: statsAggregate,
        });

        const metricField = argv.kinds ? argv.kinds : 'mixed';

        const aggregationObject = {
          metric: metricField,
          period: statsBucket,
          series: bucketed,
        };

        // Validate against aggregation schema
        try {
          const { default: Ajv } = await import('ajv');
          const { readFile } = await import('fs/promises');
          const pathMod = await import('path');
          const ajv = new Ajv({ allErrors: true });
          const schemaPath = pathMod.resolve(process.cwd(), 'schemas', 'aggregation.schema.json');
          const schemaContent = JSON.parse(await readFile(schemaPath, 'utf8'));
          const validateAgg = ajv.compile(schemaContent);
          if (!validateAgg(aggregationObject)) {
            console.error('Aggregation output failed schema validation:', validateAgg.errors);
            process.exitCode = 1;
            return;
          }
        } catch (err) {
          console.warn('Warning: could not validate aggregation output', err);
        }

        const outputPath = out ?? `stats.${statsFormat === 'csv' ? 'csv' : 'json'}`;

        if (statsFormat === 'csv') {
          const header = 'date,value,count,min,max\n';
          const lines = bucketed
            .map((p: any) => `${p.date},${p.value},${p.count ?? ''},${p.min ?? ''},${p.max ?? ''}`)
            .join('\n');
          await fs.writeFile(outputPath, header + lines, 'utf8');
        } else {
          await fs.writeFile(outputPath, JSON.stringify(aggregationObject, null, 2), 'utf8');
        }

        console.log(`Aggregated stats written to ${outputPath}`);
        return;
      }

      // Dynamically import heavy modules only when needed
      if (to === 'csv') {
        const { loadEventsFromDir } = await import('./loaders/jsonLoader.js');
        const { writeCsv } = await import('./writers/csvWriter.js');
        const { validateEvents } = await import('./validator/validate.js');
        let events = await loadEventsFromDir(inputDir);
        if (argv.decrypt) {
          const { decryptEvents } = await import('./utils/decrypt.js');
          if (!argv.privkey) {
            console.error('--decrypt specified but --privkey missing');
            process.exitCode = 1;
            return;
          }
          await decryptEvents(events, String(argv.privkey));
          if (argv['strip-pii']) {
            const { stripPii } = await import('./utils/strip.js');
            stripPii(events);
          }
        }
        if (!events.length) {
          console.error('No events found to export.');
          process.exitCode = 1;
          return;
        }
        const validation = validateEvents(events);
        if (!validation.valid) {
          console.error(`Validation failed for ${validation.errorCount} event(s). Aborting export.`);
          process.exitCode = 1;
          return;
        }
        const outputPath = out ?? 'events.csv';
        await writeCsv(events, outputPath);
        console.log(`Exported ${events.length} events to ${outputPath}`);
      } else {
        if (to === 'sqlite') {
          const { loadEventsFromDir } = await import('./loaders/jsonLoader.js');
          const { writeSqlite } = await import('./writers/sqliteWriter.js');
          const { validateEvents } = await import('./validator/validate.js');

          let events = await loadEventsFromDir(inputDir);
          if (argv.decrypt) {
            const { decryptEvents } = await import('./utils/decrypt.js');
            if (!argv.privkey) {
              console.error('--decrypt specified but --privkey missing');
              process.exitCode = 1;
              return;
            }
            await decryptEvents(events, String(argv.privkey));
            if (argv['strip-pii']) {
              const { stripPii } = await import('./utils/strip.js');
              stripPii(events);
            }
          }
          if (!events.length) {
            console.error('No events found to export.');
            process.exitCode = 1;
            return;
          }
          const validation = validateEvents(events);
          if (!validation.valid) {
            console.error(`Validation failed for ${validation.errorCount} event(s). Aborting export.`);
            process.exitCode = 1;
            return;
          }
          const outputPath = out ?? 'events.sqlite';
          await writeSqlite(events, outputPath);
          console.log(`Exported ${events.length} events to ${outputPath}`);
          return;
        }
        if (to === 'blossom') {
          const { loadEventsFromDir } = await import('./loaders/jsonLoader.js');
          const { writeBlossom } = await import('./writers/blossomWriter.js');
          const { validateEvents } = await import('./validator/validate.js');

          let events = await loadEventsFromDir(inputDir);
          if (argv.decrypt) {
            const { decryptEvents } = await import('./utils/decrypt.js');
            if (!argv.privkey) {
              console.error('--decrypt specified but --privkey missing');
              process.exitCode = 1;
              return;
            }
            await decryptEvents(events, String(argv.privkey));
            if (argv['strip-pii']) {
              const { stripPii } = await import('./utils/strip.js');
              stripPii(events);
            }
          }
          if (!events.length) {
            console.error('No events found to export.');
            process.exitCode = 1;
            return;
          }
          const validation = validateEvents(events);
          if (!validation.valid) {
            console.error(`Validation failed for ${validation.errorCount} event(s). Aborting export.`);
            process.exitCode = 1;
            return;
          }
          const outputPath = out ?? 'events.blossom.json';
          await writeBlossom(events, outputPath);
          console.log(`Exported ${events.length} events to ${outputPath}`);
          return;
        }
        console.error(`Output format '${to}' not yet implemented.`);
        process.exitCode = 1;
      }
    },
  )
  .strict()
  .parse();

// Execute CLI when run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  // no-op: yargs.parse() already handled execution
} 