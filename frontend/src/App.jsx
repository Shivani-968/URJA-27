import React from "react";
import {
  HashRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Team from "./components/Team/Team";
import Sports from "./components/Sports/Sports";
import Gallery from "./components/Gallery/Gallery";
import Pool from "./components/Pool/Pool";
import BranchLeaderboard from "./components/LeaderBoard/LeaderBoard";
import PointsTable from "./components/PointsTable/PointsTable";
import Managers from "./components/Managers/managers";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard";

import "./App.css";


function ScrollToTop() {
  React.useEffect(() => {
    const handleHashChange = () => {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return null;
}


function Layout({ children }) {
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}

      {!isAdmin && (
        <div
          className="vortex-top-icon"
          aria-hidden="true"
        >
          <img
            src={`${import.meta.env.BASE_URL}vortex.png`}
            alt="VORTEX"
          />
        </div>
      )}

      <main className={!isAdmin ? "main-page-content" : undefined}>
        {children}
      </main>
    </>
  );
}


export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />

      <Layout>
        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/team"
            element={<Team />}
          />

          <Route
            path="/sports"
            element={<Sports />}
          />

          <Route
            path="/gallery"
            element={<Gallery />}
          />

          <Route
            path="/pool"
            element={<Pool />}
          />

          <Route
            path="/branch-leaderboard"
            element={<BranchLeaderboard />}
          />

          <Route
            path="/points-table"
            element={<PointsTable />}
          />

          <Route
            path="/managers"
            element={<Managers />}
          />

          <Route
            path="/admin"
            element={<AdminLogin />}
          />

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="*"
            element={<Home />}
          />

        </Routes>
      </Layout>
    </HashRouter>
  );
}