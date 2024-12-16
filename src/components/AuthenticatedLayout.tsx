import Footer from "./Footer"
import { DiscoverSidebar } from "./discover/DiscoverSidebar"
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar"
import { Button } from "./ui/button"

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DiscoverSidebar />
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
            <Button variant="ghost" size="icon">
              <div className="flex items-center justify-center">
                <SidebarTrigger />
              </div>
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