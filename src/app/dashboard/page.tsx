'use client';

import AppHeader from '@/components/AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Briefcase, FileText, GanttChartSquare, MessageSquare, TrendingUp, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import { SidebarProvider } from '@/components/ui/sidebar';
import MarketInsights from '@/components/MarketInsights';
import MagicBento from '@/components/MagicBento';
import { Button } from '@/components/ui/button';

  return (
    <SidebarProvider>
        <div className="flex flex-col min-h-screen bg-muted/40">
        <AppHeader auth={true} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            
            <div className="bg-card p-4 md:p-6 rounded-lg shadow-sm mb-6 md:mb-8 border border-primary/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">Welcome Back!</h1>
                  <p className="text-muted-foreground mt-1">Here's your command center for career success.</p>
                </div>
                 <Button asChild className="w-full sm:w-auto">
                  <Link href="/profile">
                    Edit Profile <User className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:gap-8">
              <div id="market-insights">
                 <MarketInsights />
              </div>
            </div>

            <div className="mt-8 md:mt-12">
              <MagicBento />
            </div>
        </main>
        </div>
    </SidebarProvider>
  );
}
