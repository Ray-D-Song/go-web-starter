import { defineComponent, h, ref } from 'vue'
import {
  Bell,
  Boxes,
  ChartNoAxesColumn,
  LayoutDashboard,
  Search,
  Settings,
  Users,
} from '@lucide/vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const menu = [
  { title: '仪表盘', icon: LayoutDashboard },
  { title: '用户管理', icon: Users },
  { title: '商品管理', icon: Boxes },
  { title: '数据报表', icon: ChartNoAxesColumn },
  { title: '系统设置', icon: Settings },
]

const stats = [
  { title: '今日订单', value: '1,284', change: '+12.4%' },
  { title: '活跃用户', value: '8,492', change: '+6.8%' },
  { title: '待处理工单', value: '36', change: '-4' },
]

const orders = [
  { id: 'SO-1024', customer: '上海云帆科技', amount: '¥12,430', status: '已支付' },
  { id: 'SO-1025', customer: '杭州星河商贸', amount: '¥8,210', status: '处理中' },
  { id: 'SO-1026', customer: '成都青禾零售', amount: '¥3,980', status: '待审核' },
  { id: 'SO-1027', customer: '深圳北辰供应链', amount: '¥21,600', status: '已支付' },
]

export default defineComponent(
  () => {
    const activeMenu = ref('仪表盘')

    return () =>
      h(SidebarProvider, null, {
        default: () => (
          <>
            <Sidebar>
              <SidebarHeader class="border-b px-4 py-3">
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
                      {menu.map((item) => {
                        const Icon = item.icon

                        return (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                              isActive={activeMenu.value === item.title}
                            >
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

            <SidebarInset>
              <header class="flex h-14 items-center gap-3 border-b px-4">
                <SidebarTrigger />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbPage>{activeMenu.value}</BreadcrumbPage>
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

              <main class="flex-1 space-y-4 p-4">
                <section class="grid gap-4 md:grid-cols-3">
                  {stats.map((stat) => (
                    <Card key={stat.title}>
                      <CardHeader class="pb-2">
                        <CardTitle class="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div class="text-2xl font-semibold">{stat.value}</div>
                        <p class="text-xs text-muted-foreground">{stat.change} 较昨日</p>
                      </CardContent>
                    </Card>
                  ))}
                </section>

                <section class="rounded-lg border bg-card">
                  <div class="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 class="text-lg font-semibold">订单列表</h1>
                      <p class="text-sm text-muted-foreground">常用后台表格、筛选和分页组件示例</p>
                    </div>
                    <div class="flex gap-2">
                      <Select defaultValue="all">
                        <SelectTrigger class="w-32">
                          <SelectValue placeholder="状态" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部状态</SelectItem>
                          <SelectItem value="paid">已支付</SelectItem>
                          <SelectItem value="pending">待处理</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button>新建订单</Button>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>订单号</TableHead>
                        <TableHead>客户</TableHead>
                        <TableHead>金额</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead class="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell class="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{order.amount}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{order.status}</Badge>
                          </TableCell>
                          <TableCell class="text-right">
                            <Button variant="ghost" size="sm">
                              查看
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div class="border-t p-4">
                    <Pagination total={40} itemsPerPage={10} siblingCount={1} showEdges>
                      <PaginationContent>
                        <PaginationPrevious />
                        <PaginationNext />
                      </PaginationContent>
                    </Pagination>
                  </div>
                </section>
              </main>
            </SidebarInset>
          </>
        ),
      })
  },
  {
    name: 'App',
  },
)
