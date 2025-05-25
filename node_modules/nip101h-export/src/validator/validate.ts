import Ajv, { ErrorObject } from 'ajv';
import { NostrEvent } from '../types.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const schema = require('../schemas/nostrEvent.schema.json') as unknown as object;

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
const validateFn = ajv.compile(schema);

export interface ValidationResult {
  valid: boolean;
  errors?: ErrorObject[] | null;
}

export function validateEvent(event: NostrEvent): ValidationResult {
  const valid = validateFn(event);
  return { valid: !!valid, errors: validateFn.errors };
}

export function validateEvents(events: NostrEvent[]): { valid: boolean; errorCount: number } {
  let errors = 0;
  for (const ev of events) {
    if (!validateFn(ev)) errors++;
  }
  return { valid: errors === 0, errorCount: errors };
} 