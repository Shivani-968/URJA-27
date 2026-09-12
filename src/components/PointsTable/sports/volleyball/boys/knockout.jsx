// src/components/PointsTable/sports/basketball/boys/knockout.js

export const tableTennisBoysKnockout = {
    rounds: [
        {
            name: "Semi-finals",
            matches: [
                { id: 'SF1', date: 'TBD', venue: 'Volleyball Court', team1: 'ME', score1: '', team2: 'PIE+ECM', score2: '', winner: '' },
                { id: 'SF2', date: 'TBD', venue: 'Volleyball Court', team1: 'PG', score1: '', team2: 'CSE', score2: '', winner: '' },
            ]
        },
        {
            name: "Final",
            matches: [
                { id: 'F1', date: 'TBD', venue: 'Volleyball Court', team1: 'Winner SF1', score1: '', score1_pen: '', team2: 'Winner SF2', score2: '', score2_pen: '', winner: '' }
            ]
        }
    ],
    // 💡 NEW: Dedicated thirdPlace object
    thirdPlace: {
        name: "Third place play-off",
        match: {
            id: 'TP1', date: 'TBD', venue: 'Volleyball Court', team1: 'Loser SF1', score1: '', team2: 'Loser SF2', score2: '', winner: ''
        }
    }
};