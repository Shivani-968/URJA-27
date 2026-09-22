import React from 'react';

const CricketRules = () => {
    const cricketRulebook = {
        sections: {
            matchStructure: {
                heading: 'Match Structure',
                rules: [
                    'Each innings will consist of a maximum of 12 overs.',
                    'Each team will get one innings to bat and one innings to bowl.',
                    'The innings will end after 12 overs or earlier if the batting team is bowled out.',
                    'Standard cricket rules will apply, with modifications as specified in this rulebook.'
                ]
            },

            teamComposition: {
                heading: 'Team Composition',
                rules: [
                    'Each team must field 11 playing members.',
                    'A maximum of 5 substitutes are allowed per match for injuries or fielding substitutions only.',
                    'A minimum of 7 players must be present on the field for a team to continue the match.'
                ]
            },

            oversBowling: {
                heading: 'Overs & Bowling Restrictions',
                rules: [
                    'Each innings will consist of a maximum of 12 overs.',
                    'Only 2 bowlers are allowed to bowl a maximum of 3 overs each.',
                    'All other bowlers can bowl a maximum of 2 overs each.',
                    'No bowler can bowl more than 3 overs in an innings.',
                    'A bowler cannot bowl consecutive overs unless required due to exceptional circumstances or as permitted by the organizers.'
                ]
            },

            battingRules: {
                heading: 'Batting Rules',
                rules: [
                    'Standard dismissal modes apply: bowled, caught, run-out, stumped, and hit-wicket.',
                    'The batting team can use all available wickets during the innings.',
                    'In case of a tied score, the result may be decided by a Super Over or another tie-breaker specified by the organizers.'
                ]
            },

            powerplay: {
                heading: 'Powerplay Rules',
                rules: [
                    'The first 4 overs of each innings will be the mandatory powerplay.',
                    'During the 4-over powerplay, a maximum of 2 fielders are allowed outside the 30-yard circle.',
                    'From overs 5–12, a maximum of 5 fielders are allowed outside the 30-yard circle.'
                ]
            },

            scoringSystem: {
                heading: 'Scoring System',
                rules: [
                    'Runs will be scored according to standard cricket laws, including runs from wides, no-balls, byes.',
                    'In case of tied league points, Net Run Rate (NRR) will be considered for qualification.'
                ]
            },

            conduct: {
                heading: 'Conduct & Fair Play',
                rules: [
                    'Players must adhere to the Spirit of Cricket and maintain sportsmanship.',
                    'Umpire decisions are final and binding.',
                    'Misconduct, including abuse, dissent, or unfair play, may lead to penalties, dismissal from the match, or disqualification from the tournament.'
                ]
            },

            equipment: {
                heading: 'Equipment & Ground Rules',
                rules: [
                    'Matches will be played with a standard white cricket ball approved by the organizers.',
                    'Players must wear appropriate cricket equipment, including pads, gloves, and helmets for batters where required.',
                    'Ground dimensions and pitch markings will follow the tournament specifications and may be adjusted according to the venue.'
                ]
            }
        }
    };

    return (
        <div className="sport-rules-container">
            <h2>Rules for Cricket</h2>

            {Object.values(cricketRulebook.sections).map((section, index) => (
                <div key={index}>
                    <h3>{section.heading}</h3>

                    <ul>
                        {section.rules.map((rule, ruleIndex) => (
                            <li key={ruleIndex}>{rule}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default CricketRules;