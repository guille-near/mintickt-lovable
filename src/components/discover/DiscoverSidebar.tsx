import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Home, Search, CalendarDays, MapPin, Tags, Plus, User } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navigationItems = [
  {
    title: "All Events",
    icon: Home,
    url: "/discover",
  },
  {
    title: "Search",
    icon: Search,
    url: "/discover/search",
  },
  {
    title: "Upcoming",
    icon: CalendarDays,
    url: "/discover/upcoming",
  },
  {
    title: "Near Me",
    icon: MapPin,
    url: "/discover/nearby",
  },
  {
    title: "Categories",
    icon: Tags,
    url: "/discover/categories",
  },
]

export function DiscoverSidebar() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="relative border-b p-4">
        <SidebarTrigger className="absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-background/80 backdrop-blur-sm border-r h-12 w-6 rounded-r-lg flex items-center justify-center hover:bg-accent" />
        <img 
          src="/Logo.svg" 
          alt="NFT Tickets Logo" 
          className="h-8 cursor-pointer dark:invert mx-auto group-data-[collapsible=icon]:mx-0" 
          onClick={() => navigate('/discover')} 
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Discover</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => navigate(item.url)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Create Event"
                  onClick={() => navigate('/create')}
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Event</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar>
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/account')}>
                <User className="mr-2 h-4 w-4" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}