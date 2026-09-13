// src/components/PointsTable/sports/basketball/boys/knockout.js

export const tableTennisBoysKnockout = {
    rounds: [
        {
            name: "Semi-finals",
            matches: [
                { id: 'SF1', date: '6 November', venue: 'TSG', team1: 'PIE+ECM', score1: '3', team2: 'MME', score2: '0', winner: '' },
                { id: 'SF2', date: '6 November', venue: 'TSG', team1: 'CSE', score1: '0', team2: 'ECE', score2: '3', winner: '' },
            ]
        },
        {
            name: "Final",
            matches: [
                { id: 'F1', date: '7 November', venue: 'TSG', team1: 'ECE', score1: '0', score1_pen: '', team2: 'PIE+ECM', score2: '3', score2_pen: '', winner: 'PIE+ECM' }
            ]
        }
    ],
    // 💡 NEW: Dedicated thirdPlace object
    thirdPlace: {
        name: "Third Place",
        match: {
            id: 'TP1', date: '7 November', venue: 'TSG', team1: 'MME', score1: '0', team2: 'CSE', score2: '3', winner: ''
        }
    }
};