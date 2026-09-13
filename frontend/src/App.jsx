import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar"
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

function ScrollToTop() {
  React.useEffect(() => {
    const unlisten = () => {
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", unlisten);
    return () => window.removeEventListener("hashchange", unlisten);
  }, []);
  return null;
}

// Wrapper to conditionally show Navbar (hide on admin pages)
function Layout({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  return (
    <>
      {!isAdmin && <Navbar />}
      <main style={!isAdmin ? { paddingTop: "84px" } : undefined}>
        {children}
      </main>
    </>
  );
}

// Main App Component with Routing
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/pool" element={<Pool />} />
          <Route path="/branch-leaderboard" element={<BranchLeaderboard />} />
          <Route path="/points-table" element={<PointsTable />} />
          <Route path="/managers" element={<Managers />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
