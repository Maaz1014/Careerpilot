'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResumeStore } from '@/lib/store';
import { ResumeData, resumeSchema } from '@/lib/types';

import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { PersonalInfoForm } from '@/components/forms/PersonalInfoForm';
import { EducationForm } from '@/components/forms/EducationForm';
import { ExperienceForm } from '@/components/forms/ExperienceForm';
import { SkillsForm } from '@/components/forms/SkillsForm';
import { CertificationsForm } from '@/components/forms/CertificationsForm';
import { ProjectsForm } from '@/components/forms/ProjectsForm';
import { CareerGoalsForm } from '@/components/forms/CareerGoalsForm';
import { Bot, User, GraduationCap, Briefcase, Star, Award, Target, FolderGit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { AppLogo } from '@/components/AppLogo';
import React from 'react';
import { useRouter } from 'next/navigation';


export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: storeData, setData } = useResumeStore();
  const [activeSection, setActiveSection] = React.useState('personal');

  const methods = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      personalInfo: storeData.personalInfo || { name: '', email: '', phone: '', location: '', linkedin: '', github: '' },
      education: storeData.education || [],
      experience: storeData.experience || [],
      skills: storeData.skills || [],
      certifications: storeData.certifications || [],
      projects: storeData.projects || [],
      desiredJobRoles: storeData.desiredJobRoles || '',
    },
  });

  const { handleSubmit, watch } = methods;

  React.useEffect(() => {
    const subscription = watch((value) => {
      setData(value as ResumeData);
    });
    return () => subscription.unsubscribe();
  }, [watch, setData]);

  const onSubmit = (formData: ResumeData) => {
    setData(formData);
    toast({
      title: "Profile Saved!",
      description: "Redirecting to generate your resume...",
    });
    router.push('/preview');
  };

  const formSections = [
    { value: 'personal', label: 'Personal Info', icon: <User />, component: <PersonalInfoForm /> },
    { value: 'experience', label: 'Experience', icon: <Briefcase />, component: <ExperienceForm /> },
    { value: 'education', label: 'Education', icon: <GraduationCap />, component: <EducationForm /> },
    { value: 'skills', label: 'Skills', icon: <Star />, component: <SkillsForm /> },
    { value: 'projects', label: 'Projects', icon: <FolderGit2 />, component: <ProjectsForm /> },
    { value: 'certifications', label: 'Certifications', icon: <Award />, component: <CertificationsForm /> },
    { value: 'goals', label: 'Career Goals', icon: <Target />, component: <CareerGoalsForm /> },
  ];

  const CurrentForm = formSections.find(s => s.value === activeSection)?.component;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/40">
        <Sidebar>
          <SidebarHeader>
            <AppLogo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {formSections.map(section => (
                <SidebarMenuItem key={section.value}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(section.value)}
                    isActive={activeSection === section.value}
                  >
                    {section.icon}
                    <span>{section.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
           <SidebarFooter>
              <Button size="lg" onClick={handleSubmit(onSubmit)} className="w-full">
                Generate Resume
                <Bot className="w-5 h-5 ml-2" />
              </Button>
            </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col flex-1">
          <AppHeader auth={true} />
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            <div className="mb-8">
              <h1 className="font-heading text-3xl font-bold tracking-tight">Build Your Profile</h1>
              <p className="text-muted-foreground mt-1">
                  Fill in your details. This information will be used by our AI to craft the perfect resume.
              </p>
            </div>
            
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {CurrentForm}
                 <div className="mt-8 flex justify-end md:hidden">
                    <Button size="lg" type="submit">
                        Generate Resume
                        <Bot className="w-5 h-5 ml-2" />
                    </Button>
                </div>
              </form>
            </FormProvider>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
