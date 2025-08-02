import { z } from 'zod';

export const personalInfoSchema = z.object({
  name: z.string().min(1, 'Full name is required.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(1, 'Phone number is required.'),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  location: z.string().min(1, 'Location is required.'),
});

export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution name is required.'),
  degree: z.string().min(1, 'Degree is required.'),
  major: z.string().min(1, 'Major is required.'),
  graduationDate: z.string().min(1, 'Graduation date is required.'),
  description: z.string().optional(),
});

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company name is required.'),
  title: z.string().min(1, 'Job title is required.'),
  startDate: z.string().min(1, 'Start date is required.'),
  endDate: z.string().optional(),
  description: z.string().min(1, 'Description is required.'),
});

export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required.'),
});

export const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required.'),
  issuingOrganization: z.string().min(1, 'Issuing organization is required.'),
  issueDate: z.string().min(1, 'Issue date is required.'),
  expirationDate: z.string().optional(),
});

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required.'),
  description: z.string().min(1, 'Description is required.'),
  link: z.string().url().optional().or(z.literal('')),
});

export const resumeSchema = z.object({
  personalInfo: personalInfoSchema,
  education: z.array(educationSchema),
  experience: z.array(experienceSchema),
  skills: z.array(skillSchema),
  certifications: z.array(certificationSchema).optional(),
  projects: z.array(projectSchema).optional(),
  desiredJobRoles: z.string().optional(),
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Project = z.infer<typeof projectSchema>;
export type ResumeData = z.infer<typeof resumeSchema>;
