'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useResumeStore } from '@/lib/store';
import { generateResume } from '@/ai/flows/resume-generation';
import { suggestSkills } from '@/ai/flows/skill-gap-suggestions';
import { scoreResume } from '@/ai/flows/resume-scorer';
import { generateCoverLetter } from '@/ai/flows/cover-letter-generator';
import { ResumeData } from '@/lib/types';

import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, Download, Lightbulb, ArrowLeft, BrainCircuit, Gauge, ListChecks, FileText, ClipboardCopy, Palette, Route } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import TemplateModern from '@/components/resumes/TemplateModern';
import TemplateClassic from '@/components/resumes/TemplateClassic';
import { SidebarProvider } from '@/components/ui/sidebar';
import CareerPathRecommender from '@/components/CareerPathRecommender';


function ResumeSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                 <Skeleton className="h-4 w-full mt-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
             <div className="space-y-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    )
}

function ResumeScore() {
    const { toast } = useToast();
    const resumeData = useResumeStore((state) => state.data);
    const { resumeScore, setResumeScore } = useResumeStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleScoreResume = async () => {
        setIsLoading(true);
        setResumeScore(null);
        try {
            const result = await scoreResume(resumeData as ResumeData);
            setResumeScore(result);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to score resume. Please try again.',
            });
        }
        setIsLoading(false);
    };
    
    const getScoreColor = (score: number) => {
        if (score < 50) return '#ef4444'; // red-500
        if (score < 80) return '#f97316'; // orange-500
        return 'hsl(var(--primary))'; // green-500
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-heading flex items-center"><Gauge className="mr-2 h-6 w-6 text-primary" /> Resume Score</CardTitle>
                <CardDescription>Get an AI-powered score and feedback on your resume.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleScoreResume} disabled={isLoading} className="w-full">
                    {isLoading ? 'Scoring...' : 'Score My Resume'}
                </Button>

                {isLoading && (
                    <div className="mt-6 flex flex-col items-center">
                        <div className="w-40 h-40">
                            <Skeleton className="w-full h-full rounded-full" />
                        </div>
                        <Skeleton className="h-6 w-3/4 mt-4" />
                    </div>
                )}

                {resumeScore && (
                     <div className="mt-6 flex flex-col items-center text-center">
                        <div className="w-40 h-40">
                             <CircularProgressbar
                                value={resumeScore.score}
                                text={`${resumeScore.score}`}
                                styles={buildStyles({
                                    textSize: '20px',
                                    pathTransitionDuration: 0.5,
                                    pathColor: getScoreColor(resumeScore.score),
                                    textColor: getScoreColor(resumeScore.score),
                                    trailColor: 'hsl(var(--muted))',
                                })}
                            />
                        </div>
                        <p className="text-lg font-semibold mt-4">Your resume scores {resumeScore.score} out of 100.</p>
                        
                        <Accordion type="single" collapsible className="w-full mt-4 text-left">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="font-heading text-lg">
                                    <div className="flex items-center">
                                        <ListChecks className="mr-2 h-5 w-5" /> Actionable Feedback
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul className="list-disc pl-6 space-y-2 prose prose-sm dark:prose-invert max-w-none">
                                        {resumeScore.feedback.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}


function SkillSuggestions() {
    const { toast } = useToast();
    const resumeData = useResumeStore((state) => state.data);
    const { skillSuggestions, setSkillSuggestions } = useResumeStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleSuggestSkills = async () => {
        setIsLoading(true);
        setSkillSuggestions(null);
        try {
            const { personalInfo, education, experience, skills, certifications, projects, desiredJobRoles } = resumeData;
            
            if (!desiredJobRoles) {
                 toast({
                    variant: 'destructive',
                    title: 'Goal Required',
                    description: 'Please specify your desired job roles in your profile first.',
                });
                setIsLoading(false);
                return;
            }

            const input = {
                personalInfo: JSON.stringify(personalInfo),
                education: JSON.stringify(education),
                experience: JSON.stringify(experience),
                skills: JSON.stringify(skills),
                certifications: JSON.stringify(certifications || []),
                projects: JSON.stringify(projects || []),
                desiredJobRoles: desiredJobRoles,
            };

            const result = await suggestSkills(input);
            setSkillSuggestions(result);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to generate skill suggestions. Please try again.',
            });
        }
        setIsLoading(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-heading flex items-center"><BrainCircuit className="mr-2 h-6 w-6 text-primary" /> Skill Gap Analysis</CardTitle>
                <CardDescription>Discover skills to help you land your dream job. Based on your profile and career goals.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleSuggestSkills} disabled={isLoading} className="w-full">
                    {isLoading ? 'Analyzing...' : 'Suggest Skills'}
                    <Lightbulb className="ml-2 h-4 w-4" />
                </Button>

                {isLoading && (
                    <div className="mt-6 space-y-2">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                )}

                {skillSuggestions && (
                    <div className="mt-6">
                        <Accordion type="single" collapsible defaultValue="item-1">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="font-heading text-lg">Analysis & Reasoning</AccordionTrigger>
                                <AccordionContent className="text-base prose prose-sm dark:prose-invert max-w-none">
                                    <p>{skillSuggestions.reasoning}</p>
                                </AccordionContent>
                            AccordionItem>
                             <AccordionItem value="item-2">
                                <AccordionTrigger className="font-heading text-lg">Suggested Skills</AccordionTrigger>
                                <AccordionContent>
                                    <ul className="list-disc pl-6 space-y-2">
                                        {skillSuggestions.suggestedSkills.map((skill, index) => (
                                            <li key={index} className="text-base">{skill}</li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function CoverLetterGenerator() {
    const { toast } = useToast();
    const resumeData = useResumeStore((state) => state.data);
    const [isLoading, setIsLoading] = useState(false);
    const [jobTitle, setJobTitle] = useState('');
    const [tone, setTone] = useState('professional');
    const [generatedLetter, setGeneratedLetter] = useState('');

    const handleGenerateLetter = async () => {
        if (!jobTitle) {
            toast({
                variant: 'destructive',
                title: 'Job Title Required',
                description: 'Please enter a job title to generate a cover letter.',
            });
            return;
        }

        setIsLoading(true);
        setGeneratedLetter('');
        try {
            const result = await generateCoverLetter({
                ...(resumeData as ResumeData),
                jobTitle,
                tone: tone as any,
            });
            setGeneratedLetter(result.coverLetter);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to generate cover letter. Please try again.',
            });
        }
        setIsLoading(false);
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLetter);
        toast({ title: 'Copied!', description: 'Cover letter copied to clipboard.' });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-heading flex items-center"><FileText className="mr-2 h-6 w-6 text-primary" /> Cover Letter Generator</CardTitle>
                <CardDescription>Create a tailored cover letter for any job application in seconds.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="job-title">Job Title</Label>
                    <Input id="job-title" placeholder="e.g., Senior Product Manager" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} disabled={isLoading} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <Select value={tone} onValueChange={setTone} disabled={isLoading}>
                        <SelectTrigger id="tone">
                            <SelectValue placeholder="Select a tone" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                            <SelectItem value="creative">Creative</SelectItem>
                            <SelectItem value="formal">Formal</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleGenerateLetter} disabled={isLoading} className="w-full">
                    {isLoading ? 'Generating...' : 'Generate Cover Letter'}
                </Button>

                {isLoading && !generatedLetter && (
                     <div className="mt-6 space-y-2">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                )}

                {generatedLetter && (
                    <div className="mt-6 space-y-4">
                        <h3 className="font-heading text-lg">Generated Cover Letter:</h3>
                        <div className="relative">
                            <Textarea readOnly value={generatedLetter} rows={15} className="bg-muted pr-10" />
                            <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={handleCopy}>
                                <ClipboardCopy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

const templates = {
    modern: { name: 'Modern', component: TemplateModern },
    classic: { name: 'Classic', component: TemplateClassic },
};

export default function PreviewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data, generatedResume, setGeneratedResume, template, setTemplate } = useResumeStore();
  const [isLoading, setIsLoading] = useState(true);
  const resumeRef = useRef<HTMLDivElement>(null);
  
  const CurrentTemplate = templates[template].component;

  useEffect(() => {
    // This effect is for the initial resume text generation, it can be removed if we switch to component-based rendering entirely
    if (generatedResume) {
        setIsLoading(false);
        // return; We might not want to return here anymore
    }
    
    if (!data.personalInfo?.name) {
      toast({
          title: 'Profile Incomplete',
          description: 'Please fill out your profile first. Redirecting...',
          variant: 'destructive'
      });
      router.push('/profile');
      return;
    }

    setIsLoading(false); // We have data, so we can render templates

    // This part can be kept if some templates still rely on a pre-generated text blob
    if (!generatedResume) {
      setIsLoading(true);
      generateResume(data as ResumeData)
        .then(output => {
          setGeneratedResume(output.resume);
        })
        .catch(err => {
          console.error('Failed to generate resume:', err);
          toast({
            variant: 'destructive',
            title: 'Generation Failed',
            description: 'There was an error generating your resume. Please try again.',
          });
          router.push('/profile');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

  }, [data, router, toast, generatedResume, setGeneratedResume]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-muted/40 no-print">
        <AppHeader auth={true} />
        <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <Button variant="outline" onClick={() => router.push('/profile')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Editor
            </Button>
            <div className="text-center">
              <h1 className="font-heading text-4xl font-bold">Resume Workbench</h1>
              <p className="text-muted-foreground">Preview your resume and use our AI tools to perfect it.</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={template} onValueChange={(value) => setTemplate(value as keyof typeof templates)}>
                  <SelectTrigger className="w-[180px]">
                      <Palette className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select Template" />
                  </SelectTrigger>
                  <SelectContent>
                      {Object.entries(templates).map(([key, {name}]) => (
                          <SelectItem key={key} value={key}>{name}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
              <Button onClick={handlePrint} disabled={isLoading}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2">
                   <Card className="print-container">
                      <CardContent ref={resumeRef} className="p-0 print-p-0">
                          {isLoading ? (
                             <div className="p-8"><ResumeSkeleton /></div>
                          ) : (
                             <CurrentTemplate data={data as ResumeData} />
                          )}
                      </CardContent>
                  </Card>
              </div>
              <div className="lg:col-span-1 space-y-8 sticky top-20">
                  <Card>
                      <CardHeader>
                          <CardTitle className="font-heading flex items-center"><Bot className="mr-2 h-6 w-6 text-primary" /> AI Toolkit</CardTitle>
                          <CardDescription>Use our suite of AI-powered tools to analyze and enhance your resume and career plan.</CardDescription>
                      </CardHeader>
                  </Card>
                  <CareerPathRecommender />
                  <ResumeScore />
                  <SkillSuggestions />
                  <CoverLetterGenerator />
              </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
