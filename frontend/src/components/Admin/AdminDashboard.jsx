import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "https://urja-2026.onrender.com"
).replace(/\/$/, "");

/* ─── Allowed base teams ─────────────────────────────────── */

const BASE_TEAMS = [
  "CE",
  "PG",
  "MME",
  "CSE",
  "ME",
  "ECE",
  "PIE+ECM",
  "EE",
];

/* ─── Sports config ──────────────────────────────────────── */

const sportsDataMap = {
  Athletics: {
    genders: ["Boys", "Girls"],
    pools: {
      Boys: [
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
      Girls: [
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
    },
    stages: ["Group Stage"],
  },

  Badminton: {
    genders: ["Boys", "Girls"],
    pools: {
      Boys: ["Pool A", "Pool B"],
      Girls: ["Pool A", "Pool B"],
    },
    stages: ["Group Stage", "Knockout"],
  },

  Basketball: {
    genders: ["Boys", "Girls"],
    pools: {
      Boys: ["Pool A", "Pool B"],
      Girls: ["Pool A", "Pool B"],
    },
    stages: ["Group Stage", "Knockout"],
  },

  Chess: {
    genders: ["Boys", "Girls"],
    pools: {
      Boys: ["Pool A", "Pool B"],
      Girls: ["Pool A", "Pool B"],
    },
    stages: ["Group Stage", "Knockout"],
  },

  Cricket: {
    genders: ["Boys"],
    pools: {
      Boys: ["Pool A", "Pool B"],
    },
    stages: ["Group Stage", "Knockout"],
  },

  Football: {
    genders: ["Boys"],
    pools: {
      Boys: ["Pool A", "Pool B"],
    },
    stages: ["Group Stage", "Knockout"],
  },

  Hockey: {
    genders: ["Boys"],
    pools: {
      Boys: ["Pool A"],
    },
    stages: ["Group Stage", "Knockout"],
  },

  "Lawn Tennis": {
    genders: ["Boys", "Girls"],
    pools: {
      Boys: ["Pool A", "Pool B"],
      Girls: ["Pool A", "Pool B"],
    },
    stages: ["Group Stage", "Knockout"],
  },

  "Table Tennis": {
    genders: ["Boys", "Girls"],
    pools: {
      Boys: ["Pool A", "Pool B"],
      Girls: ["Pool A", "Pool B"],
    },
    stages: ["Group Stage", "Knockout"],
  },

  Volleyball: {
    genders: ["Boys", "Girls"],
    pools: {
      Boys: ["Pool A", "Pool B"],
      Girls: ["Pool A", "Pool B"],
    },
    stages: ["Group Stage", "Knockout"],
  },
};

/* ─── Default table headings ─────────────────────────────── */

const getDefaultHeadings = (sport) => {
  if (sport === "Athletics") {
    return ["Position", "Team", "Points"];
  }

  if (sport === "Cricket") {
    return ["Team", "Pld", "W", "L", "NRR", "Pts"];
  }

  if (sport === "Football") {
    return ["Team", "Pld", "W", "L", "GD", "GS", "Pts"];
  }

  return ["Team", "Pld", "W", "L", "Pts"];
};

/* ─── Team helpers ───────────────────────────────────────── */

function formatTeams(teams) {
  if (!teams || teams.length === 0) return "";

  if (teams.length === 1) {
    return teams[0];
  }

  const hasComplex = teams.some((team) => team.includes("+"));

  if (hasComplex) {
    return teams
      .map((team) => (team.includes("+") ? `(${team})` : team))
      .join(" + ");
  }

  return teams.join("+");
}

function parseSelectedTeams(value) {
  if (!value || typeof value !== "string") {
    return [];
  }

  const str = value.trim();

  if (!str) {
    return [];
  }

  const selected = [];
  let remaining = str;

  if (
    remaining.includes("PIE+ECM") ||
    remaining.includes("PIE + ECM")
  ) {
    selected.push("PIE+ECM");

    remaining = remaining.replace(
      /\(?PIE\s*\+\s*ECM\)?/g,
      ""
    );
  }

  const otherTeams = [
    "CE",
    "PG",
    "MME",
    "CSE",
    "ME",
    "ECE",
    "EE",
  ];

  for (const team of otherTeams) {
    const regex = new RegExp(
      `(^|[^A-Za-z])${team}([^A-Za-z]|$)`
    );

    if (regex.test(remaining)) {
      selected.push(team);
      remaining = remaining.replace(regex, "$1$2");
    }
  }

  return selected;
}

/* ─── Team Dropdown ──────────────────────────────────────── */

function TeamDropdown({
  value,
  onChange,
  openUp = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [directionUp, setDirectionUp] = useState(openUp);

  const dropdownRef = useRef(null);

  const selectedTeams = parseSelectedTeams(value);

  const handleToggleOpen = () => {
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;

      if (openUp || spaceBelow < 280) {
        setDirectionUp(true);
      } else {
        setDirectionUp(false);
      }
    }

    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [isOpen]);

  const toggleTeam = (team) => {
    let next;

    if (selectedTeams.includes(team)) {
      next = selectedTeams.filter(
        (selected) => selected !== team
      );
    } else {
      next = [...selectedTeams, team];
    }

    onChange(formatTeams(next));
  };

  const clearAll = () => {
    onChange("");
  };

  return (
    <div
      className={`team-dropdown-container ${
        isOpen ? "is-open" : ""
      }`}
      ref={dropdownRef}
    >
      <button
        type="button"
        className={`team-dropdown-btn ${
          !value ? "placeholder" : ""
        }`}
        onClick={handleToggleOpen}
      >
        <span className="team-dropdown-label">
          {value || "Select team..."}
        </span>

        <span className="team-dropdown-chevron">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <div
          className={`team-dropdown-menu ${
            directionUp ? "open-up" : "open-down"
          }`}
        >
          <div className="team-dropdown-header">
            <span className="team-dropdown-title">
              All 8 Teams
            </span>

            <span className="team-dropdown-count">
              ({selectedTeams.length} selected)
            </span>
          </div>

          <div className="team-dropdown-actions">
            <button
              type="button"
              onClick={clearAll}
              className="team-action-btn"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="team-action-btn done"
            >
              Done ✓
            </button>
          </div>

          <div className="team-dropdown-grid">
            {BASE_TEAMS.map((team) => {
              const isChecked =
                selectedTeams.includes(team);

              return (
                <div
                  key={team}
                  onClick={() => toggleTeam(team)}
                  className={`team-grid-item ${
                    isChecked ? "checked" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                  />

                  <span className="team-name">
                    {team}
                  </span>
                </div>
              );
            })}
          </div>

          {selectedTeams.length > 0 && (
            <div className="team-dropdown-preview">
              <span className="preview-label">
                Result:
              </span>

              <span className="preview-value">
                {formatTeams(selectedTeams)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Empty knockout match ───────────────────────────────── */

const createEmptyKnockoutMatch = () => ({
  id: `match-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`,
  date: "",
  venue: "",
  team1: "",
  team2: "",
  score1: "",
  score2: "",
  winner: "",
});

/* ─── Main Admin Dashboard ──────────────────────────────── */

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [adminName, setAdminName] = useState("");

  const token = localStorage.getItem("adminToken");

  /* Selection state */
  const [selectedSport, setSelectedSport] =
    useState("Athletics");

  const [selectedGender, setSelectedGender] =
    useState("Boys");

  const [selectedEvent, setSelectedEvent] =
    useState("100m");

  const [selectedStage, setSelectedStage] =
    useState("Group Stage");

  /* Data state */
  const [editData, setEditData] = useState(null);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [saveMsg, setSaveMsg] =
    useState("");

  const [fetchError, setFetchError] =
    useState("");

  /* ─── Auth check ─────────────────────────────────────── */

  useEffect(() => {
    if (!token) {
      navigate("/admin", {
        replace: true,
      });

      return;
    }

    setAdminName(
      localStorage.getItem("adminName") ||
        "Admin"
    );
  }, [token, navigate]);

  /* ─── Keep selections valid ─────────────────────────── */

  useEffect(() => {
    const cfg = sportsDataMap[selectedSport];

    if (!cfg) return;

    if (!cfg.genders.includes(selectedGender)) {
      setSelectedGender(cfg.genders[0]);
      return;
    }

    const pools =
      cfg.pools[selectedGender] ||
      cfg.pools[cfg.genders[0]] ||
      [];

    if (selectedSport === "Athletics") {
      setSelectedStage("Group Stage");

      if (!pools.includes(selectedEvent)) {
        setSelectedEvent(
          pools[0] || "100m"
        );
      }

      return;
    }

    if (
      selectedStage === "Group Stage" &&
      !pools.includes(selectedEvent)
    ) {
      setSelectedEvent(
        pools[0] || "Pool A"
      );
    }

    if (selectedStage === "Knockout") {
      setSelectedEvent("Knockout");
    }
  }, [
    selectedSport,
    selectedGender,
    selectedStage,
    selectedEvent,
  ]);

  /* ─── Fetch data ─────────────────────────────────────── */

  const fetchData = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setFetchError("");
    setSaveMsg("");

    try {
      const eventParam =
        selectedStage === "Knockout" &&
        selectedSport !== "Athletics"
          ? "Knockout"
          : selectedEvent;

      const stageParam =
        selectedSport === "Athletics"
          ? "Group Stage"
          : selectedStage;

      const params = new URLSearchParams({
        sport: selectedSport,
        gender: selectedGender,
        event: eventParam,
        stage: stageParam,
      });

      const response = await fetch(
        `${API_URL}/api/scores?${params.toString()}`,
        {
          method: "GET",
          cache: "no-cache",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        if (
          selectedStage === "Knockout" &&
          selectedSport !== "Athletics"
        ) {
          setEditData(
            JSON.parse(
              JSON.stringify(
                data[0].knockout || {
                  rounds: [],
                }
              )
            )
          );
        } else {
          const pointsTable =
            data[0].pointsTable || {};

          const headings =
            pointsTable.headings &&
            pointsTable.headings.length > 0
              ? pointsTable.headings
              : getDefaultHeadings(
                  selectedSport
                );

          setEditData({
            headings,
            data: JSON.parse(
              JSON.stringify(
                pointsTable.data || []
              )
            ),
          });
        }
      } else {
        if (
          selectedStage === "Knockout" &&
          selectedSport !== "Athletics"
        ) {
          setEditData({
            rounds: [
              {
                name: "Semi-finals",
                matches: [
                  {
                    id: "SF1",
                    date: "",
                    venue: "",
                    team1: "",
                    team2: "",
                    score1: "",
                    score2: "",
                    winner: "",
                  },
                  {
                    id: "SF2",
                    date: "",
                    venue: "",
                    team1: "",
                    team2: "",
                    score1: "",
                    score2: "",
                    winner: "",
                  },
                ],
              },
              {
                name: "Final",
                matches: [
                  {
                    id: "F1",
                    date: "",
                    venue: "",
                    team1: "",
                    team2: "",
                    score1: "",
                    score2: "",
                    winner: "",
                  },
                ],
              },
            ],

            thirdPlace: {
              match: {
                id: "TP1",
                date: "",
                venue: "",
                team1: "",
                team2: "",
                score1: "",
                score2: "",
                winner: "",
              },
            },
          });
        } else {
          setEditData({
            headings:
              getDefaultHeadings(
                selectedSport
              ),
            data: [],
          });
        }
      }
    } catch (error) {
      console.error(
        "Fetch error:",
        error
      );

      setFetchError(
        "Failed to fetch data. Is the backend running?"
      );
    } finally {
      setLoading(false);
    }
  }, [
    selectedSport,
    selectedGender,
    selectedEvent,
    selectedStage,
    token,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ─── Save changes ──────────────────────────────────── */

  const handleSave = async () => {
    if (!token || !editData) return;

    setSaving(true);
    setSaveMsg("");

    try {
      const eventParam =
        selectedStage === "Knockout" &&
        selectedSport !== "Athletics"
          ? "Knockout"
          : selectedEvent;

      const stageParam =
        selectedSport === "Athletics"
          ? "Group Stage"
          : selectedStage;

      const body = {
        sport: selectedSport,
        gender: selectedGender,
        event: eventParam,
        stage: stageParam,
      };

      if (
        selectedStage === "Knockout" &&
        selectedSport !== "Athletics"
      ) {
        body.knockout = editData;
      } else {
        body.pointsTable = editData;
      }

      const response = await fetch(
        `${API_URL}/api/scores/by-filter/upsert`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        let errorMessage = "Save failed";

        try {
          const errorData =
            await response.json();

          errorMessage =
            errorData.message ||
            errorMessage;
        } catch {
          // Ignore invalid error response
        }

        setSaveMsg(
          `❌ ${errorMessage}`
        );

        return;
      }

      setSaveMsg(
        "✅ Saved successfully!"
      );

      await fetchData();

      setTimeout(() => {
        setSaveMsg("");
      }, 3000);
    } catch (error) {
      console.error(
        "Save error:",
        error
      );

      setSaveMsg(
        "❌ Network error"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ─── Logout ────────────────────────────────────────── */

  const handleLogout = () => {
    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "adminName"
    );

    localStorage.removeItem(
      "adminEmail"
    );

    navigate("/admin");
  };

  /* ─── Points table cell editing ─────────────────────── */

  const handleCellChange = (
    rowIdx,
    colIdx,
    value
  ) => {
    if (
      !editData ||
      !editData.data
    ) {
      return;
    }

    const newData = {
      ...editData,
      data: editData.data.map(
        (row) => [...row]
      ),
    };

    const heading = (
      editData.headings[colIdx] || ""
    ).toLowerCase();

    if (
      heading === "team" ||
      heading === "position" ||
      heading === "#"
    ) {
      newData.data[rowIdx][colIdx] =
        value;
    } else {
      const numericValue =
        Number(value);

      newData.data[rowIdx][colIdx] =
        Number.isNaN(numericValue) ||
        value === ""
          ? value
          : numericValue;
    }

    setEditData(newData);
  };

  /* ─── Add row ───────────────────────────────────────── */

  const handleAddRow = () => {
    if (
      !editData ||
      !editData.headings
    ) {
      return;
    }

    const headings =
      editData.headings;

    const newRow = headings.map(
      (heading) => {
        const h =
          heading.toLowerCase();

        if (
          h === "position" ||
          h === "pos" ||
          h === "#"
        ) {
          return String(
            (editData.data?.length ||
              0) + 1
          );
        }

        if (h === "team") {
          return "";
        }

        return 0;
      }
    );

    setEditData({
      ...editData,
      data: [
        ...(editData.data || []),
        newRow,
      ],
    });
  };

  /* ─── Delete row ────────────────────────────────────── */

  const handleDeleteRow = (
    rowIdx
  ) => {
    if (
      !editData ||
      !editData.data
    ) {
      return;
    }

    const newData =
      editData.data.filter(
        (_, index) =>
          index !== rowIdx
      );

    const positionIndex =
      editData.headings.findIndex(
        (heading) => {
          const h =
            heading.toLowerCase();

          return (
            h === "position" ||
            h === "pos" ||
            h === "#"
          );
        }
      );

    if (positionIndex !== -1) {
      newData.forEach(
        (row, index) => {
          row[positionIndex] =
            String(index + 1);
        }
      );
    }

    setEditData({
      ...editData,
      data: newData,
    });
  };

  /* ─── Knockout match editing ───────────────────────── */

  const handleKnockoutMatchChange = (
    roundIdx,
    matchIdx,
    field,
    value
  ) => {
    if (
      !editData ||
      !editData.rounds
    ) {
      return;
    }

    const newRounds =
      JSON.parse(
        JSON.stringify(
          editData.rounds
        )
      );

    newRounds[roundIdx].matches[
      matchIdx
    ][field] = value;

    setEditData({
      ...editData,
      rounds: newRounds,
    });
  };

  /* ─── Add knockout round ───────────────────────────── */

  const handleAddRound = () => {
    if (!editData) return;

    const rounds = [
      ...(editData.rounds || []),
    ];

    rounds.push({
      name: `Round ${
        rounds.length + 1
      }`,
      matches: [
        createEmptyKnockoutMatch(),
      ],
    });

    setEditData({
      ...editData,
      rounds,
    });
  };

  /* ─── Rename knockout round ────────────────────────── */

  const handleRoundNameChange = (
    roundIdx,
    value
  ) => {
    if (!editData?.rounds) return;

    const rounds =
      JSON.parse(
        JSON.stringify(
          editData.rounds
        )
      );

    rounds[roundIdx].name =
      value;

    setEditData({
      ...editData,
      rounds,
    });
  };

  /* ─── Add knockout match ───────────────────────────── */

  const handleAddKnockoutMatch = (
    roundIdx
  ) => {
    if (!editData?.rounds) return;

    const rounds =
      JSON.parse(
        JSON.stringify(
          editData.rounds
        )
      );

    rounds[roundIdx].matches.push(
      createEmptyKnockoutMatch()
    );

    setEditData({
      ...editData,
      rounds,
    });
  };

  /* ─── Delete knockout match ────────────────────────── */

  const handleDeleteKnockoutMatch = (
    roundIdx,
    matchIdx
  ) => {
    if (!editData?.rounds) return;

    const rounds =
      JSON.parse(
        JSON.stringify(
          editData.rounds
        )
      );

    rounds[roundIdx].matches =
      rounds[
        roundIdx
      ].matches.filter(
        (_, index) =>
          index !== matchIdx
      );

    setEditData({
      ...editData,
      rounds,
    });
  };

  /* ─── Delete knockout round ────────────────────────── */

  const handleDeleteRound = (
    roundIdx
  ) => {
    if (!editData?.rounds) return;

    const rounds =
      editData.rounds.filter(
        (_, index) =>
          index !== roundIdx
      );

    setEditData({
      ...editData,
      rounds,
    });
  };

  /* ─── Third place match ────────────────────────────── */

  const handleThirdPlaceChange = (
    field,
    value
  ) => {
    if (!editData) return;

    const thirdPlace =
      editData.thirdPlace
        ? JSON.parse(
            JSON.stringify(
              editData.thirdPlace
            )
          )
        : {
            match:
              createEmptyKnockoutMatch(),
          };

    if (!thirdPlace.match) {
      thirdPlace.match =
        createEmptyKnockoutMatch();
    }

    thirdPlace.match[field] =
      value;

    setEditData({
      ...editData,
      thirdPlace,
    });
  };

  const handleAddThirdPlace = () => {
    if (!editData) return;

    setEditData({
      ...editData,
      thirdPlace: {
        match:
          createEmptyKnockoutMatch(),
      },
    });
  };

  const handleRemoveThirdPlace = () => {
    if (!editData) return;

    const updated = {
      ...editData,
    };

    delete updated.thirdPlace;

    setEditData(updated);
  };

  /* ─── Current configuration ────────────────────────── */

  const cfg =
    sportsDataMap[selectedSport] ||
    {};

  const genders =
    cfg.genders || [];

  const pools =
    cfg.pools?.[
      selectedGender
    ] || [];

  const stages =
    cfg.stages || [];

  /* ─── Render ───────────────────────────────────────── */

  return (
    <div className="admin-dashboard-page">

      {/* Header */}

      <div className="admin-header">
        <div className="admin-header-left">
          <h1>⚡ URJA Admin</h1>

          <span className="admin-welcome">
            Welcome, {adminName}
          </span>
        </div>

        <button
          className="admin-logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Selectors */}

      <div className="admin-selectors">

        <div className="admin-select-group">
          <label>Sport</label>

          <select
            value={selectedSport}
            onChange={(event) =>
              setSelectedSport(
                event.target.value
              )
            }
          >
            {Object.keys(
              sportsDataMap
            ).map((sport) => (
              <option
                key={sport}
                value={sport}
              >
                {sport}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-select-group">
          <label>Gender</label>

          <select
            value={selectedGender}
            onChange={(event) =>
              setSelectedGender(
                event.target.value
              )
            }
          >
            {genders.map(
              (gender) => (
                <option
                  key={gender}
                  value={gender}
                >
                  {gender}
                </option>
              )
            )}
          </select>
        </div>

        {stages.length > 1 &&
          selectedSport !==
            "Athletics" && (
            <div className="admin-select-group">
              <label>Stage</label>

              <select
                value={
                  selectedStage
                }
                onChange={(event) =>
                  setSelectedStage(
                    event.target.value
                  )
                }
              >
                {stages.map(
                  (stage) => (
                    <option
                      key={stage}
                      value={stage}
                    >
                      {stage}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

        {(selectedSport ===
          "Athletics" ||
          (selectedStage ===
            "Group Stage" &&
            pools.length > 0)) && (
          <div className="admin-select-group">
            <label>
              {selectedSport ===
              "Athletics"
                ? "Event"
                : "Pool"}
            </label>

            <select
              value={
                selectedEvent
              }
              onChange={(event) =>
                setSelectedEvent(
                  event.target.value
                )
              }
            >
              {pools.map(
                (pool) => (
                  <option
                    key={pool}
                    value={pool}
                  >
                    {pool}
                  </option>
                )
              )}
            </select>
          </div>
        )}
      </div>

      {/* Content */}

      <div className="admin-content">

        {loading && (
          <div className="admin-loading">
            Loading...
          </div>
        )}

        {fetchError && (
          <div className="admin-fetch-error">
            {fetchError}
          </div>
        )}

        {/* Group Stage / Athletics */}

        {!loading &&
          !fetchError &&
          editData &&
          (selectedSport ===
            "Athletics" ||
            selectedStage ===
              "Group Stage") && (
            <div className="admin-table-section">

              <div className="admin-table-header">
                <h2>
                  {selectedSport} —{" "}
                  {selectedGender} —{" "}
                  {selectedEvent}
                </h2>

                <div className="admin-table-actions">
                  <button
                    className="admin-add-row-btn"
                    onClick={
                      handleAddRow
                    }
                  >
                    + Add Row
                  </button>
                </div>
              </div>

              <div className="admin-table-wrapper">
                <table className="admin-edit-table">

                  <thead>
                    <tr>
                      <th className="admin-row-num">
                        #
                      </th>

                      {(
                        editData.headings ||
                        []
                      ).map(
                        (
                          heading,
                          index
                        ) => (
                          <th
                            key={
                              index
                            }
                          >
                            {
                              heading
                            }
                          </th>
                        )
                      )}

                      <th className="admin-actions-col">
                        Del
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {(
                      editData.data ||
                      []
                    ).map(
                      (
                        row,
                        rowIndex
                      ) => (
                        <tr
                          key={
                            rowIndex
                          }
                        >
                          <td className="admin-row-num">
                            {rowIndex +
                              1}
                          </td>

                          {row.map(
                            (
                              cell,
                              columnIndex
                            ) => {
                              const heading =
                                (
                                  editData
                                    .headings[
                                    columnIndex
                                  ] ||
                                  ""
                                ).toLowerCase();

                              const isTeamColumn =
                                heading ===
                                "team";

                              return (
                                <td
                                  key={
                                    columnIndex
                                  }
                                >
                                  {isTeamColumn ? (
                                    <TeamDropdown
                                      value={
                                        cell
                                      }
                                      onChange={(
                                        newValue
                                      ) =>
                                        handleCellChange(
                                          rowIndex,
                                          columnIndex,
                                          newValue
                                        )
                                      }
                                      openUp={
                                        rowIndex >=
                                          3 &&
                                        rowIndex >=
                                          (
                                            editData
                                              .data
                                              ?.length ||
                                            0
                                          ) -
                                            3
                                      }
                                    />
                                  ) : (
                                    <input
                                      type={
                                        heading ===
                                          "position" ||
                                        heading ===
                                          "pos" ||
                                        heading ===
                                          "#"
                                          ? "text"
                                          : "number"
                                      }
                                      step={
                                        heading ===
                                        "nrr"
                                          ? "0.001"
                                          : "1"
                                      }
                                      value={
                                        cell
                                      }
                                      onChange={(
                                        event
                                      ) =>
                                        handleCellChange(
                                          rowIndex,
                                          columnIndex,
                                          event
                                            .target
                                            .value
                                        )
                                      }
                                      className="admin-cell-input"
                                    />
                                  )}
                                </td>
                              );
                            }
                          )}

                          <td className="admin-actions-col">
                            <button
                              className="admin-delete-btn"
                              onClick={() =>
                                handleDeleteRow(
                                  rowIndex
                                )
                              }
                              title="Delete row"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      )
                    )}

                    {(
                      editData.data ||
                      []
                    ).length === 0 && (
                      <tr>
                        <td
                          colSpan={
                            (
                              editData
                                .headings
                                ?.length ||
                              0
                            ) + 2
                          }
                          className="admin-no-data"
                        >
                          No data yet.
                          Click "+ Add
                          Row" to start.
                        </td>
                      </tr>
                    )}
                  </tbody>

                </table>
              </div>
            </div>
          )}

        {/* Knockout */}

        {!loading &&
          !fetchError &&
          editData &&
          selectedSport !==
            "Athletics" &&
          selectedStage ===
            "Knockout" && (
            <div className="admin-knockout-section">

              <div className="admin-table-header">
                <h2>
                  {selectedSport} —{" "}
                  {selectedGender} —
                  Knockout
                </h2>

                <button
                  className="admin-add-row-btn"
                  onClick={
                    handleAddRound
                  }
                >
                  + Add Round
                </button>
              </div>

              {(editData.rounds ||
                []
              ).map(
                (
                  round,
                  roundIndex
                ) => (
                  <div
                    key={
                      roundIndex
                    }
                    className="admin-knockout-round"
                  >

                    <div className="admin-round-header">
                      <input
                        className="admin-round-name-input"
                        value={
                          round.name ||
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          handleRoundNameChange(
                            roundIndex,
                            event
                              .target
                              .value
                          )
                        }
                      />

                      <button
                        className="admin-delete-btn"
                        onClick={() =>
                          handleDeleteRound(
                            roundIndex
                          )
                        }
                        title="Delete round"
                      >
                        ✕
                      </button>
                    </div>

                    {(round.matches ||
                      []
                    ).map(
                      (
                        match,
                        matchIndex
                      ) => (
                        <div
                          key={
                            match.id ||
                            matchIndex
                          }
                          className="admin-knockout-match"
                        >

                          <div className="admin-ko-field">
                            <label>
                              Team 1
                            </label>

                            <TeamDropdown
                              value={
                                match.team1 ||
                                ""
                              }
                              onChange={(
                                value
                              ) =>
                                handleKnockoutMatchChange(
                                  roundIndex,
                                  matchIndex,
                                  "team1",
                                  value
                                )
                              }
                            />
                          </div>

                          <div className="admin-ko-field score-field">
                            <label>
                              Score 1
                            </label>

                            <input
                              value={
                                match.score1 ||
                                ""
                              }
                              onChange={(
                                event
                              ) =>
                                handleKnockoutMatchChange(
                                  roundIndex,
                                  matchIndex,
                                  "score1",
                                  event
                                    .target
                                    .value
                                )
                              }
                              placeholder="e.g. 21"
                            />
                          </div>

                          <div className="admin-ko-vs">
                            vs
                          </div>

                          <div className="admin-ko-field">
                            <label>
                              Team 2
                            </label>

                            <TeamDropdown
                              value={
                                match.team2 ||
                                ""
                              }
                              onChange={(
                                value
                              ) =>
                                handleKnockoutMatchChange(
                                  roundIndex,
                                  matchIndex,
                                  "team2",
                                  value
                                )
                              }
                            />
                          </div>

                          <div className="admin-ko-field score-field">
                            <label>
                              Score 2
                            </label>

                            <input
                              value={
                                match.score2 ||
                                ""
                              }
                              onChange={(
                                event
                              ) =>
                                handleKnockoutMatchChange(
                                  roundIndex,
                                  matchIndex,
                                  "score2",
                                  event
                                    .target
                                    .value
                                )
                              }
                              placeholder="e.g. 18"
                            />
                          </div>

                          <div className="admin-ko-field">
                            <label>
                              Winner
                            </label>

                            <TeamDropdown
                              value={
                                match.winner ||
                                ""
                              }
                              onChange={(
                                value
                              ) =>
                                handleKnockoutMatchChange(
                                  roundIndex,
                                  matchIndex,
                                  "winner",
                                  value
                                )
                              }
                            />
                          </div>

                          <div className="admin-ko-field">
                            <label>
                              Date
                            </label>

                            <input
                              value={
                                match.date ||
                                ""
                              }
                              onChange={(
                                event
                              ) =>
                                handleKnockoutMatchChange(
                                  roundIndex,
                                  matchIndex,
                                  "date",
                                  event
                                    .target
                                    .value
                                )
                              }
                              placeholder="e.g. 15 Oct"
                            />
                          </div>

                          <div className="admin-ko-field">
                            <label>
                              Venue
                            </label>

                            <input
                              value={
                                match.venue ||
                                ""
                              }
                              onChange={(
                                event
                              ) =>
                                handleKnockoutMatchChange(
                                  roundIndex,
                                  matchIndex,
                                  "venue",
                                  event
                                    .target
                                    .value
                                )
                              }
                              placeholder="e.g. Court 1"
                            />
                          </div>

                          <button
                            className="admin-delete-btn admin-ko-delete"
                            onClick={() =>
                              handleDeleteKnockoutMatch(
                                roundIndex,
                                matchIndex
                              )
                            }
                            title="Delete match"
                          >
                            ✕
                          </button>

                        </div>
                      )
                    )}

                    <button
                      className="admin-add-row-btn"
                      onClick={() =>
                        handleAddKnockoutMatch(
                          roundIndex
                        )
                      }
                    >
                      + Add Match
                    </button>

                  </div>
                )
              )}

              {/* Third Place */}

              {editData.thirdPlace?.match ? (
                <div className="admin-knockout-round admin-third-place">

                  <div className="admin-round-header">
                    <h3>
                      Third Place
                    </h3>

                    <button
                      className="admin-delete-btn"
                      onClick={
                        handleRemoveThirdPlace
                      }
                      title="Remove third-place match"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="admin-knockout-match">

                    <div className="admin-ko-field">
                      <label>
                        Team 1
                      </label>

                      <TeamDropdown
                        value={
                          editData
                            .thirdPlace
                            .match
                            .team1 ||
                          ""
                        }
                        onChange={(
                          value
                        ) =>
                          handleThirdPlaceChange(
                            "team1",
                            value
                          )
                        }
                        openUp
                      />
                    </div>

                    <div className="admin-ko-field score-field">
                      <label>
                        Score 1
                      </label>

                      <input
                        value={
                          editData
                            .thirdPlace
                            .match
                            .score1 ||
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          handleThirdPlaceChange(
                            "score1",
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="e.g. 2"
                      />
                    </div>

                    <div className="admin-ko-vs">
                      vs
                    </div>

                    <div className="admin-ko-field">
                      <label>
                        Team 2
                      </label>

                      <TeamDropdown
                        value={
                          editData
                            .thirdPlace
                            .match
                            .team2 ||
                          ""
                        }
                        onChange={(
                          value
                        ) =>
                          handleThirdPlaceChange(
                            "team2",
                            value
                          )
                        }
                        openUp
                      />
                    </div>

                    <div className="admin-ko-field score-field">
                      <label>
                        Score 2
                      </label>

                      <input
                        value={
                          editData
                            .thirdPlace
                            .match
                            .score2 ||
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          handleThirdPlaceChange(
                            "score2",
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="e.g. 1"
                      />
                    </div>

                    <div className="admin-ko-field">
                      <label>
                        Winner
                      </label>

                      <TeamDropdown
                        value={
                          editData
                            .thirdPlace
                            .match
                            .winner ||
                          ""
                        }
                        onChange={(
                          value
                        ) =>
                          handleThirdPlaceChange(
                            "winner",
                            value
                          )
                        }
                        openUp
                      />
                    </div>

                  </div>
                </div>
              ) : (
                <button
                  className="admin-add-row-btn"
                  onClick={
                    handleAddThirdPlace
                  }
                >
                  + Add Third Place Match
                </button>
              )}

              {(editData.rounds ||
                []).length === 0 && (
                <div className="admin-no-data">
                  No knockout data
                  available for this
                  selection.
                </div>
              )}

            </div>
          )}
      </div>

      {/* Save bar */}

      {!loading && editData && (
        <div className="admin-save-bar">

          {saveMsg && (
            <span
              className={`admin-save-msg ${
                saveMsg.startsWith("✅")
                  ? "success"
                  : "error"
              }`}
            >
              {saveMsg}
            </span>
          )}

          <button
            className="admin-save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "💾 Save Changes"}
          </button>

        </div>
      )}

    </div>
  );
}