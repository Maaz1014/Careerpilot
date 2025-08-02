import { z } from 'genkit';

export const PersonalInfoSchema = z.object({
    name: z.string().describe('The full name of the person.'),
    email: z.string().email().describe('The email address of the person.'),
    phone: z.string().describe('The phone number of the person.'),
    linkedin: z.string().optional().describe('The LinkedIn profile URL of the person.'),
    github: z.string().optional().describe('The GitHub profile URL of the person.'),
    location: z.string().describe('The location of the person.'),
  });
  
  export const EducationSchema = z.object({
    institution: z.string().describe('The name of the educational institution.'),
    degree: z.string().describe('The degree obtained.'),
    major: z.string().describe('The major of study.'),
    graduationDate: z.string().describe('The graduation date.'),
    description: z.string().optional().describe('Description of education experience'),
  });
  
  export const ExperienceSchema = z.object({
    company: z.string().describe('The name of the company.'),
    title: z.string().describe('The job title.'),
    startDate: z.string().describe('The start date of the job.'),
    endDate: z.string().optional().describe('The end date of the job, or "Present" if still employed.'),
    description: z.string().describe('The description of the job responsibilities and achievements.'),
  });
  
  export const SkillSchema = z.object({
    name: z.string().describe('The name of the skill.'),
  });
  
  export const CertificationSchema = z.object({
    name: z.string().describe('The name of the certification.'),
    issuingOrganization: z.string().describe('The organization that issued the certification.'),
    issueDate: z.string().describe('The date the certification was issued.'),
    expirationDate: z.string().optional().describe('The expiration date of the certification, if applicable.'),
  });
  
  export const ProjectSchema = z.object({
    name: z.string().describe('The name of the project.'),
    description: z.string().describe('A brief description of the project and its purpose.'),
    link: z.string().optional().describe('A link to the project, if available.'),
  });

export const RecommendCareerPathInputSchema = z.object({
  personalInfo: PersonalInfoSchema,
  education: z.array(EducationSchema),
  experience: z.array(ExperienceSchema),
  skills: z.array(SkillSchema),
  certifications: z.array(CertificationSchema).optional(),
  projects: z.array(ProjectSchema).optional(),
  desiredJobRoles: z.string().describe('The user\'s desired long-term career goals or job titles.'),
});
export type RecommendCareerPathInput = z.infer<typeof RecommendCareerPathInputSchema>;

const CareerStepSchema = z.object({
    title: z.string().describe('The job title for this career step.'),
    duration: z.string().describe('An estimated duration for this step, e.g., "1-2 years".'),
    summary: z.string().describe('A brief summary of what this role entails and its importance in the career path.'),
    skillsToDevelop: z.array(z.string()).describe('A list of key skills to acquire during this stage.'),
});

export const RecommendCareerPathOutputSchema = z.object({
  roadmap: z.array(CareerStepSchema).describe('A list of 3-4 sequential steps in the recommended career path.'),
  overallSummary: z.string().describe('A high-level summary of the recommended career trajectory.'),
});
export type RecommendCareerPathOutput = z.infer<typeof RecommendCareerPathOutputSchema>;
