'use client';

import { ResumeData } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

interface TemplateClassicProps {
  data: ResumeData;
}

export default function TemplateClassic({ data }: TemplateClassicProps) {
  const { personalInfo, experience, education, skills, projects, certifications } = data;

  // A simple summary; could be replaced with an AI-generated one later.
  const summary = experience[0]?.description.split(/[.\n]/)[0] || 'A highly motivated and skilled professional seeking a challenging role.';


  return (
    <div className="p-10 bg-white text-gray-800 print-text-black font-serif">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-widest uppercase">{personalInfo.name}</h1>
        <p className="text-sm mt-1 flex flex-wrap justify-center items-center gap-x-2">
          <span>{personalInfo.location}</span>
          <span className="hidden md:inline">|</span>
          <span>{personalInfo.phone}</span>
          <span className="hidden md:inline">|</span>
          <span>{personalInfo.email}</span>
          {personalInfo.linkedin && <><span className="hidden md:inline">|</span><a href={personalInfo.linkedin} className="text-blue-600 hover:underline">LinkedIn</a></>}
          {personalInfo.github && <><span className="hidden md:inline">|</span><a href={personalInfo.github} className="text-blue-600 hover:underline">GitHub</a></>}
        </p>
      </header>
      
      <Separator className="my-4 bg-gray-300" />

      {summary && (
        <section className="mb-4">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-400 pb-1 mb-2">Summary</h2>
            <p className="text-sm leading-relaxed">
                {summary}
            </p>
        </section>
      )}


      <section className="mb-4">
        <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-400 pb-1 mb-2">Experience</h2>
        {experience.map((exp, index) => (
          <div key={index} className="mb-3 break-inside-avoid">
            <div className="flex justify-between items-baseline">
              <h3 className="text-md font-bold">{exp.title}</h3>
              <p className="text-xs font-mono whitespace-nowrap">{exp.startDate} - {exp.endDate || 'Present'}</p>
            </div>
            <p className="text-sm italic">{exp.company}</p>
            <ul className="list-disc list-outside pl-5 mt-1 text-sm space-y-1">
                {exp.description.split('\n').filter(line => line.trim()).map((line, i) => <li key={i}>{line.replace(/^- /, '')}</li>)}
            </ul>
          </div>
        ))}
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-400 pb-1 mb-2">Education</h2>
        {education.map((edu, index) => (
          <div key={index} className="mb-2 break-inside-avoid">
            <div className="flex justify-between items-baseline">
                <h3 className="text-md font-bold">{edu.institution}</h3>
                <p className="text-xs font-mono">{edu.graduationDate}</p>
            </div>
            <p className="text-sm italic">{edu.degree}, {edu.major}</p>
            {edu.description && <p className="text-xs mt-1 text-gray-600">{edu.description}</p>}
          </div>
        ))}
      </section>
      
        <div className="grid grid-cols-2 gap-x-8">
            {skills && skills.length > 0 && (
                <section className="mb-4 col-span-2">
                    <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-400 pb-1 mb-2">Skills</h2>
                    <p className="text-sm">{skills.map(skill => skill.name).join(' • ')}</p>
                </section>
            )}
            
            {projects && projects.length > 0 && (
                <section className="mb-4 col-span-2">
                    <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-400 pb-1 mb-2">Projects</h2>
                     {projects.map((proj, index) => (
                      <div key={index} className="mb-2 break-inside-avoid">
                          <p className="text-md font-bold">{proj.name}</p>
                          <p className="text-sm text-gray-600">{proj.description}</p>
                      </div>
                    ))}
                </section>
            )}

            {certifications && certifications.length > 0 && (
                 <section className="mb-4 col-span-2">
                    <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-400 pb-1 mb-2">Certifications</h2>
                    {certifications.map((cert, index) => (
                        <p key={index} className="text-sm">
                            <span className="font-bold">{cert.name}</span> from {cert.issuingOrganization} ({cert.issueDate})
                        </p>
                    ))}
                </section>
            )}
        </div>
    </div>
  );
}
