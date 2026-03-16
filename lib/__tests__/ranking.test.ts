import { describe, it, expect } from 'vitest';
import { getAthleteRankingKey } from '../ranking';

describe('getAthleteRankingKey', () => {
    it('returns athlete_id_one for index 0', () => {
        expect(getAthleteRankingKey(0)).toBe('athlete_id_one');
    });

    it('returns athlete_id_two for index 1', () => {
        expect(getAthleteRankingKey(1)).toBe('athlete_id_two');
    });

    it('returns athlete_id_three for index 2', () => {
        expect(getAthleteRankingKey(2)).toBe('athlete_id_three');
    });
});
