'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Bot, FileDown, ArrowRight, ScanSearch, FilePlus2, Sparkles, Download, GanttChartSquare, Star } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import { AppLogo } from '@/components/AppLogo';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import React, { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useGsap from '@/hooks/use-gsap';
import gsap from 'gsap';

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const textVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

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


export default function LandingPage() {
  const features = [
    {
      icon: <Bot className="w-10 h-10 text-primary" />,
      title: 'AI Resume Tools',
      description: 'Leverage our Gemini-powered AI to score your resume, generate cover letters, and analyze skill gaps.',
    },
    {
      icon: <GanttChartSquare className="w-10 h-10 text-primary" />,
      title: 'Dynamic Templates',
      description: 'Choose from modern and classic resume templates. Switch between them with a single click.',
    },
    {
      icon: <FileDown className="w-10 h-10 text-primary" />,
      title: 'Easy PDF Export',
      description: 'Download your polished resume as a high-quality, print-ready PDF to send to recruiters.',
    },
     {
      icon: <Briefcase className="w-10 h-10 text-primary" />,
      title: 'Track Everything',
      description: 'Keep your professional journey organized. Input and manage your experience, education, and projects.',
    },
  ];

  const howItWorksSteps = [
    {
      icon: <FilePlus2 className="w-10 h-10 text-primary" />,
      title: '1. Build Your Profile',
      description: 'Easily input your personal details, work experience, education, and skills into our intuitive editor.',
    },
    {
      icon: <Sparkles className="w-10 h-10 text-primary" />,
      title: '2. Leverage AI Magic',
      description: 'Use our AI to score your resume, get skill suggestions, and generate a tailored cover letter in seconds.',
    },
    {
      icon: <ScanSearch className="w-10 h-10 text-primary" />,
      title: '3. Choose & Preview',
      description: 'Select from professionally designed templates and see an instant preview of your final resume.',
    },
    {
      icon: <Download className="w-10 h-10 text-primary" />,
      title: '4. Download & Apply',
      description: 'Export your masterpiece as a print-ready PDF and start applying to your dream jobs with confidence.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah L.',
      role: 'UX Designer',
      avatar: 'https://placehold.co/100x100.png',
      hint: 'woman professional',
      quote: "CareerPilot's AI resume scorer gave me the exact feedback I needed to land my dream job. The difference was night and day!",
    },
    {
      name: 'Michael B.',
      role: 'Software Engineer',
      avatar: 'https://placehold.co/100x100.png',
      hint: 'man software engineer',
      quote: "The cover letter generator is a lifesaver. It creates tailored, professional letters in seconds. I've saved so much time.",
    },
    {
      name: 'Jessica P.',
      role: 'Product Manager',
      avatar: 'https://placehold.co/100x100.png',
      hint: 'woman product manager',
      quote: "The skill-gap analysis is brilliant. It showed me exactly what skills to focus on to move into a senior role. Highly recommended!",
    },
  ];

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scrollYProgressHero } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroTextY = useTransform(scrollYProgressHero, [0, 1], ['0%', '50%']);
  const heroTextOpacity = useTransform(scrollYProgressHero, [0, 0.8], [1, 0]);

  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scrollYProgressGrid } = useScroll({
    target: gridRef,
    offset: ['start end', 'end start']
  });

  const rotateX = useTransform(scrollYProgressGrid, [0, 1], [15, -15]);
  const rotateZ = useTransform(scrollYProgressGrid, [0, 1], [-5, 5]);
  const scale = useTransform(scrollYProgressGrid, [0, 0.6], [0.8, 1]);
  const gridOpacity = useTransform(scrollYProgressGrid, [0, 0.4], [0, 1]);
  const springConfig = { stiffness: 100, damping: 20, mass: 1 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateZ = useSpring(rotateZ, springConfig);
  const smoothScale = useSpring(scale, springConfig);

  const howItWorksRef = useRef<HTMLDivElement>(null);
  useGsap(howItWorksRef, () => {
    gsap.fromTo(
      '.how-it-works-item',
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: howItWorksRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="flex-1 overflow-x-hidden">
        <section ref={heroRef} className="w-full py-20 md:py-32 lg:py-40 xl:py-48 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
           <motion.div
            className="container px-4 md:px-6 text-center"
            style={{ y: heroTextY, opacity: heroTextOpacity }}
          >
            <motion.div
              className="max-w-3xl mx-auto space-y-4"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.h1 variants={textVariants} className="font-heading text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Your AI Copilot for Career Success
              </motion.h1>
              <motion.p variants={textVariants} className="text-lg text-muted-foreground md:text-xl">
                Build a winning resume, identify skill gaps, and navigate your career path with CareerPilot. Let our AI guide you to your next opportunity.
              </motion.p>
              <motion.div variants={textVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/auth/sign-up">
                    Get Started for Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                   <Link href="/auth/sign-in">Login</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden" ref={gridRef}>
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
           <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={textVariants}
              transition={{duration: 0.5}}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="font-heading text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Get Hired</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From intelligent resume creation to personalized career advice, CareerPilot is your all-in-one platform for professional growth.
                </p>
              </div>
            </motion.div>
             <motion.div
              style={{
                opacity: gridOpacity,
                scale: smoothScale,
                rotateX: smoothRotateX,
                rotateZ: smoothRotateZ,
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 [transform-style:preserve-3d]"
            >
              {features.map((feature, index) => (
                <motion.div key={index}
                 variants={cardVariants}
                 initial="hidden"
                 whileInView="visible"
                 viewport={{ once: true, amount: 0.5 }}
                 whileHover={{ scale: 1.05, y: -10, boxShadow: "0px 20px 30px hsla(var(--primary) / 0.1)" }}
                 className="[transform-style:preserve-3d]"
                >
                  <Card className="h-full bg-card/60 dark:bg-card/40 backdrop-blur-sm border-primary/10 overflow-hidden text-center">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                            {feature.icon}
                        </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="font-heading text-xl mb-2">{feature.title}</CardTitle>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900/50" ref={howItWorksRef}>
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={textVariants}
              transition={{duration: 0.5}}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">How It Works</div>
                <h2 className="font-heading text-3xl font-bold tracking-tighter sm:text-5xl">A Few Clicks to a Perfect Resume</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our streamlined process makes resume building a breeze. Follow these simple steps.
                </p>
              </div>
            </motion.div>
            <div
              className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4 mt-12"
            >
              {howItWorksSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center gap-4 how-it-works-item">
                  <div className="bg-primary/10 p-4 rounded-full transition-transform duration-300 hover:scale-110 hover:bg-primary/20">
                    {step.icon}
                  </div>
                  <h3 className="font-heading text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={textVariants}
              transition={{duration: 0.5}}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">What Our Users Say</div>
                <h2 className="font-heading text-3xl font-bold tracking-tighter sm:text-5xl">Trusted by Professionals Worldwide</h2>
                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from real users who have supercharged their careers with CareerPilot.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={containerVariants}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div key={index} variants={cardVariants}>
                  <Card className="h-full bg-card/60 dark:bg-card/40 backdrop-blur-sm border-border/50">
                    <CardContent className="p-6">
                       <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.hint} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                        </div>
                         <div className="flex text-yellow-400">
                          <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                        </div>
                      </div>
                      <blockquote className="mt-4 text-sm text-muted-foreground italic">
                        &ldquo;{testimonial.quote}&rdquo;
                      </blockquote>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>


        <section id="cta" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center bg-primary/5 dark:bg-primary/10 p-8 md:p-12 rounded-2xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={textVariants}
            >
              <h2 className="font-heading text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Land Your Dream Job?</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Stop guessing and start getting results. Let CareerPilot's AI build a resume that gets you noticed. It's free to get started.
              </p>
              <Button asChild size="lg">
                  <Link href="/auth/sign-up">
                    Build My Resume Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
            </motion.div>
          </div>
        </section>

      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <div className="flex items-center">
         <AppLogo />
        </div>
        <p className="text-xs text-muted-foreground sm:ml-auto">&copy; {new Date().getFullYear()} CareerPilot. All rights reserved.</p>
        <nav className="sm:ml-4 flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
