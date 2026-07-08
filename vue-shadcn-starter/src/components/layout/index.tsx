import { defineComponent, h } from 'vue'
import type { LayoutMenuItem } from './layout-sidebar'
import LayoutHeader from './layout-header'
import LayoutSidebar from './layout-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default defineComponent(
  (props, { slots }) => {
    return () =>
      h(SidebarProvider, null, {
        default: () => (
          <>
            <LayoutSidebar menu={props.menu} activeMenu={props.activeMenu} />
            <SidebarInset>
              <LayoutHeader activeMenu={props.activeMenu} />
              <main class="flex-1 space-y-4 p-4">{slots.default?.()}</main>
            </SidebarInset>
          </>
        ),
      })
  },
  {
    name: 'AdminLayout',
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
