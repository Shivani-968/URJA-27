import React, { useState, useEffect, useRef } from 'react';
import './PointsTable.css';
import Footer from '../Footer/Footer.jsx';

/* ===============================================
   CONFIG
   =============================================== */

// 🔴 REPLACE with your deployed Apps Script /exec URL:
const ATH_API = "https://script.google.com/macros/s/AKfycbzmSjoHsaZO6fznE_lDOdL1wfFa3635T_tRIq5KTCaE9W0R7DON6fxKYbQfBRfRyP-w2g/exec";

/* UI config for sports/genders/pools (events) */
const sportsDataMap = {
    Athletics: {
        genders: ['Boys', 'Girls'],
        pools: {
            Boys: ['100m', '200m', '400m', '800m', '1500m', 'Discus', '4x400m Relay', 'Cross Country', '3000m', 'Tug Of War', 'Triple Jump', 'Medley', 'Long Jump', 'High Jump', 'Shot Put', 'Javelin Throw', '4x100m Relay'],
            Girls: ['100m', '200m', '400m', '800m', '1500m', 'Discus', '4x400m Relay', 'Cross Country', '3000m', 'Tug Of War', 'Triple Jump', 'Medley', 'Long Jump', 'High Jump', 'Shot Put', 'Javelin Throw', '4x100m Relay'],
        },
        stages: ['Group Stage'],
    },
    Badminton: {
        genders: ['Boys', 'Girls'],
        pools: { Boys: ['Pool A', 'Pool B'], Girls: ['Pool A', 'Pool B'] },
        stages: ['Group Stage', 'Knockout'],
    },
    Chess: {
        genders: ['Boys', 'Girls'],
        pools: { Boys: ['Pool A', 'Pool B'], Girls: ['Pool A', 'Pool B'] },
        stages: ['Group Stage', 'Knockout'],
    },
    Cricket: {
        genders: ['Boys'],
        pools: { Boys: ['Pool A', 'Pool B'] },
        stages: ['Group Stage', 'Knockout'],
    },
    Football: {
        genders: ['Boys'],
        pools: { Boys: ['Pool A', 'Pool B'] },
        stages: ['Group Stage', 'Knockout'],
    },
    'Lawn Tennis': {
        genders: ['Boys', 'Girls'],
        pools: { Boys: ['Pool A'], Girls: ['Pool A', 'Pool B'] },
        stages: ['Group Stage', 'Knockout'],
    },
    'Table Tennis': {
        genders: ['Boys', 'Girls'],
        pools: { Boys: ['Pool A', 'Pool B'], Girls: ['Pool A', 'Pool B'] },
        stages: ['Group Stage', 'Knockout'],
    },
    Volleyball: {
        genders: ['Boys', 'Girls'],
        pools: { Boys: ['Pool A', 'Pool B'] },
        stages: ['Group Stage', 'Knockout'],
    },
};

/* ===============================================
   Helpers
   =============================================== */

const formatString = (str) => {
    if (!str) return '';
    return str
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
};

// Fetch athletics data for a given event + gender from Apps Script API
async function fetchAthleticsEventPoints(eventName, gender) {
    const url = `${ATH_API}?event=${encodeURIComponent(eventName)}&gender=${encodeURIComponent(gender)}`;
    console.log(url)
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Athletics API HTTP ${res.status}`);
    return await res.json(); // { pointsTable: { headings, data }, matches: [] }
}

/* ===============================================
   Presentational components
   =============================================== */

function ScoreboardTable({ data }) {
    if (!data || !data.headings || !data.data) return null;

    const pointsColumnIndex = data.headings.findIndex(h =>
        h.toLowerCase().includes('pts') || h.toLowerCase().includes('points')
    );
    const positionColumnIndex = data.headings.findIndex(h =>
        h.toLowerCase().includes('position') || h.toLowerCase().includes('pos')
    );

    const sortedData = [...data.data].sort((a, b) => {
        if (pointsColumnIndex !== -1) {
            const aP = Number(a[pointsColumnIndex]) || 0;
            const bP = Number(b[pointsColumnIndex]) || 0;
            if (bP !== aP) return bP - aP; // desc by points
            const aT = a[1], bT = b[1];
            if (typeof aT === 'string' && typeof bT === 'string') return aT.localeCompare(bT);
            return 0;
        }
        return 0;
    });

    return (
        <div className="scoreboard-table-container">
            <table>
                <thead>
                    <tr>
                        {data.headings.map((h, i) => <th key={i}>{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((row, rIdx) => (
                        <tr key={rIdx}>
                            {row.map((cell, cIdx) => {
                                let out = cell;
                                if (cIdx === positionColumnIndex) out = rIdx + 1; // display rank
                                return <td key={cIdx}>{out}</td>;
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function MatchesList({ matches }) {
    if (!matches || matches.length === 0) return null;
    return (
        <div className="matches-list-container">
            <h3>Matches</h3>
            {matches.map((m, i) => (
                <div className="match-card" key={i}>
                    <p className="match-date">{m.date} | {m.time}</p>
                    <div className="match-details">
                        <div className="match-team team1"><span>{m.teams[0]}</span></div>
                        <div className="match-score">
                            {m.scores.length > 1 ? <p>{m.scores[0]} - {m.scores[1]}</p> : <p>{m.scores[0]}</p>}
                        </div>
                        {m.teams.length > 1 && <div className="match-team team2"><span>{m.teams[1]}</span></div>}
                    </div>
                    <p className="match-venue">Venue: {m.venue}</p>
                </div>
            ))}
        </div>
    );
}

function Dropdown({ label, options, value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);
    const toggleOpen = () => setIsOpen(v => !v);

    const handleOptionClick = (opt) => {
        onChange({ target: { value: opt } });
        setIsOpen(false);
    };

    useEffect(() => {
        const clickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', clickOutside);
        return () => document.removeEventListener('mousedown', clickOutside);
    }, []);

    const display = value ? formatString(value) : (options[0] ? formatString(options[0]) : label);

    return (
        <div className={`dropdown-wrapper ${isOpen ? 'active-dropdown' : ''}`} ref={ref}>
            <label>{label}:</label>
            <div className={`custom-dropdown-button ${isOpen ? 'open' : ''}`} onClick={toggleOpen}>
                {display}
                <span className="dropdown-arrow"></span>
            </div>
            {isOpen && (
                <ul className="dropdown-menu">
                    {options.map((opt) => (
                        <li key={opt} onClick={() => handleOptionClick(opt)} className={opt === value ? 'selected' : ''}>
                            {formatString(opt)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function KnockoutBracket({ data }) {
    if (!data || !data.rounds || data.rounds.length === 0) {
        return <p className="no-data-message">No knockout bracket data available for this selection.</p>;
    }

    const semi = data.rounds.find((r) => r.name === 'Semi-finals');
    const hasSemi = !!(semi && semi.matches && semi.matches.length);
    const finalRound = data.rounds.find((r) => r.name === 'Final');
    const finalMatch = finalRound?.matches?.[0];
    const thirdPlaceMatch = data.thirdPlace?.match;

    let winnerTeam = 'TBD';
    if (finalMatch) {
        if (finalMatch.winner && finalMatch.winner !== 'TBD') {
            winnerTeam = finalMatch.winner;
        } else if (finalMatch.score1 !== '' && finalMatch.score2 !== '') {
            const s1 = parseInt(finalMatch.score1, 10);
            const s2 = parseInt(finalMatch.score2, 10);
            if (s1 > s2) winnerTeam = finalMatch.team1;
            else if (s2 > s1) winnerTeam = finalMatch.team2;
        }
    }

    return (
        <div className="knockout-bracket-container complex-flow">
            <div className="bracket-main-flow">
                {hasSemi && (
                    <div className="bracket-round semi-finals-round">
                        <h3 className="round-heading semi-finals-heading">SEMI-FINALS</h3>
                        <div className="round-matches">
                            {semi.matches.map((m) => (
                                <div key={m.id} className="bracket-match semi-final-match">
                                    <p className="match-info">{m.date} - {m.venue}</p>
                                    {m.team1 && (<div className="bracket-team"><span className="team-name">{m.team1}</span><span className="team-score score-top">{m.score1}</span></div>)}
                                    {m.team2 && (<div className="bracket-team"><span className="team-name">{m.team2}</span><span className="team-score score-bottom">{m.score2}</span></div>)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bracket-round final-stage-column">
                    {finalMatch && (
                        <div className="final-match-block">
                            <h3 className="round-heading final-heading">FINAL</h3>
                            <div key={finalMatch.id} className="bracket-match final-match">
                                <p className="match-info">{finalMatch.date} - {finalMatch.venue}</p>
                                {finalMatch.team1 && (<div className="bracket-team"><span className="team-name">{finalMatch.team1}</span><span className="team-score score-top">{finalMatch.score1}</span></div>)}
                                {finalMatch.team2 && (<div className="bracket-team"><span className="team-name">{finalMatch.team2}</span><span className="team-score score-bottom">{finalMatch.score2}</span></div>)}
                            </div>
                        </div>
                    )}

                    {thirdPlaceMatch && (
                        <div className="third-place-match-block">
                            <h3 className="round-heading third-place-heading">THIRD PLACE</h3>
                            <div className="bracket-match third-place-match">
                                <p className="match-info">{thirdPlaceMatch.date} - {thirdPlaceMatch.venue}</p>
                                {thirdPlaceMatch.team1 && (<div className="bracket-team"><span className="team-name">{thirdPlaceMatch.team1}</span><span className="team-score score-top">{thirdPlaceMatch.score1}</span></div>)}
                                {thirdPlaceMatch.team2 && (<div className="bracket-team"><span className="team-name">{thirdPlaceMatch.team2}</span><span className="team-score score-bottom">{thirdPlaceMatch.score2}</span></div>)}
                            </div>
                        </div>
                    )}
                </div>

                {finalMatch && (
                    <div className="bracket-round winner-column">
                        <h3 className="round-heading">CHAMPIONS</h3>
                        <div className="winner-box">
                            <div className="winner-content">
                                <span className="winner-team-name">{winnerTeam}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ===============================================
   Main component
   =============================================== */

function PointsTable() {
    const [selectedSport, setSelectedSport] = useState('Athletics');
    const [selectedGender, setSelectedGender] = useState('Boys');
    const [selectedPool, setSelectedPool] = useState('100m'); // for Athletics: event
    const [selectedStage, setSelectedStage] = useState('Group Stage');
    const [currentData, setCurrentData] = useState(null);

    const [isMobileSportDropdownOpen, setIsMobileSportDropdownOpen] = useState(false);
    const mobileDropdownRef = useRef(null);
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : true);

    const sportsList = [
        { name: 'Athletics', emoji: '🏃' },
        { name: 'Badminton', emoji: '🏸' },
        { name: 'Chess', emoji: '♟️' },
        { name: 'Cricket', emoji: '🏏' },
        { name: 'Football', emoji: '⚽' },
        { name: 'Lawn Tennis', emoji: '🎾' },
        { name: 'Table Tennis', emoji: '🏓' },
        { name: 'Volleyball', emoji: '🏐' },
    ];

    // Keep pool (event) valid whenever selections change
    useEffect(() => {
        const poolsForGender = sportsDataMap[selectedSport]?.pools[selectedGender] || [];
        if (selectedStage === 'Group Stage') {
            if (poolsForGender.length > 0 && !poolsForGender.includes(selectedPool)) {
                setSelectedPool(poolsForGender[0]);
            } else if (poolsForGender.length === 0) {
                setSelectedPool('');
            }
        } else if (selectedStage === 'Knockout') {
            setSelectedPool('');
        }
    }, [selectedSport, selectedGender, selectedStage, selectedPool]);

    // Load data for current selection
    useEffect(() => {
        const importData = async () => {
            setCurrentData(null);

            if (!selectedSport || !selectedGender || (selectedStage === 'Group Stage' && !selectedPool && selectedSport !== 'Athletics')) {
                return;
            }

            try {
                const sportFolderPath = selectedSport.toLowerCase().replace(' ', '-');
                const genderFolderPath = selectedGender.toLowerCase().replace(' ', '-');

                if (selectedSport === 'Athletics') {
                    // LIVE fetch from the Apps Script API
                    const live = await fetchAthleticsEventPoints(selectedPool, selectedGender);
                    setCurrentData(live);
                    return;
                }

                // Non-athletics: dynamic import from your local files
                let module = null;
                let dataKey = '';

                if (selectedStage === 'Group Stage') {
                    const poolFolderPath = selectedPool.toLowerCase().replace(' ', '-');
                    module = await import(`./sports/${sportFolderPath}/${genderFolderPath}/${poolFolderPath}.jsx`).catch(e => {
                        console.error("Group Stage import failed:", e);
                        return null;
                    });
                    dataKey = module ? Object.keys(module)[0] : '';
                } else {
                    module = await import(`./sports/${sportFolderPath}/${genderFolderPath}/knockout.jsx`).catch(e => {
                        console.error("Knockout import failed:", e);
                        return null;
                    });
                    dataKey = module ? Object.keys(module)[0] : '';
                }

                if (module && module[dataKey]) {
                    setCurrentData(module[dataKey]);
                } else {
                    console.warn(`Data not found or key ${dataKey} missing for ${selectedSport}.`);
                    setCurrentData(null);
                }
            } catch (err) {
                console.error(`Unexpected crash during data import for ${selectedSport}:`, err);
                setCurrentData(null);
            }
        };

        importData();
    }, [selectedSport, selectedGender, selectedPool, selectedStage]);

    // Resize + outside click for mobile dropdown
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);

        const handleClickOutside = (e) => {
            if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(e.target)) {
                setIsMobileSportDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handlers
    const handleSportChange = (e) => {
        const newSport = e.target.value;
        setSelectedSport(newSport);
        setIsMobileSportDropdownOpen(false);

        const genders = sportsDataMap[newSport]?.genders || [];
        const newGender = genders.length > 0 ? genders[0] : selectedGender;
        setSelectedGender(newGender);

        const pools = sportsDataMap[newSport]?.pools[newGender] || [];
        setSelectedPool(pools.length > 0 ? pools[0] : '');

        const stages = sportsDataMap[newSport]?.stages || [];
        setSelectedStage(stages.length > 0 ? stages[0] : 'Group Stage');
    };
    const handleGenderChange = (e) => setSelectedGender(e.target.value);
    const handlePoolChange = (e) => setSelectedPool(e.target.value);
    const handleStageChange = (e) => setSelectedStage(e.target.value);
    const toggleMobileSportDropdown = () => setIsMobileSportDropdownOpen(v => !v);

    const renderSelectedSport = () => {
        const sport = sportsList.find(s => s.name === selectedSport);
        return sport ? `${sport.emoji} ${sport.name}` : selectedSport;
    };

    const genders = sportsDataMap[selectedSport]?.genders || [];
    const pools = sportsDataMap[selectedSport]?.pools[selectedGender] || [];
    const stages = sportsDataMap[selectedSport]?.stages || [];

    return (
        <>
            <div className="points-table-page">
                <h1 className="main-points-heading">Points Table</h1>

                {/* Mobile sport dropdown */}
                {isMobile && (
                    <div className="sports-mobile-dropdown-nav" ref={mobileDropdownRef}>
                        <div className={`custom-dropdown-button ${isMobileSportDropdownOpen ? 'open' : ''}`} onClick={toggleMobileSportDropdown}>
                            {renderSelectedSport()}
                            <span className="dropdown-arrow"></span>
                        </div>
                        {isMobileSportDropdownOpen && (
                            <ul className="dropdown-menu">
                                {sportsList.map((sport) => (
                                    <li
                                        key={sport.name}
                                        onClick={() => handleSportChange({ target: { value: sport.name } })}
                                        className={sport.name === selectedSport ? 'selected' : ''}
                                    >
                                        {sport.emoji} {sport.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* Desktop radio group */}
                {!isMobile && (
                    <div className="sports-radio-container">
                        {sportsList.map((sport) => (
                            <label key={sport.name} className="sport-radio-label">
                                <input
                                    type="radio"
                                    name="sport"
                                    value={sport.name}
                                    checked={selectedSport === sport.name}
                                    onChange={handleSportChange}
                                    className="sport-radio-input"
                                />
                                <span className="sport-radio-text">
                                    <span className="sport-emoji">{sport.emoji}</span>
                                    {sport.name}
                                </span>
                            </label>
                        ))}
                    </div>
                )}

                <div className="dropdowns-container">
                    {genders.length > 0 && (
                        <Dropdown label="Gender" options={genders} value={selectedGender} onChange={handleGenderChange} />
                    )}
                    {stages.length > 0 && selectedSport !== 'Athletics' && (
                        <Dropdown label="Stage" options={stages} value={selectedStage} onChange={handleStageChange} />
                    )}
                    {((selectedStage === 'Group Stage' && selectedSport !== 'Athletics') || selectedSport === 'Athletics') && pools.length > 0 && (
                        <Dropdown label={selectedSport === 'Athletics' ? 'Event' : 'Pool'} options={pools} value={selectedPool} onChange={handlePoolChange} />
                    )}
                </div>

                <div className="scoreboard-container">
                    {currentData ? (
                        <>
                            <h2>
                                {selectedSport} - {formatString(selectedGender)} |{' '}
                                {selectedSport === 'Athletics'
                                    ? formatString(selectedPool)
                                    : selectedStage === 'Group Stage'
                                        ? formatString(selectedPool)
                                        : formatString(selectedStage)}
                            </h2>
                            {selectedStage === 'Group Stage' ? (
                                <>
                                    <ScoreboardTable data={currentData.pointsTable} />
                                    <MatchesList matches={currentData.matches} />
                                </>
                            ) : (
                                <KnockoutBracket data={currentData} />
                            )}
                        </>
                    ) : (
                        <p className="no-data-message">Loading Data...</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default PointsTable;
