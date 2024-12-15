import Footer from "./Footer";
import { DiscoverSidebar } from "./discover/DiscoverSidebar";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DiscoverSidebar />
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b">
            <Button variant="ghost" size="icon">
              <SidebarTrigger>
                <ChevronLeft className="h-4 w-4" />
              </SidebarTrigger>
            </Button>
          </div>
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