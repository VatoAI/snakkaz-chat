import { Outlet } from 'react-router-dom';
import { MainNav } from './components/MainNav';
import { UserNav } from './components/UserNav';
import { useAuth } from './hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function Layout() {
  const { user, loading } = useAuth();
  
  // If not loading and no user, redirect to login
  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
          <UserNav />
        </div>
      </header>
      <main className="flex-1 container py-6">
        <Outlet />
      </main>
      <footer className="border-t py-4">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} Snakkaz. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="/info">About</a>
            <a href="/info#privacy">Privacy</a>
            <a href="/info#terms">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}