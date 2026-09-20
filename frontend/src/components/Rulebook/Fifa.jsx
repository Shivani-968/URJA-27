import React from 'react';

const FIFARules = () => {
    const fifaRulebook = {
        sections: {
            tournamentFormat: {
                heading: 'Tournament Format',
                teamSize: '1 player per team',
                matchFormat: [
                    'The tournament will be played in 1v1 mode.',
                    'Each match will be played using the designated FIFA/EA SPORTS FC game version specified by the organizers.',
                    'Matches will be played in a knockout format unless otherwise specified by the organizers.',
                    'The winner of each match will advance to the next round.',
                    'The tournament organizers may modify the format depending on the number of participants.'
                ]
            },

            matchRules: {
                heading: 'Match Regulations',
                rules: [
                    'Each match will consist of two halves of equal duration as decided by the organizers.',
                    'Players must use the teams and settings permitted by the tournament organizers.',
                    'Both players must be ready and present before the scheduled match time.',
                    'A player failing to join the match within the specified time may be disqualified.',
                    'Players must not intentionally disconnect or quit a match.',
                    'If a match is disconnected due to a technical issue, the organizers will decide whether it should be resumed or replayed.'
                ]
            },

            gameSettings: {
                heading: 'Game Settings',
                rules: [
                    'Game difficulty, match duration, camera, controls, and other settings will be decided by the tournament organizers.',
                    'Players must use the officially designated game mode.',
                    'Only the controllers and devices permitted by the organizers may be used.',
                    'Any unauthorized modification of game settings is prohibited.',
                    'Players must verify the game settings before the match begins.'
                ]
            },

            fairPlay: {
                heading: 'Fair Play & Conduct',
                rules: [
                    'Use of cheats, hacks, exploits, modified game files, or unauthorized software is strictly prohibited.',
                    'Players must not intentionally exploit game glitches to gain an unfair advantage.',
                    'Players must not interfere with or disconnect another player’s device or controller.',
                    'Abusive, threatening, or inappropriate behaviour towards opponents or officials is prohibited.',
                    'Any attempt to manipulate match results may result in disqualification.',
                    'Players are expected to maintain proper sportsmanship throughout the tournament.'
                ]
            },

            technicalIssues: {
                heading: 'Technical Issues',
                rules: [
                    'Players are responsible for their own controller, device, power supply, and other equipment.',
                    'Players must report any technical issue to the tournament officials immediately.',
                    'Minor individual technical problems will generally not result in a replay.',
                    'In case of a major technical or system failure, the organizers may restart or reschedule the match.',
                    'The tournament officials will make the final decision regarding technical disputes.'
                ]
            },

            tournamentRegulations: {
                heading: 'Tournament Regulations',
                rules: [
                    'All participants must register before the tournament begins.',
                    'Only registered participants are allowed to play.',
                    'Players must follow the tournament schedule and reporting instructions.',
                    'Players may be required to provide screenshots or other evidence in case of a dispute.',
                    'Any participant found violating tournament rules may be penalized or disqualified.',
                    'The decision of the tournament officials regarding disputes, penalties, and disqualification will be final and binding.'
                ]
            }
        }
    };

    return (
        <div className="sport-rules-container">
            <h2>Rules for FIFA</h2>

            {Object.values(fifaRulebook.sections).map((section, index) => (
                <div key={index}>
                    <h3>{section.heading}</h3>

                    {section.teamSize && (
                        <p>
                            <strong>Team Size:</strong> {section.teamSize}
                        </p>
                    )}

                    {section.matchFormat && (
                        <>
                            <h4>Match Format:</h4>
                            <ul>
                                {section.matchFormat.map((rule, ruleIndex) => (
                                    <li key={ruleIndex}>{rule}</li>
                                ))}
                            </ul>
                        </>
                    )}

                    {section.rules && (
                        <ul>
                            {section.rules.map((rule, ruleIndex) => (
                                <li key={ruleIndex}>{rule}</li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FIFARules;