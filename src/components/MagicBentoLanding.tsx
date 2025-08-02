'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bot, 
  MessageSquare, 
  GanttChartSquare, 
  FileText, 
  Briefcase, 
  Sparkles, 
  ArrowRight,
  Target,
  Users,
  FileDown
} from 'lucide-react';
import Link from 'next/link';

interface BentoItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  className: string;
  gradient: string;
  delay: number;
}

const bentoItems: BentoItem[] = [
  {
    id: 'ai-resume',
    title: 'AI Resume Tools',
    description: 'Generate, score, and get feedback on your resume with our Gemini-powered AI.',
    href: '/preview',
    icon: <Bot className="h-8 w-8" />,
    className: 'col-span-1 row-span-1',
    gradient: 'from-blue-500/20 to-purple-500/20',
    delay: 0.1
  },
  {
    id: 'mock-interview',
    title: 'Mock Interview',
    description: 'Practice with an AI coach and get real-time feedback on your responses.',
    href: '/interview',
    icon: <MessageSquare className="h-8 w-8" />,
    className: 'col-span-1 row-span-1',
    gradient: 'from-green-500/20 to-emerald-500/20',
    delay: 0.2
  },
  {
    id: 'templates',
    title: 'Dynamic Templates',
    description: 'Choose from modern and classic designs. Switch between them with a single click.',
    href: '/preview',
    icon: <GanttChartSquare className="h-8 w-8" />,
    className: 'col-span-2 row-span-1',
    gradient: 'from-orange-500/20 to-red-500/20',
    delay: 0.3
  },
  {
    id: 'skill-gap',
    title: 'Skill Gap Analysis',
    description: 'Identify missing skills and get personalized learning recommendations.',
    href: '/preview',
    icon: <Target className="h-8 w-8" />,
    className: 'col-span-1 row-span-2',
    gradient: 'from-indigo-500/20 to-blue-500/20',
    delay: 0.4
  },
  {
    id: 'cover-letter',
    title: 'Cover Letter Generator',
    description: 'Create compelling cover letters tailored to specific job descriptions.',
    href: '/preview',
    icon: <FileText className="h-8 w-8" />,
    className: 'col-span-1 row-span-1',
    gradient: 'from-teal-500/20 to-cyan-500/20',
    delay: 0.5
  },
  {
    id: 'career-path',
    title: 'Career Path Recommender',
    description: 'Get AI-powered suggestions for your next career move.',
    href: '/preview',
    icon: <Briefcase className="h-8 w-8" />,
    className: 'col-span-1 row-span-1',
    gradient: 'from-yellow-500/20 to-orange-500/20',
    delay: 0.6
  },
  {
    id: 'ai-coach',
    title: 'AI Career Coach',
    description: 'Get personalized advice and guidance for your career journey.',
    href: '/interview',
    icon: <Users className="h-8 w-8" />,
    className: 'col-span-2 row-span-1',
    gradient: 'from-pink-500/20 to-rose-500/20',
    delay: 0.7
  },
  {
    id: 'pdf-export',
    title: 'Easy PDF Export',
    description: 'Download your polished resume as a high-quality, print-ready PDF.',
    href: '/preview',
    icon: <FileDown className="h-8 w-8" />,
    className: 'col-span-1 row-span-1',
    gradient: 'from-violet-500/20 to-purple-500/20',
    delay: 0.8
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function MagicBentoLanding() {
  return (
    <div className="w-full">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px]"
      >
        {bentoItems.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            transition={{ delay: item.delay }}
            className={item.className}
          >
            <Link href={item.href} className="block h-full">
              <Card className="h-full group relative overflow-hidden border-0 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative z-10 h-full flex flex-col justify-between p-6">
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                      {item.icon}
                    </div>
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="opacity-0 group-hover:opacity-100"
                    >
                      <ArrowRight className="h-5 w-5 text-primary" />
                    </motion.div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <CardTitle className="text-lg md:text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 opacity-0 group-hover:opacity-100"
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary hover:text-primary/80 p-0 h-auto"
                    >
                      Explore <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
} 