import React from "react";
import "./managers.css";
import { MANAGERS } from "../../data/managers.jsx"; // ✅ Ensure correct path
import Footer from "../Footer/Footer.jsx";

const GROUP_ORDER = ["Team Lead", "Web managers", "Contributors"];

function groupManagers(managers) {
  const groups = {
    "Team Lead": [],
    "Web managers": [],
    "Contributors": [],
  };

  managers.forEach((m) => {
    // Normalize and inspect group/role strings
    const gRaw = (m.group || m.role || "").toString().toLowerCase();

    if (gRaw.includes("team lead") || gRaw.includes("team-lead") || gRaw === "lead" || gRaw.includes("lead")) {
      groups["Team Lead"].push(m);
    } else if (gRaw.includes("web") || gRaw.includes("web manager") || gRaw.includes("web-manager")) {
      groups["Web managers"].push(m);
    } else if (gRaw.includes("contrib") || gRaw.includes("contributor") || gRaw.includes("contributors") || gRaw.includes("contribut")) {
      groups["Contributors"].push(m);
    } else {
      // default to Team Lead so unspecified entries appear at top
      groups["Team Lead"].push(m);
    }
  });

  return groups;
}

function ManagerCard({ m }) {
  return (
    <article key={m.id} className="mgr-card">
      <div className="mgr-imgwrap">
        <img src={m.photo} alt={m.name} className="mgr-img" />
      </div>

      <div className="mgr-body">
        <h3 className="mgr-name">{m.name}</h3>
        {m.role && <p className="mgr-role">{m.role}</p>}

        {m.regNo && (
          <p className="mgr-regno">
            <strong>Reg No:</strong> {m.regNo}
          </p>
        )}

        {m.phone && (
          <a className="mgr-phone" href={`tel:${m.phone.replace(/\s+/g, "")}`}>
            {m.phone}
          </a>
        )}
      </div>
    </article>
  );
}

export default function Managers() {
  const groups = groupManagers(MANAGERS);

  return (
    <>
      <section className="mgr-wrap" id="managers">
        <div className="mgr-container">
          <h2 className="main-team-heading">Managers</h2>
          <p className="mgr-sub">The website of Urja '26 is managed by them.</p>

          {GROUP_ORDER.map((groupName) => {
            const items = groups[groupName];
            if (!items || items.length === 0) return null;

            // add a data-group attribute so CSS can target specific groups
            const dataGroup = groupName.toLowerCase().replace(/\s+/g, "-");

            return (
              <div key={groupName} className="mgr-group" data-group={dataGroup}>
                <h3 className="mgr-group-title">{groupName}</h3>
                <div className="mgr-grid">
                  {items.map((m) => (
                    <ManagerCard key={m.id} m={m} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <Footer />
    </>
  );
}
