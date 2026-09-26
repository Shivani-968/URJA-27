import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./PointsTable.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "https://urja-2026.onrender.com"
).replace(/\/$/, "");

const SCORES_API_URL = `${API_URL}/api/scores`;

/* =========================================================
   SPORTS DATA
========================================================= */

const sportsDataMap = {
  Athletics: {
  genders: ["Boys", "Girls"],
  events: [
    "100m",
    "200m",
    "400m",
    "800m",
    "1500m",
    "Discus",
    "4x400m Relay",
    "Cross Country",
    "3000m",
    "Tug Of War",
    "Triple Jump",
    "Medley",
    "Long Jump",
    "High Jump",
    "Shot Put",
    "Javelin Throw",
    "4x100m Relay",
  ],
  stages: ["Group Stage"],
},
  Badminton: {
    genders: ["Boys", "Girls"],
    pools: ["Pool A", "Pool B"],
    stages: ["Group Stage", "Knockout"],
  },

  Basketball: {
    genders: ["Boys", "Girls"],
    pools: ["Pool A", "Pool B"],
    stages: ["Group Stage", "Knockout"],
  },

  Chess: {
    genders: ["Boys", "Girls"],
    pools: ["Pool A", "Pool B"],
    stages: ["Group Stage", "Knockout"],
  },

  Cricket: {
    genders: ["Boys"],
    pools: ["Pool A", "Pool B"],
    stages: ["Group Stage", "Knockout"],
  },

  Football: {
    genders: ["Boys"],
    pools: ["Pool A", "Pool B"],
    stages: ["Group Stage", "Knockout"],
  },

  Hockey: {
    genders: ["Boys"],
    pools: ["Pool A"],
    stages: ["Group Stage", "Knockout"],
  },

  "Lawn Tennis": {
    genders: ["Boys", "Girls"],
    pools: ["Pool A", "Pool B"],
    stages: ["Group Stage", "Knockout"],
  },

  "Table Tennis": {
    genders: ["Boys", "Girls"],
    pools: ["Pool A", "Pool B"],
    stages: ["Group Stage", "Knockout"],
  },

  Volleyball: {
    genders: ["Boys", "Girls"],
    pools: ["Pool A", "Pool B"],
    stages: ["Group Stage", "Knockout"],
  },
};

/* =========================================================
   SPORT ICONS
========================================================= */

const SPORT_ICONS = {
  Athletics: "🏃",
  Badminton: "🏸",
  Basketball: "🏀",
  Chess: "♟️",
  Cricket: "🏏",
  Football: "⚽",
  Hockey: "🏑",
  "Lawn Tennis": "🎾",
  "Table Tennis": "🏓",
  Volleyball: "🏐",
};

/* =========================================================
   HELPERS
========================================================= */

const extractPointsTable = (document) => {
  const pointsTable = document?.pointsTable;

  if (!pointsTable) return null;

  return {
    headings: Array.isArray(pointsTable.headings)
      ? pointsTable.headings
      : ["Position", "Team", "Points"],

    data: Array.isArray(pointsTable.data)
      ? pointsTable.data
      : [],
  };
};

const extractKnockout = (document) => {
  if (!document?.knockout) return null;
  return document.knockout;
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const PointsTable = () => {
  const [selectedSport, setSelectedSport] = useState("Athletics");
  const [selectedGender, setSelectedGender] = useState("Boys");
  const [selectedStage, setSelectedStage] = useState("Group Stage");
  const [selectedEvent, setSelectedEvent] = useState("100m");

  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  /* =======================================================
     CURRENT SPORT CONFIG
  ======================================================= */

  const currentSportConfig = useMemo(() => {
    return (
      sportsDataMap[selectedSport] || {
        genders: [],
        events: [],
        pools: [],
        stages: [],
      }
    );
  }, [selectedSport]);

  /* =======================================================
     EVENT / POOL OPTIONS
  ======================================================= */

  const eventOptions = useMemo(() => {
    if (selectedSport === "Athletics") {
      return currentSportConfig.events || [];
    }

    return currentSportConfig.pools || [];
  }, [selectedSport, currentSportConfig]);

  /* =======================================================
     FETCH DATA
  ======================================================= */

  const fetchData = useCallback(
    async (manual = false) => {
      try {
        if (manual) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const params = new URLSearchParams();

        params.set("sport", selectedSport);
        params.set("gender", selectedGender);
        params.set("stage", selectedStage);

        if (selectedStage === "Knockout") {
          params.set("event", "Knockout");
        } else {
          params.set("event", selectedEvent);
        }

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${SCORES_API_URL}?${params.toString()}`,
          {
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
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch points table (${response.status})`
          );
        }

        const result = await response.json();

        /* Backend normally returns an array */

        let documents = [];

        if (Array.isArray(result)) {
          documents = result;
        } else if (Array.isArray(result?.data)) {
          documents = result.data;
        } else if (Array.isArray(result?.scores)) {
          documents = result.scores;
        } else if (result && typeof result === "object") {
          documents = [result];
        }

        if (documents.length === 0) {
          setCurrentData(null);
          setLastUpdated(new Date());
          return;
        }

        const validDocuments = documents.filter(Boolean);

        setCurrentData({
          documents: validDocuments,

          pointsTables: validDocuments
            .map((document) => extractPointsTable(document))
            .filter(Boolean),

          knockouts: validDocuments
            .map((document) => extractKnockout(document))
            .filter(Boolean),
        });

        setLastUpdated(new Date());
      } catch (err) {
        console.error("Points table fetch error:", err);

        setCurrentData(null);

        setError(
          err?.message || "Unable to load points table."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      selectedSport,
      selectedGender,
      selectedStage,
      selectedEvent,
    ]
  );

  /* =======================================================
     FETCH WHEN FILTER CHANGES
  ======================================================= */

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* =======================================================
     HANDLE SPORT CHANGE
  ======================================================= */

  const handleSportChange = (sport) => {
    const config = sportsDataMap[sport];

    setSelectedSport(sport);

    const firstGender =
      config?.genders?.[0] || "Boys";

    const firstStage =
      config?.stages?.[0] || "Group Stage";

    setSelectedGender(firstGender);
    setSelectedStage(firstStage);

    if (sport === "Athletics") {
      setSelectedEvent(
        config?.events?.[0] || "100m"
      );
    } else {
      setSelectedEvent(
        config?.pools?.[0] || "Pool A"
      );
    }
  };

  /* =======================================================
     HANDLE GENDER CHANGE
  ======================================================= */

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);

    if (selectedSport === "Athletics") {
      setSelectedEvent(
        currentSportConfig.events?.[0] || "100m"
      );
    } else {
      setSelectedEvent(
        currentSportConfig.pools?.[0] || "Pool A"
      );
    }
  };

  /* =======================================================
     HANDLE STAGE CHANGE
  ======================================================= */

  const handleStageChange = (stage) => {
    setSelectedStage(stage);

    if (stage === "Knockout") {
      setSelectedEvent("Knockout");
    } else {
      setSelectedEvent(
        eventOptions?.[0] ||
          (selectedSport === "Athletics"
            ? "100m"
            : "Pool A")
      );
    }
  };

  /* =======================================================
     HANDLE EVENT / POOL CHANGE
  ======================================================= */

  const handleEventChange = (event) => {
    setSelectedEvent(event);
  };

  /* =======================================================
     COMBINE POINT TABLE DATA
  ======================================================= */

  const combinedPointsTable = useMemo(() => {
    if (!currentData?.pointsTables?.length) {
      return null;
    }

    const allTables = currentData.pointsTables;

    const headings =
      allTables.find(
        (table) => table.headings?.length
      )?.headings || [
        "Position",
        "Team",
        "Points",
      ];

    const rows = [];

    allTables.forEach((table) => {
      if (Array.isArray(table.data)) {
        table.data.forEach((row) => {
          if (Array.isArray(row)) {
            rows.push(row);
          }
        });
      }
    });

    /*
      Sort by points if Points column exists.
      This keeps the leaderboard properly ordered.
    */

    const pointsColumnIndex = headings.findIndex(
      (heading) =>
        String(heading).toLowerCase() === "points"
    );

    if (pointsColumnIndex !== -1) {
      rows.sort((a, b) => {
        const aPoints =
          Number(a[pointsColumnIndex]) || 0;

        const bPoints =
          Number(b[pointsColumnIndex]) || 0;

        return bPoints - aPoints;
      });
    }

    return {
      headings,
      data: rows,
    };
  }, [currentData]);

  /* =======================================================
     KNOCKOUT ROUNDS
  ======================================================= */

  const knockoutRounds = useMemo(() => {
    if (!currentData?.knockouts?.length) {
      return [];
    }

    const rounds = [];

    currentData.knockouts.forEach((knockout) => {
      if (Array.isArray(knockout.rounds)) {
        knockout.rounds.forEach((round) => {
          rounds.push(round);
        });
      }
    });

    return rounds;
  }, [currentData]);

  /* =======================================================
     THIRD PLACE MATCH
  ======================================================= */

  const thirdPlaceMatch = useMemo(() => {
    if (!currentData?.knockouts?.length) {
      return null;
    }

    for (const knockout of currentData.knockouts) {
      if (knockout?.thirdPlace?.match) {
        return knockout.thirdPlace.match;
      }
    }

    return null;
  }, [currentData]);

  /* =======================================================
     SPORT ICON
  ======================================================= */

  const sportIcon =
    SPORT_ICONS[selectedSport] || "🏆";

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="points-table-page">
        <div className="points-loading">
          <div className="points-spinner"></div>

          <h2>LOADING POINTS TABLE</h2>

          <p>
            Fetching latest {selectedSport} scores...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="points-table-page">

      {/* Background */}

      <div className="points-grid"></div>

      <div className="points-glow glow-left"></div>

      <div className="points-glow glow-right"></div>

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="points-header">

        <div className="points-header-content">

          <div className="points-header-small">
            URJA&apos;27 • NIT JAMSHEDPUR
          </div>

          <h1>
            POINTS
            <span>TABLE</span>
          </h1>

          <p>
            SPORTS CHAMPIONSHIP SCOREBOARD
          </p>

          <div className="points-live">
            <span className="points-live-dot"></span>
            LIVE SCORES
          </div>

        </div>

      </section>

      {/* =================================================
          SPORT SELECTOR
      ================================================= */}

      <section className="sport-selector-section">

        <div className="section-title">

          <span></span>

          <h2>SELECT SPORT</h2>

          <span></span>

        </div>

        <div className="sport-selector">

          {Object.keys(sportsDataMap).map(
            (sport) => (

              <button
                key={sport}
                className={
                  selectedSport === sport
                    ? "sport-tab active"
                    : "sport-tab"
                }
                onClick={() =>
                  handleSportChange(sport)
                }
              >

                <span className="sport-tab-icon">
                  {SPORT_ICONS[sport] || "🏆"}
                </span>

                <span className="sport-tab-name">
                  {sport}
                </span>

              </button>

            )
          )}

        </div>

      </section>

      {/* =================================================
          FILTERS
      ================================================= */}

      <section className="filters-section">

        <div className="filters-card">

          {/* Sport */}

          <div className="selected-sport-title">

            <span className="selected-sport-icon">
              {sportIcon}
            </span>

            <div>

              <span>
                CURRENT SPORT
              </span>

              <h2>
                {selectedSport}
              </h2>

            </div>

          </div>

          {/* Gender */}

          <div className="filter-group">

            <label>GENDER</label>

            <select
              value={selectedGender}
              onChange={(event) =>
                handleGenderChange(
                  event.target.value
                )
              }
            >

              {currentSportConfig.genders?.map(
                (gender) => (

                  <option
                    value={gender}
                    key={gender}
                  >
                    {gender}
                  </option>

                )
              )}

            </select>

          </div>

          {/* Stage */}

          <div className="filter-group">

            <label>STAGE</label>

            <select
              value={selectedStage}
              onChange={(event) =>
                handleStageChange(
                  event.target.value
                )
              }
            >

              {currentSportConfig.stages?.map(
                (stage) => (

                  <option
                    value={stage}
                    key={stage}
                  >
                    {stage}
                  </option>

                )
              )}

            </select>

          </div>

          {/* Event / Pool */}

          <div className="filter-group">

            <label>
              {selectedSport === "Athletics"
                ? "EVENT"
                : "POOL"}
            </label>

            <select
              value={selectedEvent}
              onChange={(event) =>
                handleEventChange(
                  event.target.value
                )
              }
              disabled={
                selectedStage === "Knockout"
              }
            >

              {selectedStage === "Knockout" ? (

                <option value="Knockout">
                  Knockout
                </option>

              ) : (

                eventOptions.map((event) => (

                  <option
                    value={event}
                    key={event}
                  >
                    {event}
                  </option>

                ))

              )}

            </select>

          </div>

        </div>

      </section>

      {/* =================================================
          UPDATE BAR
      ================================================= */}

      <section className="points-toolbar">

        <div className="points-update-info">

          <span></span>

          {lastUpdated
            ? `Updated ${lastUpdated.toLocaleTimeString()}`
            : "Live data"}

        </div>

        <button
          className={
            refreshing
              ? "points-refresh refreshing"
              : "points-refresh"
          }
          onClick={() =>
            fetchData(true)
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
          CURRENT SELECTION
      ================================================= */}

      <section className="current-selection">

        <div className="selection-badge">
          {sportIcon}
        </div>

        <div className="selection-details">

          <span>
            {selectedGender} • {selectedStage}
          </span>

          <h2>
            {selectedSport}
            {" — "}
            {selectedEvent}
          </h2>

        </div>

      </section>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="points-error">

          <span>⚠️</span>

          <div>

            <strong>
              Unable to load data
            </strong>

            <p>{error}</p>

          </div>

          <button
            onClick={() =>
              fetchData(true)
            }
          >
            RETRY
          </button>

        </div>

      )}

      {/* =================================================
          GROUP STAGE
      ================================================= */}

      {selectedStage === "Group Stage" && (

        <section className="points-content">

          <div className="table-section-title">

            <div>

              <span>
                {sportIcon} {selectedSport}
              </span>

              <h2>
                {selectedEvent}
              </h2>

            </div>

            <div className="table-stage-badge">
              GROUP STAGE
            </div>

          </div>

          {combinedPointsTable &&
          combinedPointsTable.data.length > 0 ? (

            <div className="points-table-wrapper">

              <table className="points-table">

                <thead>

                  <tr>

                    {combinedPointsTable.headings.map(
                      (heading, index) => (

                        <th
                          key={`${heading}-${index}`}
                        >
                          {heading}
                        </th>

                      )
                    )}

                  </tr>

                </thead>

                <tbody>

                  {combinedPointsTable.data.map(
                    (row, rowIndex) => (

                      <tr
                        key={`row-${rowIndex}`}
                      >

                        {row.map(
                          (cell, cellIndex) => (

                            <td
                              key={`${rowIndex}-${cellIndex}`}
                              className={
                                cellIndex === 2
                                  ? "points-cell"
                                  : cellIndex === 0
                                  ? "position-cell"
                                  : "team-cell"
                              }
                            >

                              {cellIndex === 0 &&
                              Number(cell) <= 3
                                ? Number(cell) === 1
                                  ? "🥇"
                                  : Number(cell) === 2
                                  ? "🥈"
                                  : "🥉"
                                : cell}

                            </td>

                          )
                        )}

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="no-points-data">

              <div>🏆</div>

              <h3>
                NO DATA AVAILABLE
              </h3>

              <p>
                Points for this event have not
                been updated yet.
              </p>

            </div>

          )}

        </section>

      )}

      {/* =================================================
          KNOCKOUT
      ================================================= */}

      {selectedStage === "Knockout" && (

        <section className="knockout-section">

          <div className="table-section-title">

            <div>

              <span>
                {sportIcon} {selectedSport}
              </span>

              <h2>
                KNOCKOUT
              </h2>

            </div>

            <div className="table-stage-badge">
              KNOCKOUT
            </div>

          </div>

          {knockoutRounds.length > 0 ? (

            <div className="knockout-rounds">

              {knockoutRounds.map(
                (round, roundIndex) => (

                  <div
                    className="knockout-round"
                    key={roundIndex}
                  >

                    <div className="round-title">

                      <span>
                        {round.name ||
                          `ROUND ${roundIndex + 1}`}
                      </span>

                    </div>

                    <div className="matches-container">

                      {Array.isArray(round.matches)
                        ? round.matches.map(
                            (match, matchIndex) => (

                              <div
                                className="match-card"
                                key={
                                  match.id ||
                                  matchIndex
                                }
                              >

                                <div className="match-top">

                                  <span>
                                    MATCH{" "}
                                    {matchIndex + 1}
                                  </span>

                                  {match.date && (
                                    <span>
                                      {match.date}
                                    </span>
                                  )}

                                </div>

                                <div className="match-team">

                                  <span>
                                    {match.team1 ||
                                      "TBD"}
                                  </span>

                                  <strong>
                                    {match.score1 ??
                                      "-"}
                                  </strong>

                                </div>

                                <div className="match-vs">
                                  VS
                                </div>

                                <div className="match-team">

                                  <span>
                                    {match.team2 ||
                                      "TBD"}
                                  </span>

                                  <strong>
                                    {match.score2 ??
                                      "-"}
                                  </strong>

                                </div>

                                {match.winner && (

                                  <div className="match-winner">
                                    WINNER:{" "}
                                    {match.winner}
                                  </div>

                                )}

                              </div>

                            )
                          )
                        : null}

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="no-points-data">

              <div>🏆</div>

              <h3>
                KNOCKOUT NOT UPDATED
              </h3>

              <p>
                Knockout fixtures and results
                will appear here once they are
                updated.
              </p>

            </div>

          )}

          {/* Third Place */}

          {thirdPlaceMatch && (

            <div className="third-place-section">

              <div className="round-title">
                THIRD PLACE
              </div>

              <div className="match-card third-place-card">

                <div className="match-top">

                  <span>
                    THIRD PLACE MATCH
                  </span>

                  {thirdPlaceMatch.date && (
                    <span>
                      {thirdPlaceMatch.date}
                    </span>
                  )}

                </div>

                <div className="match-team">

                  <span>
                    {thirdPlaceMatch.team1 ||
                      "TBD"}
                  </span>

                  <strong>
                    {thirdPlaceMatch.score1 ??
                      "-"}
                  </strong>

                </div>

                <div className="match-vs">
                  VS
                </div>

                <div className="match-team">

                  <span>
                    {thirdPlaceMatch.team2 ||
                      "TBD"}
                  </span>

                  <strong>
                    {thirdPlaceMatch.score2 ??
                      "-"}
                  </strong>

                </div>

                {thirdPlaceMatch.winner && (

                  <div className="match-winner">
                    WINNER:{" "}
                    {thirdPlaceMatch.winner}
                  </div>

                )}

              </div>

            </div>

          )}

        </section>

      )}

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="points-footer">

        <div className="footer-logo">
          URJA<span>&apos;27</span>
        </div>

        <p>
          NIT JAMSHEDPUR • OFFICIAL SPORTS
          POINTS TABLE
        </p>

        <div className="footer-live">

          <span></span>

          LIVE DATA

        </div>

      </footer>

    </div>
  );
};

export default PointsTable;
