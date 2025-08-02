'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/AppLogo';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Bot, LayoutDashboard } from 'lucide-react';
import { DarkModeToggle } from './DarkModeToggle';
import { SidebarTrigger } from './ui/sidebar';
import { useAuth } from '@/hooks/use-auth';

const AppHeader = ({ auth: showAuthNav = false }: { auth?: boolean }) => {
  const { user, signOut } = useAuth();
  const auth = user || showAuthNav;

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#testimonials', label: 'Testimonials' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-14 items-center px-4 md:px-6 lg:px-8">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <AppLogo />
          </Link>
          {!auth && (
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground/80 text-foreground/60">
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center pl-6">
              <AppLogo />
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10">
                {!auth && (
                <div className="flex flex-col space-y-3 pl-6">
                    {navLinks.map(link => (
                    <Link key={link.href} href={link.href} className="text-muted-foreground">
                        {link.label}
                    </Link>
                    ))}
                </div>
                )}
            </div>
             <div className="pl-6">
                <DarkModeToggle />
              </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
         <div className="hidden md:flex items-center gap-2">
            {auth && <SidebarTrigger />}
            <DarkModeToggle />
          </div>
          {!user ? (
            <nav className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/sign-in">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/sign-up">Sign Up</Link>
              </Button>
            </nav>
          ) : (
             <nav className="flex items-center gap-1 md:gap-2">
                <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
                    <Link href="/dashboard"><LayoutDashboard className="w-4 h-4 mr-2" />Dashboard</Link>
                </Button>
                <Button asChild size="sm" className="hidden sm:flex">
                  <Link href="/preview">Preview Resume <Bot className="w-4 h-4 ml-2" /></Link>
                </Button>
                 <Button asChild variant="outline" size="sm" onClick={signOut}>
                    <Link href="/">Logout</Link>
                </Button>
              </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
