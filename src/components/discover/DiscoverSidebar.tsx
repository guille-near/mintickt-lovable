import { Home, Search, CalendarDays, MapPin, Tags } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

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
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Discover</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                  >
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}