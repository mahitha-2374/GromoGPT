"use client";

import type { FC, ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import SidebarNav from './SidebarNav';
import { APP_NAME } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, Settings } from 'lucide-react';
import Link from 'next/link';

interface AppLayoutProps {
  children: ReactNode;
}

const GroMoLogo: FC<{ collapsed: boolean }> = ({ collapsed }) => (
  <Link href="/" className="flex items-center gap-2 px-2">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-8 w-8 text-primary">
      <rect width="256" height="256" fill="none"/>
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" fill="currentColor"/>
      <path d="M128,56a72,72,0,1,0,72,72A72.08,72.08,0,0,0,128,56Zm0,128a56,56,0,1,1,56-56A56.06,56.06,0,0,1,128,184Z" opacity="0.3" fill="currentColor"/>
      <path d="M168,100H148.44A40,40,0,0,0,80,117.33V144h24V117.33A16,16,0,0,1,120,100h48Z" fill="currentColor" opacity="0.6"/>
    </svg>
    {!collapsed && <span className="font-bold text-lg">{APP_NAME}</span>}
  </Link>
);


const UserProfile: FC<{ collapsed: boolean }> = ({ collapsed }) => (
  <div className="flex items-center gap-2 p-2">
    <Avatar className="h-8 w-8">
      <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user avatar" />
      <AvatarFallback>GP</AvatarFallback>
    </Avatar>
    {!collapsed && (
      <div className="flex flex-col">
        <span className="text-sm font-medium">GroMo Partner</span>
        <span className="text-xs text-muted-foreground">partner@gromo.com</span>
      </div>
    )}
  </div>
);

const AppLayoutClient: FC<AppLayoutProps> = ({ children }) => {
  const { state, open } = useSidebar(); // Using state to check if sidebar is expanded or collapsed
  const isCollapsed = state === "collapsed" || !open;

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar collapsible="icon" variant="sidebar" className="border-r">
        <SidebarHeader className="py-4">
           <GroMoLogo collapsed={isCollapsed} />
        </SidebarHeader>
        <SidebarContent className="flex-1 overflow-y-auto p-2">
          <SidebarNav isCollapsed={isCollapsed} />
        </SidebarContent>
        <SidebarFooter className="p-2 border-t">
          <UserProfile collapsed={isCollapsed} />
           {!isCollapsed && (
            <>
              <Button variant="ghost" className="w-full justify-start mt-2">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive-foreground hover:bg-destructive/90">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
           )}
           {isCollapsed && (
             <>
              <Button variant="ghost" size="icon" className="w-full mt-2">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
              <Button variant="ghost" size="icon" className="w-full text-destructive hover:text-destructive-foreground hover:bg-destructive/90">
                <LogOut className="h-4 w-4" />
                 <span className="sr-only">Logout</span>
              </Button>
             </>
           )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
          <SidebarTrigger className="md:hidden" /> {/* Only on mobile, handled by sidebar component */}
          <div /> {/* Placeholder for potential breadcrumbs or actions */}
          {/* Right side elements like search or notifications can go here */}
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </div>
  );
};


const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider defaultOpen={true}>
       <AppLayoutClient>{children}</AppLayoutClient>
    </SidebarProvider>
  );
};

export default AppLayout;
