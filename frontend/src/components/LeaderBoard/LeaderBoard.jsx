import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./LeaderBoard.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "https://urja-2026.onrender.com"
).replace(/\/$/, "");

const SCORES_API_URL = `${API_URL}/api/scores`;

/* -------------------------------------------------------
   Convert value safely into a number
------------------------------------------------------- */
const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

/* -------------------------------------------------------
   Normalize text
------------------------------------------------------- */
const normalizeText = (value) =>
  String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");

/* -------------------------------------------------------
   Extract branch + points from one score document

   Backend format:

   pointsTable: {
     headings: ["Position", "Team", "Points"],
     data: [
       ["1", "ECE", 6],
       ["2", "EE", 5],
       ["3", "CSE", 4],
       ["4", "ME", 3],
       ["5", "MME", 2]
     ]
   }
------------------------------------------------------- */
const extractBranchPoints = (document) => {
  const rows = document?.pointsTable?.data;

  if (!Array.isArray(rows)) {
    return [];
  }

  return rows
    .map((row) => {
      if (!Array.isArray(row) || row.length < 3) {
        return null;
      }

      const branch = normalizeText(row[1]);
      const points = toNumber(row[2]);

      if (!branch) {
        return null;
      }

      return {
        branch,
        points,
      };
    })
    .filter(Boolean);
};

/* -------------------------------------------------------
   Build overall branch leaderboard

   Every Group Stage points table contributes to the
   overall branch score.

   Example:

   Athletics 100m:
   ECE = 6

   Athletics 200m:
   ECE = 5

   Badminton:
   ECE = 10

   Overall:
   ECE = 21
------------------------------------------------------- */
const buildBranchLeaderboard = (documents) => {
  const branchMap = new Map();

  documents.forEach((document) => {
    const stage = normalizeText(document?.stage).toLowerCase();

    /*
      Only Group Stage is used.

      Knockout data is ignored so that points are not
      accidentally counted twice.
    */
    if (stage !== "group stage") {
      return;
    }

    const rows = extractBranchPoints(document);

    rows.forEach(({ branch, points }) => {
      if (!branchMap.has(branch)) {
        branchMap.set(branch, 0);
      }

      branchMap.set(
        branch,
        branchMap.get(branch) + points
      );
    });
  });

  /* -----------------------------------------------------
     Sort:

     1. Highest points first
     2. Alphabetical order if points are equal
  ----------------------------------------------------- */
  return Array.from(branchMap.entries())
    .map(([branch, points]) => ({
      branch,
      points,
    }))
    .sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      return a.branch.localeCompare(b.branch);
    })
    .map((item, index) => ({
      ...item,
      position: index + 1,
    }));
};

/* -------------------------------------------------------
   Position styling
------------------------------------------------------- */
const getPositionClass = (position) => {
  if (position === 1) return "first";
  if (position === 2) return "second";
  if (position === 3) return "third";

  return "normal";
};

/* -------------------------------------------------------
   Medal
------------------------------------------------------- */
const getMedal = (position) => {
  if (position === 1) return "🥇";
  if (position === 2) return "🥈";
  if (position === 3) return "🥉";

  return position;
};

/* -------------------------------------------------------
   Main Component
------------------------------------------------------- */
const LeaderBoard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  /* -----------------------------------------------------
     Fetch backend data
  ----------------------------------------------------- */
  const fetchLeaderboardData = useCallback(
    async (manual = false) => {
      try {
        if (manual) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(SCORES_API_URL, {
          method: "GET",
          cache: "no-cache",
          headers: {
            Accept: "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        });

        if (!response.ok) {
          throw new Error(
            `Unable to fetch leaderboard (${response.status})`
          );
        }

        const result = await response.json();

        /*
          Normally backend returns:

          [
            {...},
            {...},
            {...}
          ]

          But this also safely handles:
          { data: [...] }
          { scores: [...] }
          {...}
        */
        let scoreDocuments = [];

        if (Array.isArray(result)) {
          scoreDocuments = result;
        } else if (Array.isArray(result?.data)) {
          scoreDocuments = result.data;
        } else if (Array.isArray(result?.scores)) {
          scoreDocuments = result.scores;
        } else if (
          result &&
          typeof result === "object"
        ) {
          scoreDocuments = [result];
        }

        setDocuments(scoreDocuments);
        setLastUpdated(new Date());
      } catch (err) {
        console.error(
          "Branch leaderboard error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load leaderboard data."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  /* -----------------------------------------------------
     Initial fetch + auto refresh every 30 seconds
  ----------------------------------------------------- */
  useEffect(() => {
    fetchLeaderboardData();

    const interval = setInterval(() => {
      fetchLeaderboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchLeaderboardData]);

  /* -----------------------------------------------------
     Overall branch leaderboard
  ----------------------------------------------------- */
  const leaderboard = useMemo(() => {
    return buildBranchLeaderboard(documents);
  }, [documents]);

  /* -----------------------------------------------------
     Top 3
  ----------------------------------------------------- */
  const topThree = useMemo(() => {
    return leaderboard.slice(0, 3);
  }, [leaderboard]);

  /* -----------------------------------------------------
     Remaining branches
  ----------------------------------------------------- */
  const remainingBranches = useMemo(() => {
    return leaderboard.slice(3);
  }, [leaderboard]);

  /* -----------------------------------------------------
     Total points
  ----------------------------------------------------- */
  const totalPoints = useMemo(() => {
    return leaderboard.reduce(
      (total, branch) => total + branch.points,
      0
    );
  }, [leaderboard]);

  /* -----------------------------------------------------
     Loading
  ----------------------------------------------------- */
  if (loading) {
    return (
      <div className="leaderboard-page">
        <div className="leaderboard-loading">
          <div className="loading-spinner"></div>

          <h2>LOADING LEADERBOARD</h2>

          <p>
            Fetching latest URJA&apos;27 scores...
          </p>
        </div>
      </div>
    );
  }

  /* -----------------------------------------------------
     Error
  ----------------------------------------------------- */
  if (error && leaderboard.length === 0) {
    return (
      <div className="leaderboard-page">
        <div className="leaderboard-error">
          <div className="error-icon">⚠️</div>

          <h2>LEADERBOARD UNAVAILABLE</h2>

          <p>{error}</p>

          <button
            className="refresh-button"
            onClick={() =>
              fetchLeaderboardData(true)
            }
          >
            ↻ TRY AGAIN
          </button>
        </div>
      </div>
    );
  }

  /* -----------------------------------------------------
     MAIN UI
  ----------------------------------------------------- */
  return (
    <div className="leaderboard-page">

      {/* Background */}
      <div className="leaderboard-grid"></div>

      <div className="pink-glow glow-one"></div>
      <div className="pink-glow glow-two"></div>

      {/* =================================================
          HEADER
      ================================================= */}
      <section className="leaderboard-header">

        <div className="header-content">

          <div className="header-small">
            URJA&apos;27 • NIT JAMSHEDPUR
          </div>

          <h1>
            BRANCH
            <span>LEADERBOARD</span>
          </h1>

          <p>
            INTER-BRANCH SPORTS CHAMPIONSHIP
          </p>

          <div className="live-indicator">
            <span className="live-dot"></span>
            LIVE SCOREBOARD
          </div>

        </div>

      </section>

      {/* =================================================
          SMALL STATS
      ================================================= */}
      <section className="leaderboard-stats">

        {/* Branches */}
        <div className="stat-card">

          <div className="stat-icon">
            🏫
          </div>

          <div className="stat-content">

            <span className="stat-label">
              BRANCHES
            </span>

            <strong>
              {leaderboard.length}
            </strong>

          </div>

        </div>

        {/* Total points */}
        <div className="stat-card">

          <div className="stat-icon">
            🏆
          </div>

          <div className="stat-content">

            <span className="stat-label">
              TOTAL POINTS
            </span>

            <strong>
              {totalPoints}
            </strong>

          </div>

        </div>

        {/* Leader */}
        <div className="stat-card">

          <div className="stat-icon">
            👑
          </div>

          <div className="stat-content">

            <span className="stat-label">
              CURRENT LEADER
            </span>

            <strong className="leader-name">
              {leaderboard[0]?.branch || "--"}
            </strong>

          </div>

        </div>

        {/* Status */}
        <div className="stat-card">

          <div className="stat-icon">
            🔴
          </div>

          <div className="stat-content">

            <span className="stat-label">
              STATUS
            </span>

            <strong className="status-live">
              LIVE
            </strong>

          </div>

        </div>

      </section>

      {/* =================================================
          REFRESH BAR
      ================================================= */}
      <section className="leaderboard-toolbar">

        <div className="update-info">

          <span className="update-dot"></span>

          {lastUpdated
            ? `Updated ${lastUpdated.toLocaleTimeString()}`
            : "Live data"}

        </div>

        <button
          className={`refresh-button ${
            refreshing ? "refreshing" : ""
          }`}
          onClick={() =>
            fetchLeaderboardData(true)
          }
          disabled={refreshing}
        >
          <span>↻</span>

          {refreshing
            ? "REFRESHING..."
            : "REFRESH"}

        </button>

      </section>

      {/* =================================================
          TOP 3
      ================================================= */}
      {topThree.length > 0 && (
        <section className="podium-section">

          <div className="section-heading">

            <span className="heading-line"></span>

            <h2>TOP 3 BRANCHES</h2>

            <span className="heading-line"></span>

          </div>

          <div className="podium">

            {/* -------------------------------------------
                2ND
            ------------------------------------------- */}
            {topThree[1] && (
              <div className="podium-wrapper second-wrapper">

                <div className="podium-card second">

                  <div className="podium-medal">
                    🥈
                  </div>

                  <div className="podium-rank">
                    2ND
                  </div>

                  <h3>
                    {topThree[1].branch}
                  </h3>

                  <div className="podium-points">
                    {topThree[1].points}
                    <span>PTS</span>
                  </div>

                  <div className="podium-base">
                    02
                  </div>

                </div>

              </div>
            )}

            {/* -------------------------------------------
                1ST
            ------------------------------------------- */}
            {topThree[0] && (
              <div className="podium-wrapper first-wrapper">

                <div className="podium-card first">

                  <div className="champion-tag">
                    CURRENT LEADER
                  </div>

                  <div className="podium-medal">
                    🥇
                  </div>

                  <div className="podium-rank">
                    1ST
                  </div>

                  <h3>
                    {topThree[0].branch}
                  </h3>

                  <div className="podium-points">
                    {topThree[0].points}
                    <span>PTS</span>
                  </div>

                  <div className="podium-base">
                    01
                  </div>

                </div>

              </div>
            )}

            {/* -------------------------------------------
                3RD
            ------------------------------------------- */}
            {topThree[2] && (
              <div className="podium-wrapper third-wrapper">

                <div className="podium-card third">

                  <div className="podium-medal">
                    🥉
                  </div>

                  <div className="podium-rank">
                    3RD
                  </div>

                  <h3>
                    {topThree[2].branch}
                  </h3>

                  <div className="podium-points">
                    {topThree[2].points}
                    <span>PTS</span>
                  </div>

                  <div className="podium-base">
                    03
                  </div>

                </div>

              </div>
            )}

          </div>

        </section>
      )}

      {/* =================================================
          COMPLETE BRANCH RANKING
      ================================================= */}
      <section className="standings-section">

        <div className="section-heading">

          <span className="heading-line"></span>

          <h2>BRANCH RANKING</h2>

          <span className="heading-line"></span>

        </div>

        {leaderboard.length > 0 ? (

          <div className="standings-table-wrapper">

            <table className="standings-table">

              <thead>

                <tr>
                  <th>POSITION</th>
                  <th>BRANCH</th>
                  <th>POINTS</th>
                </tr>

              </thead>

              <tbody>

                {leaderboard.map((branch) => (

                  <tr
                    key={branch.branch}
                    className={getPositionClass(
                      branch.position
                    )}
                  >

                    {/* Position */}
                    <td>

                      <span className="position-number">

                        {branch.position <= 3
                          ? getMedal(branch.position)
                          : branch.position}

                      </span>

                    </td>

                    {/* Branch */}
                    <td>

                      <div className="branch-name">
                        {branch.branch}
                      </div>

                    </td>

                    {/* Points */}
                    <td>

                      <span className="points-value">
                        {branch.points}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="leaderboard-empty">

            <div className="empty-icon">
              🏆
            </div>

            <h3>
              NO POINTS YET
            </h3>

            <p>
              Branch standings will appear once
              sports scores are updated.
            </p>

          </div>

        )}

      </section>

      {/* =================================================
          FOOTER
      ================================================= */}
      <footer className="leaderboard-footer">

        <div className="footer-logo">
          URJA<span>&apos;27</span>
        </div>

        <p>
          NIT JAMSHEDPUR • BRANCH CHAMPIONSHIP
        </p>

        <div className="footer-live">

          <span></span>

          LIVE DATA

        </div>

      </footer>

    </div>
  );
};

export default LeaderBoard;