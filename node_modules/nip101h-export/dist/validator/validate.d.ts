import { ErrorObject } from 'ajv';
import { NostrEvent } from '../types.js';
export interface ValidationResult {
    valid: boolean;
    errors?: ErrorObject[] | null;
}
export declare function validateEvent(event: NostrEvent): ValidationResult;
export declare function validateEvents(events: NostrEvent[]): {
    valid: boolean;
    errorCount: number;
};
