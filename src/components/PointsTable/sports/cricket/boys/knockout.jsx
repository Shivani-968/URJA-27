// src/components/PointsTable/sports/basketball/boys/knockout.js

export const tableTennisBoysKnockout = {
    rounds: [
        {
            name: "Semi-finals",
            matches: [
                { id: 'SF1', date: '5 November', venue: 'Downs Ground', team1: 'CSE', score1: '65/4 (5.5)', team2: 'MME', score2: '64/10 (9.0)', winner: 'CSE' },
                { id: 'SF2', date: '5 November', venue: 'Downs Ground', team1: 'PIE+ECM', score1: '76/9 (10.0)', team2: 'ECE', score2: '82/1 (5.1)', winner: 'ECE' },
            ]
        },
        {
            name: "Final",
            matches: [
                { id: 'F1', date: '6 November', venue: 'Downs Ground', team1: 'CSE', score1: '30/10 (7.0)', score1_pen: '', team2: 'ECE', score2: '115/8 (12.0)', score2_pen: '', winner: 'ECE' }
            ]
        }
    ],
    // 💡 NEW: Dedicated thirdPlace object
    thirdPlace: {
        name: "Third Place",
        match: {
            id: 'TP1', date: '6 November', venue: 'Downs Ground', team1: 'MME', score1: '146/8(10.0)', team2: 'PIE+ECM', score2: '85/10 (9.4)', winner: 'MME'
        }
    }
};
