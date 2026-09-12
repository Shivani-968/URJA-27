import React, { useState, useEffect, useMemo } from "react";
import "./LeaderBoard.css";
import Footer from '../Footer/Footer.jsx';

// **PASTE YOUR WEB APP URL HERE**
const GOOGLE_SHEET_API_URL = "https://script.google.com/macros/s/AKfycbyYkVeii_WHmF7PECg9jaYNFoQNbQ5JTNJDFWUejGxHU3yYpEq6vx_juWne9xK3zkeh/exec";

// --- FUNCTION TO CALCULATE TOTAL POINTS (Remains the same) ---
const calculateTotalPoints = (data) => {
  return data.map(team => {
    // Calculate the sum of all points in the breakdown object
    const calculatedTotalPoints = Object.values(team.breakdown).reduce(
      (sum, points) => sum + points,
      0
    );
    // Return a new team object with the calculated totalPoints
    return {
      ...team,
      totalPoints: calculatedTotalPoints,
    };
  });
};

const LeaderBoard = () => {
  const [teamsData, setTeamsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  // --- Data Fetching Logic (New) ---
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(GOOGLE_SHEET_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Set the fetched data into state
        setTeamsData(data);
      } catch (e) {
        console.error("Failed to fetch data:", e);
        setError("Failed to load leaderboard data. Please check the API link.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []); // Empty dependency array means this runs only once on mount

  // --- Calculation and Sorting Logic (Optimized with useMemo) ---
  // Use useMemo to prevent unnecessary recalculations on state changes other than teamsData
  const sortedTeams = useMemo(() => {
    if (teamsData.length === 0) return [];

    // 1. Calculate the totals
    const teamsWithCalculatedTotals = calculateTotalPoints(teamsData);

    // 2. Sort the calculated totals
    return [...teamsWithCalculatedTotals].sort(
      (a, b) => b.totalPoints - a.totalPoints
    );
  }, [teamsData]);

  // Existing logic for podium and list separation
  const topThree = sortedTeams.slice(0, 3);
  const teamsBelowPodium = sortedTeams.slice(3);

  // Podium order: [Second, First, Third]
  const podiumOrder = [topThree[1], topThree[0], topThree[2]].filter(Boolean);

  const handleTeamClick = (team) => setSelectedTeam(team);
  const closeModal = () => setSelectedTeam(null);

  // ESC key listener for modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Helper functions (same as original)
  const getPodiumClasses = (index) => {
    if (index === 1) return "podium-item first-place";
    if (index === 0) return "podium-item second-place";
    if (index === 2) return "podium-item third-place";
    return "podium-item";
  };
  const getMedalEmoji = (index) => {
    if (index === 1) return "🏆";
    if (index === 0) return "🥈";
    if (index === 2) return "🥉";
    return "";
  };
  const getTextColorClass = (index) => {
    if (index === 1) return "first-place-text";
    if (index === 0) return "second-place-text";
    if (index === 2) return "third-place-text";
    return "";
  };
  const showPodium = topThree.some((team) => team.totalPoints > 0);

  // --- Conditional Rendering for Loading/Error ---

  if (loading) {
    return (
      <div className="leaderboard-page loading-state">
        <div className="main-title">Loading Leaderboard...</div>
        <div className="subtitle">Fetching scores...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-page error-state">
        <div className="main-title">🛑 Data Error</div>
        <div className="subtitle">{error}</div>
      </div>
    );
  }

  // --- Main Render (Modified to use fetched data) ---

  return (
    <>
      <div className="leaderboard-page">
        {selectedTeam && (
          <>
            <div className="modal-overlay" onClick={closeModal}></div>
            <div className="breakdown-section">
              <button className="close-button" onClick={closeModal}>
                &times;
              </button>
              <div className="breakdown-title">{selectedTeam.name}</div>
              <div className="breakdown-grid">
                {/* Note: Object.entries is safe because the data structure is guaranteed by the Apps Script */}
                {Object.entries(selectedTeam.breakdown).map(([sport, points]) => (
                  <div
                    key={sport}
                    className={`breakdown-item ${points === 0 ? "zero-points" : ""}`}
                  >
                    <span className="breakdown-sport">{sport}</span>
                    <span className="breakdown-points">{points}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="leaderboard-container">
          <div className="title-section">
            <div className="main-title">LEADERBOARD</div>
            <div className="subtitle">URJA'26 • SPORTSFEST 2025 (Live Data)</div>
          </div>

          {showPodium && (
            <div className="podium">
              {podiumOrder.map((team, index) => (
                <div key={team.name} className="podium-column">
                  {/* ... (rest of the podium rendering logic remains the same) */}
                  <div className="podium-team">
                    <div
                      className={`podium-team-name ${getTextColorClass(index)}`}
                    >
                      {team.name}
                    </div>
                    <div
                      className={`podium-team-points ${getTextColorClass(index)}`}
                    >
                      {team.totalPoints}
                    </div>
                    <button
                      className="details-button"
                      onClick={() => handleTeamClick(team)}
                    >
                      Details
                    </button>
                    <div className={getPodiumClasses(index)}>
                      <div className="podium-trophy">{getMedalEmoji(index)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="other-teams-section">
            <div className="other-teams-list">
              {sortedTeams.length > 0 && teamsBelowPodium.map((team, index) => (
                <div key={team.name} className="list-item-wrapper">
                  <div className="list-item">
                    <div className="list-rank">{index + 4}</div>
                    <div className="list-name">{team.name}</div>
                    <div className="list-points">{team.totalPoints}</div>
                    <button
                      className="details-button"
                      onClick={() => handleTeamClick(team)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
              {sortedTeams.length === 0 && !loading && (
                <div className="no-data-message">No scores entered yet.</div>
              )}
            </div>
          </div>

          {/* <div className="scoring-rules">
            <div className="scoring-title">SCORING SYSTEM</div>
            <div>
              1st Place: 10 points • 2nd Place: 7 points • 3rd Place: 5 points
            </div>
            <div className="scoring-subtitle">
              Team trophies awarded based on total points from all events
            </div>
          </div> */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LeaderBoard;