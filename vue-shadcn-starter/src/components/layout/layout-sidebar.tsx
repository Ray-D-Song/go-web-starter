import type { FunctionalComponent } from 'vue'
import { defineComponent } from 'vue'
import { LayoutDashboard } from '@lucide/vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export interface LayoutMenuItem {
  title: string
  icon: FunctionalComponent
}

export default defineComponent(
  (props) => {
    return () => (
      <Sidebar>
        <SidebarHeader class="h-14 justify-center border-b px-4 py-0">
          <div class="flex items-center gap-2">
            <div class="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <LayoutDashboard class="size-4" />
            </div>
            <div>
              <p class="text-sm font-semibold">Vue Admin</p>
              <p class="text-xs text-muted-foreground">shadcn-vue starter</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>后台管理</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {props.menu.map((item) => {
                  const Icon = item.icon

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton isActive={props.activeMenu === item.title}>
                        <Icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter class="border-t p-3">
          <div class="flex items-center gap-3">
            <Avatar class="size-8">
              <AvatarFallback>管</AvatarFallback>
            </Avatar>
            <div class="min-w-0">
              <p class="truncate text-sm font-medium">管理员</p>
              <p class="truncate text-xs text-muted-foreground">admin@example.com</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    )
  },
  {
    name: 'LayoutSidebar',
    props: {
      activeMenu: {
        type: String,
        required: true,
      },
      menu: {
        type: Array as () => LayoutMenuItem[],
        required: true,
      },
    },
  },
)
