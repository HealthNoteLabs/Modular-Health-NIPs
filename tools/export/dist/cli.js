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
    .alias('version', 'v'), () => {
    // No-op for now; conversion logic will be implemented in future milestones
})
    .strict()
    .parse();
// Execute CLI when run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    // no-op: yargs.parse() already handled execution
}
