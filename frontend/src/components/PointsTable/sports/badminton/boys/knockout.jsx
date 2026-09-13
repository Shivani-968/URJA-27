// src/components/PointsTable/sports/basketball/boys/knockout.js

export const badmintonBoysKnockout = {
    rounds: [
        {
            name: "Semi-finals",
            matches: [
                { id: 'SF1', date: '5 November', venue: 'Ups Badminton Court', team1: 'ECE', score1: '', team2: 'CSE', score2: '', winner: 'ECE' },
                { id: 'SF2', date: '5 November', venue: 'Ups Badminton Court', team1: 'EE', score1: '', team2: 'ME', score2: '', winner: 'EE' },
            ]
        },
        {
            name: "Final",
            matches: [
                { id: 'F1', date: '6 November', venue: 'Ups Badminton Court', team1: 'ECE', score1: '1', score1_pen: '', team2: 'EE', score2: '3', score2_pen: '', winner: 'EE' }
            ]
        }
    ],
    // 💡 NEW: Dedicated thirdPlace object
    thirdPlace: {
        name: "Third Place",
        match: {
            id: 'TP1', date: '6 November', venue: 'Ups Badminton Court', team1: 'CSE', score1: '0', team2: 'ME', score2: '3', winner: 'ME'
        }
    }
};