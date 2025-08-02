'use client';

import AppHeader from '@/components/AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Briefcase, FileText, GanttChartSquare, MessageSquare, TrendingUp, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import { SidebarProvider } from '@/components/ui/sidebar';
import MarketInsights from '@/components/MarketInsights';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const features = [
    {
      title: 'AI Resume Tools',
      description: 'Generate, score, and get feedback on your resume.',
      href: '/preview',
      icon: <Bot className="h-10 w-10 text-primary" />,
    },
    {
      title: 'Mock Interview',
      description: 'Practice with an AI coach and get real-time feedback.',
      href: '/interview',
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
    },
     {
      title: 'Manage Templates',
      description: 'Switch between resume designs to find the perfect fit.',
      href: '/preview',
      icon: <GanttChartSquare className="h-10 w-10 text-primary" />,
    },
     {
      title: 'Market Insights',
      description: 'Analyze job market trends and salary benchmarks.',
      href: '#market-insights',
      icon: <TrendingUp className="h-10 w-10 text-primary" />,
    },
  ];

  return (
    <SidebarProvider>
        <div className="flex flex-col min-h-screen bg-muted/40">
        <AppHeader auth={true} />
        <main className="flex-1 p-4 md:p-8">
            
            <div className="bg-card p-6 rounded-lg shadow-sm mb-8 border border-primary/10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-heading text-3xl font-bold tracking-tight">Welcome Back!</h1>
                  <p className="text-muted-foreground mt-1">Here's your command center for career success.</p>
                </div>
                 <Button asChild>
                  <Link href="/profile">
                    Edit Profile <User className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              <div className="lg:col-span-2" id="market-insights">
                 <MarketInsights />
              </div>
            </div>

            <div className="mt-12">
              <h2 className="font-heading text-2xl font-bold tracking-tight mb-4">Your Career Toolkit</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                    <Link href={feature.href} key={index} className="flex group">
                        <Card className="h-full w-full hover:bg-card/80 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
                            <CardHeader className="items-center text-center">
                                <div className="p-4 bg-primary/10 rounded-full mb-4">
                                  {feature.icon}
                                </div>
                                <CardTitle className="text-lg font-medium font-heading">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </CardContent>
                             <div className="p-4 text-center text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Open Tool <ArrowRight className="inline-block h-4 w-4 ml-1" />
                            </div>
                        </Card>
                    </Link>
                ))}
              </div>
            </div>
        </main>
        </div>
    </SidebarProvider>
  );
}
