import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { Home, Plus, User } from "lucide-react"
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ThemeToggle } from "@/components/ThemeToggle"

const navigationItems = [
  {
    title: "All Events",
    icon: Home,
    url: "/discover",
  },
]

export function DiscoverSidebar() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { state } = useSidebar();

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <div className="flex h-[57px] items-center px-4">
          <img 
            src="/Logo.svg" 
            alt="NFT Tickets Logo" 
            className="cursor-pointer dark:invert transition-all duration-200 w-8 h-8 min-w-[32px] min-h-[32px]" 
            onClick={() => navigate('/discover')} 
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Discover</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        onClick={() => navigate(item.url)}
                        className="w-full flex items-center gap-2"
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {state === "collapsed" && (
                      <TooltipContent side="right" sideOffset={10}>
                        {item.title}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      onClick={() => navigate('/create')}
                      className="w-full flex items-center gap-2"
                    >
                      <Plus className="h-5 w-5 shrink-0" />
                      <span>Create Event</span>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  {state === "collapsed" && (
                    <TooltipContent side="right" sideOffset={10}>
                      Create Event
                    </TooltipContent>
                  )}
                </Tooltip>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className={`mt-auto px-4 py-2 ${state === "collapsed" ? "hidden" : ""}`}>
          <ThemeToggle />
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none w-full p-4 flex group-data-[collapsible=icon]:justify-center">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </button>
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
      </SidebarFooter>
    </Sidebar>
  );
}