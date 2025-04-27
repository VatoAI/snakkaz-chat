
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen bg-cyberdark-950">
      <Outlet />
    </div>
  );
};

export default Layout;
