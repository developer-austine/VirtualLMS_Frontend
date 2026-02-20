import type { ReactNode } from "react";
import TopBar from "./TopBar";
import Navbar from "./Navbar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Navbar />
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
};

export default MainLayout;