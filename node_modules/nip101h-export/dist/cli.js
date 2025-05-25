import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';
// Initialize the CLI with yargs
export const cli = yargs(hideBin(process.argv))
    .scriptName('nip101h-export')
    .command('$0 <inputDir>', 'Export NIP-101h events to various formats', (y) => y
    .positional('inputDir', {
    type: 'string',
    describe: 'Directory containing JSON event files',
})
    .option('to', {
    alias: 't',
    type: 'string',
    description: 'Output format (csv, sqlite, blossom)',
    choices: ['csv', 'sqlite', 'blossom'],
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
    .option('kinds', {
    type: 'string',
    description: 'Comma-separated list of event kind numbers to include',
})
    .help('help')
    .alias('help', 'h')
    .version('0.1.0')
    .alias('version', 'v'), async (argv) => {
    const { inputDir, to, out } = argv;
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
        const outputPath = out !== null && out !== void 0 ? out : 'events.csv';
        await writeCsv(events, outputPath);
        console.log(`Exported ${events.length} events to ${outputPath}`);
    }
    else {
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
            const outputPath = out !== null && out !== void 0 ? out : 'events.sqlite';
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
            const outputPath = out !== null && out !== void 0 ? out : 'events.blossom.json';
            await writeBlossom(events, outputPath);
            console.log(`Exported ${events.length} events to ${outputPath}`);
            return;
        }
        console.error(`Output format '${to}' not yet implemented.`);
        process.exitCode = 1;
    }
})
    .strict()
    .parse();
// Execute CLI when run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    // no-op: yargs.parse() already handled execution
}
