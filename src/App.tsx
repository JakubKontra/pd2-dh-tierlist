import { lazy, Suspense } from "react";
import { BrowserRouter, Link, NavLink, Route, Routes } from "react-router-dom";
import { Tierlist } from "./pages/Tierlist";
import { BuildDetail } from "./pages/BuildDetail";
import { About } from "./pages/About";
import { Compare } from "./pages/Compare";
import { LoadingState } from "./components/LoadState";
import { CompareFab } from "./components/CompareFab";

const Stats = lazy(() => import("./pages/Stats").then((m) => ({ default: m.Stats })));

function NavBar() {
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 uppercase tracking-widest text-sm transition-colors ${
      isActive
        ? "text-d2-gold border-b-2 border-d2-gold"
        : "text-stone-400 hover:text-d2-unique border-b-2 border-transparent"
    }`;

  return (
    <header className="sticky top-0 z-40 panel border-t-0 border-x-0 backdrop-blur-sm bg-bg/90">
      <div className="max-w-[1400px] mx-auto flex items-center gap-6 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div
            className="h-8 w-8 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, #ff8c3a 0%, #cc0000 40%, #330000 100%)",
              boxShadow: "0 0 12px rgba(204, 0, 0, 0.6)",
            }}
          />
          <span className="heading-gold text-xl font-display font-bold">
            PD2 Tier List
          </span>
          <span className="text-xs text-stone-500 hidden sm:inline ml-1">
            S13 Betrayal
          </span>
        </Link>
        <nav className="flex items-center ml-auto">
          <NavLink to="/" end className={linkCls}>
            Tierlist
          </NavLink>
          <NavLink to="/stats" className={linkCls}>
            Stats
          </NavLink>
          <NavLink to="/compare" className={linkCls}>
            Compare
          </NavLink>
          <NavLink to="/about" className={linkCls}>
            About
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border mt-16 py-6 px-4 text-center text-xs text-stone-500">
      <p>
        Tier list methodology & testing by{" "}
        <span className="text-d2-gold">Dark Humility</span>. Data pulled live
        from the public Google Sheet.
      </p>
      <p className="mt-1">
        Fan project for{" "}
        <a
          href="https://projectdiablo2.com"
          target="_blank"
          rel="noreferrer"
          className="text-d2-unique hover:underline"
        >
          Project Diablo 2
        </a>
        . Not affiliated with Blizzard or PD2 team.
      </p>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 py-6">
          <Suspense fallback={<LoadingState message="Loading charts…" />}>
            <Routes>
              <Route path="/" element={<Tierlist />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/build/:id" element={<BuildDetail />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Suspense>
        </main>
        <CompareFab />
        <Footer />
      </div>
    </BrowserRouter>
  );
}
