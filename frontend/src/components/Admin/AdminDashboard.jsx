import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const API_URL = (import.meta.env.VITE_API_URL || "https://urja-2026.onrender.com").replace(/\/$/, "");

/* ─── Allowed base teams (NIT Jamshedpur branches) ────────── */
const BASE_TEAMS = ["CE", "PG", "MME", "CSE", "ME", "ECE", "PIE+ECM", "EE"];

/* ─── Sports config ───────────────────────────────────────── */
const sportsDataMap = {
  Athletics: {
    genders: ["Boys", "Girls"],
    pools: {
      Boys: ["100m", "200m", "400m"],
      Girls: ["100m", "200m", "400m"],
    },
    stages: [], // No stages in Athletics
  },
  Badminton: {
    genders: ["Boys", "Girls"],
    pools: { Boys: ["Pool A", "Pool B"], Girls: ["Pool A", "Pool B"] },
    stages: ["Group Stage", "Knockout"],
  },
  Basketball: {
    genders: ["Boys", "Girls"],
    pools: { Boys: ["Pool A", "Pool B"], Girls: ["Pool A", "Pool B"] },
    stages: ["Group Stage", "Knockout"],
  },
  Chess: {
    genders: ["Boys", "Girls"],
    pools: { Boys: ["Pool A", "Pool B"], Girls: ["Pool A", "Pool B"] },
    stages: ["Group Stage", "Knockout"],
  },
  Cricket: {
    genders: ["Boys", "Girls"],
    pools: { Boys: ["Pool A", "Pool B"], Girls: ["Pool A", "Pool B"] },
    stages: ["Group Stage", "Knockout"],
  },
  Football: {
    genders: ["Boys", "Girls"],
    pools: { Boys: ["Pool A", "Pool B"], Girls: ["Pool A", "Pool B"] },
    stages: ["Group Stage", "Knockout"],
  },
  Hockey: {
    genders: ["Boys", "Girls"],
    pools: { Boys: ["Pool A", "Pool B"], Girls: ["Pool A", "Pool B"] },
    stages: ["Group Stage", "Knockout"],
  },
  "Lawn Tennis": {
    genders: ["Boys", "Girls"],
    pools: { Boys: ["Pool A", "Pool B"], Girls: ["Pool A", "Pool B"] },
    stages: ["Group Stage", "Knockout"],
  },
  "Table Tennis": {
    genders: ["Boys", "Girls"],
    pools: { Boys: ["Pool A", "Pool B"], Girls: ["Pool A", "Pool B"] },
    stages: ["Group Stage", "Knockout"],
  },
  Volleyball: {
    genders: ["Boys", "Girls"],
    pools: { Boys: ["Pool A", "Pool B"], Girls: ["Pool A", "Pool B"] },
    stages: ["Group Stage", "Knockout"],
  },
};

/* ─── Default table headings by sport ─────────────────────── */
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

/* ─── Helpers to format and parse team names ──────────────── */
function formatTeams(teams) {
  if (!teams || teams.length === 0) return "";
  if (teams.length === 1) return teams[0];
  const hasComplex = teams.some((t) => t.includes("+"));
  if (hasComplex) {
    return teams.map((t) => (t.includes("+") ? `(${t})` : t)).join(" + ");
  }
  return teams.join("+");
}

function parseSelectedTeams(val) {
  if (!val || typeof val !== "string") return [];
  const str = val.trim();
  if (!str) return [];
  const selected = [];
  let remaining = str;
  if (remaining.includes("PIE+ECM") || remaining.includes("PIE + ECM")) {
    selected.push("PIE+ECM");
    remaining = remaining.replace(/\(?PIE\s*\+\s*ECM\)?/g, "");
  }
  const otherTeams = ["CE", "PG", "MME", "CSE", "ME", "ECE", "EE"];
  for (const t of otherTeams) {
    const regex = new RegExp(`(^|[^A-Za-z])${t}([^A-Za-z]|$)`);
    if (regex.test(remaining)) {
      selected.push(t);
      remaining = remaining.replace(regex, "$1$2");
    }
  }
  return selected;
}

/* ─── Team Select Dropdown Component ──────────────────────── */
function TeamDropdown({ value, onChange, openUp = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedTeams = parseSelectedTeams(value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const toggleTeam = (team) => {
    let next;
    if (selectedTeams.includes(team)) {
      next = selectedTeams.filter((t) => t !== team);
    } else {
      next = [...selectedTeams, team];
    }
    onChange(formatTeams(next));
  };

  const clearAll = () => {
    onChange("");
  };

  return (
    <div className={`team-dropdown-container ${isOpen ? "is-open" : ""}`} ref={dropdownRef}>
      <button
        type="button"
        className={`team-dropdown-btn ${!value ? "placeholder" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="team-dropdown-label">{value || "Select team..."}</span>
        <span className="team-dropdown-chevron">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className={`team-dropdown-menu ${openUp ? "open-up" : "open-down"}`}>
          <div className="team-dropdown-header">
            <span className="team-dropdown-title">All 8 Teams</span>
            <span className="team-dropdown-count">({selectedTeams.length} selected)</span>
          </div>

          <div className="team-dropdown-actions">
            <button type="button" onClick={clearAll} className="team-action-btn">
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
              const isChecked = selectedTeams.includes(team);
              return (
                <div
                  key={team}
                  onClick={() => toggleTeam(team)}
                  className={`team-grid-item ${isChecked ? "checked" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // handled by parent onClick
                  />
                  <span className="team-name">{team}</span>
                </div>
              );
            })}
          </div>

          {selectedTeams.length > 0 && (
            <div className="team-dropdown-preview">
              <span className="preview-label">Result:</span>
              <span className="preview-value">{formatTeams(selectedTeams)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Main Admin Dashboard Component ──────────────────────── */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");
  const token = localStorage.getItem("adminToken");

  // Selection state
  const [selectedSport, setSelectedSport] = useState("Athletics");
  const [selectedGender, setSelectedGender] = useState("Boys");
  const [selectedEvent, setSelectedEvent] = useState("100m");
  const [selectedStage, setSelectedStage] = useState("Group Stage");

  // Data state
  const [scoreDoc, setScoreDoc] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [fetchError, setFetchError] = useState("");

  // Auth check
  useEffect(() => {
    if (!token) {
      navigate("/admin", { replace: true });
      return;
    }
    setAdminName(localStorage.getItem("adminName") || "Admin");
  }, [token, navigate]);

  // Keep selections valid whenever sport/gender/stage changes
  useEffect(() => {
    const cfg = sportsDataMap[selectedSport];
    if (!cfg) return;
    if (!cfg.genders.includes(selectedGender)) setSelectedGender(cfg.genders[0]);
    const pools = cfg.pools[selectedGender] || cfg.pools[cfg.genders[0]] || [];

    if (selectedSport === "Athletics") {
      setSelectedStage("Group Stage");
      if (!pools.includes(selectedEvent)) {
        setSelectedEvent(pools[0] || "100m");
      }
    } else {
      if (selectedStage === "Group Stage" && !pools.includes(selectedEvent)) {
        setSelectedEvent(pools[0] || "Pool A");
      }
      if (selectedStage === "Knockout") setSelectedEvent("Knockout");
    }
  }, [selectedSport, selectedGender, selectedStage, selectedEvent]);

  // Fetch data for current selection
  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setFetchError("");
    setSaveMsg("");

    try {
      const eventParam = selectedStage === "Knockout" && selectedSport !== "Athletics" ? "Knockout" : selectedEvent;
      const stageParam = selectedSport === "Athletics" ? "Group Stage" : selectedStage;
      const params = new URLSearchParams({
        sport: selectedSport,
        gender: selectedGender,
        event: eventParam,
        stage: stageParam,
      });

      const res = await fetch(`${API_URL}/api/scores?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.length > 0) {
        setScoreDoc(data[0]);
        if (selectedStage === "Knockout" && selectedSport !== "Athletics") {
          setEditData(JSON.parse(JSON.stringify(data[0].knockout || { rounds: [] })));
        } else {
          const pt = data[0].pointsTable || {};
          const headings = pt.headings && pt.headings.length > 0 ? pt.headings : getDefaultHeadings(selectedSport);
          setEditData({
            headings,
            data: JSON.parse(JSON.stringify(pt.data || [])),
          });
        }
      } else {
        setScoreDoc(null);
        if (selectedStage === "Knockout" && selectedSport !== "Athletics") {
          setEditData({
            rounds: [
              {
                name: "Semi-finals",
                matches: [
                  { id: "SF1", date: "", venue: "", team1: "", team2: "", score1: "", score2: "", winner: "" },
                  { id: "SF2", date: "", venue: "", team1: "", team2: "", score1: "", score2: "", winner: "" },
                ],
              },
              {
                name: "Final",
                matches: [
                  { id: "F1", date: "", venue: "", team1: "", team2: "", score1: "", score2: "", winner: "" },
                ],
              },
            ],
            thirdPlace: {
              match: { id: "TP1", date: "", venue: "", team1: "", team2: "", score1: "", score2: "", winner: "" },
            },
          });
        } else {
          setEditData({ headings: getDefaultHeadings(selectedSport), data: [] });
        }
      }
    } catch (err) {
      setFetchError("Failed to fetch data. Is the backend running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedSport, selectedGender, selectedEvent, selectedStage, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Save changes
  const handleSave = async () => {
    if (!token || !editData) return;
    setSaving(true);
    setSaveMsg("");

    try {
      const eventParam = selectedStage === "Knockout" && selectedSport !== "Athletics" ? "Knockout" : selectedEvent;
      const stageParam = selectedSport === "Athletics" ? "Group Stage" : selectedStage;
      const body = {
        sport: selectedSport,
        gender: selectedGender,
        event: eventParam,
        stage: stageParam,
      };

      if (selectedStage === "Knockout" && selectedSport !== "Athletics") {
        body.knockout = editData;
      } else {
        body.pointsTable = editData;
      }

      const res = await fetch(`${API_URL}/api/scores/by-filter/upsert`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        setSaveMsg(`❌ ${err.message || "Save failed"}`);
        return;
      }

      setSaveMsg("✅ Saved successfully!");
      fetchData(); // Reload
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      setSaveMsg("❌ Network error");
    } finally {
      setSaving(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminEmail");
    navigate("/admin");
  };

  // Edit a cell in the points table
  const handleCellChange = (rowIdx, colIdx, value) => {
    if (!editData || !editData.data) return;
    const newData = { ...editData, data: editData.data.map((r) => [...r]) };
    const heading = (editData.headings[colIdx] || "").toLowerCase();

    if (heading === "team" || heading === "position" || heading === "#") {
      newData.data[rowIdx][colIdx] = value;
    } else {
      const numVal = Number(value);
      newData.data[rowIdx][colIdx] = isNaN(numVal) || value === "" ? value : numVal;
    }
    setEditData(newData);
  };

  // Add a row to points table with sport-specific default values
  const handleAddRow = () => {
    if (!editData || !editData.headings) return;
    const headings = editData.headings;
    const newRow = headings.map((h) => {
      const hl = h.toLowerCase();
      if (hl === "position" || hl === "pos" || hl === "#") {
        return String((editData.data?.length || 0) + 1);
      }
      if (hl === "team") return "";
      return 0;
    });
    setEditData({ ...editData, data: [...(editData.data || []), newRow] });
  };

  // Delete a row
  const handleDeleteRow = (rowIdx) => {
    if (!editData || !editData.data) return;
    const newData = editData.data.filter((_, i) => i !== rowIdx);
    // Re-index position column if Athletics
    const posIdx = editData.headings.findIndex(
      (h) => h.toLowerCase() === "position" || h.toLowerCase() === "pos"
    );
    if (posIdx !== -1) {
      newData.forEach((r, idx) => {
        r[posIdx] = String(idx + 1);
      });
    }
    setEditData({ ...editData, data: newData });
  };

  // Knockout match editing
  const handleKnockoutMatchChange = (roundIdx, matchIdx, field, value) => {
    if (!editData || !editData.rounds) return;
    const newRounds = JSON.parse(JSON.stringify(editData.rounds));
    newRounds[roundIdx].matches[matchIdx][field] = value;
    setEditData({ ...editData, rounds: newRounds });
  };

  // Third place match editing
  const handleThirdPlaceChange = (field, value) => {
    if (!editData) return;
    const tp = editData.thirdPlace ? JSON.parse(JSON.stringify(editData.thirdPlace)) : { match: {} };
    if (!tp.match) tp.match = {};
    tp.match[field] = value;
    setEditData({ ...editData, thirdPlace: tp });
  };

  const cfg = sportsDataMap[selectedSport] || {};
  const genders = cfg.genders || [];
  const pools = cfg.pools?.[selectedGender] || [];
  const stages = cfg.stages || [];

  return (
    <div className="admin-dashboard-page">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <h1>⚡ URJA Admin</h1>
          <span className="admin-welcome">Welcome, {adminName}</span>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Selectors */}
      <div className="admin-selectors">
        <div className="admin-select-group">
          <label>Sport</label>
          <select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)}>
            {Object.keys(sportsDataMap).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="admin-select-group">
          <label>Gender</label>
          <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
            {genders.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {stages.length > 1 && selectedSport !== "Athletics" && (
          <div className="admin-select-group">
            <label>Stage</label>
            <select value={selectedStage} onChange={(e) => setSelectedStage(e.target.value)}>
              {stages.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        {(selectedSport === "Athletics" || (selectedStage === "Group Stage" && pools.length > 0)) && (
          <div className="admin-select-group">
            <label>{selectedSport === "Athletics" ? "Event" : "Pool"}</label>
            <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
              {pools.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="admin-content">
        {loading && <div className="admin-loading">Loading...</div>}
        {fetchError && <div className="admin-fetch-error">{fetchError}</div>}

        {!loading && !fetchError && editData && (selectedSport === "Athletics" || selectedStage === "Group Stage") && (
          <div className="admin-table-section">
            <div className="admin-table-header">
              <h2>
                {selectedSport} — {selectedGender} — {selectedEvent}
              </h2>
              <div className="admin-table-actions">
                <button className="admin-add-row-btn" onClick={handleAddRow}>
                  + Add Row
                </button>
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-edit-table">
                <thead>
                  <tr>
                    <th className="admin-row-num">#</th>
                    {(editData.headings || []).map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                    <th className="admin-actions-col">Del</th>
                  </tr>
                </thead>
                <tbody>
                  {(editData.data || []).map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td className="admin-row-num">{rIdx + 1}</td>
                      {row.map((cell, cIdx) => {
                        const heading = (editData.headings[cIdx] || "").toLowerCase();
                        const isTeamCol = heading === "team";

                        return (
                          <td key={cIdx}>
                            {isTeamCol ? (
                              <TeamDropdown
                                value={cell}
                                onChange={(newVal) => handleCellChange(rIdx, cIdx, newVal)}
                                openUp={rIdx >= 3 && rIdx >= (editData.data?.length || 0) - 3}
                              />
                            ) : (
                              <input
                                type={heading === "position" || heading === "pos" ? "text" : "number"}
                                step={heading === "nrr" ? "0.001" : "1"}
                                value={cell}
                                onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                                className="admin-cell-input"
                              />
                            )}
                          </td>
                        );
                      })}
                      <td className="admin-actions-col">
                        <button
                          className="admin-delete-btn"
                          onClick={() => handleDeleteRow(rIdx)}
                          title="Delete row"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(editData.data || []).length === 0 && (
                    <tr>
                      <td colSpan={(editData.headings?.length || 0) + 2} className="admin-no-data">
                        No data yet. Click "+ Add Row" to start.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Knockout editor */}
        {!loading && !fetchError && editData && selectedSport !== "Athletics" && selectedStage === "Knockout" && (
          <div className="admin-knockout-section">
            <h2>{selectedSport} — {selectedGender} — Knockout</h2>

            {(editData.rounds || []).map((round, rIdx) => (
              <div key={rIdx} className="admin-knockout-round">
                <h3>{round.name}</h3>
                {(round.matches || []).map((m, mIdx) => (
                  <div key={mIdx} className="admin-knockout-match">
                    <div className="admin-ko-field">
                      <label>Team 1</label>
                      <TeamDropdown
                        value={m.team1 || ""}
                        onChange={(val) => handleKnockoutMatchChange(rIdx, mIdx, "team1", val)}
                      />
                    </div>
                    <div className="admin-ko-field score-field">
                      <label>Score 1</label>
                      <input
                        value={m.score1 || ""}
                        onChange={(e) => handleKnockoutMatchChange(rIdx, mIdx, "score1", e.target.value)}
                        placeholder="e.g. 21"
                      />
                    </div>
                    <div className="admin-ko-vs">vs</div>
                    <div className="admin-ko-field">
                      <label>Team 2</label>
                      <TeamDropdown
                        value={m.team2 || ""}
                        onChange={(val) => handleKnockoutMatchChange(rIdx, mIdx, "team2", val)}
                      />
                    </div>
                    <div className="admin-ko-field score-field">
                      <label>Score 2</label>
                      <input
                        value={m.score2 || ""}
                        onChange={(e) => handleKnockoutMatchChange(rIdx, mIdx, "score2", e.target.value)}
                        placeholder="e.g. 18"
                      />
                    </div>
                    <div className="admin-ko-field">
                      <label>Winner</label>
                      <TeamDropdown
                        value={m.winner || ""}
                        onChange={(val) => handleKnockoutMatchChange(rIdx, mIdx, "winner", val)}
                      />
                    </div>
                    <div className="admin-ko-field">
                      <label>Date</label>
                      <input
                        value={m.date || ""}
                        onChange={(e) => handleKnockoutMatchChange(rIdx, mIdx, "date", e.target.value)}
                        placeholder="e.g. 15 Oct"
                      />
                    </div>
                    <div className="admin-ko-field">
                      <label>Venue</label>
                      <input
                        value={m.venue || ""}
                        onChange={(e) => handleKnockoutMatchChange(rIdx, mIdx, "venue", e.target.value)}
                        placeholder="e.g. Court 1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {editData.thirdPlace?.match && (
              <div className="admin-knockout-round admin-third-place">
                <h3>Third Place</h3>
                <div className="admin-knockout-match">
                  <div className="admin-ko-field">
                    <label>Team 1</label>
                    <TeamDropdown
                      value={editData.thirdPlace.match.team1 || ""}
                      onChange={(val) => handleThirdPlaceChange("team1", val)}
                    />
                  </div>
                  <div className="admin-ko-field score-field">
                    <label>Score 1</label>
                    <input
                      value={editData.thirdPlace.match.score1 || ""}
                      onChange={(e) => handleThirdPlaceChange("score1", e.target.value)}
                      placeholder="e.g. 2"
                    />
                  </div>
                  <div className="admin-ko-vs">vs</div>
                  <div className="admin-ko-field">
                    <label>Team 2</label>
                    <TeamDropdown
                      value={editData.thirdPlace.match.team2 || ""}
                      onChange={(val) => handleThirdPlaceChange("team2", val)}
                    />
                  </div>
                  <div className="admin-ko-field score-field">
                    <label>Score 2</label>
                    <input
                      value={editData.thirdPlace.match.score2 || ""}
                      onChange={(e) => handleThirdPlaceChange("score2", e.target.value)}
                      placeholder="e.g. 1"
                    />
                  </div>
                  <div className="admin-ko-field">
                    <label>Winner</label>
                    <TeamDropdown
                      value={editData.thirdPlace.match.winner || ""}
                      onChange={(val) => handleThirdPlaceChange("winner", val)}
                    />
                  </div>
                </div>
              </div>
            )}

            {(editData.rounds || []).length === 0 && (
              <div className="admin-no-data">No knockout data available for this selection.</div>
            )}
          </div>
        )}
      </div>

      {/* Save bar */}
      {!loading && editData && (
        <div className="admin-save-bar">
          {saveMsg && (
            <span className={`admin-save-msg ${saveMsg.startsWith("✅") ? "success" : "error"}`}>
              {saveMsg}
            </span>
          )}
          <button className="admin-save-btn" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "💾 Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
