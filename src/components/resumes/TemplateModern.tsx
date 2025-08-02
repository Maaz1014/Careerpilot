'use client';

import { ResumeData } from '@/lib/types';
import { Mail, Phone, Linkedin, Github, MapPin } from 'lucide-react';

interface TemplateModernProps {
    data: ResumeData;
}

export default function TemplateModern({ data }: TemplateModernProps) {
    const { personalInfo, experience, education, skills, projects, certifications } = data;

    return (
        <div className="p-8 bg-background text-foreground print-text-black font-sans text-sm">
            <header className="text-center mb-8 border-b pb-4 border-primary/20">
                <h1 className="text-4xl font-bold font-heading text-primary">{personalInfo.name}</h1>
                <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mt-2 text-xs text-muted-foreground print-text-black">
                     <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 hover:text-primary"><Mail size={12} />{personalInfo.email}</a>
                    <a href={`tel:${personalInfo.phone}`} className="flex items-center gap-2 hover:text-primary"><Phone size={12} />{personalInfo.phone}</a>
                    <p className="flex items-center gap-2"><MapPin size={12} />{personalInfo.location}</p>
                    {personalInfo.linkedin && <a href={personalInfo.linkedin} className="flex items-center gap-2 hover:text-primary" target="_blank" rel="noopener noreferrer"><Linkedin size={12} />LinkedIn</a>}
                    {personalInfo.github && <a href={personalInfo.github} className="flex items-center gap-2 hover:text-primary" target="_blank" rel="noopener noreferrer"><Github size={12} />GitHub</a>}
                </div>
            </header>

            <main className="grid grid-cols-3 gap-12">
                <div className="col-span-2">
                    <section className="mb-8">
                        <h2 className="text-2xl font-heading font-bold text-primary border-b-2 border-primary/50 pb-2 mb-4">Experience</h2>
                        {experience.map((exp, index) => (
                            <div key={index} className="mb-4 break-inside-avoid">
                                <h3 className="font-bold text-base">{exp.title}</h3>
                                <div className="flex justify-between text-sm text-muted-foreground print-text-black">
                                    <p className="font-semibold">{exp.company}</p>
                                    <p>{exp.startDate} - {exp.endDate || 'Present'}</p>
                                </div>
                                <div className="mt-2 prose prose-sm max-w-none dark:prose-invert print:prose-black">
                                    <ul className="pl-0">
                                      {exp.description.split('\n').map((line, i) => line.trim() && <li key={i} className="pl-4 -indent-4">{line.replace(/^- /, '• ')}</li>)}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </section>

                    {projects && projects.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-heading font-bold text-primary border-b-2 border-primary/50 pb-2 mb-4">Projects</h2>
                            {projects?.map((proj, index) => (
                                <div key={index} className="mb-4 break-inside-avoid">
                                    <h3 className="font-bold text-base">{proj.name}</h3>
                                    {proj.link && <a href={proj.link} className="text-primary text-xs hover:underline" target="_blank" rel="noopener noreferrer">{proj.link}</a>}
                                    <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{proj.description}</p>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
                <div className="col-span-1">
                    <section className="mb-8">
                        <h2 className="text-2xl font-heading font-bold text-primary border-b-2 border-primary/50 pb-2 mb-4">Education</h2>
                        {education.map((edu, index) => (
                            <div key={index} className="mb-3 break-inside-avoid">
                                <h3 className="font-bold">{edu.institution}</h3>
                                <p>{edu.degree}, {edu.major}</p>
                                <p className="text-xs text-muted-foreground print-text-black">{edu.graduationDate}</p>
                            </div>
                        ))}
                    </section>
                    
                    <section className="mb-8">
                        <h2 className="text-2xl font-heading font-bold text-primary border-b-2 border-primary/50 pb-2 mb-4">Skills</h2>
                        <ul className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                                <li key={index} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium print:bg-gray-200 print:text-black">{skill.name}</li>
                            ))}
                        </ul>
                    </section>

                     {certifications && certifications.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-heading font-bold text-primary border-b-2 border-primary/50 pb-2 mb-4">Certifications</h2>
                            {certifications?.map((cert, index) => (
                                <div key={index} className="mb-3 break-inside-avoid">
                                    <h3 className="font-bold text-sm">{cert.name}</h3>
                                    <p className="text-xs">{cert.issuingOrganization}</p>
                                    <p className="text-xs text-muted-foreground print-text-black">{cert.issueDate}</p>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}
