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
  useSidebar,
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
  const { state } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <img 
          src="/Logo.svg" 
          alt="NFT Tickets Logo" 
          className={`h-8 cursor-pointer dark:invert transition-all duration-200 ${
            state === "collapsed" ? "mx-auto w-8" : "w-auto mx-auto"
          }`}
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
                    tooltip={state === "collapsed" ? item.title : undefined}
                    onClick={() => navigate(item.url)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={state === "collapsed" ? "Create Event" : undefined}
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