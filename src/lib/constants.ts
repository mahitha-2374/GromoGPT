import type { LucideIcon } from 'lucide-react';
import { Bot, LayoutDashboard, Lightbulb, MessageSquare, TrendingUp, Users } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    title: 'AI Learning Coach',
    href: '/learning-coach',
    icon: Lightbulb,
    label: 'Learning Coach',
  },
  {
    title: 'Smart Leads',
    href: '/lead-generation',
    icon: Users,
    label: 'Lead Generation',
  },
  {
    title: 'AI Sales Copilot',
    href: '/sales-copilot',
    icon: Bot,
    label: 'Sales Copilot',
  },
  {
    title: 'Post-Sale AI',
    href: '/post-sale-engagement',
    icon: MessageSquare,
    label: 'Post-Sale AI',
  },
  {
    title: 'Growth Plans',
    href: '/growth-plans',
    icon: TrendingUp,
    label: 'Growth Plans',
  },
];

export const APP_NAME = "GroMo AI Assist";
