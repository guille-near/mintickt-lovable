import Footer from "./Footer"
import { DiscoverSidebar } from "./discover/DiscoverSidebar"
import { SidebarTrigger } from "./ui/sidebar"

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full">
      <DiscoverSidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-center w-10 h-10">
            <SidebarTrigger />
          </div>
        </div>
        <main className="flex-1 container mx-auto py-6">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AuthenticatedLayout;