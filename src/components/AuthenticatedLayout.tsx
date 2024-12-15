import Footer from "./Footer";
import { DiscoverSidebar } from "./discover/DiscoverSidebar";
import { SidebarProvider } from "./ui/sidebar";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DiscoverSidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AuthenticatedLayout;