import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const API_URL = (import.meta.env.VITE_API_URL || "https://urja-2026.onrender.com").replace(/\/$/, "");

/* ─── Sports config (mirrors PointsTable.jsx) ────────────── */
const sportsDataMap = {
  Athletics: {
    genders: ["Boys", "Girls"],
    pools: {
      Boys: ["100m","200m","400m","800m","1500m","Discus","4x400m Relay","Cross Country","3000m","Tug Of War","Triple Jump","Medley","Long Jump","High Jump","Shot Put","Javelin Throw","4x100m Relay"],
      Girls: ["100m","200m","400m","800m","1500m","Discus","4x400m Relay","Cross Country","3000m","Tug Of War","Triple Jump","Medley","Long Jump","High Jump","Shot Put","Javelin Throw","4x100m Relay"],
    },
    stages: ["Group Stage"],
  },
  Badminton: { genders: ["Boys","Girls"], pools: { Boys: ["Pool A","Pool B"], Girls: ["Pool A","Pool B"] }, stages: ["Group Stage","Knockout"] },
  Basketball: { genders: ["Boys","Girls"], pools: { Boys: ["Pool A","Pool B"], Girls: ["Pool A"] }, stages: ["Group Stage","Knockout"] },
  Chess: { genders: ["Boys","Girls"], pools: { Boys: ["Pool A","Pool B"], Girls: ["Pool A","Pool B"] }, stages: ["Group Stage","Knockout"] },
  Cricket: { genders: ["Boys"], pools: { Boys: ["Pool A","Pool B"] }, stages: ["Group Stage","Knockout"] },
  Football: { genders: ["Boys"], pools: { Boys: ["Pool A","Pool B"] }, stages: ["Group Stage","Knockout"] },
  Hockey: { genders: ["Boys"], pools: { Boys: ["Pool A"] }, stages: ["Group Stage","Knockout"] },
  "Lawn Tennis": { genders: ["Boys","Girls"], pools: { Boys: ["Pool A","Pool B"], Girls: ["Pool A","Pool B"] }, stages: ["Group Stage","Knockout"] },
  "Table Tennis": { genders: ["Boys","Girls"], pools: { Boys: ["Pool A","Pool B"], Girls: ["Pool A","Pool B"] }, stages: ["Group Stage","Knockout"] },
  Volleyball: { genders: ["Boys","Girls"], pools: { Boys: ["Pool A","Pool B"], Girls: ["Pool A","Pool B"] }, stages: ["Group Stage","Knockout"] },
};

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
  const [editData, setEditData] = useState(null); // pointsTable for group, knockout for knockout
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

  // Keep selections valid
  useEffect(() => {
    const cfg = sportsDataMap[selectedSport];
    if (!cfg) return;
    if (!cfg.genders.includes(selectedGender)) setSelectedGender(cfg.genders[0]);
    const pools = cfg.pools[selectedGender] || cfg.pools[cfg.genders[0]] || [];
    if (selectedStage === "Group Stage" && !pools.includes(selectedEvent)) {
      setSelectedEvent(pools[0] || "");
    }
    if (selectedStage === "Knockout") setSelectedEvent("Knockout");
  }, [selectedSport, selectedGender, selectedStage, selectedEvent]);

  // Fetch data for current selection
  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setFetchError("");
    setSaveMsg("");

    try {
      const eventParam = selectedStage === "Knockout" ? "Knockout" : selectedEvent;
      const params = new URLSearchParams({
        sport: selectedSport,
        gender: selectedGender,
        event: eventParam,
        stage: selectedStage,
      });

      const res = await fetch(`${API_URL}/api/scores?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.length > 0) {
        setScoreDoc(data[0]);
        if (selectedStage === "Knockout") {
          setEditData(JSON.parse(JSON.stringify(data[0].knockout || { rounds: [] })));
        } else {
          setEditData(JSON.parse(JSON.stringify(data[0].pointsTable || { headings: [], data: [] })));
        }
      } else {
        setScoreDoc(null);
        if (selectedStage === "Knockout") {
          setEditData({ rounds: [] });
        } else {
          setEditData({ headings: ["Team", "Pld", "W", "L", "Pts"], data: [] });
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
      const eventParam = selectedStage === "Knockout" ? "Knockout" : selectedEvent;
      const body = {
        sport: selectedSport,
        gender: selectedGender,
        event: eventParam,
        stage: selectedStage,
      };

      if (selectedStage === "Knockout") {
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
    // Try to parse as number
    const numVal = Number(value);
    newData.data[rowIdx][colIdx] = isNaN(numVal) || value === "" ? value : numVal;
    setEditData(newData);
  };

  // Add a row to points table
  const handleAddRow = () => {
    if (!editData || !editData.headings) return;
    const emptyRow = editData.headings.map(() => "");
    setEditData({ ...editData, data: [...editData.data, emptyRow] });
  };

  // Delete a row
  const handleDeleteRow = (rowIdx) => {
    if (!editData || !editData.data) return;
    const newData = editData.data.filter((_, i) => i !== rowIdx);
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

        {stages.length > 1 && (
          <div className="admin-select-group">
            <label>Stage</label>
            <select value={selectedStage} onChange={(e) => setSelectedStage(e.target.value)}>
              {stages.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        {selectedStage === "Group Stage" && pools.length > 0 && (
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

        {!loading && !fetchError && editData && selectedStage === "Group Stage" && (
          <div className="admin-table-section">
            <div className="admin-table-header">
              <h2>{selectedSport} — {selectedGender} — {selectedEvent}</h2>
              <div className="admin-table-actions">
                <button className="admin-add-row-btn" onClick={handleAddRow}>+ Add Row</button>
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
                      {row.map((cell, cIdx) => (
                        <td key={cIdx}>
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                            className="admin-cell-input"
                          />
                        </td>
                      ))}
                      <td className="admin-actions-col">
                        <button className="admin-delete-btn" onClick={() => handleDeleteRow(rIdx)} title="Delete row">
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
        {!loading && !fetchError && editData && selectedStage === "Knockout" && (
          <div className="admin-knockout-section">
            <h2>{selectedSport} — {selectedGender} — Knockout</h2>

            {(editData.rounds || []).map((round, rIdx) => (
              <div key={rIdx} className="admin-knockout-round">
                <h3>{round.name}</h3>
                {(round.matches || []).map((m, mIdx) => (
                  <div key={mIdx} className="admin-knockout-match">
                    <div className="admin-ko-field">
                      <label>Team 1</label>
                      <input value={m.team1 || ""} onChange={(e) => handleKnockoutMatchChange(rIdx, mIdx, "team1", e.target.value)} />
                    </div>
                    <div className="admin-ko-field">
                      <label>Score 1</label>
                      <input value={m.score1 || ""} onChange={(e) => handleKnockoutMatchChange(rIdx, mIdx, "score1", e.target.value)} />
                    </div>
                    <div className="admin-ko-vs">vs</div>
                    <div className="admin-ko-field">
                      <label>Team 2</label>
                      <input value={m.team2 || ""} onChange={(e) => handleKnockoutMatchChange(rIdx, mIdx, "team2", e.target.value)} />
                    </div>
                    <div className="admin-ko-field">
                      <label>Score 2</label>
                      <input value={m.score2 || ""} onChange={(e) => handleKnockoutMatchChange(rIdx, mIdx, "score2", e.target.value)} />
                    </div>
                    <div className="admin-ko-field">
                      <label>Winner</label>
                      <input value={m.winner || ""} onChange={(e) => handleKnockoutMatchChange(rIdx, mIdx, "winner", e.target.value)} />
                    </div>
                    <div className="admin-ko-field">
                      <label>Date</label>
                      <input value={m.date || ""} onChange={(e) => handleKnockoutMatchChange(rIdx, mIdx, "date", e.target.value)} />
                    </div>
                    <div className="admin-ko-field">
                      <label>Venue</label>
                      <input value={m.venue || ""} onChange={(e) => handleKnockoutMatchChange(rIdx, mIdx, "venue", e.target.value)} />
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
                    <input value={editData.thirdPlace.match.team1 || ""} onChange={(e) => handleThirdPlaceChange("team1", e.target.value)} />
                  </div>
                  <div className="admin-ko-field">
                    <label>Score 1</label>
                    <input value={editData.thirdPlace.match.score1 || ""} onChange={(e) => handleThirdPlaceChange("score1", e.target.value)} />
                  </div>
                  <div className="admin-ko-vs">vs</div>
                  <div className="admin-ko-field">
                    <label>Team 2</label>
                    <input value={editData.thirdPlace.match.team2 || ""} onChange={(e) => handleThirdPlaceChange("team2", e.target.value)} />
                  </div>
                  <div className="admin-ko-field">
                    <label>Score 2</label>
                    <input value={editData.thirdPlace.match.score2 || ""} onChange={(e) => handleThirdPlaceChange("score2", e.target.value)} />
                  </div>
                  <div className="admin-ko-field">
                    <label>Winner</label>
                    <input value={editData.thirdPlace.match.winner || ""} onChange={(e) => handleThirdPlaceChange("winner", e.target.value)} />
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
          {saveMsg && <span className={`admin-save-msg ${saveMsg.startsWith("✅") ? "success" : "error"}`}>{saveMsg}</span>}
          <button className="admin-save-btn" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "💾 Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
