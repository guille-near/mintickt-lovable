import { Header } from "./Header";
import Footer from "./Footer";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AuthenticatedLayout;