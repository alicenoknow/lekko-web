import { describe, it, expect } from 'vitest';
import { toLocalDatetimeInputFormat } from '../dateUtils';

describe('toLocalDatetimeInputFormat', () => {
    it('returns empty string for null', () => {
        expect(toLocalDatetimeInputFormat(null)).toBe('');
    });

    it('returns empty string for undefined', () => {
        expect(toLocalDatetimeInputFormat(undefined)).toBe('');
    });

    it('returns empty string for empty string', () => {
        expect(toLocalDatetimeInputFormat('')).toBe('');
    });

    it('returns empty string for invalid date', () => {
        expect(toLocalDatetimeInputFormat('not-a-date')).toBe('');
    });

    it('returns datetime-local format string for valid ISO date', () => {
        const result = toLocalDatetimeInputFormat('2024-06-15T10:30:00.000Z');
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    });
});
