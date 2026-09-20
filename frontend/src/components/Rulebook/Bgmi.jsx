import React from 'react';

const BGMIRules = () => {
    const bgmiRulebook = {
        sections: {
            tournamentFormat: {
                heading: 'Tournament Format',
                teamSize: 'Each team must consist of 4 players. Teams may register 1 substitute player.',
                matchFormat: [
                    'The tournament will be conducted in squad mode.',
                    'Each match will be played in Battle Royale mode.',
                    'Teams will compete across multiple matches.',
                    'The final standings will be determined based on the total points accumulated across all matches.',
                    'The tournament organizers reserve the right to modify the number of matches depending on the schedule and number of participating teams.'
                ]
            },

            scoringSystem: {
                heading: 'Scoring System',
                rules: [
                    'Points will be awarded based on the team’s final placement in each match.',
                    'Additional points will be awarded for each elimination secured by a player.',
                    'The total score of a team will be the sum of placement points and elimination points across all matches.',
                    'In case of a tie in total points, the team with the higher number of eliminations will be ranked higher.',
                    'If the tie still remains, the team with the better placement in the final match will be ranked higher.'
                ]
            },

            matchRules: {
                heading: 'Match Regulations',
                rules: [
                    'All players must join the designated room using their registered BGMI account.',
                    'Players must use the same in-game name or registered identity throughout the tournament.',
                    'Once a match has started, no player may leave and rejoin unless permitted by the organizers.',
                    'Teams must be ready and present in the lobby at the announced time.',
                    'A team failing to join the room within the specified time may be disqualified from that match.',
                    'Players are not allowed to intentionally exploit glitches, bugs, or unintended game mechanics.'
                ]
            },

            teamRules: {
                heading: 'Team & Player Rules',
                teamRules: [
                    'Only registered players are permitted to participate in the tournament.',
                    'A player cannot represent more than one team in the tournament.',
                    'Any substitution must be made before the match and must be approved by the tournament organizers.',
                    'Once a match has started, no player substitution will be allowed unless explicitly permitted by the organizers.',
                    'Teams are responsible for ensuring that all their players have a stable internet connection and a compatible device.',
                    'Players must follow instructions given by the tournament officials throughout the event.'
                ]
            },

            fairPlay: {
                heading: 'Fair Play & Conduct',
                rules: [
                    'Use of hacks, cheats, scripts, modified game clients, or any unauthorized third-party software is strictly prohibited.',
                    'Teaming with opponents or intentionally assisting another team is prohibited.',
                    'Players must not exploit bugs or glitches to gain an unfair advantage.',
                    'Any form of abusive, threatening, or inappropriate behaviour towards other participants or tournament officials is prohibited.',
                    'Stream sniping, ghosting, or obtaining unauthorized information about an opponent’s position is prohibited.',
                    'Any team found violating fair-play rules may be disqualified from the tournament.'
                ]
            },

            technicalIssues: {
                heading: 'Technical Issues',
                rules: [
                    'Players are responsible for their own devices, internet connection, battery, and game installation.',
                    'Individual device or network problems will generally not result in a rematch.',
                    'If a major technical issue affects the tournament or the game server, the organizers may decide to restart or reschedule the match.',
                    'The decision regarding a rematch or rescheduling will be made by the tournament officials.'
                ]
            },

            tournamentRegulations: {
                heading: 'Tournament Regulations',
                rules: [
                    'All teams must submit their final roster before the tournament begins.',
                    'The registered roster cannot be changed after the registration deadline except with approval from the organizers.',
                    'Players must follow the tournament schedule and reporting instructions.',
                    'Screenshots, match results, or other evidence may be requested by the tournament officials in case of a dispute.',
                    'Any intentional attempt to manipulate match results may result in immediate disqualification.',
                    'The decision of the tournament officials regarding disputes, penalties, and disqualification will be final and binding.'
                ]
            }
        }
    };

    return (
        <div className="sport-rules-container">
            <h2>Rules for BGMI</h2>

            {Object.values(bgmiRulebook.sections).map((section, index) => (
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

                    {section.teamRules && (
                        <>
                            <h4>Team Rules:</h4>
                            <ul>
                                {section.teamRules.map((rule, ruleIndex) => (
                                    <li key={ruleIndex}>{rule}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BGMIRules;