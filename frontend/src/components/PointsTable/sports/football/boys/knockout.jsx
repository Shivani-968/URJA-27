// src/components/PointsTable/sports/basketball/boys/knockout.js

// knockout.jsx example
const footballBoysKnockout = {
    rounds: [
        {
            name: "Semi-finals",
            matches: [
                { id: 'SF1', date: '6 November', venue: 'CD Ground', team1: 'PG', score1: '1', team2: 'CSE', score2: '0', winner: '' },
                { id: 'SF2', date: '5 November', venue: 'CD Ground', team1: 'PIE+ECM', score1: '2', team2: 'ECE', score2: '0', winner: 'PIE+ECM' },
            ]
        },
        {
            name: "Final",
            matches: [
                { id: 'F1', date: '7 November', venue: 'CD Ground', team1: 'PG', score1: '0', score1_pen: '', team2: 'PIE+ECM', score2: '1', score2_pen: '', winner: 'PIE+ECM' }
            ]
        }
    ],
    // 💡 NEW: Dedicated thirdPlace object
    thirdPlace: {
        name: "Third place play-off",
        match: {
            id: 'TP1', date: '7 November', venue: 'CD Ground', team1: 'CSE', score1: '4', team2: 'ECE', score2: '0', winner: ''
        }
    }
};

export default footballBoysKnockout;

// export const footballBoysKnockout = {
//     rounds: [
//         {
//             name: "Semi-finals",
//             matches: [
//                 { id: "SF1", team1: "A1", team2: "B2", winner: "", score1: "", score2: "" },
//                 { id: "SF2", team1: "A2", team2: "B1", winner: "", score1: "", score2: "" },
//             ]
//         },
//         {
//             name: "Final",
//             matches: [
//                 { id: "F1", team1: "Winner SF1", team2: "Winner SF2", winner: "", score1: "", score2: "" },
//             ]
//         },
//         {
//             name: "Winner",
//             matches: [
//                 { id: "W1", team1: "Winner", team2: null, winner: "", score1: null, score2: null },
//             ]
//         }
//     ]
// };
