import Footer from "./Footer"
import { DiscoverSidebar } from "./discover/DiscoverSidebar"
import { SidebarTrigger } from "./ui/sidebar"

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  return (
    <div className="flex-1 flex">
      <DiscoverSidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10 flex items-center">
          <SidebarTrigger />
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