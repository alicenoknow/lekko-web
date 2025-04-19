export const RANKING = ['🥇', '🥈', '🥉'];

export const getAthleteRankingKey = (
    index: number
): 'athlete_id_one' | 'athlete_id_two' | 'athlete_id_three' => {
    const keys = ['athlete_id_one', 'athlete_id_two', 'athlete_id_three'] as const;
    return keys[index];
};
