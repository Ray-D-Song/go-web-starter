import { defineComponent, h } from 'vue'
import { Bell, Search, Settings } from '@lucide/vue'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useTheme } from '@/use/use-theme'

interface SelectOption {
  label: string
  value: string
}

export default defineComponent(
  (props) => {
    const theme = useTheme()

    function renderSettingSelect(
      label: string,
      value: string,
      options: SelectOption[],
      onChange: (value: string) => void,
    ) {
      return (
        <div class="space-y-2">
          <div class="text-sm font-medium">{label}</div>
          {h(Select as any, {
            modelValue: value,
            'onUpdate:modelValue': onChange,
          }, {
            default: () => (
              <>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder={label} />
                </SelectTrigger>
                <SelectContent>
                  {options.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </>
            ),
          })}
        </div>
      )
    }

    return () => (
      <header class="flex h-14 items-center gap-3 border-b px-4">
        <SidebarTrigger />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>{props.activeMenu}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div class="ml-auto flex items-center gap-2">
          <div class="relative hidden sm:block">
            <Search class="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            {h(Input as any, { class: 'w-64 pl-8', placeholder: '搜索订单、用户或商品' })}
          </div>
          <Button variant="outline" size="icon" aria-label="通知">
            <Bell class="size-4" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="设置">
                <Settings class="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>系统设置</SheetTitle>
              </SheetHeader>
              <div class="space-y-5 px-4">
                {renderSettingSelect(
                  'Style',
                  theme.style.value,
                  theme.styles.map(style => ({ label: style.title, value: style.name })),
                  value => {
                    theme.style.value = value as typeof theme.style.value
                  },
                )}
                {renderSettingSelect(
                  'Base Color',
                  theme.baseColor.value,
                  theme.baseColors.map(baseColor => ({ label: baseColor.title ?? baseColor.name, value: baseColor.name })),
                  value => {
                    theme.baseColor.value = value as typeof theme.baseColor.value
                  },
                )}
                {renderSettingSelect(
                  'Theme',
                  theme.theme.value,
                  theme.availableThemes.value.map(item => ({ label: item.title ?? item.name, value: item.name })),
                  value => {
                    theme.theme.value = value as typeof theme.theme.value
                  },
                )}
              </div>
            </SheetContent>
          </Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">管理员</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>账号</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>个人资料</DropdownMenuItem>
              <DropdownMenuItem>退出登录</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    )
  },
  {
    name: 'LayoutHeader',
    props: {
      activeMenu: {
        type: String,
        required: true,
      },
    },
  },
)
