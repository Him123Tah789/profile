import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const profileSchema = z.object({
  name: z.string().min(2),
  headline: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  photoUrl: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  email: z.string().email()
});

export const socialSchema = z.object({
  github: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  googleScholar: z.string().url().optional().or(z.literal("")),
  orcid: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal(""))
});

export const skillSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  level: z.coerce.number().min(1).max(100),
  icon: z.string().optional().or(z.literal(""))
});

const commaStringToArray = z.string().optional().default("").transform((v) =>
  v
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
);

export const projectSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  techStack: commaStringToArray,
  githubLink: z.string().url().optional().or(z.literal("")),
  liveLink: z.string().url().optional().or(z.literal("")),
  images: commaStringToArray,
  featured: z.coerce.boolean().default(false),
  tags: commaStringToArray,
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED")
});

export const paperSchema = z.object({
  title: z.string().min(2),
  authors: commaStringToArray,
  venue: z.string().optional().or(z.literal("")),
  year: z.coerce.number().int().min(1990).max(2100),
  abstract: z.string().min(20),
  pdfLink: z.string().optional().or(z.literal("")),
  codeLink: z.string().url().optional().or(z.literal("")),
  citations: z.coerce.number().int().min(0).default(0),
  tags: commaStringToArray,
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED")
});

export const certificateSchema = z.object({
  title: z.string().min(2),
  issuer: z.string().min(2),
  year: z.coerce.number().int().min(1990).max(2100),
  credentialUrl: z.string().url().optional().or(z.literal("")),
  assetUrl: z.string().optional().or(z.literal("")),
  tags: commaStringToArray
});

export const postSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(3),
  content: z.string().min(20),
  excerpt: z.string().optional().or(z.literal("")),
  coverImage: z.string().optional().or(z.literal("")),
  tags: commaStringToArray,
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT")
});

export const documentSchema = z.object({
  title: z.string().min(2),
  category: z.string().min(1),
  fileUrl: z.string().min(1),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PUBLIC"),
  description: z.string().optional().or(z.literal("")),
  tags: commaStringToArray,
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED")
});

export const cvSchema = z.object({
  fileUrl: z.string().min(1),
  version: z.string().optional().or(z.literal("")),
  isActive: z.coerce.boolean().default(true)
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10).max(2000)
});
