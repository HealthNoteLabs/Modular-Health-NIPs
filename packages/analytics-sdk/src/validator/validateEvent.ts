import Ajv, { ValidateFunction } from 'ajv';
import path from 'path';
import { readFileSync, existsSync } from 'fs';
import { NostrEvent } from '../types.js';

const ajv = new Ajv({ allErrors: true });
const cache = new Map<number, ValidateFunction>();

function loadSchemaForKind(kind: number): ValidateFunction | null {
  if (cache.has(kind)) return cache.get(kind)!;
  const schemaPath = path.resolve(process.cwd(), 'packages', 'analytics-sdk', 'schemas', `${kind}.schema.json`);
  if (!existsSync(schemaPath)) {
    cache.set(kind, null as any);
    return null;
  }
  const raw = readFileSync(schemaPath, 'utf8');
  const schemaJson = JSON.parse(raw);
  const validate = ajv.compile(schemaJson);
  cache.set(kind, validate);
  return validate;
}

export interface ValidationResult {
  valid: boolean;
  errors?: Ajv.ErrorObject[] | null;
}

export function validateEvent(ev: NostrEvent): ValidationResult {
  const validate = loadSchemaForKind(ev.kind);
  if (!validate) return { valid: true };
  const ok = validate(ev);
  return { valid: !!ok, errors: validate.errors };
} 