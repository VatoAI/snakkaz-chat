import { Outlet } from "react-router-dom";
import { MainNav } from "./components/nav/MainNav";
import { UserNav } from "./components/nav/UserNav";
import { useAuth } from "./hooks/useAuth";

const Layout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-cyberdark-950 flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-cyberdark-800 bg-cyberdark-900/95 backdrop-blur supports-[backdrop-filter]:bg-cyberdark-900/75">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/snakkaz-logo.png"
              alt="Snakkaz Logo"
              className="h-8 w-auto"
            />
            <MainNav />
          </div>

          {user && <UserNav />}
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-cyberdark-800 bg-cyberdark-900 py-4">
        <div className="container text-center text-xs text-cyberdark-400">
          © {new Date().getFullYear()} Snakkaz — Sikker kommunikasjon
        </div>
      </footer>
    </div>
  );
};

export default Layout;
