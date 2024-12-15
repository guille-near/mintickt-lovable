import { DiscoverSidebar } from "@/components/discover/DiscoverSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DiscoverEvents() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DiscoverSidebar />
        <main className="flex-1 p-6">
          <SidebarTrigger className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-background/80 backdrop-blur-sm border-r h-12 w-6 rounded-r-lg flex items-center justify-center hover:bg-accent" />
          <h1>Discover Events</h1>
        </main>
      </div>
    </SidebarProvider>
  );
}