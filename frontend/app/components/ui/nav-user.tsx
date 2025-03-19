'use client';

import {
  BadgeCheck,
  ChevronsUpDown,
  LogIn,
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/shadcn/sidebar"
import { UserInfo } from "../../types/user_info"
import { signout } from "@/utils/supabase/signout"
import { useRouter } from "next/navigation";
import { checkLogin } from "@/utils/supabase/checkLogin";
import { useEffect, useState } from "react";

export function NavUser({ email, avatar, username }: UserInfo) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    const fetchLogin = async () => {
      const login = await checkLogin();
      setIsLogin(login);
    }
    fetchLogin();
  }, []);

  const handleLogout = async () => {
    const result = await signout();
    if (!result) {
      return;
    }
    setIsLogin(false);
    router.push('/login?msg=logout');
  };
  const handleLogin = () => {
    router.push('/login');
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatar} alt={username} />
                <AvatarFallback className="rounded-lg">{username}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{username}</span>
                <span className="truncate text-xs">{email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatar} alt={username} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{username}</span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push('/home/profile')}>
                <BadgeCheck className="mr-2 h-4 w-4" />
                プロファイル設定
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {isLogin && (<>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut/>
                Log out
              </DropdownMenuItem>
              </>
            )}
            {!isLogin && (<>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleLogin}>
                  <LogIn />
                  Login
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
