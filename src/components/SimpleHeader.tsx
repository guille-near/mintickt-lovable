import { Link } from "react-router-dom";
import { WalletButton } from "./WalletButton";
import { ThemeToggle } from "./ThemeToggle";

export const SimpleHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <img src="/Logo.svg" alt="Logo" className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Lovable Events
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none" />
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            <WalletButton />
          </nav>
        </div>
      </div>
    </header>
  );
};