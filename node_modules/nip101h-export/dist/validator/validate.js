import Ajv from 'ajv';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const schema = require('../schemas/nostrEvent.schema.json');
const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
const validateFn = ajv.compile(schema);
export function validateEvent(event) {
    const valid = validateFn(event);
    return { valid: !!valid, errors: validateFn.errors };
}
export function validateEvents(events) {
    let errors = 0;
    for (const ev of events) {
        if (!validateFn(ev))
            errors++;
    }
    return { valid: errors === 0, errorCount: errors };
}
