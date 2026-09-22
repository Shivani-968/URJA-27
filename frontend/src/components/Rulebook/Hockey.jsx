import React from 'react';

const HockeyRules = () => {
    const hockeyRulebook = {
        sections: {
            matchStructure: {
                heading: 'Match Structure',
                rules: [
                    'Each match consists of 4 quarters of 15 minutes each.',
                    'There will be a 2-minute interval between the first and second quarters and between the third and fourth quarters.',
                    'A 10-minute halftime break will be provided between the second and third quarters.',
                    'If a knockout match ends in a draw, the winner will be decided according to the tournament rules.'
                ]
            },

            teamComposition: {
                heading: 'Team Composition',
                rules: [
                    'Each team can have a maximum of 16 players in the squad.',
                    'A maximum of 11 players can be on the field at any time.',
                    'Substitutions are allowed according to the tournament regulations.',
                    'A goalkeeper must be present on the field unless otherwise permitted by the tournament rules.'
                ]
            },

            scoringSystem: {
                heading: 'Scoring System',
                rules: [
                    'A goal is scored when the ball completely crosses the goal line after being played by an attacker inside the shooting circle.',
                    'Each valid goal counts as 1 point.',
                    'Only goals scored according to the official rules will be counted.'
                ]
            },

            gameRules: {
                heading: 'Game Rules',
                rules: [
                    'The game will be played according to the rules of the International Hockey Federation (FIH).',
                    'Players must use the flat side of the hockey stick to play the ball.',
                    'Players must not intentionally use their feet, hands, or other parts of the body to play the ball.',
                    'Dangerous play, obstruction, and intentional physical contact are prohibited.',
                    'Penalty corners and penalty strokes may be awarded for specific fouls.'
                ]
            },

            foulsAndPenalties: {
                heading: 'Fouls & Penalties',
                rules: [
                    'Minor fouls may result in a free hit for the opposing team.',
                    'Certain defensive fouls inside the shooting circle may result in a penalty corner.',
                    'A penalty stroke may be awarded for certain fouls that prevent a probable goal.',
                    'Players may receive green, yellow, or red cards for misconduct.'
                ]
            },

            conduct: {
                heading: 'Conduct & Fair Play',
                rules: [
                    'Players, coaches, and officials must maintain fair play and sportsmanship throughout the match.',
                    'Abusive language, dangerous play, and deliberate misconduct are prohibited.',
                    'The umpire’s decision during the match must be respected.',
                    'Unsportsmanlike behaviour may result in penalties, cards, or suspension.'
                ]
            },

            equipment: {
                heading: 'Equipment',
                rules: [
                    'Players must use an approved field hockey stick and ball.',
                    'Players must wear proper sports attire and suitable footwear.',
                    'Goalkeepers must wear the required protective equipment.',
                    'Jewelry and other dangerous accessories are prohibited during the match.'
                ]
            }
        }
    };

    return (
        <div className="sport-rules-container">
            <h2>Rules for Hockey</h2>

            {Object.values(hockeyRulebook.sections).map((section, index) => (
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

export default HockeyRules;