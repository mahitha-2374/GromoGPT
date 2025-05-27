"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';
import { NAV_ITEMS, type NavItem } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'; // Keep this import

interface SidebarNavProps {
  isCollapsed: boolean;
}

const SidebarNav: FC<SidebarNavProps> = ({ isCollapsed }) => {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {NAV_ITEMS.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  aria-label={item.title}
                  className={cn(
                    "w-full justify-start",
                    isCollapsed && "justify-center" 
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className={cn(isCollapsed ? "sr-only" : "ml-2 delay-150 duration-150")}>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" align="center">
                {item.label || item.title}
              </TooltipContent>
            )}
          </Tooltip>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default SidebarNav;
